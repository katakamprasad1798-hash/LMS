import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User as UserIcon, Moon, Sun, ChevronDown, BookOpen, Layers, Laptop, PenTool, Database, Star, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const megaMenuRef = useRef(null);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [isMegaOpen, setIsMegaOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setIsMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="navbar" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 99, background: 'var(--glass-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
      
      {/* Left Search and Mega Menu Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }} ref={megaMenuRef}>
        {/* Search Bar */}
        <div className="search-bar glass" style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', width: '300px', gap: '10px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search courses, modules..." 
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', width: '100%', fontSize: '13.5px' }}
          />
        </div>

        {/* Mega Menu Toggle Button */}
        <button 
          onClick={() => setIsMegaOpen(!isMegaOpen)}
          className="btn-secondary"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '10px 16px', 
            fontSize: '13.5px', 
            fontWeight: 600,
            cursor: 'pointer',
            borderRadius: '10px',
            border: isMegaOpen ? '1px solid var(--primary)' : '1px solid var(--border)',
            color: isMegaOpen ? 'var(--primary)' : 'var(--text-main)',
            background: isMegaOpen ? 'rgba(99, 102, 241, 0.04)' : 'var(--glass-inner)'
          }}
        >
          <Layers size={16} />
          <span>Explore</span>
          <motion.div animate={{ rotate: isMegaOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} />
          </motion.div>
        </button>

        {/* MEGA MENU CONTAINER */}
        <AnimatePresence>
          {isMegaOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '52px',
                left: 0,
                width: '740px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr) 1.2fr',
                gap: '24px',
                zIndex: 1000
              }}
            >
              {/* Column 1: Web Development */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--primary)' }}>
                  <Laptop size={16} />
                  <span style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Development</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <MegaItem to="/courses" title="React & Next.js Masterclass" subtitle="Frontend development" />
                  <MegaItem to="/courses" title="Node.js & Express" subtitle="Backend infrastructure" />
                  <MegaItem to="/courses" title="Python Bootcamp" subtitle="Data & scripting" />
                </div>
              </div>

              {/* Column 2: Design & UX */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#ec4899' }}>
                  <PenTool size={16} />
                  <span style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Design</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <MegaItem to="/courses" title="UI/UX Core Principles" subtitle="User-centered design" />
                  <MegaItem to="/courses" title="Figma Advanced Prototyping" subtitle="High-fidelity flows" />
                  <MegaItem to="/courses" title="Graphic Design Foundations" subtitle="Visual identities" />
                </div>
              </div>

              {/* Column 3: Data & Cloud */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#10b981' }}>
                  <Database size={16} />
                  <span style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Data Science</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <MegaItem to="/courses" title="SQL & Databases" subtitle="Relational analytics" />
                  <MegaItem to="/courses" title="Data Visualization" subtitle="Insights & charting" />
                  <MegaItem to="/courses" title="AWS Cloud Architecture" subtitle="Scalable deployments" />
                </div>
              </div>

              {/* Column 4: Promo Card / Featured */}
              <div style={{
                background: 'rgba(99, 102, 241, 0.03)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    background: 'rgba(99, 102, 241, 0.08)',
                    color: 'var(--primary)',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}>Featured Track</span>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>AI & Machine Learning</h4>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>Master Neural Networks and Deep Learning from first principles.</p>
                </div>

                <button 
                  onClick={() => { setIsMegaOpen(false); navigate('/courses'); }}
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = 0.9}
                  onMouseOut={(e) => e.currentTarget.style.opacity = 1}
                >
                  <span>Explore Track</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right User actions */}
      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="glass" onClick={toggleTheme} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '8px' }}>
          {isDark ? <Sun size={18} color="var(--text-muted)" /> : <Moon size={18} color="var(--text-muted)" />}
        </button>
        <button className="glass" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '8px' }}>
          <Bell size={18} color="var(--text-muted)" />
        </button>
        
        <div 
          className="user-profile glass" 
          onClick={() => navigate('/profile')}
          style={{ display: 'flex', alignItems: 'center', padding: '5px 12px 5px 5px', gap: '10px', cursor: 'pointer', borderRadius: '10px' }}
        >
          <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserIcon size={16} color="white" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>Prasad R.</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Pro Learner</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for Mega Menu items with elegant hover state
const MegaItem = ({ to, title, subtitle }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link 
      to={to} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 12px',
        borderRadius: '8px',
        textDecoration: 'none',
        background: isHovered ? 'var(--glass-inner)' : 'transparent',
        transition: 'background 0.2s ease'
      }}
    >
      <span style={{ fontWeight: 600, fontSize: '12.5px', color: isHovered ? 'var(--primary)' : 'var(--text-main)' }}>{title}</span>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{subtitle}</span>
    </Link>
  );
};

export default Navbar;
