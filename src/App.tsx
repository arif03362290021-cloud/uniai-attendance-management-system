import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { UniAIAssistant } from './components/UniAIAssistant';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { TakeAttendance } from './pages/TakeAttendance';
import { AttendanceReports } from './pages/AttendanceReports';
import { ClassesPage } from './pages/Classes';
import { TimetablePage } from './pages/Timetable';
import { UsersPage } from './pages/UsersPage';
import { SystemSettings } from './pages/SystemSettings';
import { ProfilePage } from './pages/Profile';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [uniAIOpen, setUniAIOpen] = useState(false);

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar onOpenUniAI={() => setUniAIOpen(true)} />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/take-attendance" element={<TakeAttendance />} />
            <Route path="/history" element={<AttendanceReports />} />
            <Route path="/reports" element={<AttendanceReports />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/timetable" element={<TimetablePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global UniAI Assistant Floating Modal */}
      <UniAIAssistant isOpen={uniAIOpen} onClose={() => setUniAIOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <MainLayout />
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
