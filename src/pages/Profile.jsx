import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Award, BookOpen, Clock, Settings, Camera, Save } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    bio: 'Lifelong learner and frontend developer. Passionate about creating beautiful user interfaces and accessible web applications.',
    role: 'Student'
  });

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, save to backend here
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '1000px', margin: '0 auto' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Profile Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your personal information and track your learning progress.</p>
        </div>
        {!isEditing ? (
          <button className="btn-secondary" onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} /> Edit Profile
          </button>
        ) : (
          <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} /> Save Changes
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
        {/* Main Profile Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass" style={{ padding: '32px', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: 'white', fontWeight: 'bold' }}>
                {profileData.name.charAt(0)}
              </div>
              {isEditing && (
                <button style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>
                  <Camera size={16} />
                </button>
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  style={{ fontSize: '24px', fontWeight: 700, background: 'var(--glass-inner-darker)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 16px', color: 'var(--text-main)', outline: 'none', marginBottom: '8px', width: '100%' }}
                />
              ) : (
                <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{profileData.name}</h2>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <Mail size={16} /> 
                {isEditing ? (
                  <input 
                    type="email" 
                    value={profileData.email} 
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    style={{ background: 'var(--glass-inner-darker)', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 8px', color: 'var(--text-main)', outline: 'none', width: '250px' }}
                  />
                ) : (
                  <span>{profileData.email}</span>
                )}
              </div>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                {profileData.role}
              </span>
            </div>
          </div>

          <div className="glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="var(--primary)" /> About Me
            </h3>
            {isEditing ? (
              <textarea 
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                style={{ width: '100%', height: '100px', background: 'var(--glass-inner-darker)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', color: 'var(--text-main)', outline: 'none', resize: 'none', lineHeight: 1.6 }}
              />
            ) : (
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{profileData.bio}</p>
            )}
          </div>

          <div className="glass" style={{ padding: '32px' }}>
             <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="var(--secondary)" /> Earned Certificates
            </h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ background: 'var(--glass-inner)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Award size={32} color="#10b981" style={{ marginBottom: '12px' }} />
                <span style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>React Foundations</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Issued: May 2024</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Sidebar Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Learning Stats</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={20} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>4</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Enrolled Courses</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={20} color="var(--secondary)" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>1</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Completed Courses</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={20} color="#10b981" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>24h</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Time Spent Learning</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
