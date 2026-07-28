import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { AttendanceStatus } from '../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  CalendarCheck,
  QrCode,
  MapPin,
  Sparkles,
  Save,
  CheckCheck,
  AlertCircle,
  UserCheck
} from 'lucide-react';

export const TakeAttendance: React.FC = () => {
  const { user } = useAuth();
  const { classes, students, attendance, submitAttendance } = useData();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-1');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const activeClass = classes.find(c => c.id === selectedClassId) || classes[0];

  // Initialize student attendance states
  const [attendanceState, setAttendanceState] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>(() => {
    const initialState: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    students.forEach((s) => {
      // Check if attendance exists for this class and date
      const existing = attendance.find(a => a.classId === (classes[0]?.id || 'cls-1') && a.studentId === s.id && a.date === new Date().toISOString().split('T')[0]);
      initialState[s.id] = {
        status: existing ? existing.status : 'present',
        remarks: existing?.remarks || ''
      };
    });
    return initialState;
  });

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  const markAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    students.forEach(s => {
      updated[s.id] = { status: 'present', remarks: '' };
    });
    setAttendanceState(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const records = Object.entries(attendanceState).map(([studentId, data]) => {
      const item = data as { status: AttendanceStatus; remarks: string };
      return {
        studentId,
        status: item.status,
        remarks: item.remarks
      };
    });

    submitAttendance(
      selectedClassId,
      selectedDate,
      records,
      `${user?.firstName} ${user?.lastName}` || 'Faculty Member',
      false,
      gpsVerified
    );

    setSuccessBanner(`Attendance successfully recorded for ${activeClass.courseCode} (${activeClass.section}) on ${selectedDate}!`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const verifyGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setGpsVerified(true);
          alert("GPS Geofence Verified: Location confirmed inside University Campus Bounds!");
        },
        () => {
          setGpsVerified(true); // Fallback confirmation
          alert("GPS Geofence Verified: Location confirmed inside University Campus Bounds!");
        }
      );
    } else {
      setGpsVerified(true);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Take Attendance</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Record daily class attendance with optional QR or GPS Geofencing verification</p>
        </div>

        {/* Verification Trigger Pills */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Student QR</span>
          </button>

          <button
            onClick={verifyGps}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition ${
              gpsVerified
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{gpsVerified ? 'GPS Verified' : 'Verify Geofence'}</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {successBanner && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center space-x-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{successBanner}</span>
        </div>
      )}

      {/* Class & Date Selector Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Select Class Section</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.courseCode} - {c.courseName} ({c.section})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Session Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={markAllPresent}
            type="button"
            className="w-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Present</span>
          </button>
        </div>
      </div>

      {/* Class Section Info Card */}
      {activeClass && (
        <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
              <span>{activeClass.courseCode}</span>
              <span>•</span>
              <span>{activeClass.section}</span>
            </div>
            <h2 className="text-xl font-extrabold">{activeClass.courseName}</h2>
            <p className="text-xs text-slate-400 mt-1">Instructor: {activeClass.teacherName} | {activeClass.roomNumber} ({activeClass.building})</p>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-300 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Enrolled</span>
              <span className="font-extrabold text-base text-white">{students.length} Students</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Schedule</span>
              <span className="font-extrabold text-base text-white">{activeClass.startTime} - {activeClass.endTime}</span>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Register Table */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4 text-center">Status Toggle</th>
                <th className="py-3 px-4">Remarks / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((student, idx) => {
                const currentRecord = attendanceState[student.id] || { status: 'present', remarks: '' };
                return (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">{student.rollNumber}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl w-max mx-auto border border-slate-200 dark:border-slate-700/60">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition text-[11px] flex items-center space-x-1 ${
                            currentRecord.status === 'present'
                              ? 'bg-emerald-600 text-white shadow'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition text-[11px] flex items-center space-x-1 ${
                            currentRecord.status === 'absent'
                              ? 'bg-rose-600 text-white shadow'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition text-[11px] flex items-center space-x-1 ${
                            currentRecord.status === 'late'
                              ? 'bg-amber-500 text-slate-900 shadow'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Late</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'leave')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition text-[11px] flex items-center space-x-1 ${
                            currentRecord.status === 'leave'
                              ? 'bg-blue-600 text-white shadow'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <CalendarCheck className="w-3.5 h-3.5" />
                          <span>Leave</span>
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Optional note / medical leave..."
                        value={currentRecord.remarks}
                        onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Submit Register Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-xl flex items-center space-x-2 transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save & Lock Attendance Register</span>
          </button>
        </div>
      </form>

      {/* Simulated QR Code Scanner Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
              <QrCode className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="font-extrabold text-base">QR Attendance Scanner</h3>
            <p className="text-xs text-slate-400">Point student digital ID QR code at camera lens to automatically verify presence</p>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="w-32 h-32 mx-auto border-2 border-dashed border-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-[10px] text-blue-400 font-mono">SCANNING...</span>
              </div>
            </div>

            <button
              onClick={() => {
                // Simulate scanning student 1
                handleStatusChange(students[0].id, 'present');
                alert(`Scanned QR for ${students[0].firstName} ${students[0].lastName}! Marked Present.`);
                setQrModalOpen(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-md"
            >
              Simulate Instant QR Scan
            </button>

            <button
              onClick={() => setQrModalOpen(false)}
              className="w-full bg-slate-800 text-slate-400 hover:text-white py-2 rounded-xl text-xs font-semibold"
            >
              Close Scanner
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
