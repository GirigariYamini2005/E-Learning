/**
 * LangGraph-powered AI pipelines for the e-learning platform.
 *
 * Instead of making a single monolithic OpenAI call, each feature is
 * expressed as a multi-node StateGraph.  Every node has a single
 * responsibility and builds on the state produced by previous nodes,
 * giving us:
 *  - Clearer separation of concerns / testability
 *  - Intermediate state for debugging
 *  - Easy extension (add nodes / conditional edges without touching callers)
 *
 * Pipelines exported:
 *  runExplainPipeline(input)       → { explanations, recommendations }
 *  runFeedbackPipeline(input)      → { feedback, strengths, improvements, studyPlan }
 *  runQuizGenerationPipeline(input)→ { quiz }
 *  runSlidePipeline(input)         → { slides }        (text only; images generated in route)
 */

'use strict';

const { StateGraph, Annotation, END, START } = require('@langchain/langgraph');
const { ChatOpenAI } = require('@langchain/openai');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');

// ─────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────

/** "Last write wins" reducer — each node fully replaces a field */
const last = (x, y) => (y !== undefined ? y : x);

/** Parse JSON from an LLM response, tolerating markdown code fences */
function safeParseJSON(text) {
  const stripped = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();
  const match = stripped.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!match) throw new Error('No JSON object found in LLM response');
  return JSON.parse(match[0]);
}

