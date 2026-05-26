import React, { useState } from 'react';

export default function RegisterScreen({ onSuccess, onSwitchToLogin }) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (pass.length === 0) {
      setPasswordStrength('');
    } else if (regex.test(pass)) {
      setPasswordStrength('Strong password');
    } else {
      setPasswordStrength('Needs 8+ chars, 1 uppercase, 1 number, 1 special char');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const password = e.target.password.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(password)) {
      setError('Please meet all password constraints before submitting.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('https://innerlift-8wtt.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          password: password,
        })
      });
      const data = await res.json();

      if (res.ok) {
        onSuccess(data);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server connection failed. Make sure your backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-none font-sans" style={{ backgroundColor: '#FFFFFF', color: '#000000' }}>

      {/* Decorative Minimalist Floral Overlay */}
      <svg className="absolute bottom-10 right-10 opacity-10 w-40 h-40 pointer-events-none text-black" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M80 80 Q 50 50 20 80" />
        <path d="M50 65 Q 40 40 60 30" />
        <circle cx="60" cy="30" r="3" fill="currentColor" />
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
          <p className="text-sm text-gray-500">Initialize your profile to begin tracking.</p>
        </div>

        {error && <div className="mb-4 text-xs text-red-500 font-medium text-center">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input name="name" type="text" placeholder="First Name" required className="w-full p-3 border border-gray-300 outline-none focus:border-black text-sm bg-white text-black transition-colors" />
          <input name="email" type="email" placeholder="Email address" required className="w-full p-3 border border-gray-300 outline-none focus:border-black text-sm bg-white text-black transition-colors" />

          <div>
            <input
              name="password"
              type="password"
              placeholder="Create Password"
              onChange={handlePasswordChange}
              required
              className="w-full p-3 border border-gray-300 outline-none focus:border-black text-sm bg-white text-black transition-colors"
            />
            {passwordStrength && (
              <p className={`mt-2 text-xs font-medium ${passwordStrength === 'Strong password' ? 'text-green-600' : 'text-gray-500'}`}>
                {passwordStrength}
              </p>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-3 text-sm font-medium transition disabled:opacity-50 border cursor-pointer bg-black text-white hover:bg-gray-800 border-black">
            {isLoading ? 'Creating Account...' : 'Initialize Profile'}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-gray-500">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-semibold text-black hover:underline cursor-pointer">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}