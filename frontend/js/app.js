const API_URL = '/api';

// Utility: Show Toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast) return;

    toast.className = `toast shadow-lg toast-${type}`;
    toastMsg.textContent = message;
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
}

// Utility: Check if User Logged In
function getToken() {
    return localStorage.getItem('ku_token');
}

function getUser() {
    const userStr = localStorage.getItem('ku_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Ensure Auth Redirects
const currentPath = window.location.pathname;
if (getToken() && (currentPath.includes('login') || currentPath.includes('register') || currentPath === '/' || currentPath === '/index.html')) {
    window.location.href = '/dashboard.html';
}

if (!getToken() && currentPath.includes('dashboard')) {
    window.location.href = '/login.html';
}

// Form Validation Utils
const validateEmail = (email) => {
    return String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

// Login Logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        let isValid = true;

        if (!validateEmail(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid university email';
            isValid = false;
        } else {
            document.getElementById('emailError').textContent = '';
        }

        if (password.length < 6) {
            document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
            isValid = false;
        } else {
            document.getElementById('passwordError').textContent = '';
        }

        if (!isValid) return;

        const btn = document.getElementById('loginBtn');
        const alertBox = document.getElementById('loginAlert');
        btn.textContent = 'Authenticating...';
        btn.disabled = true;

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('ku_token', data.token);
                localStorage.setItem('ku_user', JSON.stringify({ id: data._id, name: data.name, email: data.email }));
                window.location.href = '/dashboard.html';
            } else {
                alertBox.textContent = data.message || 'Login failed. Please verify your credentials.';
                alertBox.classList.remove('hidden');
            }
        } catch (err) {
            alertBox.textContent = 'Server error. Please try again later.';
            alertBox.classList.remove('hidden');
        } finally {
            btn.textContent = 'Login to Portal';
            btn.disabled = false;
        }
    });
}

// Register Logic
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        let isValid = true;

        if (name.length < 3) {
            document.getElementById('nameError').textContent = 'Name must be at least 3 characters';
            isValid = false;
        } else document.getElementById('nameError').textContent = '';

        if (!validateEmail(email)) {
            document.getElementById('regEmailError').textContent = 'Valid university email is required';
            isValid = false;
        } else document.getElementById('regEmailError').textContent = '';

        if (password.length < 6) {
            document.getElementById('regPasswordError').textContent = 'Password must be at least 6 characters';
            isValid = false;
        } else document.getElementById('regPasswordError').textContent = '';

        if (password !== confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
            isValid = false;
        } else document.getElementById('confirmPasswordError').textContent = '';

        if (!isValid) return;

        const btn = document.getElementById('registerBtn');
        const alertBox = document.getElementById('registerAlert');
        btn.textContent = 'Creating Account...';
        btn.disabled = true;

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('ku_token', data.token);
                localStorage.setItem('ku_user', JSON.stringify({ id: data._id, name: data.name, email: data.email }));
                window.location.href = '/dashboard.html';
            } else {
                alertBox.textContent = data.message || 'Registration failed.';
                alertBox.classList.remove('hidden');
            }
        } catch (err) {
            alertBox.textContent = 'Server connection error.';
            alertBox.classList.remove('hidden');
        } finally {
            btn.textContent = 'Create Account';
            btn.disabled = false;
        }
    });
}

// Dashboard Logic
if (currentPath.includes('dashboard')) {
    const user = getUser();
    if (user) {
        document.getElementById('userName').textContent = user.name;
        document.getElementById('welcomeName').textContent = user.name.split(' ')[0];
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('ku_token');
        localStorage.removeItem('ku_user');
        window.location.href = '/login.html';
    });

    loadDashboardData();
}

async function loadDashboardData() {
    try {
        const token = getToken();
        // Fetch User with Enrolled Courses
        const userRes = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await userRes.json();
        
        // Fetch all courses
        const coursesRes = await fetch(`${API_URL}/courses`);
        const allCourses = await coursesRes.json();

        if (userRes.ok && coursesRes.ok) {
            renderDashboard(userData.enrolledCourses, allCourses);
        } else {
            showToast('Failed to load courses', 'error');
        }
    } catch (err) {
        showToast('Server connection failed', 'error');
    }
}

function renderDashboard(enrolledCourses, allCourses) {
    const enrolledList = document.getElementById('enrolledCoursesList');
    const availableList = document.getElementById('availableCoursesList');

    enrolledList.innerHTML = '';
    availableList.innerHTML = '';

    const enrolledIds = enrolledCourses.map(c => c._id);

    if (enrolledCourses.length === 0) {
        enrolledList.innerHTML = `<p class="text-muted" style="grid-column: 1/-1;">You are not enrolled in any courses right now. Check available courses below.</p>`;
    } else {
        enrolledCourses.forEach(course => {
            enrolledList.innerHTML += createCourseCard(course, true);
        });
    }

    const unEnrolledCourses = allCourses.filter(c => !enrolledIds.includes(c._id));

    if (unEnrolledCourses.length === 0) {
        availableList.innerHTML = `<p class="text-muted" style="grid-column: 1/-1;">No more courses available right now.</p>`;
    } else {
        unEnrolledCourses.forEach(course => {
            availableList.innerHTML += createCourseCard(course, false);
        });
    }
}

function createCourseCard(course, isEnrolled) {
    const isFull = course.enrolledStudents.length >= course.capacity;

    let buttonHtml = '';
    if (isEnrolled) {
        buttonHtml = `<button class="btn btn-block btn-sm mt-3" style="background:#ECFDF5; color:var(--success); border:1px solid #A7F3D0; cursor:default;">✓ Enrolled</button>`;
    } else if (isFull) {
        buttonHtml = `<button class="btn btn-block btn-sm mt-3" style="background:#FEF2F2; color:var(--error); border:1px solid #FECACA; cursor:default;" disabled>Seat Limit Reached</button>`;
    } else {
        buttonHtml = `<button class="btn btn-primary btn-block btn-sm mt-3 shadow-hover" onclick="enrollCourse('${course._id}')">Enroll Now</button>`;
    }

    return `
        <div class="course-card">
            <div>
                <div class="flex-space-between align-center mb-2">
                    <span class="badge ${isEnrolled ? 'badge-success' : ''}">${isEnrolled ? 'Registered' : 'Open'}</span>
                    <span class="text-muted" style="font-size:0.8rem;">Seats: ${course.enrolledStudents.length}/${course.capacity}</span>
                </div>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-desc">${course.description}</p>
                <div class="course-meta">
                    <div class="meta-item">
                        <span class="meta-label">Instructor</span>
                        <span class="meta-value">${course.instructor}</span>
                    </div>
                    <div class="meta-item text-right">
                        <span class="meta-label">Duration</span>
                        <span class="meta-value">${course.duration}</span>
                    </div>
                </div>
            </div>
            ${buttonHtml}
        </div>
    `;
}

window.enrollCourse = async function(courseId) {
    if (!confirm('Are you sure you want to enroll in this course?')) return;
    
    try {
        const res = await fetch(`${API_URL}/courses/enroll/${courseId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await res.json();
        
        if (res.ok) {
            showToast('Successfully enrolled in the course!', 'success');
            loadDashboardData(); // Refresh UI
        } else {
            showToast(data.message || 'Failed to enroll', 'error');
        }
    } catch (err) {
        showToast('Network error while enrolling', 'error');
    }
};