/** Create a ChatOpenAI model — uses fine-tuned ID when available */
function getModel(opts = {}) {
  const { useFinetuned = false, temperature = 0.7, maxTokens = 2000 } = opts;
  const modelId =
    useFinetuned && process.env.FINETUNED_MODEL_ID
      ? process.env.FINETUNED_MODEL_ID
      : 'gpt-3.5-turbo';
  return new ChatOpenAI({
    model: modelId,
    temperature,
    maxTokens,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
}

// ═════════════════════════════════════════════════════════════
// 1. EXPLAIN PIPELINE
//    Three nodes: categorise → explain → recommend
// ═════════════════════════════════════════════════════════════

const ExplainState = Annotation.Root({
  incorrectAnswers: Annotation({ reducer: last, default: () => [] }),
  quizTitle:        Annotation({ reducer: last, default: () => '' }),
  courseTitle:      Annotation({ reducer: last, default: () => '' }),
  score:            Annotation({ reducer: last, default: () => 0 }),
  percentage:       Annotation({ reducer: last, default: () => 0 }),
  errorCategories:  Annotation({ reducer: last, default: () => [] }),
  explanations:     Annotation({ reducer: last, default: () => [] }),
  recommendations:  Annotation({ reducer: last, default: () => [] }),
});

/** Node 1 — categorise each wrong answer by the concept it tests */
async function categoriseErrors(state) {
  const { incorrectAnswers, quizTitle, courseTitle } = state;

  const prompt = `You are an expert educational analyst.
A student got the following questions WRONG in the quiz "${quizTitle}" (course: "${courseTitle}"):

${incorrectAnswers
  .map(
    (a, i) => `${i + 1}. Question: ${a.question}
   Student answered: ${a.yourAnswer}
   Correct answer:   ${a.correctAnswer}`
  )
  .join('\n\n')}

For each wrong answer identify:
- The core concept / topic being tested
- The likely misconception the student holds
- The difficulty category: "foundational", "conceptual", or "applied"

Return a JSON array (one object per question):
[{ "questionIndex": 0, "concept": "...", "misconception": "...", "difficulty": "..." }]`;

  const model = getModel({ temperature: 0.3, maxTokens: 1000 });
  const response = await model.invoke([
    new SystemMessage('You are an expert educational analyst. Respond with valid JSON only.'),
    new HumanMessage(prompt),
  ]);

  let errorCategories;
  try {
    errorCategories = safeParseJSON(response.content);
  } catch {
    // Graceful fallback — each wrong answer gets a generic category
    errorCategories = incorrectAnswers.map((_, i) => ({
      questionIndex: i,
      concept: 'General knowledge',
      misconception: 'Unclear understanding',
      difficulty: 'conceptual',
    }));
  }

  return { errorCategories };
}

/** Node 2 — generate a targeted explanation for EACH wrong answer */
async function generateExplanations(state) {
  const { incorrectAnswers, errorCategories, quizTitle } = state;

  const categorisedList = incorrectAnswers.map((a, i) => {
    const cat = errorCategories[i] || {};
    return `${i + 1}. Question: ${a.question}
   Student answered: ${a.yourAnswer}
   Correct answer:   ${a.correctAnswer}
   Core concept:     ${cat.concept || 'N/A'}
   Likely misconception: ${cat.misconception || 'N/A'}`;
  });

  const prompt = `You are an expert tutor. Write a clear, concise explanation for each of the
following incorrectly answered questions from the quiz "${quizTitle}".

${categorisedList.join('\n\n')}

For each question explain:
1. Why the correct answer is right (with a brief, memorable reason)
2. Why the student's answer is wrong (address the specific misconception)

Keep each explanation under 80 words.

Return a JSON array:
[{ "question": "...", "explanation": "..." }]`;

  const model = getModel({ temperature: 0.5, maxTokens: 1500 });
  const response = await model.invoke([
    new SystemMessage('You are an expert tutor. Respond with valid JSON only.'),
    new HumanMessage(prompt),
  ]);

  let explanations;
  try {
    explanations = safeParseJSON(response.content);
  } catch {
    explanations = incorrectAnswers.map((a) => ({
      question: a.question,
      explanation: `The correct answer is "${a.correctAnswer}". Review this concept in your course materials.`,
    }));
  }

  return { explanations };
}

/** Node 3 — synthesise personalised study recommendations from all error patterns */
async function synthesiseRecommendations(state) {
  const { errorCategories, quizTitle, courseTitle, percentage } = state;

  const conceptList = [...new Set(errorCategories.map((c) => c.concept))].join(', ');

  const prompt = `A student scored ${percentage}% on "${quizTitle}" (course: "${courseTitle}").
They struggled with the following concepts: ${conceptList}.

Based on these weak areas, create 4–5 specific, actionable study recommendations.
Each recommendation should reference a concrete action (e.g., "Review...", "Practice...", "Watch...").

Return strictly a JSON array of strings:
["recommendation 1", "recommendation 2", ...]`;

  const model = getModel({ temperature: 0.6, maxTokens: 600 });
  const response = await model.invoke([
    new SystemMessage('You are a personalised learning advisor. Respond with valid JSON only.'),
    new HumanMessage(prompt),
  ]);

  let recommendations;
  try {
    recommendations = safeParseJSON(response.content);
    if (!Array.isArray(recommendations)) recommendations = [];
  } catch {
    recommendations = [
      `Review the incorrect topics from "${quizTitle}" in your course materials.`,
      'Re-attempt the quiz after studying the explanations provided.',
    ];
  }

  return { recommendations };
}

function buildExplainGraph() {
  const graph = new StateGraph(ExplainState)
    .addNode('categoriseErrors', categoriseErrors)
    .addNode('generateExplanations', generateExplanations)
    .addNode('synthesiseRecommendations', synthesiseRecommendations)
    .addEdge(START, 'categoriseErrors')
    .addEdge('categoriseErrors', 'generateExplanations')
    .addEdge('generateExplanations', 'synthesiseRecommendations')
    .addEdge('synthesiseRecommendations', END);

  return graph.compile();
}

// ═════════════════════════════════════════════════════════════
// 2. FEEDBACK PIPELINE
//    Three nodes: analyseTrend → identifyPatterns → buildStudyPlan
// ═════════════════════════════════════════════════════════════

const FeedbackState = Annotation.Root({
  results:      Annotation({ reducer: last, default: () => [] }),
  avgScore:     Annotation({ reducer: last, default: () => 0 }),
  trend:        Annotation({ reducer: last, default: () => '' }),
  patterns:     Annotation({ reducer: last, default: () => ({}) }),
  feedback:     Annotation({ reducer: last, default: () => '' }),
  strengths:    Annotation({ reducer: last, default: () => [] }),
  improvements: Annotation({ reducer: last, default: () => [] }),
  studyPlan:    Annotation({ reducer: last, default: () => [] }),
});

/** Node 1 — compute score trend (improving / declining / stable) */
async function analyseTrend(state) {
  const { results, avgScore } = state;

  // Lightweight heuristic — no LLM call needed for trend direction
  const scores = results.map((r) => r.percentage);
  let trend = 'stable';
  if (scores.length >= 3) {
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    if (secondAvg - firstAvg > 5) trend = 'improving';
    else if (firstAvg - secondAvg > 5) trend = 'declining';
  }

  const prompt = `A student has the following recent quiz scores (oldest → newest):
${scores.map((s, i) => `Attempt ${i + 1}: ${s}%`).join(', ')}

Overall average: ${avgScore}%
Trend detected: ${trend}

Write a brief, encouraging (2–3 sentence) performance assessment that references the trend.

Return as JSON: { "feedback": "..." }`;

  const model = getModel({ temperature: 0.7, maxTokens: 400 });
  const response = await model.invoke([
    new SystemMessage('You are a supportive learning coach. Respond with valid JSON only.'),
    new HumanMessage(prompt),
  ]);

  let feedback = '';
  try {
    const parsed = safeParseJSON(response.content);
    feedback = parsed.feedback || '';
  } catch {
    feedback = `Your current average is ${avgScore}%. Keep practising consistently to improve!`;
  }

  return { trend, feedback };
}

/** Node 2 — group results by topic to surface strengths & areas for growth */
async function identifyPatterns(state) {
  const { results, trend, avgScore } = state;

  const summary = results
    .map((r) => `Quiz: "${r.quiz?.title || 'Unknown'}" | Course: "${r.course?.title || 'Unknown'}" | Score: ${r.percentage}%`)
    .join('\n');

  const prompt = `A student has completed the following quizzes:

${summary}

Overall average: ${avgScore}% | Trend: ${trend}

Analyse the performance data and identify:
1. Top 3 STRENGTHS — topics or courses where they scored consistently well (≥70%)
2. Top 3 IMPROVEMENT AREAS — topics or courses where scores are low (<60%) or inconsistent

Return JSON:
{
  "strengths":    ["strength 1", "strength 2", "strength 3"],
  "improvements": ["area 1", "area 2", "area 3"]
}`;

  const model = getModel({ temperature: 0.4, maxTokens: 700 });
  const response = await model.invoke([
    new SystemMessage('You are a learning analytics expert. Respond with valid JSON only.'),
    new HumanMessage(prompt),
  ]);

  let patterns = { strengths: [], improvements: [] };
  try {
    patterns = safeParseJSON(response.content);
  } catch {
    patterns = { strengths: [], improvements: ['Review your recent quiz topics'] };
  }

  return { patterns };
}

/** Node 3 — build a personalised, week-by-week study plan */
async function buildStudyPlan(state) {
  const { patterns, avgScore, trend } = state;

  const prompt = `Based on a student's performance analysis:
- Overall average: ${avgScore}%  |  Trend: ${trend}
- Strengths:    ${(patterns.strengths || []).join(', ') || 'None identified yet'}
- Needs work:   ${(patterns.improvements || []).join(', ') || 'General review'}

Create a personalised 5-step study plan. Each step should be:
- Specific and actionable (not generic advice)
- Tied to the identified strengths or improvement areas
- Progressive (earlier steps build foundations for later ones)

Return strictly a JSON array of 5 strings:
["Step 1: ...", "Step 2: ...", ...]`;

  const model = getModel({ temperature: 0.6, maxTokens: 800 });
  const response = await model.invoke([
    new SystemMessage('You are a personalised learning strategist. Respond with valid JSON only.'),
    new HumanMessage(prompt),
  ]);

  let studyPlan;
  try {
    studyPlan = safeParseJSON(response.content);
    if (!Array.isArray(studyPlan)) studyPlan = [];
  } catch {
    studyPlan = ['Review your weakest topics', 'Re-take quizzes on challenging subjects'];
  }

  return {
    strengths:    patterns.strengths    || [],
    improvements: patterns.improvements || [],
    studyPlan,
  };
}

function buildFeedbackGraph() {
  const graph = new StateGraph(FeedbackState)
    .addNode('analyseTrend',    analyseTrend)
    .addNode('identifyPatterns', identifyPatterns)
    .addNode('buildStudyPlan',  buildStudyPlan)
    .addEdge(START, 'analyseTrend')
    .addEdge('analyseTrend',    'identifyPatterns')
    .addEdge('identifyPatterns', 'buildStudyPlan')
    .addEdge('buildStudyPlan',  END);

  return graph.compile();
}

// ═════════════════════════════════════════════════════════════
// 3. QUIZ GENERATION PIPELINE  (uses fine-tuned model)
//    Three nodes: enrichTopic → generateDraft → validateQuiz
// ═════════════════════════════════════════════════════════════

const QuizGenState = Annotation.Root({
  topic:           Annotation({ reducer: last, default: () => '' }),
  courseContext:   Annotation({ reducer: last, default: () => '' }),
  difficulty:      Annotation({ reducer: last, default: () => 'intermediate' }),
  numQuestions:    Annotation({ reducer: last, default: () => 5 }),
  enrichedContext: Annotation({ reducer: last, default: () => '' }),
  rawQuiz:         Annotation({ reducer: last, default: () => null }),
  quiz:            Annotation({ reducer: last, default: () => null }),
});

/** Node 1 — expand the topic into learning objectives before generation */
async function enrichTopicContext(state) {
  const { topic, courseContext, difficulty } = state;

  const prompt = `You are a curriculum designer.
Topic to generate a quiz about: "${topic}"
${courseContext ? `Context: ${courseContext}` : ''}
Difficulty level: ${difficulty}

Briefly describe (2–3 sentences):
1. The key concepts a ${difficulty}-level student should know about this topic
2. Common misconceptions or errors at this level

Return JSON: { "enrichedContext": "..." }`;

  const model = getModel({ temperature: 0.3, maxTokens: 400 });
  const response = await model.invoke([
    new SystemMessage('You are a curriculum designer. Respond with valid JSON only.'),
    new HumanMessage(prompt),
  ]);

  let enrichedContext = '';
  try {
    const parsed = safeParseJSON(response.content);
    enrichedContext = parsed.enrichedContext || '';
  } catch {
    enrichedContext = `A quiz about ${topic} at ${difficulty} level.`;
  }

  return { enrichedContext };
}

/** Node 2 — generate the quiz using the fine-tuned model when available */
async function generateQuizDraft(state) {
  const { topic, difficulty, numQuestions, enrichedContext, courseContext } = state;

  const systemPrompt =
    'You are an expert educational quiz generator for an AI-powered e-learning platform. ' +
    'Create accurate, well-structured quizzes with clear questions, plausible distractors, ' +
    'and detailed educational explanations. Always respond with valid JSON only.';

  const userPrompt =
    `Generate a ${numQuestions}-question multiple-choice quiz about "${topic}" ` +
    `at ${difficulty} level.\n` +
    (courseContext ? `Course context: ${courseContext}\n` : '') +
    `Pedagogical context: ${enrichedContext}\n\n` +
    'Return valid JSON with:\n' +
    '  title     (string)\n' +
    '  topic     (string)\n' +
    '  difficulty (string)\n' +
    '  questions (array of objects, each with: question, options [4 strings], correctAnswer [0-based int], explanation)';

  // Prefer fine-tuned model — falls back to gpt-3.5-turbo automatically
  const model = getModel({ useFinetuned: true, temperature: 0.7, maxTokens: 2000 });
  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ]);

  let rawQuiz = null;
  try {
    rawQuiz = safeParseJSON(response.content);
  } catch {
    rawQuiz = null;
  }

  return { rawQuiz };
}

