const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const User = require('./models/User');

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/student_course_registration';

const courses = [
  {
    title: 'Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, and Node.js to become a full-stack developer.',
    instructor: 'John Doe',
    duration: '12 Weeks',
    capacity: 30
  },
  {
    title: 'Advanced React patterns',
    description: 'Master React concepts like Context API, Hooks, and Redux.',
    instructor: 'Jane Smith',
    duration: '6 Weeks',
    capacity: 25
  },
  {
    title: 'Introduction to Python Data Science',
    description: 'Data manipulation and visualization using Pandas, NumPy, and Matplotlib.',
    instructor: 'Alice Johnson',
    duration: '8 Weeks',
    capacity: 40
  },
  {
    title: 'Machine Learning Basics',
    description: 'Learn the fundamentals of ML using Scikit-learn and basic neural networks.',
    instructor: 'Bob Brown',
    duration: '10 Weeks',
    capacity: 20
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('DB Connected for seeding...');

    // Clear existing data
    await Course.deleteMany();
    await User.deleteMany();

    await Course.insertMany(courses);
    console.log('Mock courses seeded successfully!');

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedDB();
