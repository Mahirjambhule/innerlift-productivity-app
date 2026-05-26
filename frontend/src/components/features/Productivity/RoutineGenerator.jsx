import React, { useState, useEffect } from 'react';

export default function RoutineGenerator({ token }) {
  const [constraints, setConstraints] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const [routine, setRoutine] = useState(() => {
    const saved = localStorage.getItem('innerlift_current_routine');
    if (saved && saved !== 'undefined') {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const fetchLatestRoutine = async () => {
      try {
        const res = await fetch('https://innerlift-8wtt.onrender.com/api/routine', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setRoutine(data[0]);
            localStorage.setItem('innerlift_current_routine', JSON.stringify(data[0]));
          }
        }
      } catch (err) {
        console.error("Failed to auto-fetch routine", err);
      }
    };

    const saved = localStorage.getItem('innerlift_current_routine');
    if (!saved || saved === 'undefined') {
      fetchLatestRoutine();
    }
  }, [token]);

  const generateRoutine = async (e) => {
    e.preventDefault();
    if (!constraints.trim()) return;

    setIsGenerating(true);
    setError('');

    try {
      const res = await fetch('https://innerlift-8wtt.onrender.com/api/routine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ promptText: constraints })
      });

      const data = await res.json();

      if (res.ok) {
        setRoutine(data);
        localStorage.setItem('innerlift_current_routine', JSON.stringify(data));
      } else {
        setError(data.message || 'Failed to generate routine.');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartOver = async () => {
    if (routine && routine._id) {
      try {
        await fetch(`https://innerlift-8wtt.onrender.com/api/routine/${routine._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error('Failed to delete routine from MongoDB:', err);
      }
    }

    setRoutine(null);
    setConstraints('');
    localStorage.removeItem('innerlift_current_routine');
  };

  const getTypeColor = (type) => {
    const t = type ? type.toLowerCase() : '';
    if (t.includes('execution') || t.includes('focus')) return 'border-l-4 border-black dark:border-white';
    if (t.includes('recovery') || t.includes('break')) return 'border-l-4 border-gray-300 dark:border-gray-600';
    if (t.includes('prep') || t.includes('learn')) return 'border-l-4 border-blue-500';
    return 'border-l-4 border-gray-400';
  };

  return (
    <div className="space-y-6 animate-fade-in w-full pb-12">
      <div>
        <h2 className="text-3xl font-serif tracking-tight">Routine Engine</h2>
        <p className="text-sm opacity-60 mt-1">Algorithmic timeline mapping to engineer your execution flow.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-start">

        {/* Box 1: Input */}
        <div className="border p-8 flex flex-col min-h-[450px]" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
          <h2 className="text-2xl font-serif mb-6">Design Your Day</h2>
          {error && <div className="text-red-500 text-xs mb-4">{error}</div>}

          <form onSubmit={generateRoutine} className="flex flex-col flex-1">
            <label className="block text-xs tracking-widest uppercase opacity-60 mb-3">Constraints & Goals</label>
            <textarea
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              className="w-full flex-1 p-4 border outline-none resize-none text-sm bg-transparent min-h-[200px] placeholder-current placeholder-opacity-40"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              placeholder="e.g., I wake up at 8:00 AM, have classes until 2 PM, need to study for exam for 3 hours..."
            />
            <button
              type="submit"
              disabled={isGenerating || !constraints.trim()}
              className="w-full py-4 mt-6 text-sm font-medium transition disabled:opacity-50 border cursor-pointer hover:opacity-80"
              style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', borderColor: 'var(--text-primary)' }}
            >
              {isGenerating ? 'Engineering Routine...' : 'Generate Blueprint'}
            </button>
          </form>
        </div>

        {/* Box 2: Output */}
        <div className="border p-8 flex flex-col min-h-[450px]" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-primary)' }}>

          {!routine && !isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="mb-6 opacity-20" style={{ color: 'var(--text-primary)' }}>
                <svg width="64" height="64" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="25" cy="70" r="15" />
                  <circle cx="75" cy="70" r="15" />
                  <path d="M 25 70 L 45 40 L 70 40 L 75 70" />
                  <path d="M 45 40 L 30 60 L 55 70 Z" />
                  <path d="M 40 40 L 45 30 L 35 30" />
                  <path d="M 70 40 L 65 25 L 75 20" />
                  <path d="M 10 90 L 90 90" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-2">The Journey Awaits</h3>
              <p className="opacity-60 text-sm max-w-[250px]">Input your constraints on the left. The AI will engineer the perfect path for your day.</p>
            </div>
          ) : isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: 'var(--text-primary)', borderTopColor: 'transparent' }}></div>
              <p className="text-sm opacity-60 animate-pulse">Calculating optimal time blocks...</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col animate-fade-in overflow-y-auto pr-2">
              <h3 className="text-2xl font-serif mb-1">{routine.title || 'Optimized Blueprint'}</h3>
              <p className="text-xs opacity-60 italic mb-6 border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
                "{routine.philosophy || 'Execute with precision.'}"
              </p>

              <div className="space-y-4 flex-1">
                {routine.blocks && routine.blocks.map((block, index) => (
                  <div key={index} className={`flex flex-col p-5 border bg-opacity-5 ${getTypeColor(block.type)}`} style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>

                    <div className="flex justify-between items-center border-b pb-3 mb-3" style={{ borderColor: 'var(--border-subtle)' }}>
                      <div className="font-serif font-bold text-lg">{block.time}</div>
                      <div className="text-[10px] uppercase tracking-widest opacity-60 font-medium px-2 py-1 border rounded" style={{ borderColor: 'var(--border-subtle)' }}>
                        {block.type}
                      </div>
                    </div>

                    <div className="text-sm leading-relaxed opacity-90">
                      {block.activity}
                    </div>

                  </div>
                ))}
              </div>

              <button
                onClick={handleStartOver}
                className="mt-8 text-xs uppercase tracking-widest font-medium opacity-60 hover:opacity-100 transition self-start cursor-pointer border-b border-transparent hover:border-current pb-1"
              >
                Start Over / Clear Blueprint
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}