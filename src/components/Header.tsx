import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Search,
  Bell,
  Clock,
  ShieldCheck,
  Check,
  Sparkles,
  X,
  User,
  BookOpen
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, role } = useAuth();
  const { notifications, markNotificationRead, students, teachers, courses } = useData();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadNotifs = notifications.filter(n => !n.read && (n.targetRole === 'all' || n.targetRole === role));

  const filteredStudents = searchQuery.trim() ? students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.rollNumber} ${s.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4) : [];

  const filteredTeachers = searchQuery.trim() ? teachers.filter(t =>
    `${t.firstName} ${t.lastName} ${t.employeeId} ${t.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3) : [];

  const filteredCourses = searchQuery.trim() ? courses.filter(c =>
    `${c.name} ${c.code}`.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3) : [];

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200 shrink-0">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Global Search Bar */}
        <div className="relative w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students, faculty, or course modules..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-200 dark:border-slate-700/60"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 max-h-96 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Search Results</span>
                <button onClick={() => setSearchOpen(false)} className="text-slate-400 text-xs hover:underline">Close</button>
              </div>

              {/* Students */}
              {filteredStudents.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">Students ({filteredStudents.length})</span>
                  {filteredStudents.map(s => (
                    <div key={s.id} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl flex items-center space-x-3 transition text-xs">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{s.firstName} {s.lastName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.rollNumber} • {s.programName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Teachers */}
              {filteredTeachers.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-1">Teachers ({filteredTeachers.length})</span>
                  {filteredTeachers.map(t => (
                    <div key={t.id} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl flex items-center space-x-3 transition text-xs">
                      <User className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{t.firstName} {t.lastName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{t.employeeId} • {t.designation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Courses */}
              {filteredCourses.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block mb-1">Courses ({filteredCourses.length})</span>
                  {filteredCourses.map(c => (
                    <div key={c.id} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl flex items-center space-x-3 transition text-xs">
                      <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{c.code}: {c.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.creditHours} Credit Hours • Semester {c.semester}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredStudents.length === 0 && filteredTeachers.length === 0 && filteredCourses.length === 0 && (
                <div className="text-center py-4 text-xs text-slate-400">No records found matching "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center space-x-4">

          {/* Operational Status Pill */}
          <div className="bg-slate-100 dark:bg-slate-800/80 rounded-full px-4 py-2 flex items-center space-x-2 border border-slate-200 dark:border-slate-700/80">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Systems Operational</span>
          </div>

          {/* Realtime Clock */}
          <div className="text-right hidden md:block">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>

          {/* Notifications Drawer */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-100">Notifications ({unreadNotifs.length})</span>
                  </div>
                  <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs">Close</button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-2xl border text-xs transition ${
                        n.read
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-60'
                          : 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{n.title}</span>
                        {!n.read && (
                          <button
                            onClick={() => markNotificationRead(n.id)}
                            className="text-indigo-600 hover:text-indigo-700 text-[10px] font-bold flex items-center space-x-0.5 shrink-0"
                          >
                            <Check className="w-3 h-3" />
                            <span>Read</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">{n.message}</p>
                      <span className="text-[9px] text-slate-400 font-mono mt-1 block">{n.date}</span>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-center py-4 text-xs text-slate-400">No new notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