/** Node 3 — validate the draft and repair common schema issues */
async function validateQuiz(state) {
  const { rawQuiz, topic, difficulty, numQuestions } = state;

  if (!rawQuiz || !Array.isArray(rawQuiz.questions)) {
    // Ask the model to regenerate from scratch with a stricter prompt
    const model = getModel({ temperature: 0.5, maxTokens: 2000 });
    const response = await model.invoke([
      new SystemMessage('You are an educational quiz generator. Respond with valid JSON only.'),
      new HumanMessage(
        `Generate ${numQuestions} multiple-choice quiz questions about "${topic}" (${difficulty} level). ` +
          'Return JSON: { "title": "...", "topic": "...", "difficulty": "...", "questions": [{ "question": "...", "options": ["A","B","C","D"], "correctAnswer": 0, "explanation": "..." }] }'
      ),
    ]);
    try {
      const quiz = safeParseJSON(response.content);
      return { quiz };
    } catch {
      return { quiz: null };
    }
  }

  // Sanitise each question — ensure exactly 4 options and valid correctAnswer
  const cleanQuestions = rawQuiz.questions.slice(0, numQuestions).map((q) => {
    const options = Array.isArray(q.options) ? q.options.slice(0, 4) : ['A', 'B', 'C', 'D'];
    while (options.length < 4) options.push(`Option ${options.length + 1}`);
    const correctAnswer =
      typeof q.correctAnswer === 'number' &&
      q.correctAnswer >= 0 &&
      q.correctAnswer < options.length
        ? q.correctAnswer
        : 0;
    return {
      question:      q.question   || 'Question text missing',
      options,
      correctAnswer,
      explanation:   q.explanation || '',
    };
  });

  return {
    quiz: {
      title:      rawQuiz.title      || `${topic} Quiz`,
      topic:      rawQuiz.topic      || topic,
      difficulty: rawQuiz.difficulty || difficulty,
      questions:  cleanQuestions,
    },
  };
}

