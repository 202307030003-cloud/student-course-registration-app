# Student Course Registration App

A fully functional, aesthetic and responsive premium web application built for Karnavati University's students to seamlessly register, log in, view available courses, and enroll in them online.

## 🚀 Features
- **Student Authentication:** Secure user registration and login using JWT and bcrypt.
- **Aesthetic UI:** Premium design using custom CSS, focusing on an elegant experience and responsiveness.
- **Student Dashboard:** View enrolled courses and browse available courses.
- **Real-time Course Enrollment:** Handle limited course capacities dynamically.
- **Form validation:** Extensive client-side validations and notifications.

## 💻 Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla DOM APIs, Fetch API)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Tools:** Git, VS Code

## 🛠️ Setup Instructions
1. Clone the repository.
   ```bash
   git clone https://github.com/202307030/student-course-registration-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd student-course-registration-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables in a `.env` file based on `.env.example`.
5. Run the server:
   ```bash
   npm run dev
   ```
6. Visit `http://localhost:5000` in your web browser.

## 🗄️ Database Seeding
You can run the mock data script to populate your MongoDB with starter courses:
```bash
node backend/seed.js
```
