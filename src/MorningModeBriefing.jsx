import React, { useState } from 'react';
import { CheckSquare, Flame, Archive, Users, ChevronRight, ChevronLeft, Sun } from 'lucide-react';

const slides = [
  {
    icon: CheckSquare,
    iconColor: '#10b981',
    title: 'EXECUTION',
    content: 'Check off a mission if you simply completed the task as planned.',
    visual: 'check'
  },
  {
    icon: Flame,
    iconColor: '#f59e0b',
    title: 'CRUSH THE GOAL',
    content: 'If you exceeded expectations, hit \'CRUSH\' and document exactly how you went above and beyond.',
    visual: 'crush'
  },
  {
    icon: Archive,
    iconColor: '#3b82f6',
    title: 'THE VAULT',
    content: 'Your \'Vision\' tab stores your topics, active visions, and the history of missions you have \'Crushed.\'',
    visual: null
  },
  {
    icon: Users,
    iconColor: '#8b5cf6',
    title: 'THE ALLY',
    content: 'Connect with one person. You will see each other\'s progress and can send motivational messages to maintain accountability.',
    visual: 'dossier'
  }
];

export default function MorningModeBriefing({ onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const isLastSlide = currentSlide === slides.length - 1;
  const CurrentIcon = slides[currentSlide].icon;
  const currentVisual = slides[currentSlide].visual;

  // Visual component for Check vs Crush
  const renderVisual = () => {
    if (currentVisual === 'check') {
      return (
        <div style={{
          display: 'flex',
          gap: '15px',
          marginTop: '25px',
          justifyContent: 'center'
        }}>
          <div style={{
            padding: '12px 20px',
            background: '#f0fdf4',
            border: '2px solid #10b981',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckSquare size={18} color="#10b981" />
            <span style={{ color: '#166534', fontWeight: '700', fontSize: '12px' }}>COMPLETE</span>
          </div>
        </div>
      );
    }

    if (currentVisual === 'crush') {
      return (
        <div style={{
          display: 'flex',
          gap: '15px',
          marginTop: '25px',
          justifyContent: 'center'
        }}>
          <div style={{
            padding: '12px 20px',
            background: '#fffbeb',
            border: '2px solid #f59e0b',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Flame size={18} color="#f59e0b" fill="#f59e0b" />
            <span style={{ color: '#b45309', fontWeight: '700', fontSize: '12px' }}>CRUSHED</span>
          </div>
        </div>
      );
    }

    if (currentVisual === 'dossier') {
      return (
        <div style={{
          marginTop: '25px',
          background: '#0a0a0f',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '15px',
          textAlign: 'left',
          maxWidth: '260px'
        }}>
          <div style={{
            fontSize: '9px',
            color: '#475569',
            letterSpacing: '2px',
            marginBottom: '10px',
            borderBottom: '1px solid #1e293b',
            paddingBottom: '8px'
          }}>
            ALLY DOSSIER
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={14} color="#94a3b8" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: '600' }}>Partner Name</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>3 missions active</div>
            </div>
          </div>
          <div style={{
            fontSize: '10px',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginTop: '10px'
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            STATUS: LINKED
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(255, 255, 255, 0.97)',
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
        background: 'white',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
      }}>

        {/* Header Badge */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          background: '#fafafa'
        }}>
          <Sun size={16} color="#f59e0b" />
          <span style={{
            fontSize: '11px',
            color: '#b45309',
            letterSpacing: '3px',
            fontWeight: '600'
          }}>
            DAY OPS BRIEFING
          </span>
        </div>

        {/* Content Area */}
        <div style={{
          padding: '40px 35px',
          textAlign: 'center',
          minHeight: '320px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}>
          {/* Icon */}
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '20px',
            background: `${slides[currentSlide].iconColor}15`,
            border: `1px solid ${slides[currentSlide].iconColor}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '25px'
          }}>
            <CurrentIcon size={32} color={slides[currentSlide].iconColor} />
          </div>

          {/* Slide Counter */}
          <div style={{
            fontSize: '10px',
            color: '#94a3b8',
            letterSpacing: '2px',
            marginBottom: '12px'
          }}>
            {String(currentSlide + 1).padStart(2, '0')} — {String(slides.length).padStart(2, '0')}
          </div>

          {/* Title */}
          <h2 style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: '800',
            color: '#0f172a',
            letterSpacing: '2px',
            marginBottom: '15px'
          }}>
            {slides[currentSlide].title}
          </h2>

          {/* Content */}
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#64748b',
            lineHeight: '1.7',
            maxWidth: '300px'
          }}>
            {slides[currentSlide].content}
          </p>

          {/* Visual */}
          {renderVisual()}
        </div>

        {/* Progress Indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          paddingBottom: '25px'
        }}>
          {slides.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentSlide ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: index === currentSlide ? '#0f172a' : '#e2e8f0',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          borderTop: '1px solid #f1f5f9'
        }}>
          {/* Previous */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            style={{
              flex: 1,
              padding: '18px',
              background: 'transparent',
              border: 'none',
              borderRight: '1px solid #f1f5f9',
              color: currentSlide === 0 ? '#e2e8f0' : '#94a3b8',
              cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Next / Dismiss */}
          {isLastSlide ? (
            <button
              onClick={onClose}
              style={{
                flex: 3,
                padding: '18px',
                background: '#0f172a',
                border: 'none',
                color: 'white',
                fontSize: '13px',
                fontWeight: '700',
                letterSpacing: '2px',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              START DAY
            </button>
          ) : (
            <button
              onClick={nextSlide}
              style={{
                flex: 3,
                padding: '18px',
                background: 'transparent',
                border: 'none',
                color: '#0f172a',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              CONTINUE
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
