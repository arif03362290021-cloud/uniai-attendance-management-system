import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  CheckCircle2,
  CalendarDays,
  FileSpreadsheet,
  Users,
  BookOpen,
  Clock,
  Settings,
  UserCheck,
  LogOut,
  Sun,
  Moon,
  Bot,
  ChevronDown,
  GraduationCap,
  Shield,
  Activity
} from 'lucide-react';

interface SidebarProps {
  onOpenUniAI?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenUniAI }) => {
  const { user, role, switchRole, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    setRoleMenuOpen(false);
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'teacher', 'student'] },
    { name: 'Take Attendance', path: '/take-attendance', icon: CheckCircle2, roles: ['super_admin', 'admin', 'teacher'] },
    { name: 'Attendance History', path: '/history', icon: CalendarDays, roles: ['super_admin', 'admin', 'teacher', 'student'] },
    { name: 'Classes & Courses', path: '/classes', icon: BookOpen, roles: ['super_admin', 'admin', 'teacher'] },
    { name: 'Timetable', path: '/timetable', icon: Clock, roles: ['super_admin', 'admin', 'teacher', 'student'] },
    { name: 'User Directory', path: '/users', icon: Users, roles: ['super_admin', 'admin'] },
    { name: 'Reports & Analytics', path: '/reports', icon: FileSpreadsheet, roles: ['super_admin', 'admin', 'teacher', 'student'] },
    { name: 'System Settings', path: '/settings', icon: Settings, roles: ['super_admin', 'admin'] },
    { name: 'My Profile', path: '/profile', icon: UserCheck, roles: ['super_admin', 'admin', 'teacher', 'student'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  const roleLabels: Record<UserRole, { title: string; badge: string; color: string }> = {
    super_admin: { title: 'Super Admin', badge: 'ROOT', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
    admin: { title: 'Administrator', badge: 'ADMIN', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    teacher: { title: 'Faculty / Teacher', badge: 'FACULTY', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    student: { title: 'Student', badge: 'SCHOLAR', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between h-screen sticky top-0 z-30 border-r border-slate-200 dark:border-slate-800 transition-all duration-200">
      <div className="p-6 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none text-white shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">UniPortal</span>
            </div>
            <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Attendance System</p>
          </div>
        </div>

        {/* Role Switcher Bar */}
        <div className="mb-6 relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
          >
            <div className="flex items-center space-x-2.5">
              <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Active Persona</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{roleLabels[role].title}</span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${roleMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {roleMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">Switch View Role</div>
              {(['super_admin', 'admin', 'teacher', 'student'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    role === r ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <span>{roleLabels[r].title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-lg border font-mono ${roleLabels[r].color}`}>
                    {roleLabels[r].badge}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-2xl font-semibold text-xs transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* AI Assistant Trigger Pill */}
        {onOpenUniAI && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onOpenUniAI}
              className="w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white p-3.5 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-between group transition-all duration-200"
            >
              <div className="flex items-center space-x-2.5">
                <div className="bg-white/20 p-1.5 rounded-xl">
                  <Bot className="w-4 h-4 text-yellow-300 animate-pulse" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-xs block text-white">Ask UniAI</span>
                  <span className="text-[10px] text-indigo-200">Attendance Intelligence</span>
                </div>
              </div>
              <span className="bg-yellow-400 text-slate-900 text-[9px] font-extrabold px-2 py-0.5 rounded-full">AI</span>
            </button>
          </div>
        )}
      </div>

      {/* Bento User Profile Card Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-4 text-white shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-sm">
                {user?.firstName?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-slate-400">Logged in as</p>
                <p className="font-bold text-xs truncate text-slate-100">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">{roleLabels[role].badge}_ROLE</span>
            <button
              onClick={logout}
              className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center space-x-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

