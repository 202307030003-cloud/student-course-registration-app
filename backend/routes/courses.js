const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route GET /api/courses
// @desc Get all available courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/courses/enroll/:id
// @desc Enroll in a course
router.post('/enroll/:id', protect, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if capacity is full
    if (course.enrolledStudents.length >= course.capacity) {
      return res.status(400).json({ message: 'Course is already full' });
    }

    const user = await User.findById(userId);

    // Check if already enrolled
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add course to user
    user.enrolledCourses.push(courseId);
    await user.save();

    // Add user to course
    course.enrolledStudents.push(userId);
    await course.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
