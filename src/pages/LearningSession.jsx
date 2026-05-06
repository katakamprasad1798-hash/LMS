import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, FileText, MessageSquare, ChevronDown } from 'lucide-react';

const LearningSession = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(1);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then(res => res.json())
      .then(data => setCourse(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!course) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading session...</div>;

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', gap: '24px', overflow: 'hidden' }}>
      {/* Video Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        <div className="glass" style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative', background: '#000' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Play size={40} fill="white" color="white" />
            </div>
          </div>
          <img 
            src={course.image} 
            alt="Video placeholder" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Module {activeLesson}: Advanced Component Architectures</h1>
            <p style={{ color: 'var(--text-muted)' }}>{course.title} • Lesson {activeLesson} of {course.lessons}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChevronLeft size={18} /> Previous
            </button>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Next Lesson <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
            <Tab active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} label="Overview" />
            <Tab active={activeTab === 'Quiz'} onClick={() => setActiveTab('Quiz')} label="Quiz" />
            <Tab active={activeTab === 'Assignments'} onClick={() => setActiveTab('Assignments')} label="Assignments" />
            <Tab active={activeTab === 'Resources'} onClick={() => setActiveTab('Resources')} label="Resources" />
            <Tab active={activeTab === 'Discussion'} onClick={() => setActiveTab('Discussion')} label="Discussion" />
          </div>
          
          {activeTab === 'Overview' && (
            <div style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              In this lesson, we dive deep into advanced component patterns. We'll explore Higher-Order Components, Render Props, and the Compound Component pattern. By the end of this module, you'll be able to build highly flexible and reusable UI libraries.
            </div>
          )}

          {activeTab === 'Quiz' && (
            <QuizComponent questions={course.quizzes ? course.quizzes[activeLesson] : []} courseId={course.id} />
          )}

          {activeTab === 'Assignments' && (
            <AssignmentComponent />
          )}
        </div>
      </div>

      {/* Sidebar - Course Content */}
      <div className="glass" style={{ width: '350px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Course Content</h3>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div 
              key={i} 
              onClick={() => setActiveLesson(i)}
              style={{ 
                padding: '16px', 
                borderRadius: '12px', 
                marginBottom: '8px',
                cursor: 'pointer',
                background: activeLesson === i ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                border: activeLesson === i ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: activeLesson === i ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>LESSON {i}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>12:45</span>
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 500, color: activeLesson === i ? 'var(--primary)' : 'var(--text-muted)' }}>
                {i === 1 ? 'Introduction to the Course' : i === 2 ? 'Setting up the Environment' : `Module ${i}: Advanced Concepts`}
              </h4>
              {activeLesson === i && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <FileText size={12} /> Resource
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <MessageSquare size={12} /> 12 Comments
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuizComponent = ({ questions, courseId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!questions || questions.length === 0) {
    return <div style={{ color: 'var(--text-muted)' }}>No quiz available for this course yet.</div>;
  }

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    // Auto Grading Logic: Pass if score >= 50% for mock purposes
    const passed = score >= questions.length * 0.5;

    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <h3 style={{ fontSize: '28px', marginBottom: '16px', color: 'var(--text-main)' }}>Quiz Auto-Graded!</h3>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Your final score: <span style={{ color: passed ? '#10b981' : '#f43f5e', fontWeight: 700 }}>{score}</span> / {questions.length}
        </p>
        
        {passed ? (
          <div style={{ background: 'var(--glass-inner)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)' }}>
             <p style={{ color: '#10b981', marginBottom: '8px', fontWeight: 600, fontSize: '18px' }}>🎉 Congratulations, you passed!</p>
             <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>Your progress has been successfully tracked in your profile.</p>
             <Link to={`/certificate/${courseId || 'demo'}`} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
               Generate Certificate
             </Link>
          </div>
        ) : (
          <div>
            <p style={{ color: '#f43f5e', marginBottom: '20px' }}>You didn't pass this time. Review the material and try again.</p>
            <button className="btn-primary" onClick={() => { setCurrentQuestion(0); setShowResult(false); setScore(0); setSelectedOption(null); }}>
              Retry Quiz
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>QUESTION {currentQuestion + 1} OF {questions.length}</span>
        <h3 style={{ fontSize: '18px', marginTop: '8px' }}>{questions[currentQuestion].question}</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {questions[currentQuestion].options.map((option, index) => (
          <div 
            key={index}
            onClick={() => handleOptionSelect(index)}
            style={{ 
              padding: '16px 20px', 
              borderRadius: '12px', 
              cursor: 'pointer',
              background: selectedOption === index ? 'rgba(99, 102, 241, 0.15)' : 'var(--glass-inner-darker)',
              border: selectedOption === index ? '1px solid var(--primary)' : '1px solid var(--border)',
              transition: 'all 0.2s',
              color: selectedOption === index ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            {option}
          </div>
        ))}
      </div>

      <button 
        className="btn-primary" 
        onClick={handleNext}
        disabled={selectedOption === null}
        style={{ width: '100%', opacity: selectedOption === null ? 0.5 : 1 }}
      >
        {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>
  );
};

const AssignmentComponent = () => {
  const [submission, setSubmission] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submission.trim() !== '') {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', background: 'var(--glass-inner)', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '12px', color: '#f59e0b' }}>Pending Manual Grading</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Your assignment has been submitted successfully and is currently in the queue for manual grading by your instructor.</p>
        <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '20px', fontSize: '14px', fontWeight: 600 }}>
          Status: In Review
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Module 1 Assignment: Component Architecture</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
        Build a reusable `Modal` component using React Portals and the Compound Component pattern. Ensure it handles focus trapping and keyboard accessibility (ESC to close). Provide a link to your CodeSandbox or GitHub repository below.
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <textarea 
          placeholder="Paste your repository URL or assignment text here..." 
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          style={{ 
            width: '100%', 
            height: '150px', 
            background: 'var(--glass-inner-darker)', 
            border: '1px solid var(--border)', 
            borderRadius: '12px', 
            padding: '16px', 
            color: 'var(--text-main)', 
            outline: 'none', 
            resize: 'none',
            fontFamily: 'inherit'
          }}
        />
        <button type="submit" className="btn-primary" disabled={submission.trim() === ''} style={{ alignSelf: 'flex-start', opacity: submission.trim() === '' ? 0.5 : 1 }}>
          Submit Assignment
        </button>
      </form>
    </div>
  );
};

const Tab = ({ label, active, onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      paddingBottom: '16px', 
      color: active ? 'var(--primary)' : 'var(--text-muted)', 
      fontWeight: active ? 600 : 500,
      borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
      cursor: 'pointer',
      fontSize: '14px'
    }}
  >
    {label}
  </div>
);

export default LearningSession;
