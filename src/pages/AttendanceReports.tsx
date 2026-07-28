import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  FileText,
  Download,
  Filter,
  BarChart2,
  PieChart as PieIcon,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Sparkles
} from 'lucide-react';

export const AttendanceReports: React.FC = () => {
  const { attendance, students, departments, courses } = useData();

  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtered dataset
  const filteredRecords = attendance.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  // Calculate summary metrics
  const total = filteredRecords.length;
  const presents = filteredRecords.filter(r => r.status === 'present').length;
  const absents = filteredRecords.filter(r => r.status === 'absent').length;
  const lates = filteredRecords.filter(r => r.status === 'late').length;
  const leaves = filteredRecords.filter(r => r.status === 'leave').length;

  const presentPercentage = total > 0 ? Math.round(((presents + lates) / total) * 100) : 100;

  // Export to CSV
  const exportCSV = () => {
    const headers = ['Record ID,Student Name,Roll Number,Date,Class Section,Status,Marked By,Remarks\n'];
    const rows = filteredRecords.map(r =>
      `"${r.id}","${r.studentName}","${r.rollNumber}","${r.date}","${r.classId}","${r.status}","${r.markedBy}","${r.remarks || ''}"`
    );
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UniAI_Attendance_Report_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export PDF / Print view
  const triggerPrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Attendance Reports & Analytics</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate, analyze, and export campus-wide attendance audit reports</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel / CSV</span>
          </button>

          <button
            onClick={triggerPrintPDF}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Department Filter</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Course Filter</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.code}: {c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Attendance Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Statuses (Present, Absent, Late, Leave)</option>
            <option value="present">Present Only</option>
            <option value="absent">Absent Only</option>
            <option value="late">Late Only</option>
            <option value="leave">Leave Only</option>
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overall Compliance</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{presentPercentage}%</div>
          <span className="text-[11px] text-slate-400 block mt-1">Based on {total} total session records</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Presents</span>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2">{presents}</div>
          <span className="text-[11px] text-slate-400 block mt-1">{lates} late arrivals included</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Absences</span>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">{absents}</div>
          <span className="text-[11px] text-slate-400 block mt-1">Unexcused missed sessions</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Approved Leaves</span>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">{leaves}</div>
          <span className="text-[11px] text-slate-400 block mt-1">Authorized medical / leave requests</span>
        </div>
      </div>

      {/* Visual Analytics Bar Chart Simulation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-2xl text-indigo-500">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Department Attendance Breakdown</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Comparative attendance performance across university faculties</p>
            </div>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="space-y-3 pt-2">
          {departments.map((dept, index) => {
            const rates = [92, 86, 90, 84];
            const rate = rates[index % rates.length];
            return (
              <div key={dept.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>{dept.name} ({dept.code})</span>
                  <span>{rate}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendance Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">Detailed Attendance Records ({filteredRecords.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Marked By</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">{r.date}</td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">{r.studentName}</td>
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">{r.rollNumber}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      r.status === 'present' ? 'bg-emerald-500/10 text-emerald-500' :
                      r.status === 'absent' ? 'bg-rose-500/10 text-rose-500' :
                      r.status === 'late' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{r.markedBy}</td>
                  <td className="py-3 px-4">
                    {r.qrScanned ? (
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">QR Code</span>
                    ) : r.gpsVerified ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">GPS Geofence</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded">Manual Register</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 italic">{r.remarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
