const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
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

const mockCourses = [
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
];

const mockStudents = [];

const mockEnrollments = [
  { id: 1, name: 'Jane Doe', email: 'jane@example.com', course: 'Modern UI/UX Design Fundamentals', progress: 75, enrolledDate: '2024-05-01' },
  { id: 2, name: 'John Smith', email: 'john@example.com', course: 'Advanced React Architecture', progress: 100, enrolledDate: '2024-04-15' },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', course: 'Fullstack Node.js Masterclass', progress: 30, enrolledDate: '2024-05-05' }
];

const mockAdminStats = {
  revenue: '$84,590',
  activeUsers: '12,450',
  courses: '142',
  systemLoad: '24%'
};

const mockAdminActivity = [
  { id: 1, user: 'Alex Rivers', action: 'published a new course', target: 'Modern UI/UX Design', time: '2 mins ago', type: 'course' },
  { id: 2, user: 'Sarah Jenkins', action: 'purchased', target: 'Advanced React Architecture', time: '15 mins ago', type: 'purchase' }
];

const mockInstructorStats = {
  totalStudents: '1,248',
  courseRating: '4.8',
  revenue: '$12,450',
  activeCourses: '3'
};

const mockGradingQueue = [
  { id: 1, student: 'Jane Doe', course: 'Modern UI/UX Design', assignment: 'Portfolio Review', submitted: '2 hours ago', status: 'pending' },
  { id: 2, student: 'John Smith', course: 'Advanced React Architecture', assignment: 'Final Project', submitted: '5 hours ago', status: 'pending' }
];


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
  const data = await getFirebaseData('courses', mockCourses);
  res.json(data);
});

app.get('/api/courses/:id', async (req, res) => {
  const id = req.params.id;
  if (database) {
    const data = await getFirebaseData(`courses/${id}`, null);
    if (data) return res.json(data);
  }
  const course = mockCourses.find(c => c.id === parseInt(id));
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
  mockCourses.push(courseWithId);
  res.status(201).json(courseWithId);
});

// Student Routes
app.get('/api/students', async (req, res) => {
  const data = await getFirebaseData('students', mockStudents);
  res.json(data);
});

app.post('/api/students', async (req, res) => {
  const newStudent = { ...req.body, id: Date.now(), joinedAt: new Date().toISOString().split('T')[0], status: "Active" };
  if (database) {
    try {
      const ref = database.ref('students').push();
      newStudent.id = ref.key;
      await ref.set(newStudent);
      return res.status(201).json(newStudent);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  mockStudents.push(newStudent);
  res.status(201).json(newStudent);
});

// Dashboard Endpoints
app.get('/api/enrollments', async (req, res) => {
  const data = await getFirebaseData('enrollments', mockEnrollments);
  res.json(data);
});

app.get('/api/metrics/admin', async (req, res) => {
  const stats = await getFirebaseData('adminStats', mockAdminStats);
  const activity = await getFirebaseData('adminActivity', mockAdminActivity);
  res.json({ stats, activity });
});

app.get('/api/metrics/instructor', async (req, res) => {
  const stats = await getFirebaseData('instructorStats', mockInstructorStats);
  const gradingQueue = await getFirebaseData('gradingQueue', mockGradingQueue);
  res.json({ stats, gradingQueue });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

