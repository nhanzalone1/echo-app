import React, { useState } from 'react';
import { Mic, Moon, Play, CheckCircle } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState('night'); 
  const [thoughts, setThoughts] = useState([
    { id: 1, text: "I need to stop waiting. I want to build a finance empire.", time: "3:14 AM", ignited: false },
    { id: 2, text: "Read 20 pages of 'The Intelligent Investor'. No excuses.", time: "2:45 AM", ignited: true }
  ]);
  const [currentInput, setCurrentInput] = useState('');

  const handleCapture = () => {
    if (!currentInput.trim()) return;
    const newThought = {
      id: Date.now(),
      text: currentInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ignited: false
    };
    setThoughts([newThought, ...thoughts]);
    setCurrentInput('');
    alert("Vibe Captured. Sleep well.");
  };

  const toggleIgnite = (id) => {
    setThoughts(thoughts.map(t => 
      t.id === id ? { ...t, ignited: !t.ignited } : t
    ));
  };

  // --- NIGHT MODE (With Forced Spacing) ---
  if (mode === 'night') {
    return (
      <div style={{ 
        backgroundColor: '#09090b', 
        color: 'white', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        
        <button 
          onClick={() => setMode('morning')} 
          style={{ position: 'absolute', top: '16px', right: '16px', border: '1px solid #333', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', color: '#888', background: 'transparent', cursor: 'pointer' }}
        >
          Skip to Morning ☀️
        </button>

        <div style={{ maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.8 }}>
                <Moon size={48} color="#a855f7" />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', background: 'linear-gradient(to right, #c084fc, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              The Night Shift.
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Capture the person you want to be.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="What is keeping you awake?"
              style={{ 
                width: '100%', 
                height: '150px', 
                backgroundColor: '#1a1a1a', 
                border: '1px solid #333', 
                color: 'white', 
                outline: 'none', 
                borderRadius: '12px', 
                padding: '16px', 
                fontSize: '16px',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ backgroundColor: '#1a1a1a', color: '#888', border: 'none', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Mic size={24} />
              </button>
              <button 
                onClick={handleCapture}
                style={{ flex: 1, backgroundColor: 'white', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '16px' }}
              >
                Capture Vibe
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MORNING MODE (With Forced Spacing) ---
  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      color: 'black', 
      minHeight: '100vh', 
      padding: '24px', 
      display: 'flex', 
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      
       <button 
          onClick={() => setMode('night')} 
          style={{ position: 'absolute', top: '16px', right: '16px', border: '1px solid #ddd', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', color: '#666', background: 'transparent', cursor: 'pointer' }}
        >
          Back to Night 🌙
        </button>

      <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ marginTop: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.1', margin: '0 0 10px 0' }}>Cold Light<br/>of Day.</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Your past self left you these notes.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {thoughts.map((thought) => (
            <div key={thought.id} 
                 style={{ 
                   backgroundColor: thought.ignited ? '#f0fdf4' : '#f9fafb', 
                   border: `1px solid ${thought.ignited ? '#bbf7d0' : '#f3f4f6'}`,
                   padding: '20px',
                   borderRadius: '16px',
                   transition: 'all 0.2s'
                 }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#9ca3af', backgroundColor: 'white', padding: '2px 8px', borderRadius: '4px', border: '1px solid #f3f4f6' }}>
                  {thought.time}
                </span>
                {thought.ignited && <CheckCircle size={20} color="#22c55e" />}
              </div>
              
              <p style={{ 
                   fontSize: '18px', 
                   fontWeight: '500', 
                   margin: 0,
                   textDecoration: thought.ignited ? 'line-through' : 'none',
                   color: thought.ignited ? '#9ca3af' : '#111827'
                 }}>
                "{thought.text}"
              </p>

              {!thought.ignited && (
                <button 
                  onClick={() => toggleIgnite(thought.id)}
                  style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Play size={16} fill="currentColor" />
                  Replay Vibe & Ignite
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}