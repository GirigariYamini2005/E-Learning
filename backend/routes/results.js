const express = require('express');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Submit quiz result
router.post('/', auth, async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });

    let score = 0;
    const processedAnswers = answers.map((ans, index) => {
      const isCorrect = quiz.questions[index].correctAnswer === ans.selectedAnswer;
      if (isCorrect) score++;
      return { questionIndex: index, selectedAnswer: ans.selectedAnswer, isCorrect };
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);

    const result = new Result({
      user: req.user._id,
      quiz: quizId,
      course: quiz.course,
      answers: processedAnswers,
      score,
      totalQuestions: quiz.questions.length,
      percentage
    });
    await result.save();

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get results for current user
router.get('/my', auth, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate('quiz', 'title')
      .populate('course', 'title')
      .sort({ completedAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get single result
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quiz')
      .populate('course', 'title');
    if (!result) return res.status(404).json({ message: 'Result not found.' });
    if (result.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
