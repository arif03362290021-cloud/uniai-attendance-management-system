import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Settings,
  Shield,
  Sliders,
  Calendar,
  Save,
  CheckCircle2,
  Plus
} from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const { holidays, addHoliday } = useData();

  const [minThreshold, setMinThreshold] = useState(75);
  const [gracePeriodMinutes, setGracePeriodMinutes] = useState(15);
  const [universityName, setUniversityName] = useState('Imperial University of Science & Technology');
  const [savedBanner, setSavedBanner] = useState(false);

  // New holiday form
  const [holidayTitle, setHolidayTitle] = useState('');
  const [holidayDate, setHolidayDate] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayTitle || !holidayDate) return;

    addHoliday({
      title: holidayTitle,
      startDate: holidayDate,
      endDate: holidayDate,
      type: 'Academic',
      description: 'Scheduled University Holiday'
    });

    setHolidayTitle('');
    setHolidayDate('');
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">System Configuration & Policies</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure global university attendance rules, thresholds, and academic calendar holidays</p>
      </div>

      {savedBanner && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">System policies successfully updated!</span>
        </div>
      )}

      {/* Policy Settings Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-blue-500" />
          <span>Attendance Policy Rules</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">University Name</label>
            <input
              type="text"
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Minimum Exam Eligibility Attendance Threshold (%)</label>
            <input
              type="number"
              min="50"
              max="100"
              value={minThreshold}
              onChange={(e) => setMinThreshold(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Students below this threshold will be flagged as At-Risk for final examinations.</span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Late Grace Period (Minutes)</label>
            <input
              type="number"
              min="0"
              max="60"
              value={gracePeriodMinutes}
              onChange={(e) => setGracePeriodMinutes(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Arrivals within this window are logged as "Late" instead of "Absent".</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Holiday Calendar Manager */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <span>Academic Holiday & Recess Calendar</span>
        </h3>

        <form onSubmit={handleAddHoliday} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <input
            type="text"
            placeholder="Holiday Title (e.g. Winter Recess)"
            required
            value={holidayTitle}
            onChange={(e) => setHolidayTitle(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="date"
            required
            value={holidayDate}
            onChange={(e) => setHolidayDate(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl flex items-center justify-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Holiday</span>
          </button>
        </form>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-2">
          {holidays.map((h) => (
            <div key={h.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-100 block">{h.title}</span>
                <span className="text-[10px] text-slate-400">{h.description}</span>
              </div>
              <span className="font-mono text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-xl">
                {h.startDate}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