function buildQuizGenerationGraph() {
  const graph = new StateGraph(QuizGenState)
    .addNode('enrichTopicContext', enrichTopicContext)
    .addNode('generateQuizDraft',  generateQuizDraft)
    .addNode('validateQuiz',       validateQuiz)
    .addEdge(START, 'enrichTopicContext')
    .addEdge('enrichTopicContext', 'generateQuizDraft')
    .addEdge('generateQuizDraft',  'validateQuiz')
    .addEdge('validateQuiz',       END);

  return graph.compile();
}

// ═════════════════════════════════════════════════════════════
// 4. SLIDE PIPELINE  (text / script generation; DALL-E in route)
//    Two nodes: planSlides → refineImagePrompts
// ═════════════════════════════════════════════════════════════

const SlideState = Annotation.Root({
  topic:          Annotation({ reducer: last, default: () => '' }),
  courseContext:  Annotation({ reducer: last, default: () => '' }),
  slideDrafts:    Annotation({ reducer: last, default: () => [] }),
  slides:         Annotation({ reducer: last, default: () => [] }),
});

/** Node 1 — plan + write all 5 slide scripts in one pass */
async function planAndWriteSlides(state) {
  const { topic, courseContext } = state;

  const prompt =
    `You are an educational content creator. Create a 5-slide educational slideshow about: "${topic}".` +
    (courseContext ? ` ${courseContext}` : '') +
    `\n\nFor each slide provide:\n` +
    `  1. A short title (max 8 words)\n` +
    `  2. A description with 2–3 key learning points (max 80 words)\n` +
    `  3. An initial image concept (1 sentence describing a suitable educational illustration)\n\n` +
    `Format as JSON:\n` +
    `{ "slides": [{ "title": "...", "description": "...", "imageConcept": "..." }] }`;

  const model = getModel({ temperature: 0.7, maxTokens: 1500 });
  const response = await model.invoke([
    new SystemMessage('You are an expert educational content creator. Respond with valid JSON only.'),
    new HumanMessage(prompt),
  ]);

  let slideDrafts = [];
  try {
    const parsed = safeParseJSON(response.content);
    slideDrafts = parsed.slides || [];
  } catch {
    slideDrafts = [];
  }

  return { slideDrafts };
}

