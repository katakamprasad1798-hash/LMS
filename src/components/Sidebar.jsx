import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, User, Users, Settings, LogOut, Layout, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar glass" style={{ width: '260px', margin: '24px', height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Layout color="white" size={24} />
        </div>
        <h2 className="gradient-text" style={{ fontSize: '24px', fontWeight: 'bold' }}>LuxeLMS</h2>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NavItem to="/" icon={<Home size={20} />} label="Dashboard" />
        <NavItem to="/courses" icon={<BookOpen size={20} />} label="My Courses" />
        <NavItem to="/quizzes" icon={<HelpCircle size={20} />} label="My Quizzes" />
        <NavItem to="/instructor" icon={<Layout size={20} />} label="Instructor Portal" />
        <NavItem to="/instructor/enrollments" icon={<Users size={20} />} label="Manage Enrollments" />
        <NavItem to="/admin" icon={<Settings size={20} />} label="Admin Dashboard" />
        <NavItem to="/admin/students" icon={<Users size={20} />} label="Manage All Users" />
        <NavItem to="/profile" icon={<User size={20} />} label="Profile" />
        <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
      </nav>

      <div className="logout" style={{ marginTop: 'auto' }}>
        <button className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    style={({ isActive }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      textDecoration: 'none',
      color: isActive ? 'var(--primary)' : 'var(--text-muted)',
      background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
      border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
      transition: 'all 0.3s'
    })}
  >
    {icon}
    <span style={{ fontWeight: 500 }}>{label}</span>
  </NavLink>
);

export default Sidebar;
