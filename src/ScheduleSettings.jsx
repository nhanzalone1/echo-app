import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Clock, Sun, Moon, Save, X, AlertTriangle } from 'lucide-react';

export default function ScheduleSettings({ session, currentSchedule, onClose, onSave }) {
  const [morningTime, setMorningTime] = useState(currentSchedule?.morning_start_time || '06:00');
  const [nightTime, setNightTime] = useState(currentSchedule?.night_start_time || '21:00');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    // Validate times
    if (morningTime >= nightTime) {
      setError('Morning must start before Night.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          morning_start_time: morningTime,
          night_start_time: nightTime
        })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      onSave({ morning_start_time: morningTime, night_start_time: nightTime });
      onClose();
    } catch (err) {
      console.error('Schedule save error:', err);
      setError('Failed to save schedule.');
    } finally {
      setSaving(false);
    }
  };

  // Generate time options (every 30 minutes)
  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      timeOptions.push(`${hour}:${minute}`);
    }
  }

  const formatTimeDisplay = (time) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      zIndex: 50000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '380px',
        width: '100%',
        background: '#0a0a0f',
        borderRadius: '24px',
        border: '1px solid #1a1a1f',
        overflow: 'hidden',
        boxShadow: '0 0 80px rgba(0, 0, 0, 0.8)'
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #1a1a1f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={20} color="#64748b" />
            <span style={{
              fontSize: '14px',
              color: 'white',
              fontWeight: '700',
              letterSpacing: '2px'
            }}>
              SYSTEM SCHEDULE
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '30px 24px' }}>

          {/* Info Banner */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <AlertTriangle size={18} color="#3b82f6" style={{ marginTop: '2px', flexShrink: 0 }} />
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: '#94a3b8',
              lineHeight: '1.5'
            }}>
              The system will automatically transition between modes. Manual override is disabled to enforce discipline.
            </p>
          </div>

          {/* Morning Time */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sun size={16} color="#f59e0b" />
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'white', fontWeight: '600' }}>DAY OPS BEGIN</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Execution mode activates</div>
              </div>
            </label>
            <select
              value={morningTime}
              onChange={(e) => setMorningTime(e.target.value)}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #1e293b',
                background: '#0f172a',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                fontFamily: 'monospace',
                letterSpacing: '2px',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                textAlign: 'center'
              }}
            >
              {timeOptions.map(time => (
                <option key={`m-${time}`} value={time}>
                  {formatTimeDisplay(time)}
                </option>
              ))}
            </select>
          </div>

          {/* Night Time */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(192, 132, 252, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Moon size={16} color="#c084fc" />
              </div>
              <div>
                <div style={{ fontSize: '13px', color: 'white', fontWeight: '600' }}>NIGHT OPS BEGIN</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Planning mode activates</div>
              </div>
            </label>
            <select
              value={nightTime}
              onChange={(e) => setNightTime(e.target.value)}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #1e293b',
                background: '#0f172a',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                fontFamily: 'monospace',
                letterSpacing: '2px',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                textAlign: 'center'
              }}
            >
              {timeOptions.map(time => (
                <option key={`n-${time}`} value={time}>
                  {formatTimeDisplay(time)}
                </option>
              ))}
            </select>
          </div>

          {/* Timeline Visual */}
          <div style={{
            background: '#0f172a',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '10px', color: '#64748b', letterSpacing: '1px' }}>CYCLE PREVIEW</span>
            </div>
            <div style={{
              height: '8px',
              borderRadius: '4px',
              background: '#1e293b',
              overflow: 'hidden',
              display: 'flex'
            }}>
              {/* Calculate percentages */}
              {(() => {
                const morningMinutes = parseInt(morningTime.split(':')[0]) * 60 + parseInt(morningTime.split(':')[1]);
                const nightMinutes = parseInt(nightTime.split(':')[0]) * 60 + parseInt(nightTime.split(':')[1]);
                const morningPercent = (morningMinutes / 1440) * 100;
                const dayDuration = ((nightMinutes - morningMinutes) / 1440) * 100;

                return (
                  <>
                    <div style={{ width: `${morningPercent}%`, background: '#c084fc' }} />
                    <div style={{ width: `${dayDuration}%`, background: '#f59e0b' }} />
                    <div style={{ flex: 1, background: '#c084fc' }} />
                  </>
                );
              })()}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px',
              fontSize: '10px',
              color: '#64748b'
            }}>
              <span>12 AM</span>
              <span>12 PM</span>
              <span>12 AM</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '20px',
              color: '#ef4444',
              fontSize: '13px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid #1a1a1f',
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #1e293b',
              background: 'transparent',
              color: '#64748b',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 2,
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: saving ? '#334155' : 'white',
              color: saving ? '#64748b' : 'black',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '1px',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Save size={16} />
            {saving ? 'SAVING...' : 'LOCK SCHEDULE'}
          </button>
        </div>
      </div>
    </div>
  );
}
