const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Firebase Initialization
// Note: You need to download your serviceAccountKey.json from Firebase Console
let database;
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lms-2266a-default-rtdb.firebaseio.com/"
  });
  database = admin.database();
  console.log('Firebase connected successfully');
} catch (error) {
  console.error('Firebase connection failed (serviceAccountKey.json missing):', error.message);
  console.log('Running with local mock data instead.');
}

// ----------------------------------------------------
// Mock Data (Fallback)
// ----------------------------------------------------

const DB_FILE = path.join(__dirname, 'db.json');

let localDb = {};

const defaultDb = {
  mockCourses: [
    {
      id: 1778054631755,
      title: "Modern UI/UX Design Fundamentals",
      instructor: "Alex Rivers",
      category: "Design",
      status: "Published",
      students: 1248,
      rating: 4.9,
      price: 89.99,
      duration: "12h 45m",
      lessons: 24,
      facilities: ["HD Video", "Source Files", "Certificate", "Lifetime Access"],
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=2000",
      quiz: [{ question: "What does UI stand for?", options: ["User Identity", "User Interface", "User Integration"], correct: 1 }]
    },
    {
      id: 1778054631756,
      title: "Advanced React Architecture",
      instructor: "Sarah Jenkins",
      category: "Development",
      status: "Pending Review",
      students: 0,
      rating: 0,
      price: 120.00,
      duration: "10h 00m",
      lessons: 15,
      facilities: ["HD Video", "Code Repo"],
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=2000",
      quiz: []
    }
  ],
  mockStudents: [],
  mockEnrollments: [
    { id: 1, name: 'Jane Doe', email: 'jane@example.com', course: 'Modern UI/UX Design Fundamentals', progress: 75, enrolledDate: '2024-05-01' },
    { id: 2, name: 'John Smith', email: 'john@example.com', course: 'Advanced React Architecture', progress: 100, enrolledDate: '2024-04-15' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', course: 'Fullstack Node.js Masterclass', progress: 30, enrolledDate: '2024-05-05' }
  ],
  mockAdminStats: {
    revenue: '$84,590',
    activeUsers: '12,450',
    courses: '142',
    systemLoad: '24%'
  },
  mockPlatformHealth: [
    { service: 'Database Server', status: 'Operational', uptime: '99.99%' },
    { service: 'Authentication API', status: 'Operational', uptime: '100%' },
    { service: 'Video CDN', status: 'Degraded', uptime: '98.50%' },
    { service: 'Payment Gateway', status: 'Operational', uptime: '99.99%' }
  ],
  mockStudentStats: {
    coursesInProgress: 3,
    learningHours: '42.5h',
    communityRank: '#128',
    certificatesEarned: 12
  },
  mockAdminActivity: [
    { id: 1, user: 'Alex Rivers', action: 'published a new course', target: 'Modern UI/UX Design', time: '2 mins ago', type: 'course' },
    { id: 2, user: 'Sarah Jenkins', action: 'purchased', target: 'Advanced React Architecture', time: '15 mins ago', type: 'purchase' }
  ],
  mockInstructorStats: {
    totalStudents: '1,248',
    courseRating: '4.8',
    revenue: '$12,450',
    activeCourses: '3'
  },
  mockGradingQueue: [
    { id: 1, student: 'Jane Doe', course: 'Modern UI/UX Design', assignment: 'Portfolio Review', submitted: '2 hours ago', status: 'pending' },
    { id: 2, student: 'John Smith', course: 'Advanced React Architecture', assignment: 'Final Project', submitted: '5 hours ago', status: 'pending' }
  ]
};

if (fs.existsSync(DB_FILE)) {
  try {
    const fileDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    localDb = { ...defaultDb, ...fileDb };
  } catch (err) {
    console.error('Error reading db.json:', err);
    localDb = defaultDb;
  }
} else {
  localDb = defaultDb;
  fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2));
}

const saveLocalDb = () => {
  fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2));
};


// ----------------------------------------------------
// Routes
// ----------------------------------------------------

// Helpers for Firebase mapping
const getFirebaseData = async (path, fallback) => {
  if (database) {
    try {
      const snapshot = await database.ref(path).once('value');
      const data = snapshot.val();
      if (!data) return fallback;
      return Array.isArray(fallback) ? Object.values(data) : data;
    } catch (error) {
      console.error(`Firebase GET error at ${path}:`, error);
      return fallback;
    }
  }
  return fallback;
};

// Course Routes
app.get('/api/courses', async (req, res) => {
  const data = await getFirebaseData('courses', localDb.mockCourses);
  res.json(data);
});

app.get('/api/courses/:id', async (req, res) => {
  const id = req.params.id;
  if (database) {
    const data = await getFirebaseData(`courses/${id}`, null);
    if (data) return res.json(data);
  }
  const course = localDb.mockCourses.find(c => c.id === parseInt(id));
  if (!course) return res.status(404).send('Course not found');
  res.json(course);
});

