import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  BookOpen,
  Plus,
  Building2,
  Users,
  Clock,
  GraduationCap,
  X
} from 'lucide-react';

export const ClassesPage: React.FC = () => {
  const { classes, courses, teachers, addCourse, addClass } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'courses'>('sections');

  // Form states
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [creditHours, setCreditHours] = useState(3);
  const [semester, setSemester] = useState(6);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !courseName) return;

    addCourse({
      code: courseCode,
      name: courseName,
      creditHours,
      semester,
      programId: 'prog-1',
      programName: 'BS Computer Science'
    });

    setCourseCode('');
    setCourseName('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Classes & Course Catalog</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage active class sections, course offerings, credit hours, and assigned instructors</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'sections'
              ? 'bg-blue-600 text-white'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Active Class Sections ({classes.length})
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'courses'
              ? 'bg-blue-600 text-white'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Course Catalog ({courses.length})
        </button>
      </div>

      {/* Sections View */}
      {activeTab === 'sections' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 hover:border-blue-500 transition">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-extrabold uppercase">{cls.courseCode}</span>
                <span className="text-xs font-bold text-slate-400">{cls.section}</span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{cls.courseName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                  <span>{cls.teacherName}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cls.roomNumber} ({cls.building})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cls.startTime} - {cls.endTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Courses Catalog View */}
      {activeTab === 'courses' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Course Code</th>
                  <th className="py-3 px-4">Course Title</th>
                  <th className="py-3 px-4">Credit Hours</th>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4">Degree Program</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{c.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100">{c.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{c.creditHours} Credits</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">Semester {c.semester}</td>
                    <td className="py-3.5 px-4 text-slate-500">{c.programName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-base">Add New Course to Catalog</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Course Code (e.g. CS-402)</label>
                <input
                  type="text"
                  required
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. CS-402"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. Mobile Application Development"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Credit Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={creditHours}
                    onChange={(e) => setCreditHours(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
