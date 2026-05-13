const express = require('express');
const Course = require('../models/Course');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().select('-topics.subtopics.content');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get single course with full content
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found.' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create course (admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const course = new Course({ ...req.body, createdBy: req.user._id });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    console.error('Course creation error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update course (admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found.' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.enrolledCourses.includes(req.params.id)) {
      return res.status(400).json({ message: 'Already enrolled.' });
    }
    user.enrolledCourses.push(req.params.id);
    await user.save();
    res.json({ message: 'Enrolled successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get enrolled courses for current user
router.get('/user/enrolled', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses');
    res.json(user.enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
