import React, { useState } from 'react';
import { Target, Eye, ListTodo, ChevronRight, ChevronLeft, Moon } from 'lucide-react';

const slides = [
  {
    icon: Target,
    title: 'CATEGORIES & VISIONS',
    content: 'Categories are Areas of Life. Inside each, you store \'Visions\' (your long-term north stars).'
  },
  {
    icon: Eye,
    title: 'MISSION VS. VISION',
    content: 'A Vision is the destination; a Mission is tomorrow\'s tactical steps to get you there.'
  },
  {
    icon: ListTodo,
    title: 'PREP THE LINE',
    content: 'Set your missions tonight so you can execute without thinking tomorrow.'
  }
];

export default function NightModeBriefing({ onClose }) {
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
        background: 'linear-gradient(180deg, #0f0f12 0%, #000000 100%)',
        borderRadius: '24px',
        border: '1px solid #1a1a1f',
        overflow: 'hidden',
        boxShadow: '0 0 80px rgba(192, 132, 252, 0.1)'
      }}>

        {/* Header Badge */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #1a1a1f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <Moon size={16} color="#c084fc" />
          <span style={{
            fontSize: '11px',
            color: '#c084fc',
            letterSpacing: '3px',
            fontWeight: '600'
          }}>
            NIGHT OPS BRIEFING
          </span>
        </div>

        {/* Content Area */}
        <div style={{
          padding: '50px 35px',
          textAlign: 'center',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Icon */}
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '20px',
            background: 'rgba(192, 132, 252, 0.1)',
            border: '1px solid rgba(192, 132, 252, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px'
          }}>
            <CurrentIcon size={32} color="#c084fc" />
          </div>

          {/* Slide Counter */}
          <div style={{
            fontSize: '10px',
            color: '#444',
            letterSpacing: '2px',
            marginBottom: '15px'
          }}>
            {String(currentSlide + 1).padStart(2, '0')} — {String(slides.length).padStart(2, '0')}
          </div>

          {/* Title */}
          <h2 style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: '800',
            color: 'white',
            letterSpacing: '2px',
            marginBottom: '20px'
          }}>
            {slides[currentSlide].title}
          </h2>

          {/* Content */}
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#888',
            lineHeight: '1.7',
            maxWidth: '300px'
          }}>
            {slides[currentSlide].content}
          </p>
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
                background: index === currentSlide ? '#c084fc' : '#333',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          borderTop: '1px solid #1a1a1f'
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
              borderRight: '1px solid #1a1a1f',
              color: currentSlide === 0 ? '#222' : '#555',
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
                background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)',
                border: 'none',
                color: 'white',
                fontSize: '13px',
                fontWeight: '700',
                letterSpacing: '2px',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              BEGIN OPS
            </button>
          ) : (
            <button
              onClick={nextSlide}
              style={{
                flex: 3,
                padding: '18px',
                background: 'transparent',
                border: 'none',
                color: '#c084fc',
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
