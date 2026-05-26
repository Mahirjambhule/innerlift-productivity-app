import React, { useState, useEffect } from 'react';

export default function TaskList({ token, user }) {
  const userId = user?._id || user?.id || user?.email || 'guest';
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const API_URL = 'https://innerlift-8wtt.onrender.com/api/tasks';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (err) {
        console.error("Failed to fetch tasks from database", err);
      }
    };

    if (userId !== 'guest') {
      fetchTasks();
    }
  }, [userId, token]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newTask })
      });

      if (res.ok) {
        const savedTask = await res.json();
        setTasks([savedTask, ...tasks]);
        setNewTask('');
      } else {
        const errorData = await res.json();
        alert(`Failed to add task: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      alert("Network error: Could not reach the backend.");
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    const updatedTasks = tasks.map(task =>
      task._id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        setTasks(tasks);
        console.error("Failed to toggle task in database");
        return;
      }

      if (!currentStatus) {
        const xpRes = await fetch('https://innerlift-8wtt.onrender.com/api/gamification/update-xp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ xpActionType: 'task' })
        });

        if (xpRes.ok) {
          const data = await xpRes.json();
          window.dispatchEvent(new CustomEvent('innerlift_update_stats', {
            detail: { xpAmount: 5, actionLabel: 'Objective Completed', newStats: data }
          }));
        }
      }
    } catch (err) {
      console.error("Task toggle or XP Sync failed", err);
      setTasks(tasks);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const filteredTasks = tasks.filter(task => task._id !== taskId);
    setTasks(filteredTasks);

    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        setTasks(tasks);
      }
    } catch (err) {
      console.error("Failed to delete task", err);
      setTasks(tasks);
    }
  };

  return (
    <div className="border p-6" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
      <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new objective..."
          className="flex-1 p-3 border outline-none text-sm bg-transparent transition-colors"
          style={{ borderColor: 'var(--border-subtle)' }}
        />
        <button
          type="submit"
          className="px-6 py-3 text-xs uppercase tracking-widest font-medium transition border cursor-pointer hover:opacity-80"
          style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', borderColor: 'var(--text-primary)' }}
        >
          Add
        </button>
      </form>

      {tasks.length === 0 ? (
        <div className="text-center py-10 opacity-40 text-sm italic">
          No active objectives. Define your targets above.
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task._id}
              className="flex items-center justify-between p-4 border transition-colors group"
              style={{ borderColor: 'var(--border-subtle)', backgroundColor: task.completed ? 'var(--bg-primary)' : 'transparent' }}
            >
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => handleToggleTask(task._id, task.completed)}
                  className="w-5 h-5 rounded-full border flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  style={{
                    borderColor: 'var(--text-primary)',
                    backgroundColor: task.completed ? 'var(--text-primary)' : 'transparent',
                    color: 'var(--bg-primary)'
                  }}
                >
                  {task.completed && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                </button>
                <span className={`text-sm transition-all ${task.completed ? 'line-through opacity-40' : 'opacity-90'}`}>
                  {task.text}
                </span>
              </div>

              <button
                onClick={() => handleDeleteTask(task._id)}
                className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity p-2 text-red-500 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}