app.post('/api/courses', async (req, res) => {
  const newCourse = { ...req.body, status: "Pending Review", students: 0, rating: 0 };
  if (database) {
    try {
      const ref = database.ref('courses').push();
      newCourse.id = ref.key;
      await ref.set(newCourse);
      return res.status(201).json(newCourse);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  const courseWithId = { ...newCourse, id: Date.now() };
  localDb.mockCourses.push(courseWithId);
  saveLocalDb();
  res.status(201).json(courseWithId);
});

app.post('/api/courses/:id/quiz/:moduleId', async (req, res) => {
  const courseId = parseInt(req.params.id) || req.params.id;
  const moduleId = req.params.moduleId;
  const newQuiz = req.body.quiz || [];

  if (database) {
    try {
      const courseRef = database.ref(`courses/${courseId}`);
      await courseRef.child('quizzes').child(moduleId).set(newQuiz);
      return res.status(200).json({ success: true, quiz: newQuiz });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  const courseIndex = localDb.mockCourses.findIndex(c => c.id === courseId);
  if (courseIndex === -1) {
    return res.status(404).send('Course not found');
  }

  if (!localDb.mockCourses[courseIndex].quizzes) {
    localDb.mockCourses[courseIndex].quizzes = {};
  }
  localDb.mockCourses[courseIndex].quizzes[moduleId] = newQuiz;
  
  saveLocalDb();
  res.status(200).json({ success: true, quiz: newQuiz });
});

// Student Routes
app.get('/api/students', async (req, res) => {
  const data = await getFirebaseData('students', localDb.mockStudents);
  res.json(data);
});

app.post('/api/students/bulk', async (req, res) => {
  const students = req.body.students;
  if (!Array.isArray(students)) {
    return res.status(400).json({ error: 'Expected an array of students' });
  }

  const processedStudents = [];
  const processedEnrollments = [];

  students.forEach((student, index) => {
    const id = Date.now() + index;
    processedStudents.push({
      ...student,
      id: id,
      joinedAt: new Date().toISOString().split('T')[0],
      status: student.status || "Active",
      courses: parseInt(student.courses) || 0
    });

    processedEnrollments.push({
      id: id + 10000,
      name: student.name,
      email: student.email,
      course: 'Pending Course Assignment',
      progress: 0,
      enrolledDate: new Date().toISOString().split('T')[0]
    });
  });

  if (database) {
    try {
      const updates = {};
      processedStudents.forEach((student, idx) => {
        const studentKey = database.ref('students').push().key;
        student.id = studentKey;
        updates[`students/${studentKey}`] = student;

        const enrollment = processedEnrollments[idx];
        const enrollmentKey = database.ref('enrollments').push().key;
        enrollment.id = enrollmentKey;
        updates[`enrollments/${enrollmentKey}`] = enrollment;
      });
      await database.ref().update(updates);
      return res.status(201).json(processedStudents);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  localDb.mockStudents.push(...processedStudents);
  localDb.mockEnrollments.push(...processedEnrollments);
  saveLocalDb();
  res.status(201).json(processedStudents);
});

app.post('/api/students', async (req, res) => {
  const id = Date.now();
  const newStudent = { ...req.body, id, joinedAt: new Date().toISOString().split('T')[0], status: "Active" };
  
  const newEnrollment = {
    id: id + 10000,
    name: newStudent.name,
    email: newStudent.email,
    course: 'Pending Course Assignment',
    progress: 0,
    enrolledDate: new Date().toISOString().split('T')[0]
  };

  if (database) {
    try {
      const studentRef = database.ref('students').push();
      newStudent.id = studentRef.key;
      
      const enrollmentRef = database.ref('enrollments').push();
      newEnrollment.id = enrollmentRef.key;

      const updates = {};
      updates[`students/${studentRef.key}`] = newStudent;
      updates[`enrollments/${enrollmentRef.key}`] = newEnrollment;

      await database.ref().update(updates);
      return res.status(201).json(newStudent);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  localDb.mockStudents.push(newStudent);
  localDb.mockEnrollments.push(newEnrollment);
  saveLocalDb();
  res.status(201).json(newStudent);
});

// Dashboard Endpoints
app.get('/api/enrollments', async (req, res) => {
  const data = await getFirebaseData('enrollments', localDb.mockEnrollments);
  res.json(data);
});

app.get('/api/metrics/admin', async (req, res) => {
  const stats = await getFirebaseData('adminStats', localDb.mockAdminStats);
  const activity = await getFirebaseData('adminActivity', localDb.mockAdminActivity);
  const platformHealth = await getFirebaseData('platformHealth', localDb.mockPlatformHealth);
  res.json({ stats, activity, platformHealth });
});

app.get('/api/metrics/student', async (req, res) => {
  const stats = await getFirebaseData('studentStats', localDb.mockStudentStats);
  res.json({ stats });
});

app.get('/api/metrics/instructor', async (req, res) => {
  const stats = await getFirebaseData('instructorStats', localDb.mockInstructorStats);
  const gradingQueue = await getFirebaseData('gradingQueue', localDb.mockGradingQueue);
  res.json({ stats, gradingQueue });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

