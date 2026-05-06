import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Download, Share2, ArrowLeft } from 'lucide-react';

const Certificate = () => {
  const { courseId } = useParams();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}
    >
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <Link to={`/learn/${courseId}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Course
        </Link>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={16} /> Share
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      <div 
        className="glass" 
        style={{ 
          width: '100%', 
          maxWidth: '900px', 
          aspectRatio: '1.414', // A4 Landscape ratio
          padding: '48px', 
          background: 'var(--bg-main)', 
          border: '12px solid var(--glass-inner-darker)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative corner elements */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '150px', height: '150px', borderRight: '2px solid var(--primary)', borderBottom: '2px solid var(--secondary)', borderBottomRightRadius: '100%' }}></div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '150px', height: '150px', borderLeft: '2px solid var(--secondary)', borderTop: '2px solid var(--primary)', borderTopLeftRadius: '100%' }}></div>

        <Award size={64} color="var(--primary)" style={{ marginBottom: '24px' }} />
        
        <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px', letterSpacing: '4px', textTransform: 'uppercase' }}>
          Certificate of Completion
        </h1>
        
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '32px' }}>
          This is to certify that
        </p>
        
        <h2 className="gradient-text" style={{ fontSize: '42px', fontWeight: 700, marginBottom: '32px', borderBottom: '2px solid var(--border)', paddingBottom: '8px', minWidth: '400px' }}>
          Jane Doe
        </h2>
        
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          has successfully completed the masterclass
        </p>
        
        <h3 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '48px' }}>
          Modern UI/UX Design Fundamentals
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 48px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '4px', marginBottom: '8px', width: '150px' }}>
              {new Date().toLocaleDateString()}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Date Issued</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '4px', marginBottom: '8px', width: '150px', fontFamily: 'cursive', color: 'var(--primary)' }}>
              Alex Rivers
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Lead Instructor</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Certificate;
