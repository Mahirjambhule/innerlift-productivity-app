import React, { useState, useEffect } from 'react';

export default function AIJournal({ token }) {
  const [journalText, setJournalText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [journalHistory, setJournalHistory] = useState([]);

  const [deletePrompt, setDeletePrompt] = useState({ show: false, id: null });

  useEffect(() => {
    const fetchJournalHistory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/journal', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          const formattedHistory = data.map(entry => ({
            id: entry._id,
            date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            rawThought: entry.content,
            mood: entry.analysis?.mood || 'Reflective',
            sentimentScore: entry.analysis?.sentimentScore ?? 0.5,
            emotionalReflection: entry.analysis?.emotionalReflection || entry.analysis?.aiRecommendation || 'Baseline recorded.',
            productivityInsight: entry.analysis?.productivityInsight || 'Keep showing up and executing.',
            actionableSteps: entry.analysis?.actionableSteps || ['Protect your core execution windows.']
          }));
          setJournalHistory(formattedHistory);
        }
      } catch (err) {
        console.error("Could not load backend logs", err);
      }
    };
    if (token) fetchJournalHistory();
  }, [token]);

  const analyzeJournal = async () => {
    if (!journalText.trim()) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('http://localhost:5000/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: journalText })
      });

      const data = await res.json();

      if (res.ok) {
        const backendAnalysis = data.analysis || data;

        const newEntry = {
          id: data._id || Date.now(),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          rawThought: journalText,
          mood: backendAnalysis.mood || 'Reflective',
          sentimentScore: backendAnalysis.sentimentScore ?? 0.5,
          emotionalReflection: backendAnalysis.emotionalReflection || 'Baseline recorded locally.',
          productivityInsight: backendAnalysis.productivityInsight || 'Focus on the next immediate step.',
          actionableSteps: backendAnalysis.actionableSteps || ['Take a deep breath and reset.']
        };

        setJournalHistory(prevHistory => [newEntry, ...prevHistory]);
        setJournalText('');

        const xpRes = await fetch('http://localhost:5000/api/gamification/update-xp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ xpActionType: 'journal' })
        });

        const xpData = await xpRes.json();

        if (xpRes.ok) {
          window.dispatchEvent(new CustomEvent('innerlift_update_stats', {
            detail: { xpAmount: 10, actionLabel: 'Mind Calibrated', newStats: xpData }
          }));
        }

      } else {
        alert(data.message || 'Analysis tracking sync failed');
      }
    } catch (error) {
      console.error('Journal UI API Processing error:', error);
      alert('Could not update profile parameters completely.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const executeDelete = async () => {
    const id = deletePrompt.id;
    setDeletePrompt({ show: false, id: null });

    if (!id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/journal/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (res.ok) {
        setJournalHistory((prevHistory) => prevHistory.filter((entry) => entry.id !== id));
      } else {
        alert(data.message || 'Failed to delete entry');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Server error while deleting entry');
    }
  };

  return (
    <>
      <div className="space-y-8 animate-fade-in w-full pb-16">
        <div>
          <h2 className="text-3xl font-serif tracking-tight">Mind Space Analytics</h2>
          <p className="text-sm opacity-60 mt-1">Log raw thought entries to extract behavioral trend suggestions.</p>
        </div>

        <div className="space-y-4">
          <div className="relative w-full">
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              className="w-full h-44 p-4 border outline-none resize-none font-sans bg-transparent relative z-10 transition-colors focus:bg-opacity-5 placeholder-current placeholder-opacity-40"
              style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              placeholder="Start writing down your unfiltered thoughts, current stressors, or mini-wins..."
            />
          </div>

          <button
            onClick={analyzeJournal}
            disabled={isAnalyzing || !journalText.trim()}
            className="px-6 py-3 font-medium text-xs uppercase tracking-wider transition-all disabled:opacity-30 border cursor-pointer hover:opacity-80"
            style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', borderColor: 'var(--text-primary)' }}
          >
            {isAnalyzing ? 'Processing Baseline...' : 'Analyze & Calibrate State'}
          </button>
        </div>

        <div className="space-y-4 pt-4">
          <div className="border-b pb-2" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-lg font-serif tracking-wide">Historical Insights ({journalHistory.length})</h3>
          </div>

          {journalHistory.length === 0 ? (
            <div className="text-sm opacity-40 italic py-8 text-center border border-dashed" style={{ borderColor: 'var(--border-subtle)' }}>
              No journal records filed yet. Your analytical logs will map out down here.
            </div>
          ) : (
            <div className="space-y-6">
              {journalHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="border p-6 relative overflow-hidden transition-all duration-200 group"
                  style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}
                >
                  <button
                    onClick={() => setDeletePrompt({ show: true, id: entry.id })}
                    className="absolute right-4 top-4 opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity p-1.5 text-red-500 cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></svg>
                  </button>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-3 gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
                      <div>
                        <span className="text-[10px] tracking-widest uppercase opacity-40 block font-bold mb-0.5">{entry.date}</span>
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-serif font-semibold">{entry.mood}</h4>
                          <span className="text-xs px-2 py-0.5 border opacity-70" style={{ borderColor: 'var(--border-subtle)' }}>
                            Positivity: {(entry.sentimentScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest opacity-40 block font-bold mb-1">Your Entry Log</span>
                        <p className="text-sm opacity-80 whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto pr-2 bg-black/5 dark:bg-white/5 p-3 rounded">
                          {entry.rawThought}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest opacity-40 block font-bold mb-1">State Reflection</span>
                          <p className="font-serif italic text-sm leading-relaxed opacity-90">
                            {entry.emotionalReflection}
                          </p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-widest opacity-40 block font-bold mb-1">Productivity Insight</span>
                          <p className="text-sm opacity-80 font-medium">
                            {entry.productivityInsight}
                          </p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-widest opacity-40 block font-bold mb-1">Action Protocol</span>
                          <ul className="list-disc pl-4 space-y-1">
                            {Array.isArray(entry.actionableSteps) ? (
                              entry.actionableSteps.map((step, idx) => (
                                <li key={idx} className="text-sm opacity-80">{step}</li>
                              ))
                            ) : (
                              <li className="text-sm opacity-80">{entry.actionableSteps}</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {deletePrompt.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" style={{ position: 'fixed' }}>
          <div className="p-8 border w-full max-w-sm animate-fade-in shadow-2xl" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
            <h3 className="font-serif text-2xl mb-2">Erase Record?</h3>
            <p className="text-sm opacity-60 mb-8 leading-relaxed">This mental baseline record will be permanently purged from the database.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeletePrompt({ show: false, id: null })}
                className="flex-1 py-3 text-xs uppercase tracking-widest font-medium transition border cursor-pointer hover:opacity-70"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 py-3 text-xs uppercase tracking-widest font-medium transition border cursor-pointer hover:bg-red-600 hover:text-white hover:border-red-600"
                style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', borderColor: 'var(--text-primary)' }}
              >
                Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}