/** Node 2 — refine image concepts into optimised DALL-E prompts */
async function refineImagePrompts(state) {
  const { slideDrafts, topic } = state;

  if (!slideDrafts.length) return { slides: [] };

  const prompt =
    `You are a visual design expert for educational content. Below are ${slideDrafts.length} slides about "${topic}".\n\n` +
    slideDrafts
      .map(
        (s, i) =>
          `Slide ${i + 1} — "${s.title}"\n` +
          `Description: ${s.description}\n` +
          `Initial image concept: ${s.imageConcept}`
      )
      .join('\n\n') +
    `\n\nFor each slide craft a precise DALL-E image prompt (max 40 words).` +
    ` The prompt should describe a clean, professional, colourful educational illustration with no text overlaid.\n\n` +
    `Return JSON:\n` +
    `{ "slides": [{ "title": "...", "description": "...", "imagePrompt": "..." }] }`;

  const model = getModel({ temperature: 0.5, maxTokens: 1200 });
  const response = await model.invoke([
    new SystemMessage('You are a visual design expert. Respond with valid JSON only.'),
    new HumanMessage(prompt),
  ]);

  let slides = [];
  try {
    const parsed = safeParseJSON(response.content);
    slides = (parsed.slides || []).map((s, i) => ({
      title:       s.title       || slideDrafts[i]?.title       || `Slide ${i + 1}`,
      description: s.description || slideDrafts[i]?.description || '',
      imagePrompt: s.imagePrompt || slideDrafts[i]?.imageConcept || topic,
    }));
  } catch {
    // Fall back to original drafts, using imageConcept as the prompt
    slides = slideDrafts.map((s) => ({
      title:       s.title,
      description: s.description,
      imagePrompt: s.imageConcept || topic,
    }));
  }

  return { slides };
}

