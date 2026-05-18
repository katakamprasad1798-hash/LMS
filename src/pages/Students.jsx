import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Search, Mail, Calendar, BookOpen, Download, Trash2, Filter, MoreVertical, Phone, CheckCircle, RefreshCw, LayoutGrid, List, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const studentPhotos = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
];

const studentTracks = [
  { role: "UI/UX Designer", dept: "Designing Team", color: "#6366f1" },
  { role: "Front-End Developer", dept: "Development Team", color: "#3b82f6" },
  { role: "Web Designer", dept: "Designing Team", color: "#06b6d4" },
  { role: "Data Analyst", dept: "Development Team", color: "#10b981" },
  { role: "Full-Stack Architect", dept: "Development Team", color: "#8b5cf6" },
  { role: "Cloud Engineer", dept: "Infrastructure Team", color: "#f59e0b" }
];

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // Default to table for the new modern look
  const itemsPerPage = 20;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => {
        const validData = Array.isArray(data) ? data.filter(s => s && s.name) : [];
        const uniqueData = validData.reduce((acc, current) => {
          if (!acc.find(item => item.name === current.name)) {
            acc.push(current);
          }
          return acc;
        }, []);
        setStudents(uniqueData);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

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
      setSelectedIds(filteredStudents.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleToggleStatus = async (student) => {
    const newStatus = student.status === 'Active' ? 'Suspended' : 'Active';
    try {
      const response = await fetch(`http://localhost:5000/api/students/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setStudents(prev => prev.map(s => s.id === student.id ? { ...s, status: newStatus } : s));
      }
    } catch (err) {
      console.error(err);
    }
    setActiveMenuId(null);
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const response = await fetch('http://localhost:5000/api/students/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] })
      });
      if (response.ok) {
        setStudents(prev => prev.filter(s => s.id !== id));
        setSelectedIds(prev => prev.filter(i => i !== id));
      }
    } catch (err) {
      console.error(err);
    }
    setActiveMenuId(null);
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '12 Aug 2025';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getStudentDisplay = (student, index) => {
    const hash = (student.name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const photo = studentPhotos[hash % studentPhotos.length];
    const track = studentTracks[hash % studentTracks.length];
    const phone = `+1 (555) ${100 + (hash % 900)}-${4000 + (hash % 1000)}`;
    return { photo, ...track, phone };
  };

  const filteredStudents = students.filter(s => {
    const name = s.name || '';
    const email = s.email || '';
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const getStatusBadge = (status) => {
    const isActive = status === 'Active';
    const dotColor = isActive ? '#10b981' : '#f43f5e';
    const bgColor = isActive ? 'rgba(16, 185, 129, 0.04)' : 'rgba(244, 63, 94, 0.04)';
    const borderColor = isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)';
    const textColor = isActive ? '#10b981' : '#f43f5e';

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 12px',
        borderRadius: '20px',
        background: bgColor,
        border: `1px solid ${borderColor}`,
        color: textColor,
        fontSize: '11.5px',
        fontWeight: 600
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: dotColor
        }} />
        {status || 'Active'}
      </span>
    );
  };

  if (isLoading) return <LoadingSpinner message="Fetching student records..." />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: '"Inter", sans-serif' }}
    >
      {/* Top Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>Student Directory</h1>
          <p style={{ color: 'var(--text-muted)' }}>Overview of all registered users, their roles, departments, and statuses.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {selectedIds.length > 0 && (
            <button 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f43f5e' }}
              onClick={handleBulkDelete}
            >
              <Trash2 size={18} /> Bulk Delete ({selectedIds.length})
            </button>
          )}
          <button 
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={handleExportCSV}
          >
            <Download size={18} /> Export CSV
          </button>
          <button 
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => navigate('/bulk-add-students')}
          >
            <Users size={18} /> Bulk Upload
          </button>
          <button 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => navigate('/admin/add-student')}
          >
            <UserPlus size={18} /> Add Student
          </button>
        </div>
      </div>

      {/* Filter, Search Bar & View Toggle */}
      <div className="glass" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '12px', background: 'var(--glass-inner)', padding: '10px 16px', borderRadius: '10px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', width: '100%', fontSize: '14px' }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Toggle View Mode */}
          <div className="glass" style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '8px' }}>
            <button 
              onClick={() => setViewMode('table')}
              style={{
                background: viewMode === 'table' ? 'var(--primary)' : 'none',
                border: 'none',
                color: viewMode === 'table' ? 'white' : 'var(--text-muted)',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? 'var(--primary)' : 'none',
                border: 'none',
                color: viewMode === 'grid' ? 'white' : 'var(--text-muted)',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px' }}>
            <Filter size={18} color="var(--text-muted)" />
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 500 }}
            >
              <option value="All" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>All Statuses</option>
              <option value="Active" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>Active</option>
              <option value="Suspended" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>Suspended</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
            <input 
              type="checkbox" 
              id="select-all-cb"
              onChange={handleSelectAll} 
              checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length} 
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="select-all-cb" style={{ cursor: 'pointer', fontWeight: 500 }}>Select Page</label>
          </div>
        </div>
      </div>

      {/* Grid or Table Layout */}
      {currentStudents.length === 0 ? (
        <div className="glass" style={{ padding: '64px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Users size={48} color="var(--text-muted)" style={{ opacity: 0.6 }} />
          <h3 style={{ fontSize: '20px', fontWeight: 600 }}>No Students Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>No student records match your query. Try adjusting your search query or filters.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW MODE (New Premium Corporate Table Design) */
        <div className="table-container" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--glass-inner-darker)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ width: '50px', padding: '18px 24px' }}>
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll} 
                      checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length} 
                      style={{ cursor: 'pointer' }} 
                    />
                  </th>
                  <th style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '18px 24px', letterSpacing: '0.5px' }}>Student Profile</th>
                  <th style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '18px 24px', letterSpacing: '0.5px' }}>Job Track & Department</th>
                  <th style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '18px 24px', letterSpacing: '0.5px' }}>Contact Info</th>
                  <th style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '18px 24px', letterSpacing: '0.5px' }}>Joined Date</th>
                  <th style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '18px 24px', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '18px 24px', letterSpacing: '0.5px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student, index) => {
                  const display = getStudentDisplay(student, index);
                  const isSelected = selectedIds.includes(student.id);
                  const isSuspended = student.status !== 'Active';

                  return (
                    <tr key={student.id} style={{ background: isSelected ? 'rgba(99, 102, 241, 0.02)' : 'transparent', borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '18px 24px' }}>
                        <input 
                          type="checkbox" 
                          checked={isSelected} 
                          onChange={() => handleSelect(student.id)} 
                          style={{ cursor: 'pointer' }} 
                        />
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={display.photo} 
                            alt={student.name}
                            style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border)' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14.5px' }}>{student.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>{display.role}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{display.dept}</div>
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>{display.phone}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Mobile Contact</div>
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>{formatDate(student.joinedAt)}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Registration Date</div>
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        {getStatusBadge(student.status)}
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px' }}>
                          <button 
                            onClick={() => handleToggleStatus(student)}
                            title={isSuspended ? "Activate Student" : "Suspend Student"}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s', padding: 0 }}
                            onMouseOver={(e) => e.currentTarget.style.color = isSuspended ? '#10b981' : '#f43f5e'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <CheckCircle size={18} style={{ color: isSuspended ? 'var(--text-muted)' : '#10b981' }} />
                          </button>
                          <button 
                            onClick={() => handleDeleteStudent(student.id)}
                            title="Delete Student"
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s', padding: 0 }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#f43f5e'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD GRID LAYOUT MODE */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {currentStudents.map((student, index) => {
            const display = getStudentDisplay(student, index);
            const isSelected = selectedIds.includes(student.id);
            const isSuspended = student.status !== 'Active';

            return (
              <motion.div
                key={student.id}
                layout
                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}
                className="glass"
                style={{ 
                  padding: '24px', 
                  position: 'relative', 
                  overflow: 'visible',
                  border: isSelected 
                    ? '1.5px solid #6366f1' 
                    : isSuspended 
                      ? '1px solid rgba(244, 63, 94, 0.2)' 
                      : '1px solid var(--border)',
                  background: isSuspended && isSelected 
                    ? 'rgba(244, 63, 94, 0.02)' 
                    : isSelected 
                      ? 'rgba(99, 102, 241, 0.02)' 
                      : 'var(--glass-bg)',
                  transition: 'border 0.2s, background 0.2s',
                  borderRadius: '20px'
                }}
              >
                {/* Top Action Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="checkbox" 
                      checked={isSelected} 
                      onChange={() => handleSelect(student.id)} 
                      style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#6366f1' }}
                    />
                    {getStatusBadge(student.status)}
                  </div>

                  <div style={{ position: 'relative' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === student.id ? null : student.id); }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      className="btn-secondary-hover"
                    >
                      <MoreVertical size={16} />
                    </button>

                    <AnimatePresence>
                      {activeMenuId === student.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.15 }}
                          style={{
                            position: 'absolute',
                            top: '32px',
                            right: 0,
                            width: '160px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow)',
                            zIndex: 10,
                            overflow: 'hidden'
                          }}
                        >
                          <button
                            onClick={() => handleToggleStatus(student)}
                            style={{ width: '100%', padding: '10px 16px', border: 'none', background: 'none', textAlign: 'left', color: 'var(--text-main)', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
                            className="menu-item-hover"
                          >
                            {isSuspended ? 'Activate User' : 'Suspend User'}
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            style={{ width: '100%', padding: '10px 16px', border: 'none', background: 'none', textAlign: 'left', color: '#f43f5e', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
                            className="menu-item-hover"
                          >
                            Delete User
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Profile Photo */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <img 
                    src={display.photo} 
                    alt={student.name}
                    style={{ 
                      width: '96px', 
                      height: '96px', 
                      borderRadius: '20px', 
                      objectFit: 'cover',
                      border: '3px solid var(--border)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                    }} 
                  />

                  {/* Name and Track */}
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '16px', color: 'var(--text-main)' }}>{student.name}</h3>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: display.color, marginTop: '4px' }}>{display.role}</span>
                </div>

                {/* Metadata Panel */}
                <div style={{ 
                  background: 'var(--glass-inner)', 
                  borderRadius: '14px', 
                  padding: '12px 16px', 
                  margin: '20px 0', 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '12px',
                  border: '1px solid var(--border)'
                }}>
                  <div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.5px' }}>Department</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px', color: 'var(--text-main)' }}>{display.dept}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.5px' }}>Joined Date</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px', color: 'var(--text-main)' }}>{formatDate(student.joinedAt)}</div>
                  </div>
                </div>

                {/* Contact Information */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.06)', color: '#6366f1' }}>
                      <Mail size={14} />
                    </div>
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>{student.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.06)', color: '#6366f1' }}>
                      <Phone size={14} />
                    </div>
                    <span>{display.phone}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination Panel */}
      {totalPages > 1 && (
        <div className="glass" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} entries
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '14px', opacity: currentPage === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Previous
            </button>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: currentPage === page ? 'var(--primary)' : 'transparent',
                    color: currentPage === page ? 'white' : 'var(--text-main)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '14px', opacity: currentPage === totalPages ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Students;
