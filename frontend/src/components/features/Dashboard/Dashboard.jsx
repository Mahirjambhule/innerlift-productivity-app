import React, { useState, useEffect } from 'react';
import StatsBoard from './StatsBoard';
import PomodoroTimer from '../Productivity/PomodoroTimer';

export default function Dashboard({ user, token, setActiveTab }) {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [xp, setXp] = useState(150);

  useEffect(() => {
    const enforceDecayRules = async () => {
      const lastActiveStr = localStorage.getItem('lastActiveDate');

      if (!lastActiveStr) {
        localStorage.setItem('lastActiveDate', new Date().toISOString());
        return;
      }

      const lastActive = new Date(lastActiveStr);
      const now = new Date();
      const fortyEightHoursInMs = 48 * 60 * 60 * 1000; // 48 Hours

      if (now - lastActive > fortyEightHoursInMs) {

        alert("Codex Breach: 48 hours of inactivity detected. Streak and XP wiped to 0.");

        // 1. Wipe Local Storage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          storedUser.xp = 0;
          storedUser.streak = 0;
          storedUser.level = 1;
          localStorage.setItem('user', JSON.stringify(storedUser));
        }

        // 2. Wipe the Backend Database so it doesn't jump back to old XP!
        if (token) {
          try {
            await fetch('https://innerlift-8wtt.onrender.com/api/gamification/reset', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
          } catch (err) {
            console.error("Failed to wipe backend database stats", err);
          }
        }

        // 3. Update the UI instantly
        window.dispatchEvent(new CustomEvent('innerlift_update_stats', {
          detail: {
            xpAmount: 0,
            actionLabel: 'Codex Breach: Penalty Applied',
            newStats: { xp: 0, streak: 0, level: 1 }
          }
        }));

        // 4. Reset the clock so they can start over
        localStorage.setItem('lastActiveDate', new Date().toISOString());
      }
    };

    enforceDecayRules();

    const decayInterval = setInterval(enforceDecayRules, 60000);

    const handleTabFocus = () => enforceDecayRules();
    window.addEventListener('focus', handleTabFocus);

    return () => {
      clearInterval(decayInterval);
      window.removeEventListener('focus', handleTabFocus);
    };
  }, [token]);

  const triggerMetricSync = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="animate-fade-in w-full flex flex-col gap-4 pt-2">

      <div className="w-full relative z-10 shrink-0">
        <StatsBoard
          user={user}
          token={token}
          refreshTrigger={refreshTrigger}
          onOpenRules={() => setIsRulesOpen(true)}
        />
      </div>

      <div className="w-full relative z-10 shrink-0">
        <PomodoroTimer token={token} onActionComplete={triggerMetricSync} />
      </div>

      {isRulesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg border p-6 relative shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]"
            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <h3 className="text-xl font-serif text-red-500 font-bold uppercase tracking-wide">⚔️ Codex Disciplina</h3>
              <p className="text-xs opacity-50 mt-0.5">Your strict rules of engagement.</p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed font-sans">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold opacity-80 mb-2">Protocol I: Earning Path</h4>
                <div className="bg-black/5 dark:bg-white/5 p-3 space-y-2 rounded text-xs border border-neutral-200/5">
                  <div className="flex justify-between font-medium">
                    <span>⏱️ Complete Pomodoro Block</span>
                    <span className="text-green-500 font-bold">+30 XP</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1">
                    <span>🧠 AI Journal Check-In</span>
                    <span className="text-green-500 font-bold">+10 XP</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1">
                    <span>🎯 Complete Task List Item</span>
                    <span className="text-green-500 font-bold">+5 XP</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-red-500 mb-1">Protocol II: Streak Penalties & Decay</h4>
                <p className="text-xs opacity-70">
                  Consistency is absolute. If you let more than <strong>48 hours</strong> pass without completing any of the following <strong>Essential Actions</strong>, an automated decay triggers:
                </p>
                <ul className="list-disc pl-4 mt-1 text-xs opacity-60 space-y-1">
                  <li><strong>Pomodoro Session:</strong> Completing at least one full focused work block.</li>
                  <li><strong>Objective Completion:</strong> Marking any active task as "Done."</li>
                  <li><strong>Mental Log:</strong> Submitting a daily AI Journal entry.</li>
                </ul>
                <p className="text-xs mt-2 font-bold text-red-500">
                  Breach Result: Streak resets to 0 days and current XP vaporizes to 0.
                </p>
              </div>

              <div className="pt-2 text-[11px] opacity-50 border-t border-dashed" style={{ borderColor: 'var(--border-subtle)' }}>
                Level up requirements scale deterministically: 100 XP = 1 Level. Do the work or lose rank.
              </div>
            </div>

            <button
              onClick={() => setIsRulesOpen(false)}
              className="w-full py-3 text-xs font-semibold uppercase tracking-wider transition-all text-white bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700 cursor-pointer"
            >
              Acknowledge Covenant & Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
}