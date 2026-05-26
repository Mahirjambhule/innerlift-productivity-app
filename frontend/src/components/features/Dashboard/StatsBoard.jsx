import React from 'react';

export default function StatsBoard({ user, onOpenRules }) {
  let displayXP = user?.xp || 0;
  let displayLevel = user?.level || 1;
  const streak = user?.streak || 0;

  while (displayXP >= 100) {
    displayXP -= 100;
    displayLevel += 1;
  }

  const xpNeeded = 100;
  const progressPercentage = Math.min((displayXP / xpNeeded) * 100, 100);

  return (
    <div className="w-full space-y-4 animate-fade-in">

      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-serif font-medium tracking-tight">
            Welcome back, {user?.name || 'Seeker'}.
          </h2>
          <p className="text-xs opacity-50 uppercase tracking-widest mt-0.5">
            Focus State: Rank {displayLevel} Mind Operator
          </p>
        </div>

        <button
          onClick={onOpenRules}
          className="text-[10px] uppercase font-bold tracking-wider px-4 py-2 border transition cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black mb-1"
          style={{ borderColor: 'var(--text-primary)' }}
        >
          XP RULES
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="border p-5 flex flex-col justify-between" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
          <span className="text-[10px] tracking-widest uppercase opacity-50 font-semibold">User Ranking</span>
          <h3 className="text-3xl font-serif font-medium mt-2">Level {displayLevel}</h3>
        </div>

        <div className="border p-5 flex flex-col justify-between relative overflow-hidden" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
          <span className="text-[10px] tracking-widest uppercase opacity-50 font-semibold">Consistency Loop</span>
          <h3 className="text-3xl font-serif font-medium mt-2 z-10 relative">{streak} Days</h3>
        </div>

        <div className="border p-5 flex flex-col justify-between" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] tracking-widest uppercase opacity-50 font-semibold">Clarity Progress</span>
            <span className="text-[10px] font-mono opacity-60 mb-0.5">{displayXP} / {xpNeeded} XP</span>
          </div>

          <div className="w-full">
            <div className="w-full h-1.5 rounded-full overflow-hidden bg-gray-500/20">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progressPercentage}%`,
                  backgroundColor: 'var(--text-primary)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}