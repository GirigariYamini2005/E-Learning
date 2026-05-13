const express = require('express');
const OpenAI  = require('openai');
const Result  = require('../models/Result');
const Quiz    = require('../models/Quiz');
const Course  = require('../models/Course');
const { auth }  = require('../middleware/auth');
const {
  runExplainPipeline,
  runFeedbackPipeline,
  runQuizGenerationPipeline,
  runSlidePipeline,
} = require('../langgraph/pipeline');

const router = express.Router();

// OpenAI client is kept only for DALL-E image generation (lazy init)
let _openai = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/generate-video
// LangGraph pipeline:  planAndWriteSlides → refineImagePrompts
// Then DALL-E generates one image per refined prompt.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/generate-video', auth, async (req, res) => {
  try {
    const { topic, courseId } = req.body;
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ message: 'Topic is required.' });
    }

    const sanitizedTopic = topic.trim().slice(0, 200);

    let courseContext = '';
    if (courseId) {
      const course = await Course.findById(courseId);
      if (course) {
        courseContext = `This is part of the course "${course.title}" (${course.category}, ${course.difficulty} level).`;
      }
    }

    // --- LangGraph: generate + refine slide scripts -------------------------
    const { slides: scriptSlides } = await runSlidePipeline({
      topic:         sanitizedTopic,
      courseContext,
    });

    if (!scriptSlides.length) {
      return res.status(500).json({ message: 'Failed to generate slide content.' });
    }

    // --- DALL-E: generate one image per refined prompt ---------------------
    const slides = [];
    for (const slide of scriptSlides) {
      try {
        const imageResponse = await getOpenAI().images.generate({
          model:   'dall-e-3',
          prompt:  `Educational illustration: ${slide.imagePrompt}. Clean, modern, professional style with soft colours suitable for e-learning.`,
          n:       1,
          size:    '1024x1024',
          quality: 'standard',
        });
        slides.push({
          title:       slide.title,
          description: slide.description,
          imageUrl:    imageResponse.data[0].url,
        });
      } catch (imgErr) {
        console.error('Image generation error for slide:', slide.title, imgErr.message);
        slides.push({ title: slide.title, description: slide.description, imageUrl: null });
      }
    }

    res.json({ topic: sanitizedTopic, slides });
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ message: 'Failed to generate video slides.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/explain
// LangGraph pipeline:  categoriseErrors → generateExplanations → synthesiseRecommendations
// ─────────────────────────────────────────────────────────────────────────────
router.post('/explain', auth, async (req, res) => {
  try {
    const { resultId } = req.body;
    const result = await Result.findById(resultId).populate('quiz').populate('course', 'title');
    if (!result) return res.status(404).json({ message: 'Result not found.' });

    const incorrectAnswers = result.answers
      .filter((a) => !a.isCorrect)
      .map((a) => {
        const q = result.quiz.questions[a.questionIndex];
        return {
          question:      q.question,
          yourAnswer:    q.options[a.selectedAnswer],
          correctAnswer: q.options[q.correctAnswer],
        };
      });

    if (incorrectAnswers.length === 0) {
      return res.json({
        explanations:    [],
        recommendations: [],
        message:         'Congratulations! You answered all questions correctly!',
      });
    }

    const aiResponse = await runExplainPipeline({
      incorrectAnswers,
      quizTitle:   result.quiz.title,
      courseTitle: result.course?.title || '',
      score:       result.score,
      percentage:  result.percentage,
    });

    res.json(aiResponse);
  } catch (error) {
    console.error('Explain pipeline error:', error);
    res.status(500).json({ message: 'Failed to generate AI feedback.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/feedback
// LangGraph pipeline:  analyseTrend → identifyPatterns → buildStudyPlan
// ─────────────────────────────────────────────────────────────────────────────
router.post('/feedback', auth, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate('quiz', 'title')
      .populate('course', 'title')
      .sort({ completedAt: -1 })
      .limit(10);

    if (results.length === 0) {
      return res.json({
        feedback:     'Start taking quizzes to receive personalised AI feedback!',
        strengths:    [],
        improvements: [],
        studyPlan:    [],
      });
    }

    const avgScore = Math.round(
      results.reduce((sum, r) => sum + r.percentage, 0) / results.length
    );

    const aiResponse = await runFeedbackPipeline({ results, avgScore });

    res.json(aiResponse);
  } catch (error) {
    console.error('Feedback pipeline error:', error);
    res.status(500).json({ message: 'Failed to generate feedback.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/generate-quiz
// LangGraph pipeline:  enrichTopicContext → generateQuizDraft → validateQuiz
// Uses fine-tuned model when FINETUNED_MODEL_ID env var is set.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/generate-quiz', auth, async (req, res) => {
  try {
    const { topic, courseId, difficulty = 'intermediate', numQuestions = 5 } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ message: 'Topic is required.' });
    }

    const sanitizedTopic = topic.trim().slice(0, 200);

    let courseContext = '';
    if (courseId) {
      const course = await Course.findById(courseId);
      if (course) {
        courseContext = `Course: "${course.title}" — ${course.category}, ${course.difficulty} level.`;
      }
    }

    const allowedDifficulties = ['beginner', 'intermediate', 'advanced'];
    const safeDifficulty = allowedDifficulties.includes(difficulty) ? difficulty : 'intermediate';
    const safeNum = Math.min(Math.max(Number(numQuestions) || 5, 1), 10);

    const { quiz } = await runQuizGenerationPipeline({
      topic:        sanitizedTopic,
      courseContext,
      difficulty:   safeDifficulty,
      numQuestions: safeNum,
    });

    if (!quiz) {
      return res.status(500).json({ message: 'Failed to generate quiz.' });
    }

    // Indicate whether the response came from the fine-tuned model
    const modelUsed = process.env.FINETUNED_MODEL_ID || 'gpt-3.5-turbo';
    res.json({ quiz, modelUsed });
  } catch (error) {
    console.error('Quiz generation pipeline error:', error);
    res.status(500).json({ message: 'Failed to generate quiz.' });
  }
});

module.exports = router;