function buildSlideGraph() {
  const graph = new StateGraph(SlideState)
    .addNode('planAndWriteSlides', planAndWriteSlides)
    .addNode('refineImagePrompts', refineImagePrompts)
    .addEdge(START, 'planAndWriteSlides')
    .addEdge('planAndWriteSlides', 'refineImagePrompts')
    .addEdge('refineImagePrompts', END);
  return graph.compile();
}

// ═════════════════════════════════════════════════════════════
// Public API — lazy-compile graphs on first call
// ═════════════════════════════════════════════════════════════

let _explainApp  = null;
let _feedbackApp = null;
let _quizApp     = null;
let _slideApp    = null;

async function runExplainPipeline(input) {
  if (!_explainApp) _explainApp = buildExplainGraph();
  const result = await _explainApp.invoke(input);
  return {
    explanations:   result.explanations   || [],
    recommendations: result.recommendations || [],
  };
}

async function runFeedbackPipeline(input) {
  if (!_feedbackApp) _feedbackApp = buildFeedbackGraph();
  const result = await _feedbackApp.invoke(input);
  return {
    feedback:     result.feedback     || '',
    strengths:    result.strengths    || [],
    improvements: result.improvements || [],
    studyPlan:    result.studyPlan    || [],
  };
}

async function runQuizGenerationPipeline(input) {
  if (!_quizApp) _quizApp = buildQuizGenerationGraph();
  const result = await _quizApp.invoke(input);
  return { quiz: result.quiz || null };
}

async function runSlidePipeline(input) {
  if (!_slideApp) _slideApp = buildSlideGraph();
  const result = await _slideApp.invoke(input);
  return { slides: result.slides || [] };
}

module.exports = {
  runExplainPipeline,
  runFeedbackPipeline,
  runQuizGenerationPipeline,
  runSlidePipeline,
};
