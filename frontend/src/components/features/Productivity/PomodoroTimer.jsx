import React, { useState, useEffect } from 'react';

const playTerminalChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    const playTone = (freq, startTime, duration, vol) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    playTone(880, 0, 0.3, 0.5);
    playTone(1108.73, 0.1, 0.5, 0.5);
  } catch (e) {
    console.log("Audio API blocked or unsupported.");
  }
};

export default function PomodoroTimer({ token, onActionComplete }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus');

  const [completionModal, setCompletionModal] = useState(null);

  const handlePomodoroComplete = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/gamification/update-xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ xpActionType: 'pomodoro' })
      });

      const data = await res.json();

      if (res.ok) {
        window.dispatchEvent(new CustomEvent('innerlift_update_stats', {
          detail: { xpAmount: 30, actionLabel: 'Focus Block Logged', newStats: data }
        }));

        if (onActionComplete) onActionComplete();
      }
    } catch (err) {
      console.error("Failed to sync XP:", err);
    }
  };

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);

      playTerminalChime();

      if (mode === 'focus') {
        handlePomodoroComplete();
      }

      setCompletionModal({ type: mode });
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const setTimerMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 1 * 60);
  };

  const handleAcknowledge = () => {
    const nextMode = completionModal.type === 'focus' ? 'shortBreak' : 'focus';
    setMode(nextMode);
    setTimeLeft(nextMode === 'focus' ? 25 * 60 : 1 * 60);
    setCompletionModal(null);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="border p-6 flex flex-col min-h-[320px] relative overflow-hidden" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>

        <svg className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M50 100 Q 40 50 10 20" />
          <path d="M45 70 Q 70 60 90 30" />
          <path d="M48 90 Q 70 90 80 70" />
        </svg>

        <div className="flex justify-between items-end mb-4 border-b pb-3 relative z-10" style={{ borderColor: 'var(--border-subtle)' }}>
          <h2 className="text-xl font-serif">Pomodoro</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setTimerMode('focus')}
              className={`text-xs tracking-widest uppercase transition-opacity cursor-pointer ${mode === 'focus' ? 'opacity-100 font-bold' : 'opacity-40 hover:opacity-100'}`}
            >
              Focus
            </button>
            <button
              onClick={() => setTimerMode('shortBreak')}
              className={`text-xs tracking-widest uppercase transition-opacity cursor-pointer ${mode === 'shortBreak' ? 'opacity-100 font-bold' : 'opacity-40 hover:opacity-100'}`}
            >
              Break
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <div className="text-6xl md:text-7xl font-serif font-light tracking-tight mb-6">
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTimer}
              className="px-8 py-3 text-sm font-medium transition border cursor-pointer"
              style={{
                backgroundColor: isActive ? 'transparent' : 'var(--text-primary)',
                color: isActive ? 'var(--text-primary)' : 'var(--bg-primary)',
                borderColor: 'var(--text-primary)'
              }}
            >
              {isActive ? 'PAUSE' : 'START SESSION'}
            </button>

            <button
              onClick={() => setTimerMode(mode)}
              className="p-3 border opacity-60 hover:opacity-100 transition cursor-pointer"
              style={{ borderColor: 'var(--border-subtle)' }}
              title="Reset Timer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
            </button>
          </div>
        </div>
      </div>

      {completionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-sm border p-8 relative shadow-2xl flex flex-col items-center text-center gap-4 animate-fade-in"
            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center border-2 mb-2"
              style={{ borderColor: 'var(--text-primary)', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}
            >
              {completionModal.type === 'focus' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              )}
            </div>

            <h3 className="text-2xl font-serif tracking-tight">
              {completionModal.type === 'focus' ? 'TARGET SECURED' : 'RECOVERY COMPLETE'}
            </h3>

            <p className="text-sm opacity-60 px-4 leading-relaxed">
              {completionModal.type === 'focus'
                ? 'Execution block finished. +30 XP has been allocated to your profile.'
                : 'Rest period concluded. Recalibrate your mind for the next objective.'}
            </p>

            <button
              onClick={handleAcknowledge}
              className="w-full mt-4 py-3 text-xs font-bold uppercase tracking-widest transition-all border cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
              style={{ borderColor: 'var(--text-primary)' }}
            >
              {completionModal.type === 'focus' ? 'Initialize Break' : 'Resume Execution'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}