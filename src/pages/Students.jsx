import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Mail, Calendar, BookOpen, Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = ['Name', 'Email', 'Joined Date', 'Courses', 'Status'];
    const csvRows = [
      headers.join(','),
      ...students.map(s => `"${s.name}","${s.email}","${s.joinedAt}","${s.courses}","${s.status}"`)
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(students.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} students?`)) return;

    try {
      const response = await fetch('http://localhost:5000/api/students/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      if (response.ok) {
        setStudents(prev => prev.filter(s => !selectedIds.includes(s.id)));
        setSelectedIds([]);
      } else {
        console.error('Failed to bulk delete');
      }
    } catch (err) {
      console.error(err);
    }
  };


  if (isLoading) return <LoadingSpinner message="Fetching student records..." />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Student Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Overview of all enrolled students and their progress.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {selectedIds.length > 0 && (
            <button 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--accent)' }}
              onClick={handleBulkDelete}
            >
              <Trash2 size={18} /> Bulk Delete ({selectedIds.length})
            </button>
          )}
          <button 
            className="glass" 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', borderRadius: '12px', color: 'var(--text-main)', border: '1px solid var(--border)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => navigate('/admin/courses')}
          >
            <BookOpen size={18} color="var(--secondary)" /> Manage Courses
          </button>
          <button 
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            onClick={handleExportCSV}
          >
            <Download size={18} /> Export CSV
          </button>
          <button 
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            onClick={() => navigate('/bulk-add-students')}
          >
            <Users size={18} /> Bulk Upload
          </button>
          <button 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            onClick={() => navigate('/admin/add-student')}
          >
            <UserPlus size={18} /> Add Student
          </button>
        </div>
      </div>

      <div className="glass" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--glass-inner)', padding: '12px 20px', borderRadius: '12px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', width: '100%', fontSize: '14px' }}
          />
        </div>
      </div>

      <div className="glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--glass-inner-darker)' }}>
              <th style={{ padding: '20px', width: '40px' }}>
                <input type="checkbox" onChange={handleSelectAll} checked={students.length > 0 && selectedIds.length === students.length} />
              </th>
              <th style={{ padding: '20px' }}>Student</th>
              <th style={{ padding: '20px' }}>Joined Date</th>
              <th style={{ padding: '20px' }}>Courses</th>
              <th style={{ padding: '20px' }}>Status</th>
              <th style={{ padding: '20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} style={{ borderBottom: '1px solid var(--border)', transition: 'all 0.2s', background: selectedIds.includes(student.id) ? 'var(--glass-inner)' : 'transparent' }}>
                <td style={{ padding: '20px' }}>
                  <input type="checkbox" checked={selectedIds.includes(student.id)} onChange={() => handleSelect(student.id)} />
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                      {student.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{student.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} /> {student.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <Calendar size={14} /> {student.joinedAt}
                  </div>
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={14} color="var(--primary)" /> {student.courses} Courses
                  </div>
                </td>
                <td style={{ padding: '20px' }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    background: student.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                    color: student.status === 'Active' ? '#10b981' : '#f43f5e',
                    border: student.status === 'Active' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(244, 63, 94, 0.2)'
                  }}>
                    {student.status}
                  </span>
                </td>
                <td style={{ padding: '20px' }}>
                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Students;
