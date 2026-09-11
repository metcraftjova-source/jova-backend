import { useEffect, useState, useRef } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ ready, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const currentRef = useRef(0);

  // Progress climbs quickly to 90% for perceived responsiveness, then
  // holds there until `ready` (the hero video's first real frame) becomes
  // true — instead of always finishing on a fixed timer regardless of
  // whether anything has actually loaded. currentRef persists across the
  // effect re-running when `ready` flips, so the bar continues smoothly
  // from wherever it was instead of jumping back to 0.
  useEffect(() => {
    const cap = ready ? 100 : 90;
    const interval = setInterval(() => {
      currentRef.current = Math.min(currentRef.current + Math.random() * 12 + 4, cap);
      setProgress(Math.floor(currentRef.current));

      if (currentRef.current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            onComplete && onComplete();
          }, 700);
        }, 300);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [ready, onComplete]);

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      {/* Background glow */}
      <div className="loading-bg-glow" />

      {/* Orbiting circles */}
      <div className="loading-orbit-wrapper">
        {/* Outer orbit ring */}
        <div className="loading-orbit loading-orbit-outer">
          <div className="loading-dot loading-dot-outer" />
        </div>

        {/* Middle orbit ring */}
        <div className="loading-orbit loading-orbit-middle">
          <div className="loading-dot loading-dot-middle" />
        </div>

        {/* Inner orbit ring */}
        <div className="loading-orbit loading-orbit-inner">
          <div className="loading-dot loading-dot-inner" />
        </div>

        {/* Center pulsing circle */}
        <div className="loading-center-circle">
          <div className="loading-center-pulse" />
          <span className="loading-percent">{progress}%</span>
        </div>
      </div>


      {/* Progress bar */}
      <div className="loading-progress-bar-wrapper">
        <div
          className="loading-progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="loading-tagline">Precision Engineered Solutions</p>
    </div>
  );
};

export default LoadingScreen;