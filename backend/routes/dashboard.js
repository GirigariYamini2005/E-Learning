const express = require('express');
const Result = require('../models/Result');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const results = await Result.find({ user: userId })
      .populate('quiz', 'title topicIndex subtopicIndex')
      .populate('course', 'title');

    const user = await User.findById(userId);
    const enrolledCount = user.enrolledCourses.length;

    const totalQuizzes = results.length;
    const avgScore = totalQuizzes > 0
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes)
      : 0;

    // Identify weak topics (score < 60%)
    const weakTopics = [];
    const topicScores = {};
    for (const result of results) {
      const key = `${result.course?.title || 'Unknown'} - ${result.quiz?.title || 'Unknown'}`;
      if (!topicScores[key]) {
        topicScores[key] = { total: 0, count: 0 };
      }
      topicScores[key].total += result.percentage;
      topicScores[key].count += 1;
    }
    for (const [topic, data] of Object.entries(topicScores)) {
      const avg = data.total / data.count;
      if (avg < 60) {
        weakTopics.push({ topic, averageScore: Math.round(avg) });
      }
    }

    // Recent activity
    const recentResults = results.slice(0, 5).map(r => ({
      id: r._id,
      quizTitle: r.quiz?.title || 'Unknown',
      courseTitle: r.course?.title || 'Unknown',
      score: r.score,
      totalQuestions: r.totalQuestions,
      percentage: r.percentage,
      completedAt: r.completedAt
    }));

    // Course-wise performance
    const coursePerformance = {};
    for (const result of results) {
      const courseTitle = result.course?.title || 'Unknown';
      if (!coursePerformance[courseTitle]) {
        coursePerformance[courseTitle] = { totalScore: 0, count: 0, quizzes: 0 };
      }
      coursePerformance[courseTitle].totalScore += result.percentage;
      coursePerformance[courseTitle].count += 1;
      coursePerformance[courseTitle].quizzes += 1;
    }
    const courseStats = Object.entries(coursePerformance).map(([name, data]) => ({
      course: name,
      averageScore: Math.round(data.totalScore / data.count),
      quizzesAttempted: data.quizzes
    }));

    res.json({
      totalQuizzes,
      averageScore: avgScore,
      enrolledCourses: enrolledCount,
      weakTopics,
      recentResults,
      courseStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
