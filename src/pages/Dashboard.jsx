import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Users, Award } from 'lucide-react';
import CourseCard from '../components/CourseCard';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <div className="glass" style={{ padding: '40px', marginBottom: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
            Welcome back, <span className="gradient-text">Prasad!</span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '500px', marginBottom: '24px' }}>
            You've completed 75% of your weekly goal. Keep pushing to unlock your next certification!
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn-primary">View Progress</button>
            <button className="btn-secondary">Explore New</button>
          </div>
        </div>
        
        {/* Abstract shapes for design */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', left: '40%', width: '200px', height: '200px', background: 'var(--secondary)', filter: 'blur(80px)', opacity: 0.2, borderRadius: '50%' }}></div>
      </div>

      {/* Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <StatCard icon={<Play size={20} />} label="Courses in Progress" value="3" color="#6366f1" />
        <StatCard icon={<TrendingUp size={20} />} label="Learning Hours" value="42.5h" color="#a855f7" />
        <StatCard icon={<Users size={20} />} label="Community Rank" value="#128" color="#f43f5e" />
        <StatCard icon={<Award size={20} />} label="Certificates Earned" value="12" color="#10b981" />
      </div>

      {/* Course List Section */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600 }}>Continue Learning</h2>
        <a href="/courses" style={{ color: 'var(--primary)', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>View all courses</a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
      <h3 style={{ fontSize: '20px', fontWeight: 700 }}>{value}</h3>
    </div>
  </div>
);

export default Dashboard;
