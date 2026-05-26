import React, { useState } from 'react';

export default function LoginScreen({ onSuccess, onSwitchToRegister }) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('https://innerlift-8wtt.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value,
        })
      });
      const data = await res.json();

      if (res.ok) {
        onSuccess(data);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server connection failed. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-none font-sans overflow-hidden" style={{ backgroundColor: '#FFFFFF', color: '#000000' }}>

      <svg className="absolute top-10 left-10 opacity-10 w-32 h-32 pointer-events-none text-black" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M10 50 Q 40 20 90 40" />
        <path d="M40 35 Q 50 25 60 40" />
        <circle cx="50" cy="30" r="2" fill="currentColor" />
      </svg>

      <svg className="absolute -bottom-10 -right-10 opacity-[0.07] w-96 h-96 pointer-events-none text-black" viewBox="0 0 200 200" fill="none" stroke="currentColor">
        <g strokeWidth="0.5">
          <circle cx="140" cy="140" r="40" strokeDasharray="1 3" />
          <circle cx="140" cy="140" r="20" strokeWidth="0.25" />
          <circle cx="140" cy="140" r="60" strokeDasharray="4 6" opacity="0.5" />

          <circle cx="100" cy="100" r="3" fill="currentColor" />
          <circle cx="170" cy="110" r="2" fill="currentColor" />
          <circle cx="120" cy="180" r="4" fill="currentColor" />
          <circle cx="180" cy="160" r="1.5" fill="currentColor" />
          <circle cx="80" cy="150" r="2.5" fill="currentColor" />
          <circle cx="140" cy="140" r="1.5" fill="currentColor" />

          <path d="M100 100 L 140 140 L 170 110" />
          <path d="M140 140 L 120 180 L 80 150 L 100 100" />
          <path d="M120 180 L 180 160 L 170 110" />
          <path d="M140 140 L 180 160" />
          <path d="M80 150 L 140 140" />

          <ellipse cx="140" cy="140" rx="70" ry="25" transform="rotate(-30 140 140)" strokeWidth="0.2" />
          <ellipse cx="140" cy="140" rx="70" ry="25" transform="rotate(60 140 140)" strokeWidth="0.2" />
        </g>
      </svg>

      <div className="max-w-md w-full border border-gray-200 bg-white p-10 relative z-10 bg-opacity-90 backdrop-blur-sm shadow-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4 text-black">
            {/* Full Lotus Logo */}
            <svg width="64" height="64" viewBox="0 0 100 100" fill="none" stroke="currentColor">
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
          </div>
          <h1 className="text-3xl font-serif font-bold mb-1">InnerLift</h1>
          <p className="text-sm text-gray-500">Welcome back. Enter your credentials.</p>
        </div>

        {error && <div className="mb-4 text-xs text-red-500 font-medium text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input name="email" type="email" placeholder="Email address" required className="w-full p-3 border border-gray-300 outline-none focus:border-black text-sm bg-white text-black transition-colors" />

          <div>
            <input name="password" type="password" placeholder="Password" required className="w-full p-3 border border-gray-300 outline-none focus:border-black text-sm bg-white text-black transition-colors" />
            <div className="flex justify-end mt-2">
              <button type="button" onClick={() => alert('Password recovery flow coming soon!')} className="text-xs text-gray-500 hover:text-black transition font-medium cursor-pointer">
                Forgot password?
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-3 text-sm font-medium transition disabled:opacity-50 border cursor-pointer bg-black text-white hover:bg-gray-800 border-black">
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-gray-500">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="font-semibold text-black hover:underline cursor-pointer">
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}