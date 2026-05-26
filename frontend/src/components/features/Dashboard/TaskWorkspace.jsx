import React from 'react';
import TaskList from './TaskList';

export default function TaskWorkspace({ user, token }) {
  const userKey = user?._id || user?.id || user?.email || 'guest';

  return (
    <div className="space-y-6 animate-fade-in w-full pb-12">

      <div>
        <h2 className="text-3xl font-serif tracking-tight">Objectives</h2>
        <p className="text-sm opacity-60 mt-1">
          Break down your targets, track progress, and master your daily execution strategy.
        </p>
      </div>

      <div className="w-full">
        <TaskList token={token} user={user} />
      </div>
    </div>
  );
}