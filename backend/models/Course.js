const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    default: "4 Weeks"
  },
  capacity: {
    type: Number,
    default: 50
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
