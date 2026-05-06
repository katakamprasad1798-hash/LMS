import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading data..." }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '60px 20px',
        width: '100%',
        minHeight: '300px'
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{ marginBottom: '16px', color: 'var(--primary)' }}
      >
        <Loader2 size={48} />
      </motion.div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
        Please wait
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
        {message}
      </p>
    </motion.div>
  );
};

export default LoadingSpinner;
