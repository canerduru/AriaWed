import React, { useState } from 'react';
import { Heart, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('bride');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: 'user-123',
        email,
        name: name || email.split('@')[0],
        role: isLogin && email.includes('admin') ? 'admin' : (isLogin ? 'bride' : role), 
      };
      // Auto-assign admin role if "admin" is in email for demo
      if (email.includes('admin')) mockUser.role = 'admin';
      
      onLogin(mockUser);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex w-1/2 bg-rose-50 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-rose-500/10 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop" 
          alt="Wedding" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white p-12 bg-black/30 backdrop-blur-sm rounded-3xl mx-12">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <Heart fill="white" size={32} />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">Plan Your Perfect Day</h1>
          <p className="text-lg text-white/90">Join thousands of couples and vendors on AriaWed to create unforgettable memories.</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="text-center">
             <div className="lg:hidden w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
              <Heart fill="white" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 font-serif">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 mt-2">
              {isLogin ? 'Sign in to continue planning' : 'Start your wedding journey today'}
            </p>
          </div>

          <div className="bg-slate-50 p-1 rounded-xl flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isLogin ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isLogin ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setRole('bride')} 
                          className={`p-3 border rounded-xl text-center transition-all ${role === 'bride' || role === 'groom' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            <span className="block font-semibold">Couple</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('vendor')}
                          className={`p-3 border rounded-xl text-center transition-all ${role === 'vendor' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                            <span className="block font-semibold">Vendor</span>
                        </button>
                    </div>
                 </div>
                 <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-rose-500 text-white py-3 rounded-xl hover:bg-rose-600 transition-colors flex items-center justify-center gap-2 font-medium shadow-lg shadow-rose-200 disabled:opacity-50"
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-4 text-center">
             <button 
                onClick={() => {
                    setEmail('admin@ariawed.com');
                    setPassword('admin123');
                    setIsLogin(true);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto"
             >
                 <ShieldCheck size={12} /> Demo Admin Login
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};