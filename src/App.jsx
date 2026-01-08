import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { Moon, Trash2, Image as ImageIcon, CheckCircle, Play, Sun, Archive, Target, Flame, LogOut, Lock, Mic, Video, Camera, X, StopCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- AUTH COMPONENT ---
function Auth({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }
    const { data, error } = result;
    if (error) {
      setMessage(error.message);
    } else {
      if (isSignUp && !data.session) {
        setMessage('Check email for confirmation (if enabled) or sign in.');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at center, #1f1f22 0%, #000000 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', color: 'white' }}>
      <div style={{ maxWidth: '350px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
           <div style={{ background: 'rgba(192, 132, 252, 0.1)', padding: '20px', borderRadius: '50%' }}>
             <Lock size={40} color="#c084fc" />
           </div>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Vision Log.</h1>
          <p style={{ color: '#888', marginTop: '8px' }}>Secure your future.</p>
        </div>
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #333', background: '#111', color: 'white', fontSize: '16px', outline: 'none' }} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #333', background: '#111', color: 'white', fontSize: '16px', outline: 'none' }} required />
          <button disabled={loading} style={{ padding: '16px', borderRadius: '12px', border: 'none', background: 'white', color: 'black', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Enter System')}</button>
        </form>
        {message && <p style={{ color: '#ef4444', fontSize: '14px' }}>{message}</p>}
        <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '14px', marginTop: '10px' }}>{isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}</button>
      </div>
    </div>
  );
}

// --- MAIN APP ---
export default function App() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);
  if (!session) return <Auth />;
  return <VisionBoard session={session} />;
}

// --- LOGIC ---
function VisionBoard({ session }) {
  const [mode, setMode] = useState(() => localStorage.getItem('visionMode') || 'night');
  const [activeTab, setActiveTab] = useState('targets'); 
  const [thoughts, setThoughts] = useState([]);
  const [streak, setStreak] = useState(0); 
  const [currentInput, setCurrentInput] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // MEDIA STATES
  const [mediaType, setMediaType] = useState('text'); // 'text', 'photo', 'video', 'audio'
  const [imageFile, setImageFile] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null);
  
  // RECORDING STATES
  const [isRecording, setIsRecording] = useState(false);
  const [mediaBlob, setMediaBlob] = useState(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);

  useEffect(() => { localStorage.setItem('visionMode', mode); }, [mode]);
  useEffect(() => { fetchThoughts(); }, [session]);

  // --- RECORDING LOGIC (Audio & Video) ---
  const startRecording = async (type) => {
    try {
      chunksRef.current = [];
      const constraints = type === 'video' ? { video: true, audio: true } : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // If video, show live preview
      if (type === 'video' && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.muted = true; // Mute preview to avoid feedback
        videoPreviewRef.current.play();
      }

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: type === 'video' ? 'video/webm' : 'audio/webm' });
        setMediaBlob(blob);
        setMediaPreviewUrl(URL.createObjectURL(blob));
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Microphone/Camera permission denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetMedia = () => {
    setImageFile(null); setImagePreview(null);
    setMediaBlob(null); setMediaPreviewUrl(null);
    setMediaType('text');
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) { 
      setImageFile(file); 
      setImagePreview(URL.createObjectURL(file)); 
      setMediaType('photo');
    }
  };

  // --- UPLOAD & SAVE ---
  const handleCapture = async () => {
    if (!currentInput.trim() && !imageFile && !mediaBlob) return;
    setUploading(true);

    let imageUrl = null;
    let audioUrl = null;
    let videoUrl = null;
    const timestamp = Date.now();

    // 1. Upload Photo
    if (imageFile) {
      const fileName = `img-${timestamp}-${imageFile.name}`;
      const { data } = await supabase.storage.from('images').upload(fileName, imageFile);
      if (data) imageUrl = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;
    }

    // 2. Upload Audio/Video Blob
    if (mediaBlob) {
        const ext = mediaType === 'video' ? 'webm' : 'webm'; // Browser recording usually defaults to webm
        const fileName = `${mediaType}-${timestamp}.${ext}`;
        const { data } = await supabase.storage.from('images').upload(fileName, mediaBlob); // Using 'images' bucket for simplicity
        if (data) {
            const publicUrl = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;
            if (mediaType === 'video') videoUrl = publicUrl;
            else audioUrl = publicUrl;
        }
    }

    // 3. Save to DB
    const { data } = await supabase.from('thoughts').insert([{ 
        text: currentInput, 
        image_url: imageUrl, 
        audio_url: audioUrl,
        video_url: videoUrl,
        ignited: false, 
        user_id: session.user.id 
    }]).select();

    if (data) {
      const newThoughts = [data[0], ...thoughts];
      setThoughts(newThoughts);
      calculateStreak(newThoughts);
      setCurrentInput('');
      resetMedia();
    }
    setUploading(false);
  };

  // --- DATA FETCHING & HELPERS ---
  async function fetchThoughts() {
    const { data, error } = await supabase.from('thoughts').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    if (!error) { setThoughts(data || []); calculateStreak(data || []); }
  }

  function calculateStreak(data) {
    if (!data || data.length === 0) { setStreak(0); return; }
    const uniqueDates = [...new Set(data.map(item => new Date(item.created_at).toDateString()))];
    const sortedDates = uniqueDates.map(d => new Date(d)).sort((a, b) => b - a);
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (sortedDates[0].toDateString() !== today && sortedDates[0].toDateString() !== yesterday.toDateString()) { setStreak(0); return; }
    let currentStreak = 0;
    let checkDate = new Date();
    if (sortedDates[0].toDateString() !== today) checkDate.setDate(checkDate.getDate() - 1);
    for (let i = 0; i < sortedDates.length; i++) {
        if (sortedDates[i].toDateString() === checkDate.toDateString()) { currentStreak++; checkDate.setDate(checkDate.getDate() - 1); } else break;
    }
    setStreak(currentStreak);
  }

  const deleteThought = async (id) => {
    const { error } = await supabase.from('thoughts').delete().eq('id', id);
    if (!error) { const newThoughts = thoughts.filter(t => t.id !== id); setThoughts(newThoughts); calculateStreak(newThoughts); }
  };

  const toggleIgnite = async (id, currentStatus) => {
    if (!currentStatus) confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: mode === 'night' ? ['#c084fc', '#a855f7', '#ffffff'] : ['#fbbf24', '#f59e0b', '#ef4444'] });
    const { error } = await supabase.from('thoughts').update({ ignited: !currentStatus }).eq('id', id);
    if (!error) setThoughts(thoughts.map(t => t.id === id ? { ...t, ignited: !t.ignited } : t));
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };
  const visibleThoughts = thoughts.filter(t => activeTab === 'targets' ? !t.ignited : t.ignited);

  const nightStyle = { background: 'radial-gradient(circle at center, #1f1f22 0%, #000000 100%)', color: 'white', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
  const morningStyle = { background: 'linear-gradient(135deg, #fdfbf7 0%, #e2e8f0 100%)', color: 'black', minHeight: '100vh', padding: '24px', display: 'flex', flexDirection: 'column' };

  return (
    <div style={mode === 'night' ? nightStyle : morningStyle}>
       <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
          <button onClick={() => setMode(mode === 'night' ? 'morning' : 'night')} style={{ border: '1px solid #777', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', color: '#888', background: 'rgba(0,0,0,0.5)', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>{mode === 'night' ? 'Morning ☀️' : 'Capture 🌙'}</button>
          <button onClick={handleLogout} style={{ border: '1px solid #ef4444', padding: '8px', borderRadius: '50%', color: '#ef4444', background: 'rgba(0,0,0,0.1)', cursor: 'pointer' }}><LogOut size={14} /></button>
       </div>

      <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* HEADER */}
        <div style={{ marginTop: '40px', textAlign: mode === 'night' ? 'center' : 'left' }}>
          {mode === 'night' ? (
             <>
               <div style={{ display: 'flex', justifyContent: 'center', opacity: 0.9, marginBottom: '15px' }}><Moon size={56} color="#c084fc" style={{ filter: 'drop-shadow(0 0 10px rgba(192, 132, 252, 0.5))' }} /></div>
               <h1 style={{ fontSize: '36px', fontWeight: 'bold', background: 'linear-gradient(to right, #e9d5ff, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Vision Log.</h1>
             </>
          ) : (
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Sun size={32} color="#f59e0b" /><h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '1', margin: 0, color: '#1e293b' }}>The Fuel.</h1></div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff7ed', padding: '6px 12px', borderRadius: '20px', border: '1px solid #ffedd5' }}><Flame size={20} fill={streak > 0 ? "#f97316" : "none"} color="#f97316" /><span style={{ fontSize: '16px', fontWeight: 'bold', color: '#9a3412' }}>{streak} Day{streak !== 1 && 's'}</span></div>
             </div>
          )}
          
          {mode === 'morning' && (
             <div style={{ display: 'flex', gap: '5px', background: '#f1f5f9', padding: '4px', borderRadius: '12px', width: 'fit-content', marginTop: '10px' }}>
               <button onClick={() => setActiveTab('targets')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'targets' ? 'white' : 'transparent', boxShadow: activeTab === 'targets' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', color: activeTab === 'targets' ? '#0f172a' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Target size={16} /> Targets</button>
               <button onClick={() => setActiveTab('vault')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'vault' ? 'white' : 'transparent', boxShadow: activeTab === 'vault' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', color: activeTab === 'vault' ? '#0f172a' : '#64748b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Archive size={16} /> The Vault</button>
             </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
           
           {/* PREVIEWS */}
           {imagePreview && (
              <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #333' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={resetMedia} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}><X size={18} /></button>
              </div>
           )}
           
           {/* MEDIA RECORDING UI */}
           {mediaType === 'video' && (
             <div style={{ position: 'relative', width: '100%', height: '260px', background: 'black', borderRadius: '16px', overflow: 'hidden', border: '1px solid #333' }}>
                {!mediaPreviewUrl ? (
                   <video ref={videoPreviewRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                   <video src={mediaPreviewUrl} controls style={{ width: '100%', height: '100%' }} />
                )}
                
                {isRecording && <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'red', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', animation: 'pulse 1s infinite' }}>REC</div>}
                {mediaPreviewUrl && <button onClick={resetMedia} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}><X size={18} /></button>}
             </div>
           )}

           {mediaType === 'audio' && (
             <div style={{ width: '100%', padding: '20px', background: '#111', borderRadius: '16px', border: '1px solid #333', textAlign: 'center', color: 'white' }}>
                {isRecording ? <p style={{ color: '#ef4444', fontWeight: 'bold', animation: 'pulse 1s infinite' }}>Recording Audio...</p> : mediaPreviewUrl ? <audio src={mediaPreviewUrl} controls style={{ width: '100%' }} /> : <p>Ready to Record</p>}
                {mediaPreviewUrl && <button onClick={resetMedia} style={{ marginTop: '10px', background: 'none', border: '1px solid #333', color: '#888', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer' }}>Discard Audio</button>}
             </div>
           )}

           {/* TEXT INPUT (Only show if not in video mode to save space) */}
           {mediaType !== 'video' && (
            <textarea value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} placeholder={mediaType === 'audio' ? "Add a title to this voice note..." : "What are you building?"} style={{ width: '100%', height: '80px', backgroundColor: 'rgba(26, 26, 26, 0.8)', border: '1px solid #333', color: mode === 'morning' ? 'black' : 'white', outline: 'none', borderRadius: '16px', padding: '16px', fontSize: '18px', resize: 'none', backdropFilter: 'blur(10px)' }} disabled={uploading} />
           )}

           <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} style={{ display: 'none' }} />

           {/* CONTROLS BAR */}
           <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
             
             {/* MODE SWITCHERS */}
             <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setMediaType('photo'); fileInputRef.current.click(); }} disabled={uploading} style={{ background: mediaType === 'photo' ? '#222' : 'transparent', border: '1px solid #333', borderRadius: '12px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#c084fc' }}><Camera size={20} /></button>
                <button onClick={() => { setMediaType('video'); setMediaBlob(null); setMediaPreviewUrl(null); }} disabled={uploading} style={{ background: mediaType === 'video' ? '#222' : 'transparent', border: '1px solid #333', borderRadius: '12px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3b82f6' }}><Video size={20} /></button>
                <button onClick={() => { setMediaType('audio'); setMediaBlob(null); setMediaPreviewUrl(null); }} disabled={uploading} style={{ background: mediaType === 'audio' ? '#222' : 'transparent', border: '1px solid #333', borderRadius: '12px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}><Mic size={20} /></button>
             </div>

             {/* DYNAMIC ACTION BUTTON */}
             {(mediaType === 'video' || mediaType === 'audio') && !mediaBlob ? (
                // RECORD BUTTON
                <button 
                  onClick={() => isRecording ? stopRecording() : startRecording(mediaType)}
                  style={{ flex: 1, backgroundColor: isRecording ? '#ef4444' : 'white', color: isRecording ? 'white' : 'black', fontWeight: 'bold', border: 'none', borderRadius: '16px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {isRecording ? <><StopCircle /> Stop Recording</> : (mediaType === 'video' ? 'Start Video' : 'Start Audio')}
                </button>
             ) : (
                // UPLOAD BUTTON
                <button 
                  onClick={handleCapture}
                  disabled={uploading}
                  style={{ flex: 1, backgroundColor: uploading ? '#333' : '#c084fc', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '16px', cursor: 'pointer', fontSize: '16px', boxShadow: '0 0 15px rgba(192, 132, 252, 0.3)' }}
                >
                  {uploading ? 'Syncing...' : 'Capture'}
                </button>
             )}
           </div>
        </div>

        {/* FEED */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
          {visibleThoughts.length === 0 && (<div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}><p style={{ margin: 0, fontSize: '16px' }}>{activeTab === 'targets' ? "Ready to capture." : "The Vault is empty."}</p></div>)}
          {visibleThoughts.map((thought) => (
            <div key={thought.id} style={{ backgroundColor: thought.ignited ? 'rgba(240, 253, 244, 0.9)' : 'rgba(255, 255, 255, 0.8)', border: `1px solid ${thought.ignited ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: '20px', overflow: 'hidden', paddingBottom: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', backdropFilter: 'blur(8px)' }}>
              
              {/* DISPLAY CONTENT */}
              {thought.image_url && (<div style={{ width: '100%', height: '260px' }}><img src={thought.image_url} alt="Vision" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>)}
              {thought.video_url && (<div style={{ width: '100%', background: 'black' }}><video src={thought.video_url} controls style={{ width: '100%', maxHeight: '400px' }} /></div>)}
              {thought.audio_url && (<div style={{ padding: '15px 20px 0 20px' }}><audio src={thought.audio_url} controls style={{ width: '100%' }} /></div>)}

              <div style={{ padding: '0 24px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.5px' }}>{new Date(thought.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).toUpperCase()}</span>
                    <button onClick={() => deleteThought(thought.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', opacity: 0.6, padding: 0 }}><Trash2 size={18} /></button>
                </div>
                {thought.text && <p style={{ fontSize: '19px', fontWeight: '600', lineHeight: '1.5', margin: 0, color: thought.ignited ? '#94a3b8' : '#1e293b', textDecoration: thought.ignited ? 'line-through' : 'none' }}>"{thought.text}"</p>}
                {!thought.ignited ? (<button onClick={() => toggleIgnite(thought.id, thought.ignited)} style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#2563eb', background: 'rgba(59, 130, 246, 0.1)', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', width: '100%', justifyContent: 'center', transition: 'all 0.2s' }}><Play size={16} fill="currentColor" /> IGNITE VISION</button>) : (<div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 'bold', fontSize: '14px', justifyContent: 'center' }}><CheckCircle size={18} /> Vision Secured <button onClick={() => toggleIgnite(thought.id, thought.ignited)} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>(Restore)</button></div>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
