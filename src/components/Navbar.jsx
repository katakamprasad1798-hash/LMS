import React from 'react';
import { Search, Bell, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="navbar" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="search-bar glass" style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', width: '400px', gap: '12px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search courses, instructors..." 
          style={{ background: 'none', border: 'none', color: 'var(--text-main)', outline: 'none', width: '100%', fontSize: '14px' }}
        />
      </div>

      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button className="glass" style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Bell size={20} color="var(--text-muted)" />
        </button>
        
        <div className="user-profile glass" style={{ display: 'flex', alignItems: 'center', padding: '6px 16px 6px 6px', gap: '12px', cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #f43f5e, #fb923c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserIcon size={18} color="white" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Prasad R.</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pro Learner</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
