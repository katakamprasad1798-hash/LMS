import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle, XCircle, MoreVertical, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Published': return <span style={{ padding: '4px 10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Published</span>;
      case 'Pending Review': return <span style={{ padding: '4px 10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Pending Review</span>;
      case 'Rejected': return <span style={{ padding: '4px 10px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Rejected</span>;
      default: return null;
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading global course directory..." />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Global Course Directory</h1>
          <p style={{ color: 'var(--text-muted)' }}>Approve, reject, and monitor all courses on the platform.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search all courses..." 
            style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'var(--glass-inner)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-main)', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
            <Filter size={18} /> Filter Status
          </button>
        </div>
      </div>

      {/* Course Table */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--glass-inner-darker)' }}>
              <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)' }}>Course Title</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)' }}>Instructor</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)' }}>Category</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ fontWeight: 600 }}>{course.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{course.students} enrollments • {course.price}</div>
                </td>
                <td style={{ padding: '20px 24px', color: 'var(--text-muted)' }}>{course.instructor}</td>
                <td style={{ padding: '20px 24px', color: 'var(--text-muted)' }}>{course.category}</td>
                <td style={{ padding: '20px 24px' }}>{getStatusBadge(course.status)}</td>
                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    {course.status === 'Pending Review' && (
                      <>
                        <button style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer' }} title="Approve">
                          <CheckCircle size={20} />
                        </button>
                        <button style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer' }} title="Reject">
                          <XCircle size={20} />
                        </button>
                      </>
                    )}
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Preview Course">
                      <Eye size={20} />
                    </button>
                    <button title="More Actions" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminCourses;
