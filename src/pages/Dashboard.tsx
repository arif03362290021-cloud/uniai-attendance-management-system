import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Calendar,
  FileCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, role } = useAuth();
  const {
    students,
    teachers,
    departments,
    classes,
    attendance,
    timetable,
    getStudentSummary,
    getAtRiskStudents
  } = useData();

  const navigate = useNavigate();

  // Find active student if role === student
  const activeStudent = role === 'student' ? students.find(s => s.userId === user?.id) || students[0] : null;
  const studentSummary = activeStudent ? getStudentSummary(activeStudent.id) : null;
  const atRiskList = getAtRiskStudents(75);

  // Overall campus average calculation
  const totalLogs = attendance.length;
  const presentsCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const campusAverage = totalLogs > 0 ? Math.round((presentsCount / totalLogs) * 100) : 88.4;

  return (
    <div className="space-y-6">

      {/* Header Banner / Bento Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">University Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Academic Session: Fall 2026 • Real-time Attendance & AI Telemetry</p>
        </div>

        <div className="flex items-center space-x-3">
          {role !== 'student' && (
            <button
              onClick={() => navigate('/take-attendance')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none flex items-center space-x-2 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Take Attendance</span>
            </button>
          )}
          <button
            onClick={() => navigate('/history')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs px-4 py-3 rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Export Logs
          </button>
        </div>
      </div>

      {/* Primary Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Bento Tile 1: Overall Attendance Stat (4 cols) */}
        <div className="md:col-span-6 lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm min-h-[200px]">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 dark:text-slate-500 font-extrabold uppercase text-[10px] tracking-widest">Overall Attendance</span>
            <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-xl">
              +2.4% vs Last Mo
            </span>
          </div>

          <div className="flex items-end justify-between space-x-3 my-4">
            <span className="text-5xl sm:text-6xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">
              {role === 'student' && studentSummary ? `${studentSummary.percentage}%` : `${campusAverage}%`}
            </span>
            <div className="w-16 h-12 flex space-x-1.5 items-end shrink-0 pb-1">
              <div className="w-3 bg-indigo-200 dark:bg-indigo-900 rounded-md h-1/2"></div>
              <div className="w-3 bg-indigo-300 dark:bg-indigo-800 rounded-md h-3/4"></div>
              <div className="w-3 bg-indigo-600 rounded-md h-full"></div>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
            {role === 'student'
              ? `You have attended ${studentSummary?.presents || 0} out of ${studentSummary?.totalClasses || 0} sessions.`
              : `Threshold achieved across ${departments.length} departments. Computer Science leads at 94%.`}
          </p>
        </div>

        {/* Bento Tile 2 & 3: Quick Stats (2 cols each = 4 cols total) */}
        <div className="md:col-span-6 lg:col-span-4 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">Total Scholars</span>
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{students.length}</span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-1">Active Enrolled</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-center shadow-sm">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">Active Faculty</span>
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{teachers.length}</span>
            <span className="text-[10px] text-emerald-500 font-bold mt-1">100% Present</span>
          </div>

          <div className="col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Short Attendance Risk</span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{atRiskList.length} Students &lt;75%</span>
            </div>
            <div className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Bento Tile 4: AI Assistant Feature Card (4 cols) */}
        <div className="md:col-span-12 lg:col-span-4 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-6 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            <span className="font-bold tracking-tight text-sm">UniAI Assistant</span>
            <span className="bg-yellow-400 text-slate-900 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ml-auto">Active</span>
          </div>

          <div className="space-y-3 my-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 text-xs">
              <p className="text-indigo-200 font-bold text-[10px] uppercase mb-0.5">Live Predictive Context</p>
              Predict attendance trends for the CS department next week.
            </div>
            <div className="bg-indigo-600 rounded-2xl p-3.5 text-xs">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse"></div>
                <span className="font-bold">Analysis Result</span>
              </div>
              Expect high attendance across CS modules. 2 scholars require follow-up for safe 75% thresholds.
            </div>
          </div>

          <div className="mt-2 p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
            <span className="text-xs text-indigo-200">Ask UniAI in English or Urdu...</span>
            <button
              onClick={() => navigate('/take-attendance')}
              className="bg-white text-indigo-900 rounded-xl p-1.5 font-bold hover:bg-indigo-50 transition"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bento Tile 5: Today's Active Classes (6 cols) */}
        <div className="md:col-span-12 lg:col-span-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Today's Active Classes</h3>
            </div>
            <Link to="/timetable" className="text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:underline">
              View Timetable
            </Link>
          </div>

          <div className="p-3 space-y-2">
            {timetable.slice(0, 3).map((t, idx) => (
              <div
                key={t.id}
                className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl flex items-center space-x-4 border border-slate-100 dark:border-slate-800/60 transition"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  idx === 0 ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300' :
                  idx === 1 ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {t.courseCode.slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{t.courseName}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t.roomNumber} • {t.timeSlot}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 block">Status</span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                    {idx === 0 ? 'Present (42/45)' : idx === 1 ? 'Ongoing' : 'Scheduled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Tile 6: Weekly Patterns Bar Chart (6 cols) */}
        <div className="md:col-span-12 lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Weekly Attendance Patterns</h3>
            <span className="text-[10px] font-bold text-slate-400">Mon - Fri Sessions</span>
          </div>

          <div className="h-32 flex items-end justify-between space-x-3 px-2">
            {[
              { day: 'Mon', pct: 85, h: '85%' },
              { day: 'Tue', pct: 92, h: '92%' },
              { day: 'Wed', pct: 88, h: '88%' },
              { day: 'Thu', pct: 95, h: '95%' },
              { day: 'Fri', pct: 78, h: '78%' },
            ].map((bar, i) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center space-y-2 h-full justify-end">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl relative overflow-hidden flex items-end" style={{ height: bar.h }}>
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      i === 3 ? 'bg-indigo-600' : i === 4 ? 'bg-rose-500' : 'bg-indigo-400'
                    }`}
                    style={{ height: '100%' }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
            <span>Peak Day: Thursday (95%)</span>
            <span>Lowest: Friday (78%)</span>
          </div>
        </div>

        {/* Bento Tile 7: At-Risk Table (12 cols) */}
        <div className="col-span-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-rose-500/10 rounded-2xl text-rose-500">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-slate-100">At-Risk Scholars (&lt;75% Threshold)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Students requiring official academic warning notices or parental advisories</p>
              </div>
            </div>
            <Link to="/reports" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1">
              <span>View Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Program & Semester</th>
                  <th className="py-3 px-4">Attendance %</th>
                  <th className="py-3 px-4">Classes Missed</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {atRiskList.map(({ student, summary }) => (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">{student.rollNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{student.programName} (Sem {student.semester})</td>
                    <td className="py-3.5 px-4 font-black text-rose-600 dark:text-rose-400">{summary.percentage}%</td>
                    <td className="py-3.5 px-4 text-slate-500">{summary.absents} absents recorded</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert(`Warning notice issued for ${student.firstName} ${student.lastName}`)}
                        className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl font-bold transition text-[11px]"
                      >
                        Issue Warning Notice
                      </button>
                    </td>
                  </tr>
                ))}
                {atRiskList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-400">All students are currently above the 75% attendance threshold!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
