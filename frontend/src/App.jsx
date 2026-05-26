import React, { useState, useEffect } from 'react';
import LoginScreen from './components/auth/LoginScreen';
import RegisterScreen from './components/auth/RegisterScreen';
import ThemeToggle from './components/layout/ThemeToggle';
import RoutineGenerator from './components/features/Productivity/RoutineGenerator';
import VoiceAssistant from './components/features/Journaling/VoiceAssistant';
import CommunityFeed from './components/features/Community/CommunityFeed';
import Dashboard from './components/features/Dashboard/Dashboard';
import TaskWorkspace from './components/features/Dashboard/TaskWorkspace';
import AIJournal from './components/features/Journaling/AIJournal';
import MindsetVault from './components/features/Dashboard/MindsetVault';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authView, setAuthView] = useState('login');

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [xpToasts, setXpToasts] = useState([]);

  useEffect(() => {
    const handleStatsUpdate = (e) => {
      const { xpAmount, actionLabel, newStats } = e.detail;
      const id = Date.now();

      setXpToasts((prev) => [...prev, { id, xpAmount, actionLabel }]);

      if (newStats) {
        setUser((prevUser) => {
          const updatedUser = { ...prevUser, ...newStats };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return updatedUser;
        });
      }

      setTimeout(() => {
        setXpToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 3000);
    };

    window.addEventListener('innerlift_update_stats', handleStatsUpdate);
    return () => window.removeEventListener('innerlift_update_stats', handleStatsUpdate);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const handleAuthSuccess = (data) => {
    setToken(data.token);
    setUser(data);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setActiveTab('dashboard');

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActiveDate');
    localStorage.removeItem('innerlift_current_routine');
  };

  if (!token) {
    if (authView === 'login') {
      return <LoginScreen onSuccess={handleAuthSuccess} onSwitchToRegister={() => setAuthView('register')} />;
    }
    return <RegisterScreen onSuccess={handleAuthSuccess} onSwitchToLogin={() => setAuthView('login')} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-300 relative">

      <svg className="fixed top-0 right-0 w-[400px] h-[400px] opacity-[0.03] pointer-events-none z-0 rotate-180" viewBox="0 0 200 200" fill="none" stroke="currentColor">
        <path d="M100 200 Q110 100 200 80" strokeWidth="1" />
        <path d="M120 150 Q160 140 180 180" strokeWidth="0.5" />
        <path d="M110 120 Q180 110 190 50" strokeWidth="0.5" />
        <circle cx="180" cy="180" r="2" fill="currentColor" />
        <circle cx="190" cy="50" r="1.5" fill="currentColor" />
      </svg>

      <div className="md:hidden flex justify-between items-center p-4 border-b relative z-50 sticky top-0" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-primary)' }}>
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <path d="M 45,8 C 75,5 95,25 92,55 C 88,85 55,95 25,80 C -2,65 5,30 25,12" strokeWidth="4" strokeLinecap="round" />
            <path d="M 47,16 C 67,14 82,28 79,48 C 76,68 52,76 32,65 C 13,55 18,35 30,22" strokeWidth="1" strokeLinecap="round" />
            <path d="M 50,30 C 58,45 62,60 50,72 C 38,60 42,45 50,30 Z" fill="currentColor" />
            <path d="M 50,72 C 65,70 75,55 72,40 C 65,52 55,60 50,72 Z" strokeWidth="2" />
            <path d="M 50,72 C 35,70 25,55 28,40 C 35,52 45,60 50,72 Z" strokeWidth="2" />
            <path d="M 50,72 C 75,76 90,65 88,52 C 80,65 65,70 50,72 Z" strokeWidth="1.5" />
            <path d="M 50,72 C 25,76 10,65 12,52 C 20,65 35,70 50,72 Z" strokeWidth="1.5" />
            <circle cx="50" cy="18" r="2.5" fill="currentColor" />
            <circle cx="70" cy="25" r="1.5" fill="currentColor" />
            <circle cx="30" cy="25" r="1.5" fill="currentColor" />
          </svg>
          <h1 className="text-xl font-serif tracking-tight">InnerLift.</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      <header className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex w-full md:w-64 border-b md:border-b-0 md:border-r p-6 flex-col justify-between sticky top-0 md:h-screen`} style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-primary)' }}>
        <div className="flex flex-col gap-8 relative z-10">
          <div className="hidden md:flex flex-col mb-2">
            <div className="flex items-center gap-3">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                <path d="M 45,8 C 75,5 95,25 92,55 C 88,85 55,95 25,80 C -2,65 5,30 25,12" strokeWidth="4" strokeLinecap="round" />
                <path d="M 47,16 C 67,14 82,28 79,48 C 76,68 52,76 32,65 C 13,55 18,35 30,22" strokeWidth="1" strokeLinecap="round" />
                <path d="M 50,30 C 58,45 62,60 50,72 C 38,60 42,45 50,30 Z" fill="currentColor" />
                <path d="M 50,72 C 65,70 75,55 72,40 C 65,52 55,60 50,72 Z" strokeWidth="2" />
                <path d="M 50,72 C 35,70 25,55 28,40 C 35,52 45,60 50,72 Z" strokeWidth="2" />
                <path d="M 50,72 C 75,76 90,65 88,52 C 80,65 65,70 50,72 Z" strokeWidth="1.5" />
                <path d="M 50,72 C 25,76 10,65 12,52 C 20,65 35,70 50,72 Z" strokeWidth="1.5" />
                <circle cx="50" cy="18" r="2.5" fill="currentColor" />
                <circle cx="70" cy="25" r="1.5" fill="currentColor" />
                <circle cx="30" cy="25" r="1.5" fill="currentColor" />
              </svg>
              <h1 className="text-3xl font-serif tracking-tight">InnerLift.</h1>
            </div>
            <span className="text-[10px] tracking-widest uppercase opacity-40 mt-2 ml-[52px]">Nurture the Mind, Master the Day</span>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            {['dashboard', 'tasks', 'journal', 'routines', 'voice', 'vault', 'community'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setIsMobileMenuOpen(false); }}
                className={`text-left font-medium py-2 px-3 rounded transition cursor-pointer ${activeTab === tab ? 'opacity-100 font-bold border-l-2' : 'opacity-60 hover:opacity-100'} border-current capitalize`}
              >
                {tab === 'dashboard' ? 'Deep Work'
                  : tab === 'tasks' ? 'Objectives'
                    : tab === 'journal' ? 'AI Journal'
                      : tab === 'vault' ? 'Inspiration'
                        : tab === 'community' ? 'The Collective'
                          : tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-start gap-6 relative z-10 mt-12 md:mt-0">
          <ThemeToggle />
          <div className="text-xs opacity-60">
            <button onClick={handleLogout} className="hover:opacity-100 transition mb-2 block font-semibold cursor-pointer">Sign Out</button>
            © 2026 InnerLift AI
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="px-6 pt-8 pb-16 md:px-12 md:pt-12 max-w-4xl mx-auto w-full relative z-10">

          <div className={activeTab === 'dashboard' ? 'block w-full' : 'hidden'}>
            <Dashboard user={user} token={token} setActiveTab={setActiveTab} />
          </div>

          <div className={activeTab === 'tasks' ? 'block w-full' : 'hidden'}>
            <TaskWorkspace user={user} token={token} />
          </div>

          <div className={activeTab === 'journal' ? 'block w-full' : 'hidden'}>
            <AIJournal token={token} />
          </div>

          <div className={activeTab === 'routines' ? 'block w-full' : 'hidden'}>
            <RoutineGenerator token={token} />
          </div>

          <div className={activeTab === 'voice' ? 'block w-full' : 'hidden'}>
            <VoiceAssistant token={token} />
          </div>

          <div className={activeTab === 'vault' ? 'block w-full' : 'hidden'}>
            <MindsetVault />
          </div>

          <div className={activeTab === 'community' ? 'block w-full' : 'hidden'}>
            <CommunityFeed token={token} currentUser={user} />
          </div>

        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-50 space-y-3 flex flex-col items-end pointer-events-none">
        {xpToasts.map((toast) => (
          <div
            key={toast.id}
            className="p-4 border flex items-center gap-4 shadow-2xl backdrop-blur-md transition-all duration-300"
            style={{
              borderColor: 'var(--text-primary)',
              backgroundColor: 'var(--bg-secondary)',
              animation: 'innerliftToastSlide 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
              +{toast.xpAmount}
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider select-none" style={{ color: 'var(--text-primary)' }}>XP Secured</h4>
              <p className="text-[11px] opacity-60 leading-tight mt-0.5 select-none">{toast.actionLabel}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes innerliftToastSlide {
          0% { transform: translateY(1.5rem); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}