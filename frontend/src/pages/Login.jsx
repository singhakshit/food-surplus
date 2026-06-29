import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false); // Toggles between Sign In and Sign Up views
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // 1. Handle Email & Password Authentication (Sign In / Sign Up)
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // --- SIGN UP LOGIC ---
        const {  error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName, // Saves the profile name to Supabase
            },
          },
        });
        if (error) throw error;
        alert('🎉 Account created! Please check your email for a verification link.');
      } else {
        // --- SIGN IN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/'); // Redirect to homepage on success
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Google OAuth Authentication
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      alert('Google authentication failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-background px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-sm border border-gray-100 text-left">
        
        {/* Dynamic Title Headers */}
        <h2 className="text-3xl font-bold text-slate-900 mb-1">
          {isSignUp ? 'Join FoodShare' : 'Welcome Back'}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {isSignUp 
            ? 'Create an account to start donating or receiving food' 
            : 'Sign in to your account to continue'}
        </p>

        {/* Input Form Wrapper */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          
          {/* Full Name Field (Only renders if in Sign Up Mode) */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-slate-50 text-slate-900"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Email Input Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-slate-50 text-slate-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent bg-slate-50 text-slate-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg shadow-sm text-center transition-colors focus:outline-none disabled:bg-slate-400 mt-2"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Separator Line */}
        <div className="relative my-6 text-center">
          <hr className="border-slate-200" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-slate-400 uppercase tracking-wider">
            Or continue with
          </span>
        </div>

        {/* Google Authentication Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors disabled:bg-slate-100"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#ea4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.73 5.73 0 0 1 8.2 12.8a5.73 5.73 0 0 1 5.79-5.714c2.53 0 4.381 1.07 5.343 2.01l3.224-3.224C20.583 3.942 17.657 2 13.99 2 7.92 2 3 6.92 3 13s4.92 11 10.99 11c6.333 0 10.514-4.457 10.514-10.714 0-.728-.064-1.285-.2-2H12.24Z"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Bottom Navigation Toggle */}
        <div className="mt-6 text-center text-sm text-slate-600">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button onClick={() => setIsSignUp(false)} className="text-green-700 font-semibold hover:underline bg-transparent border-none p-0">
                Sign in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button onClick={() => setIsSignUp(true)} className="text-green-700 font-semibold hover:underline bg-transparent border-none p-0">
                Sign up
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}