import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Department,
  Program,
  Course,
  Teacher,
  Student,
  ClassSection,
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummary,
  TimetableEntry,
  SystemNotification,
  Holiday,
  ActivityLog
} from '../types';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_PROGRAMS,
  INITIAL_COURSES,
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_CLASSES,
  INITIAL_ATTENDANCE,
  INITIAL_TIMETABLE,
  INITIAL_NOTIFICATIONS,
  INITIAL_HOLIDAYS,
  INITIAL_ACTIVITY_LOGS
} from '../data/initialData';

interface DataContextType {
  departments: Department[];
  programs: Program[];
  courses: Course[];
  teachers: Teacher[];
  students: Student[];
  classes: ClassSection[];
  attendance: AttendanceRecord[];
  timetable: TimetableEntry[];
  notifications: SystemNotification[];
  holidays: Holiday[];
  activityLogs: ActivityLog[];
  submitAttendance: (
    classId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[],
    markedBy: string,
    isQr?: boolean,
    isGps?: boolean
  ) => void;
  getStudentSummary: (studentId: string) => AttendanceSummary & {
    target75: { action: 'miss' | 'attend'; count: number };
    target80: { action: 'miss' | 'attend'; count: number };
    target90: { action: 'miss' | 'attend'; count: number };
  };
  getAtRiskStudents: (threshold?: number) => {
    student: Student;
    summary: AttendanceSummary;
  }[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  addClass: (cls: Omit<ClassSection, 'id'>) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Omit<SystemNotification, 'id' | 'read'>) => void;
  logActivity: (userName: string, role: any, action: string, details?: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('uniai_departments');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [programs, setPrograms] = useState<Program[]>(() => {
    const saved = localStorage.getItem('uniai_programs');
    return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('uniai_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('uniai_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('uniai_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [classes, setClasses] = useState<ClassSection[]>(() => {
    const saved = localStorage.getItem('uniai_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('uniai_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [timetable] = useState<TimetableEntry[]>(INITIAL_TIMETABLE);

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('uniai_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    const saved = localStorage.getItem('uniai_holidays');
    return saved ? JSON.parse(saved) : INITIAL_HOLIDAYS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('uniai_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('uniai_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('uniai_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('uniai_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('uniai_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('uniai_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('uniai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('uniai_holidays', JSON.stringify(holidays));
  }, [holidays]);

  useEffect(() => {
    localStorage.setItem('uniai_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const logActivity = (userName: string, role: any, action: string, details?: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userId: `u-${userName}`,
      userName,
      userRole: role,
      action,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      details
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const submitAttendance = (
    classId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[],
    markedBy: string,
    isQr = false,
    isGps = false
  ) => {
    setAttendance((prev) => {
      // Filter out existing records for this classId & date
      const otherRecords = prev.filter((r) => !(r.classId === classId && r.date === date));
      const newRecords: AttendanceRecord[] = records.map((rec) => {
        const student = students.find((s) => s.id === rec.studentId);
        return {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          classId,
          studentId: rec.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          rollNumber: student?.rollNumber || 'N/A',
          date,
          status: rec.status,
          remarks: rec.remarks,
          markedBy,
          qrScanned: isQr,
          gpsVerified: isGps,
        };
      });
      return [...otherRecords, ...newRecords];
    });

    logActivity(markedBy, 'teacher', 'Marked Attendance', `Logged attendance for ${records.length} students on ${date}`);
  };

  const getStudentSummary = (studentId: string) => {
    const studentRecords = attendance.filter((a) => a.studentId === studentId);
    const totalClasses = studentRecords.length;
    let presents = 0;
    let absents = 0;
    let lates = 0;
    let leaves = 0;

    studentRecords.forEach((r) => {
      if (r.status === 'present') presents++;
      else if (r.status === 'absent') absents++;
      else if (r.status === 'late') lates++;
      else if (r.status === 'leave') leaves++;
    });

    // 3 lates count as 1 present or partial calculation
    const effectiveAttended = presents + lates;
    const percentage = totalClasses > 0 ? Math.round((effectiveAttended / totalClasses) * 100) : 100;

    const calcProjection = (targetPct: number) => {
      const targetDec = targetPct / 100;
      if (totalClasses === 0) return { action: 'attend' as const, count: 0 };
      const currentRatio = effectiveAttended / totalClasses;

      if (currentRatio >= targetDec) {
        // Can miss classes
        const maxMissable = Math.floor((effectiveAttended - targetDec * totalClasses) / targetDec);
        return { action: 'miss' as const, count: Math.max(0, maxMissable) };
      } else {
        // Must attend future classes
        const needed = Math.ceil((targetDec * totalClasses - effectiveAttended) / (1 - targetDec));
        return { action: 'attend' as const, count: Math.max(0, needed) };
      }
    };

    return {
      totalClasses,
      presents,
      absents,
      lates,
      leaves,
      percentage,
      target75: calcProjection(75),
      target80: calcProjection(80),
      target90: calcProjection(90),
    };
  };

  const getAtRiskStudents = (threshold = 75) => {
    return students
      .map((student) => {
        const summary = getStudentSummary(student.id);
        return { student, summary };
      })
      .filter((item) => item.summary.percentage < threshold && item.summary.totalClasses > 0);
  };

  const addStudent = (newStudent: Omit<Student, 'id'>) => {
    const created: Student = { ...newStudent, id: `std-${Date.now()}` };
    setStudents((prev) => [...prev, created]);
    logActivity('Admin', 'admin', 'Created Student', `${created.firstName} ${created.lastName} (${created.rollNumber})`);
  };

  const addTeacher = (newTeacher: Omit<Teacher, 'id'>) => {
    const created: Teacher = { ...newTeacher, id: `tch-${Date.now()}` };
    setTeachers((prev) => [...prev, created]);
    logActivity('Admin', 'admin', 'Created Teacher', `${created.firstName} ${created.lastName} (${created.employeeId})`);
  };

  const addClass = (newClass: Omit<ClassSection, 'id'>) => {
    const created: ClassSection = { ...newClass, id: `cls-${Date.now()}` };
    setClasses((prev) => [...prev, created]);
    logActivity('Admin', 'admin', 'Created Class Section', `${created.courseCode} - ${created.section}`);
  };

  const addCourse = (newCourse: Omit<Course, 'id'>) => {
    const created: Course = { ...newCourse, id: `crs-${Date.now()}` };
    setCourses((prev) => [...prev, created]);
    logActivity('Admin', 'admin', 'Created Course', `${created.code} - ${created.name}`);
  };

  const addDepartment = (newDept: Omit<Department, 'id'>) => {
    const created: Department = { ...newDept, id: `dept-${Date.now()}` };
    setDepartments((prev) => [...prev, created]);
  };

  const addHoliday = (newHoliday: Omit<Holiday, 'id'>) => {
    const created: Holiday = { ...newHoliday, id: `hol-${Date.now()}` };
    setHolidays((prev) => [...prev, created]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const addNotification = (notif: Omit<SystemNotification, 'id' | 'read'>) => {
    const created: SystemNotification = { ...notif, id: `notif-${Date.now()}`, read: false };
    setNotifications((prev) => [created, ...prev]);
  };

  return (
    <DataContext.Provider
      value={{
        departments,
        programs,
        courses,
        teachers,
        students,
        classes,
        attendance,
        timetable,
        notifications,
        holidays,
        activityLogs,
        submitAttendance,
        getStudentSummary,
        getAtRiskStudents,
        addStudent,
        addTeacher,
        addClass,
        addCourse,
        addDepartment,
        addHoliday,
        markNotificationRead,
        addNotification,
        logActivity,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
