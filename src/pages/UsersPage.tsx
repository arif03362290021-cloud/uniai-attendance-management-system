import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Users,
  UserPlus,
  Search,
  GraduationCap,
  Shield,
  X,
  Mail,
  Phone,
  BookOpen
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { students, teachers, departments, programs, addStudent, addTeacher } = useData();

  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalType, setModalType] = useState<'student' | 'teacher' | null>(null);

  // Student Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [phone, setPhone] = useState('');

  const filteredStudents = students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.rollNumber} ${s.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeachers = teachers.filter(t =>
    `${t.firstName} ${t.lastName} ${t.employeeId} ${t.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent({
      userId: `u-${Date.now()}`,
      firstName,
      lastName,
      email,
      rollNumber,
      registrationNumber: `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      departmentId: departments[0]?.id || 'dept-1',
      departmentName: departments[0]?.name || 'Computer Science & IT',
      programId: programs[0]?.id || 'prog-1',
      programName: programs[0]?.name || 'BS Computer Science',
      semester: 1,
      batch: '2026-2030',
      status: 'active',
      phone
    });

    setFirstName('');
    setLastName('');
    setEmail('');
    setRollNumber('');
    setModalType(null);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">User Directory & Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage enrolled scholars, faculty profiles, and role privileges</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setModalType('student')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-lg transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'students' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Students ({students.length})
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'teachers' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Teachers / Faculty ({teachers.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, roll, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Students Table */}
      {activeTab === 'students' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Department & Program</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100">{s.firstName} {s.lastName}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{s.rollNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{s.programName} (Sem {s.semester})</td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{s.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-extrabold uppercase">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Teachers Table */}
      {activeTab === 'teachers' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Faculty Name</th>
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100">{t.firstName} {t.lastName}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-500">{t.employeeId}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{t.designation}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{t.departmentName}</td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{t.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {modalType === 'student' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-base">Enroll New Scholar</h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Roll Number (e.g. BSCS-2026-088)</label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 0000000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Enroll Scholar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
