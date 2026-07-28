import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Clock, Building2, User, BookOpen } from 'lucide-react';

export const TimetablePage: React.FC = () => {
  const { timetable } = useData();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const [selectedDay, setSelectedDay] = useState('Monday');

  const filteredItems = timetable.filter(t => t.day === selectedDay);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">University Class Timetable</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Weekly lecture schedules, lecture hall allocations, and timings</p>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 ${
              selectedDay === day
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 uppercase">{item.courseCode}</span>
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>{item.timeSlot}</span>
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{item.courseName}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Instructor: {item.teacherName}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.roomNumber} ({item.building})</span>
              </span>
              <span className="font-bold text-slate-700 dark:text-slate-300">Section {item.section}</span>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-xs font-medium">
            No scheduled classes for {selectedDay}. Enjoy your academic recess!
          </div>
        )}
      </div>

    </div>
  );
};
