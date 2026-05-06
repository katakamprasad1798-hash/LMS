import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Trash2, Search, Filter, UserPlus, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageEnrollments = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/enrollments')
      .then(res => res.json())
      .then(data => setEnrollments(data))
      .catch(err => console.error(err));
  }, []);

  const handleExportCSV = () => {
    if (enrollments.length === 0) return;
    const headers = ['Name', 'Email', 'Course', 'Enrolled Date', 'Progress'];
    const csvRows = [
      headers.join(','),
      ...enrollments.map(e => `"${e.name}","${e.email}","${e.course}","${e.enrolledDate}","${e.progress}%"`)
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enrollments_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
    >
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Manage Enrollments</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track student progress and manage access to your courses.</p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'var(--glass-inner)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-main)', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }} onClick={handleExportCSV}>
            <Download size={18} /> Export CSV
          </button>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
            <Filter size={18} /> Filter by Course
          </button>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/bulk-add-students')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}
          >
            <UserPlus size={18} /> Bulk Enroll
          </button>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--glass-inner-darker)' }}>
              <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)' }}>Student</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)' }}>Course</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)' }}>Enrolled Date</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)' }}>Progress</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map(enrollment => (
              <tr key={enrollment.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                      {enrollment.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{enrollment.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{enrollment.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px 24px', fontWeight: 500, color: 'var(--text-muted)' }}>{enrollment.course}</td>
                <td style={{ padding: '20px 24px', color: 'var(--text-muted)' }}>{enrollment.enrolledDate}</td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'var(--glass-inner-darker)', borderRadius: '3px', overflow: 'hidden', minWidth: '100px' }}>
                      <div style={{ height: '100%', width: `${enrollment.progress}%`, background: enrollment.progress === 100 ? '#10b981' : 'var(--primary)', borderRadius: '3px' }}></div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: enrollment.progress === 100 ? '#10b981' : 'var(--text-main)' }}>{enrollment.progress}%</span>
                  </div>
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} title="Message Student">
                      <Mail size={18} />
                    </button>
                    <button style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', transition: 'opacity 0.2s', opacity: 0.8 }} title="Remove Student">
                      <Trash2 size={18} />
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

export default ManageEnrollments;
