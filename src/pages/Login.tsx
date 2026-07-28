import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  GraduationCap,
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  Sparkles,
  Bot
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState('ayesha.ahmed@student.edu');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, selectedRole);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (demoRole: UserRole, demoEmail: string) => {
    setSelectedRole(demoRole);
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">

        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">UniAI Enterprise</h1>
          <p className="text-xs text-slate-400">University Attendance & Academic Intelligence System</p>
        </div>

        {/* Quick Demo Credentials */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Select Demo Persona to Test:</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold">
            <button
              onClick={() => setDemoAccount('student', 'ayesha.ahmed@student.edu')}
              className={`p-2 rounded-xl border text-left transition ${selectedRole === 'student' ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}
            >
              🎓 Student
            </button>

            <button
              onClick={() => setDemoAccount('teacher', 'tariq.mahmood@university.edu')}
              className={`p-2 rounded-xl border text-left transition ${selectedRole === 'teacher' ? 'bg-blue-600/20 border-blue-500/40 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}
            >
              👨‍🏫 Teacher
            </button>

            <button
              onClick={() => setDemoAccount('admin', 'admin@university.edu')}
              className={`p-2 rounded-xl border text-left transition ${selectedRole === 'admin' ? 'bg-amber-600/20 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}
            >
              🏛️ Admin
            </button>

            <button
              onClick={() => setDemoAccount('super_admin', 'superadmin@university.edu')}
              className={`p-2 rounded-xl border text-left transition ${selectedRole === 'super_admin' ? 'bg-rose-600/20 border-rose-500/40 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}
            >
              🛡️ Super Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-3 rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition active:scale-95"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-[10px] text-slate-500">
          Protected by Enterprise JWT Authentication & Geofenced Security
        </div>

      </div>
    </div>
  );
};
