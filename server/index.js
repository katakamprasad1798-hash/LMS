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
  mockCourses: [],
  mockStudents: [],
  mockEnrollments: [],
  mockAdminStats: {
    revenue: '$0',
    activeUsers: '0',
    courses: '0',
    systemLoad: '0%'
  },
  mockPlatformHealth: [
    { service: 'Database Server', status: 'Operational', uptime: '100%' },
    { service: 'Authentication API', status: 'Operational', uptime: '100%' },
    { service: 'Video CDN', status: 'Operational', uptime: '100%' },
    { service: 'Payment Gateway', status: 'Operational', uptime: '100%' }
  ],
  mockStudentStats: {
    coursesInProgress: 0,
    learningHours: '0h',
    communityRank: 'N/A',
    certificatesEarned: 0
  },
  mockAdminActivity: [],
  mockInstructorStats: {
    totalStudents: '0',
    courseRating: '0',
    revenue: '$0',
    activeCourses: '0'
  },
  mockGradingQueue: [],
  mockFeedback: [
    {
      id: "feed-1",
      courseId: "-N_course_2",
      courseName: "Advanced React Architecture",
      studentName: "Alice Green",
      rating: 5,
      comment: "This course is exceptionally well structured! The deep dives into advanced component design and patterns were extremely practical and helpful.",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      id: "feed-2",
      courseId: "-N_course_2",
      courseName: "Advanced React Architecture",
      studentName: "Bob Miller",
      rating: 4,
      comment: "Great content and very advanced. The compound components module was a bit challenging but highly rewarding.",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      id: "feed-3",
      courseId: "-N_course_1",
      courseName: "Intro to Product Design",
      studentName: "Anonymous",
      rating: 5,
      comment: "Absolutely stellar! The instructor explains Figma workflows beautifully. Highly recommend to anyone transitioning to UI/UX.",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
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
      const firebasePromise = database.ref(path).once('value').then(snapshot => {
        const data = snapshot.val();
        if (!data) return fallback;
        return Array.isArray(fallback) ? Object.values(data) : data;
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firebase timeout')), 2000)
      );

      return await Promise.race([firebasePromise, timeoutPromise]);
    } catch (error) {
      console.warn(`Firebase GET fallback at ${path}:`, error.message);
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

app.post('/api/courses/:id/quizzes/clear', async (req, res) => {
  const courseId = parseInt(req.params.id) || req.params.id;

  if (database) {
    try {
      await database.ref(`courses/${courseId}/quizzes`).remove();
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  const courseIndex = localDb.mockCourses.findIndex(c => c.id === courseId);
  if (courseIndex === -1) {
    return res.status(404).send('Course not found');
  }

  localDb.mockCourses[courseIndex].quizzes = {};
  saveLocalDb();
  res.status(200).json({ success: true });
});

app.put('/api/courses/:id', async (req, res) => {
  const courseId = parseInt(req.params.id) || req.params.id;
  const updatedData = req.body;

  if (database) {
    try {
      await database.ref(`courses/${courseId}`).update(updatedData);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  const courseIndex = localDb.mockCourses.findIndex(c => c.id === courseId);
  if (courseIndex === -1) {
    return res.status(404).send('Course not found');
  }

  localDb.mockCourses[courseIndex] = { ...localDb.mockCourses[courseIndex], ...updatedData };
  saveLocalDb();
  res.status(200).json(localDb.mockCourses[courseIndex]);
});

app.post('/api/courses/bulk-delete', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'Expected an array of ids' });

  if (database) {
    try {
      const updates = {};
      ids.forEach(id => updates[`courses/${id}`] = null);
      await database.ref().update(updates);
      return res.status(200).json({ success: true, deleted: ids });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  localDb.mockCourses = localDb.mockCourses.filter(c => !ids.includes(c.id));
  saveLocalDb();
  res.status(200).json({ success: true, deleted: ids });
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

app.put('/api/students/:id', async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  if (database) {
    try {
      await database.ref(`students/${id}`).update(updatedData);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  const studentIndex = localDb.mockStudents.findIndex(s => s.id.toString() === id.toString());
  if (studentIndex === -1) return res.status(404).send('Student not found');

  localDb.mockStudents[studentIndex] = { ...localDb.mockStudents[studentIndex], ...updatedData };
  saveLocalDb();
  res.status(200).json(localDb.mockStudents[studentIndex]);
});

// Dashboard Endpoints
app.post('/api/students/bulk-delete', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'Expected an array of ids' });

  if (database) {
    try {
      const updates = {};
      ids.forEach(id => updates[`students/${id}`] = null);
      await database.ref().update(updates);
      return res.status(200).json({ success: true, deleted: ids });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  localDb.mockStudents = localDb.mockStudents.filter(s => !ids.includes(s.id));
  saveLocalDb();
  res.status(200).json({ success: true, deleted: ids });
});

app.post('/api/enrollments/bulk-delete', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'Expected an array of ids' });

  if (database) {
    try {
      const updates = {};
      ids.forEach(id => updates[`enrollments/${id}`] = null);
      await database.ref().update(updates);
      return res.status(200).json({ success: true, deleted: ids });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  localDb.mockEnrollments = localDb.mockEnrollments.filter(e => !ids.includes(e.id));
  saveLocalDb();
  res.status(200).json({ success: true, deleted: ids });
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

// Feedback Endpoint
app.post('/api/feedback', async (req, res) => {
  const newFeedback = {
    id: Date.now(),
    courseId: req.body.courseId,
    courseName: req.body.courseName,
    studentName: req.body.studentName || 'Anonymous',
    rating: parseInt(req.body.rating) || 5,
    comment: req.body.comment || '',
    date: new Date().toISOString().split('T')[0]
  };

  if (database) {
    try {
      const ref = database.ref('feedback').push();
      newFeedback.id = ref.key;
      await ref.set(newFeedback);
      
      // Update course rating dynamically in Firebase if exists
      const courseRef = database.ref(`courses/${req.body.courseId}`);
      const courseSnap = await courseRef.once('value');
      if (courseSnap.exists()) {
        const feedbackSnap = await database.ref('feedback').once('value');
        const allFeedback = Object.values(feedbackSnap.val() || {});
        const courseFeedbacks = allFeedback.filter(f => f.courseId === req.body.courseId);
        const avg = courseFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / (courseFeedbacks.length || 1);
        await courseRef.update({ rating: parseFloat(avg.toFixed(1)) });
      }
      
      return res.status(201).json(newFeedback);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (!localDb.mockFeedback) {
    localDb.mockFeedback = [];
  }
  localDb.mockFeedback.push(newFeedback);

  // Update course rating dynamically in local fallback
  const courseIndex = localDb.mockCourses.findIndex(c => c.id.toString() === req.body.courseId.toString());
  if (courseIndex !== -1) {
    const courseFeedbacks = localDb.mockFeedback.filter(f => f.courseId.toString() === req.body.courseId.toString());
    const avg = courseFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / (courseFeedbacks.length || 1);
    localDb.mockCourses[courseIndex].rating = parseFloat(avg.toFixed(1));
  }

  saveLocalDb();
  res.status(201).json(newFeedback);
});

// GET all feedbacks
app.get('/api/feedback', async (req, res) => {
  const data = await getFirebaseData('feedback', localDb.mockFeedback || []);
  res.json(data);
});

// DELETE a feedback
app.delete('/api/feedback/:id', async (req, res) => {
  const id = req.params.id;

  if (database) {
    try {
      await database.ref(`feedback/${id}`).remove();
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  localDb.mockFeedback = (localDb.mockFeedback || []).filter(f => f.id.toString() !== id.toString());
  saveLocalDb();
  res.status(200).json({ success: true });
});

// DELETE bulk feedbacks
app.post('/api/feedback/bulk-delete', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'Expected an array of ids' });

  if (database) {
    try {
      const updates = {};
      ids.forEach(id => updates[`feedback/${id}`] = null);
      await database.ref().update(updates);
      return res.status(200).json({ success: true, deleted: ids });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  localDb.mockFeedback = (localDb.mockFeedback || []).filter(f => !ids.includes(f.id));
  saveLocalDb();
  res.status(200).json({ success: true, deleted: ids });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

