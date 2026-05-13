const express = require('express');
const Quiz = require('../models/Quiz');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get quizzes for a course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId }).select('-questions.correctAnswer -questions.explanation');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get specific quiz (without answers for students)
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer -questions.explanation');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get quiz with answers (for result review)
router.get('/:id/full', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create quiz (admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
