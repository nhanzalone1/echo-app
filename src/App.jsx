import React, { useState, useEffect, useRef } from 'react';
import { Mic, Moon, Play, CheckCircle, Trash2, Image as ImageIcon, Plus } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState('night'); 
  const fileInputRef = useRef(null); // Reference to the hidden file input
  
  // Load from memory
  const [thoughts, setThoughts] = useState(() => {
    const saved = localStorage.getItem('nightShiftThoughts');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "I need to stop waiting. I want to build a finance empire.", time: "3:14 AM", ignited: false, type: 'text' }
    ];
  });

  const [currentInput, setCurrentInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // Temporary holder for the image you are about to post

  // Save to memory
  useEffect(() => {
    localStorage.setItem('nightShiftThoughts', JSON.stringify(thoughts));
  }, [thoughts]);

  // Handle Image Selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a temporary URL to view the image instantly
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleCapture = () => {
    if (!currentInput.trim() && !selectedImage) return;
    
    const newThought = {
      id: Date.now(),
      text: currentInput,
      image: selectedImage, // Attach the image
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ignited: false,
      type: selectedImage ? 'vision' : 'text'
    };
    
    setThoughts([newThought, ...thoughts]);
    setCurrentInput('');
    setSelectedImage(null); // Clear the preview
  };

  const toggleIgnite = (id) => {
    setThoughts(thoughts.map(t => 
      t.id === id ? { ...t, ignited: !t.ignited } : t
    ));
  };

  const deleteThought = (id) => {
    setThoughts(thoughts.filter(t => t.id !== id));
  };

  // --- NIGHT MODE (Vision Board Style) ---
  if (mode === 'night') {
    return (
      <div style={{ backgroundColor: '#09090b', color: 'white', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        <button onClick={() => setMode('morning')} style={{ position: 'absolute', top: '16px', right: '16px', border: '1px solid #333', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', color: '#888', background: 'transparent' }}>
          Skip to Morning ☀️
        </button>

        <div style={{ maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.8, marginBottom: '10px' }}>
                <Moon size={48} color="#a855f7" />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', background: 'linear-gradient(to right, #c084fc, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              Vision Log.
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Capture the things that drive you.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* Image Preview Area */}
            {selectedImage && (
              <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
                <img src={selectedImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => setSelectedImage(null)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>X</button>
              </div>
            )}

            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="What did you just see? Why do you want it?"
              style={{ width: '100%', height: '100px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: 'white', outline: 'none', borderRadius: '12px', padding: '16px', fontSize: '16px', resize: 'none' }}
            />
            
            {/* Hidden File Input */}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageSelect} 
              style={{ display: 'none' }} 
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Camera Button */}
              <button 
                onClick={() => fileInputRef.current.click()}
                style={{ backgroundColor: '#1a1a1a', color: '#a855f7', border: '1px solid #333', borderRadius: '12px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ImageIcon size={24} />
              </button>
              
              <button 
                onClick={handleCapture}
                style={{ flex: 1, backgroundColor: 'white', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px' }}
              >
                Capture Vision
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MORNING MODE (The Feed) ---
  return (
    <div style={{ backgroundColor: '#ffffff', color: 'black', minHeight: '100vh', padding: '24px', display: 'flex', flexDirection: 'column' }}>
       <button onClick={() => setMode('night')} style={{ position: 'absolute', top: '16px', right: '16px', border: '1px solid #ddd', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', color: '#666', background: 'transparent' }}>
          Back to Capture 🌙
        </button>

      <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ marginTop: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.1', margin: '0 0 10px 0' }}>The<br/>Fuel.</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>The things you are working for.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {thoughts.map((thought) => (
            <div key={thought.id} style={{ 
                   backgroundColor: '#f9fafb', 
                   border: '1px solid #f3f4f6',
                   borderRadius: '16px',
                   overflow: 'hidden',
                   paddingBottom: '16px'
                 }}>
              
              {/* If there is an image, show it full width */}
              {thought.image && (
                <div style={{ width: '100%', height: '250px', overflow: 'hidden' }}>
                    <img src={thought.image} alt="Vision" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ padding: '0 20px', marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace' }}>{thought.time}</span>
                    <button onClick={() => deleteThought(thought.id)} style={{ background: 'none', border: 'none', color: '#ef4444' }}><Trash2 size={16} /></button>
                </div>
                
                <p style={{ fontSize: '18px', fontWeight: '500', margin: 0, color: '#111827' }}>
                  "{thought.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
