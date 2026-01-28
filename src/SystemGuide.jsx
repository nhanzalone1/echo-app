import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, LayoutGrid, Mountain, Target, FileSignature, CheckCircle, Eye, Users, Calendar } from 'lucide-react';

// Night Mode Slides (The Architect)
const nightSlides = [
  {
    icon: LayoutGrid,
    title: 'THE ZONES',
    subtitle: 'Your life is divided into Zones. These are the buckets where you want to win.',
    color: '#c084fc'
  },
  {
    icon: Mountain,
    title: 'THE VISION',
    subtitle: 'Every Zone has a Vision. This is your "North Star"—the ultimate goal you are chasing.',
    color: '#a855f7'
  },
  {
    icon: Target,
    title: 'THE MISSION',
    subtitle: "You can't climb the mountain in one day. Set 3-5 Missions for tomorrow to chip away at it.",
    color: '#8b5cf6'
  },
  {
    icon: FileSignature,
    title: 'THE CONTRACT',
    subtitle: 'Set your Start Time and sign. Once signed, the plan is locked. No edits. Only execution.',
    color: '#7c3aed'
  }
];

// Morning Mode Slides (The Operator)
const morningSlides = [
  {
    icon: CheckCircle,
    title: 'THE EXECUTION',
    subtitle: 'This is Execution Mode. Your specific tasks are laid out. Your only job is to turn them Green.',
    color: '#10b981'
  },
  {
    icon: Eye,
    title: 'THE ALIGNMENT',
    subtitle: 'Lost motivation? Check the Vision Tab. Remind yourself WHY you are doing these hard tasks.',
    color: '#3b82f6'
  },
  {
    icon: Users,
    title: 'THE ALLIANCE',
    subtitle: "Don't fight alone. Share progress with an Ally. If you win, they see it.",
    color: '#f59e0b'
  },
  {
    icon: Calendar,
    title: 'THE SCOREBOARD',
    subtitle: 'Consistency is currency. Green days build the chain. Gold days build the legend.',
    color: '#fbbf24'
  }
];

export default function SystemGuide({ onClose, mode = 'night' }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = mode === 'night' ? nightSlides : morningSlides;
  const CurrentIcon = slides[currentSlide].icon;
  const accentColor = slides[currentSlide].color;

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
  const isNight = mode === 'night';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.9)',
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
        background: 'linear-gradient(145deg, rgba(20, 20, 25, 0.95) 0%, rgba(10, 10, 12, 0.98) 100%)',
        borderRadius: '28px',
        border: `1px solid ${accentColor}33`,
        overflow: 'hidden',
        boxShadow: `0 25px 60px -12px rgba(0, 0, 0, 0.8), 0 0 40px ${accentColor}15`
      }}>

        {/* Content Area */}
        <div style={{
          padding: '50px 35px',
          textAlign: 'center',
          minHeight: '320px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Mode Badge */}
          <div style={{
            fontSize: '10px',
            color: accentColor,
            letterSpacing: '3px',
            marginBottom: '25px',
            textTransform: 'uppercase',
            fontWeight: '700'
          }}>
            {isNight ? '🌙 THE ARCHITECT' : '☀️ THE OPERATOR'}
          </div>

          {/* Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: `linear-gradient(135deg, ${accentColor}20 0%, ${accentColor}10 100%)`,
            border: `2px solid ${accentColor}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px',
            boxShadow: `0 0 30px ${accentColor}20`
          }}>
            <CurrentIcon size={36} color={accentColor} style={{ filter: `drop-shadow(0 0 8px ${accentColor})` }} />
          </div>

          {/* Title */}
          <h1 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: '900',
            color: 'white',
            letterSpacing: '3px',
            marginBottom: '16px',
            textTransform: 'uppercase'
          }}>
            {slides[currentSlide].title}
          </h1>

          {/* Subtitle */}
          <p style={{
            margin: 0,
            fontSize: '15px',
            color: '#94a3b8',
            lineHeight: '1.7',
            maxWidth: '300px'
          }}>
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Progress Dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          paddingBottom: '25px'
        }}>
          {slides.map((slide, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: index === currentSlide ? '28px' : '10px',
                height: '10px',
                borderRadius: '5px',
                background: index === currentSlide ? accentColor : '#333',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: index === currentSlide ? `0 0 10px ${accentColor}60` : 'none'
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          borderTop: '1px solid #1a1a1a'
        }}>
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            style={{
              flex: 1,
              padding: '20px',
              background: 'transparent',
              border: 'none',
              borderRight: '1px solid #1a1a1a',
              color: currentSlide === 0 ? '#333' : '#666',
              cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s'
            }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Next / Close Button */}
          {isLastSlide ? (
            <button
              onClick={onClose}
              style={{
                flex: 3,
                padding: '20px',
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
                border: 'none',
                color: 'white',
                fontSize: '14px',
                fontWeight: '800',
                letterSpacing: '2px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
                boxShadow: `0 4px 20px ${accentColor}40`
              }}
            >
              {isNight ? 'START PLANNING' : 'START EXECUTING'}
            </button>
          ) : (
            <button
              onClick={nextSlide}
              style={{
                flex: 3,
                padding: '20px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'color 0.2s'
              }}
            >
              NEXT
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
