import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Fingerprint, ChevronRight, AlertCircle } from 'lucide-react';

const globalStyles = `
  * { box-sizing: border-box; touch-action: manipulation; }
  html, body { margin: 0; padding: 0; overflow-x: hidden; }
  input, textarea, button, select { font-size: 16px !important; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(192, 132, 252, 0.4); } 50% { box-shadow: 0 0 40px rgba(192, 132, 252, 0.8); } }
`;

export default function Onboarding({ session, onComplete }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Identification required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: name.trim(),
          is_first_timer: false
        })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      // Transition to main app
      onComplete();
    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err.message || 'Failed to establish link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      minHeight: '100dvh',
      background: 'radial-gradient(circle at center, #1f1f22 0%, #000000 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: 'white'
    }}>
      <style>{globalStyles}</style>

      <div style={{
        maxWidth: '380px',
        width: '100%',
        background: 'linear-gradient(145deg, rgba(30, 30, 35, 0.9) 0%, rgba(15, 15, 20, 0.95) 100%)',
        borderRadius: '32px',
        padding: '40px 30px',
        border: '1px solid rgba(192, 132, 252, 0.3)',
        boxShadow: '0 0 60px rgba(192, 132, 252, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
        animation: 'glow 3s ease-in-out infinite'
      }}>

        {/* ICON */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(192, 132, 252, 0.15)',
            padding: '24px',
            borderRadius: '50%',
            border: '2px solid rgba(192, 132, 252, 0.4)'
          }}>
            <Fingerprint size={48} color="#c084fc" style={{ filter: 'drop-shadow(0 0 10px rgba(192, 132, 252, 0.8))' }} />
          </div>
        </div>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h1 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: '900',
            background: 'linear-gradient(to right, #e9d5ff, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            INITIATE PROTOCOL
          </h1>
          <p style={{
            margin: '12px 0 0 0',
            color: '#a855f7',
            fontSize: '14px',
            letterSpacing: '1px',
            opacity: 0.8
          }}>
            WELCOME, AGENT.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* INPUT SECTION */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '12px',
              color: '#94a3b8',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              Identify yourself.
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
              style={{
                width: '100%',
                padding: '18px 20px',
                borderRadius: '16px',
                border: '1px solid rgba(192, 132, 252, 0.3)',
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                fontSize: '18px',
                outline: 'none',
                transition: 'all 0.3s',
                textAlign: 'center',
                letterSpacing: '1px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#c084fc';
                e.target.style.boxShadow = '0 0 20px rgba(192, 132, 252, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(192, 132, 252, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              color: '#ef4444',
              fontSize: '14px'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '20px',
              borderRadius: '16px',
              border: 'none',
              background: loading
                ? 'rgba(192, 132, 252, 0.5)'
                : 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '900',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: loading ? 'none' : '0 10px 30px -10px rgba(168, 85, 247, 0.6)',
              transition: 'all 0.3s'
            }}
          >
            {loading ? (
              <span style={{ animation: 'pulse 1s infinite' }}>ESTABLISHING...</span>
            ) : (
              <>
                ESTABLISH LINK
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* FOOTER */}
        <p style={{
          textAlign: 'center',
          color: '#475569',
          fontSize: '11px',
          marginTop: '30px',
          letterSpacing: '1px'
        }}>
          YOUR MISSION AWAITS.
        </p>
      </div>
    </div>
  );
}
