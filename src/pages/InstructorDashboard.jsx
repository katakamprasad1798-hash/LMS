import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Star, DollarSign, Plus, Edit2, Play, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [gradingQueue, setGradingQueue] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/metrics/instructor').then(res => res.json()),
      fetch('http://localhost:5000/api/courses').then(res => res.json())
    ])
      .then(([metricsData, coursesData]) => {
        if (metricsData.stats) {
          setStats([
            { title: 'Total Students', value: metricsData.stats.totalStudents, icon: <Users size={24} color="var(--primary)" /> },
            { title: 'Course Rating', value: metricsData.stats.courseRating, icon: <Star size={24} color="#f59e0b" /> },
            { title: 'Revenue', value: metricsData.stats.revenue, icon: <DollarSign size={24} color="#10b981" /> },
            { title: 'Active Courses', value: metricsData.stats.activeCourses, icon: <BookOpen size={24} color="var(--secondary)" /> }
          ]);
        }
        if (metricsData.gradingQueue) {
          setGradingQueue(metricsData.gradingQueue);
        }
        setCourses(coursesData);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingSpinner message="Fetching your instructor dashboard..." />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Instructor Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your courses, grade assignments, and track performance.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/admin/add-course')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Create New Course
        </button>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'var(--glass-inner-darker)', borderRadius: '12px' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>{stat.title}</p>
              <h3 style={{ fontSize: '24px', fontWeight: 700 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Course Management */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>My Courses</h2>
            <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px', fontWeight: 500 }}>Course</th>
                <th style={{ padding: '12px', fontWeight: 500 }}>Students</th>
                <th style={{ padding: '12px', fontWeight: 500 }}>Rating</th>
                <th style={{ padding: '12px', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id} style={{ borderBottom: '1px solid var(--glass-inner)' }}>
                  <td style={{ padding: '16px 12px', fontWeight: 500 }}>{course.title}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{course.students}</td>
                  <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} color="#f59e0b" fill="#f59e0b" /> {course.rating}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button title="Edit Course" style={{ background: 'var(--glass-inner-darker)', border: 'none', padding: '8px', borderRadius: '8px', color: 'var(--text-main)', cursor: 'pointer' }}>
                        <Edit2 size={16} />
                      </button>
                      <button title="Preview Course" style={{ background: 'var(--glass-inner-darker)', border: 'none', padding: '8px', borderRadius: '8px', color: 'var(--text-main)', cursor: 'pointer' }}>
                        <Play size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grading Queue */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Grading Queue</h2>
            <span style={{ background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{gradingQueue.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {gradingQueue.length > 0 ? gradingQueue.map(item => (
              <div key={item.id} style={{ background: 'var(--glass-inner-darker)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{item.student}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.submitted}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {item.course} - {item.assignment}
                </div>
                <button title="Grade Assignment" className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '8px' }}>
                  <CheckCircle size={16} /> Grade Now
                </button>
              </div>
            )) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>All caught up! No assignments pending.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InstructorDashboard;
