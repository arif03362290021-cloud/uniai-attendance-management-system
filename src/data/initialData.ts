import {
  User,
  Department,
  Program,
  Course,
  Teacher,
  Student,
  ClassSection,
  AttendanceRecord,
  TimetableEntry,
  SystemNotification,
  Holiday,
  ActivityLog
} from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Computer Science & IT', code: 'CSIT', headName: 'Dr. Tariq Mahmood', studentCount: 420, teacherCount: 18 },
  { id: 'dept-2', name: 'Electrical Engineering', code: 'EE', headName: 'Dr. Sarah Ahmed', studentCount: 280, teacherCount: 14 },
  { id: 'dept-3', name: 'Software Engineering', code: 'SE', headName: 'Prof. Junaid Iqbal', studentCount: 350, teacherCount: 16 },
  { id: 'dept-4', name: 'Business Administration', code: 'BBA', headName: 'Dr. Ayesha Malik', studentCount: 310, teacherCount: 12 },
];

export const INITIAL_PROGRAMS: Program[] = [
  { id: 'prog-1', departmentId: 'dept-1', departmentName: 'Computer Science & IT', name: 'BS Computer Science', code: 'BSCS', durationYears: 4 },
  { id: 'prog-2', departmentId: 'dept-3', departmentName: 'Software Engineering', name: 'BS Software Engineering', code: 'BSSE', durationYears: 4 },
  { id: 'prog-3', departmentId: 'dept-2', departmentName: 'Electrical Engineering', name: 'BS Electrical Engineering', code: 'BSEE', durationYears: 4 },
  { id: 'prog-4', departmentId: 'dept-4', departmentName: 'Business Administration', name: 'Bachelor of Business Admin', code: 'BBA', durationYears: 4 },
];

export const INITIAL_COURSES: Course[] = [
  { id: 'crs-1', programId: 'prog-1', programName: 'BS Computer Science', name: 'Advanced Software Engineering', code: 'CS-401', creditHours: 3, semester: 6 },
  { id: 'crs-2', programId: 'prog-1', programName: 'BS Computer Science', name: 'Database Systems & SQL', code: 'CS-302', creditHours: 4, semester: 6 },
  { id: 'crs-3', programId: 'prog-1', programName: 'BS Computer Science', name: 'Artificial Intelligence & ML', code: 'CS-405', creditHours: 3, semester: 6 },
  { id: 'crs-4', programId: 'prog-2', programName: 'BS Software Engineering', name: 'Cloud Computing & DevOps', code: 'SE-402', creditHours: 3, semester: 6 },
  { id: 'crs-5', programId: 'prog-2', programName: 'BS Software Engineering', name: 'Web Application Security', code: 'SE-308', creditHours: 3, semester: 6 },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-sadmin',
    email: 'superadmin@university.edu',
    firstName: 'System',
    lastName: 'SuperAdmin',
    role: 'super_admin',
    isVerified: true,
    phone: '+92 300 1112233',
    employeeId: 'SA-001'
  },
  {
    id: 'u-admin',
    email: 'admin@university.edu',
    firstName: 'Registrar',
    lastName: 'Admin',
    role: 'admin',
    isVerified: true,
    phone: '+92 300 2223344',
    employeeId: 'ADM-102'
  },
  {
    id: 'u-teacher-1',
    email: 'tariq.mahmood@university.edu',
    firstName: 'Dr. Tariq',
    lastName: 'Mahmood',
    role: 'teacher',
    isVerified: true,
    departmentId: 'dept-1',
    departmentName: 'Computer Science & IT',
    employeeId: 'TCH-201',
    phone: '+92 301 3334455'
  },
  {
    id: 'u-teacher-2',
    email: 'sidra.khan@university.edu',
    firstName: 'Prof. Sidra',
    lastName: 'Khan',
    role: 'teacher',
    isVerified: true,
    departmentId: 'dept-1',
    departmentName: 'Computer Science & IT',
    employeeId: 'TCH-202',
    phone: '+92 301 4445566'
  },
  {
    id: 'u-student-1',
    email: 'ayesha.ahmed@student.edu',
    firstName: 'Ayesha',
    lastName: 'Ahmed',
    role: 'student',
    isVerified: true,
    departmentId: 'dept-1',
    departmentName: 'Computer Science & IT',
    programId: 'prog-1',
    programName: 'BS Computer Science',
    rollNumber: 'BSCS-2023-010',
    semester: 6,
    batch: '2023-2027',
    phone: '+92 302 5556677'
  },
  {
    id: 'u-student-2',
    email: 'zain.malik@student.edu',
    firstName: 'Zain',
    lastName: 'Malik',
    role: 'student',
    isVerified: true,
    departmentId: 'dept-1',
    departmentName: 'Computer Science & IT',
    programId: 'prog-1',
    programName: 'BS Computer Science',
    rollNumber: 'BSCS-2023-024',
    semester: 6,
    batch: '2023-2027',
    phone: '+92 302 6667788'
  },
  {
    id: 'u-student-3',
    email: 'fatima.riaz@student.edu',
    firstName: 'Fatima',
    lastName: 'Riaz',
    role: 'student',
    isVerified: true,
    departmentId: 'dept-1',
    departmentName: 'Computer Science & IT',
    programId: 'prog-1',
    programName: 'BS Computer Science',
    rollNumber: 'BSCS-2023-045',
    semester: 6,
    batch: '2023-2027',
    phone: '+92 302 7778899'
  },
  {
    id: 'u-student-4',
    email: 'bilal.siddiqui@student.edu',
    firstName: 'Bilal',
    lastName: 'Siddiqui',
    role: 'student',
    isVerified: true,
    departmentId: 'dept-1',
    departmentName: 'Computer Science & IT',
    programId: 'prog-1',
    programName: 'BS Computer Science',
    rollNumber: 'BSCS-2023-059',
    semester: 6,
    batch: '2023-2027',
    phone: '+92 302 8889900'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-1',
    userId: 'u-teacher-1',
    employeeId: 'TCH-201',
    firstName: 'Tariq',
    lastName: 'Mahmood',
    email: 'tariq.mahmood@university.edu',
    departmentId: 'dept-1',
    departmentName: 'Computer Science & IT',
    designation: 'Associate Professor',
    phone: '+92 301 3334455',
    joiningDate: '2019-08-15',
    assignedCourses: ['CS-401', 'CS-405']
  },
  {
    id: 'tch-2',
    userId: 'u-teacher-2',
    employeeId: 'TCH-202',
    firstName: 'Sidra',
    lastName: 'Khan',
    email: 'sidra.khan@university.edu',
    departmentId: 'dept-1',
    departmentName: 'Computer Science & IT',
    designation: 'Assistant Professor',
    phone: '+92 301 4445566',
    joiningDate: '2021-02-10',
    assignedCourses: ['CS-302']
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    userId: 'u-student-1',
    rollNumber: 'BSCS-2023-010',
    registrationNumber: 'REG-2023-CS-010',
    firstName: 'Ayesha',
    lastName: 'Ahmed',
    email: 'ayesha.ahmed@student.edu',
    departmentId: 'dept-1',
    departmentName: 'Computer Science & IT',
    programId: 'prog-1',
    programName: 'BS Computer Science',
    semester: 6,
    batch: '2023-2027',
    status: 'active',
    phone: '+92 302 5556677'
  },
  {
    id: 'std-2',
    userId: 'u-student-2',
    rollNumber: 'BSCS-2023-024',
    registrationNumber: 'REG-2023-CS-024',
    firstName: 'Zain',
    lastName: 'Malik',
    email: 'zain.malik@student.edu',
    departmentId: 'dept-1',
    departmentName: 'Computer Science & IT',
    programId: 'prog-1',
    programName: 'BS Computer Science',
    semester: 6,
    batch: '2023-2027',
    status: 'active',
    phone: '+92 302 6667788'
  },
  {
    id: 'std-3',
    userId: 'u-student-3',
    rollNumber: 'BSCS-2023-045',
    registrationNumber: 'REG-2023-CS-045',
    firstName: 'Fatima',
    lastName: 'Riaz',
    email: 'fatima.riaz@student.edu',
    departmentId: 'dept-1',
    departmentName: 'Computer Science & IT',
    programId: 'prog-1',
    programName: 'BS Computer Science',
    semester: 6,
    batch: '2023-2027',
    status: 'active',
    phone: '+92 302 7778899'
  },
  {
    id: 'std-4',
    userId: 'u-student-4',
    rollNumber: 'BSCS-2023-059',
    registrationNumber: 'REG-2023-CS-059',
    firstName: 'Bilal',
    lastName: 'Siddiqui',
    email: 'bilal.siddiqui@student.edu',
    departmentId: 'dept-1',
    departmentName: 'Computer Science & IT',
    programId: 'prog-1',
    programName: 'BS Computer Science',
    semester: 6,
    batch: '2023-2027',
    status: 'active',
    phone: '+92 302 8889900'
  }
];

export const INITIAL_CLASSES: ClassSection[] = [
  {
    id: 'cls-1',
    courseId: 'crs-1',
    courseName: 'Advanced Software Engineering',
    courseCode: 'CS-401',
    teacherId: 'tch-1',
    teacherName: 'Dr. Tariq Mahmood',
    semester: 6,
    section: 'BSCS-6A',
    roomNumber: 'Lab 304',
    building: 'CS Block',
    scheduleDay: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    enrolledStudentsCount: 4
  },
  {
    id: 'cls-2',
    courseId: 'crs-2',
    courseName: 'Database Systems & SQL',
    courseCode: 'CS-302',
    teacherId: 'tch-2',
    teacherName: 'Prof. Sidra Khan',
    semester: 6,
    section: 'BSCS-6A',
    roomNumber: 'Room 201',
    building: 'Main Academic Building',
    scheduleDay: 'Tuesday',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    enrolledStudentsCount: 4
  },
  {
    id: 'cls-3',
    courseId: 'crs-3',
    courseName: 'Artificial Intelligence & ML',
    courseCode: 'CS-405',
    teacherId: 'tch-1',
    teacherName: 'Dr. Tariq Mahmood',
    semester: 6,
    section: 'BSCS-6A',
    roomNumber: 'AI Innovation Lab',
    building: 'Tech Complex',
    scheduleDay: 'Wednesday',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    enrolledStudentsCount: 4
  }
];

// Rich attendance log seed data for realistic calculations
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Session 1: 2026-07-20
  { id: 'att-1', classId: 'cls-1', studentId: 'std-1', studentName: 'Ayesha Ahmed', rollNumber: 'BSCS-2023-010', date: '2026-07-20', status: 'present', markedBy: 'Dr. Tariq Mahmood', qrScanned: true },
  { id: 'att-2', classId: 'cls-1', studentId: 'std-2', studentName: 'Zain Malik', rollNumber: 'BSCS-2023-024', date: '2026-07-20', status: 'present', markedBy: 'Dr. Tariq Mahmood' },
  { id: 'att-3', classId: 'cls-1', studentId: 'std-3', studentName: 'Fatima Riaz', rollNumber: 'BSCS-2023-045', date: '2026-07-20', status: 'late', remarks: 'Bus delay', markedBy: 'Dr. Tariq Mahmood' },
  { id: 'att-4', classId: 'cls-1', studentId: 'std-4', studentName: 'Bilal Siddiqui', rollNumber: 'BSCS-2023-059', date: '2026-07-20', status: 'absent', markedBy: 'Dr. Tariq Mahmood' },

  // Session 2: 2026-07-21
  { id: 'att-5', classId: 'cls-2', studentId: 'std-1', studentName: 'Ayesha Ahmed', rollNumber: 'BSCS-2023-010', date: '2026-07-21', status: 'present', markedBy: 'Prof. Sidra Khan' },
  { id: 'att-6', classId: 'cls-2', studentId: 'std-2', studentName: 'Zain Malik', rollNumber: 'BSCS-2023-024', date: '2026-07-21', status: 'absent', markedBy: 'Prof. Sidra Khan' },
  { id: 'att-7', classId: 'cls-2', studentId: 'std-3', studentName: 'Fatima Riaz', rollNumber: 'BSCS-2023-045', date: '2026-07-21', status: 'present', markedBy: 'Prof. Sidra Khan' },
  { id: 'att-8', classId: 'cls-2', studentId: 'std-4', studentName: 'Bilal Siddiqui', rollNumber: 'BSCS-2023-059', date: '2026-07-21', status: 'absent', markedBy: 'Prof. Sidra Khan' },

  // Session 3: 2026-07-22
  { id: 'att-9', classId: 'cls-3', studentId: 'std-1', studentName: 'Ayesha Ahmed', rollNumber: 'BSCS-2023-010', date: '2026-07-22', status: 'present', markedBy: 'Dr. Tariq Mahmood' },
  { id: 'att-10', classId: 'cls-3', studentId: 'std-2', studentName: 'Zain Malik', rollNumber: 'BSCS-2023-024', date: '2026-07-22', status: 'present', markedBy: 'Dr. Tariq Mahmood' },
  { id: 'att-11', classId: 'cls-3', studentId: 'std-3', studentName: 'Fatima Riaz', rollNumber: 'BSCS-2023-045', date: '2026-07-22', status: 'present', markedBy: 'Dr. Tariq Mahmood' },
  { id: 'att-12', classId: 'cls-3', studentId: 'std-4', studentName: 'Bilal Siddiqui', rollNumber: 'BSCS-2023-059', date: '2026-07-22', status: 'leave', remarks: 'Medical Leave Approved', markedBy: 'Dr. Tariq Mahmood' },

  // Session 4: 2026-07-24
  { id: 'att-13', classId: 'cls-1', studentId: 'std-1', studentName: 'Ayesha Ahmed', rollNumber: 'BSCS-2023-010', date: '2026-07-24', status: 'present', markedBy: 'Dr. Tariq Mahmood' },
  { id: 'att-14', classId: 'cls-1', studentId: 'std-2', studentName: 'Zain Malik', rollNumber: 'BSCS-2023-024', date: '2026-07-24', status: 'present', markedBy: 'Dr. Tariq Mahmood' },
  { id: 'att-15', classId: 'cls-1', studentId: 'std-3', studentName: 'Fatima Riaz', rollNumber: 'BSCS-2023-045', date: '2026-07-24', status: 'present', markedBy: 'Dr. Tariq Mahmood' },
  { id: 'att-16', classId: 'cls-1', studentId: 'std-4', studentName: 'Bilal Siddiqui', rollNumber: 'BSCS-2023-059', date: '2026-07-24', status: 'absent', markedBy: 'Dr. Tariq Mahmood' },

  // Session 5: Today 2026-07-26
  { id: 'att-17', classId: 'cls-1', studentId: 'std-1', studentName: 'Ayesha Ahmed', rollNumber: 'BSCS-2023-010', date: '2026-07-26', status: 'present', markedBy: 'Dr. Tariq Mahmood', gpsVerified: true },
  { id: 'att-18', classId: 'cls-1', studentId: 'std-2', studentName: 'Zain Malik', rollNumber: 'BSCS-2023-024', date: '2026-07-26', status: 'present', markedBy: 'Dr. Tariq Mahmood' },
  { id: 'att-19', classId: 'cls-1', studentId: 'std-3', studentName: 'Fatima Riaz', rollNumber: 'BSCS-2023-045', date: '2026-07-26', status: 'late', remarks: '15 mins late', markedBy: 'Dr. Tariq Mahmood' },
  { id: 'att-20', classId: 'cls-1', studentId: 'std-4', studentName: 'Bilal Siddiqui', rollNumber: 'BSCS-2023-059', date: '2026-07-26', status: 'absent', markedBy: 'Dr. Tariq Mahmood' },
];

export const INITIAL_TIMETABLE: TimetableEntry[] = [
  { id: 'tt-1', day: 'Monday', timeSlot: '09:00 AM - 10:30 AM', courseCode: 'CS-401', courseName: 'Advanced Software Eng', teacherName: 'Dr. Tariq Mahmood', roomNumber: 'Lab 304', building: 'CS Block', section: 'BSCS-6A' },
  { id: 'tt-2', day: 'Monday', timeSlot: '11:00 AM - 12:30 PM', courseCode: 'CS-302', courseName: 'Database Systems & SQL', teacherName: 'Prof. Sidra Khan', roomNumber: 'Room 201', building: 'Academic Block', section: 'BSCS-6A' },
  { id: 'tt-3', day: 'Tuesday', timeSlot: '09:00 AM - 10:30 AM', courseCode: 'CS-405', courseName: 'Artificial Intelligence & ML', teacherName: 'Dr. Tariq Mahmood', roomNumber: 'AI Lab', building: 'Tech Complex', section: 'BSCS-6A' },
  { id: 'tt-4', day: 'Wednesday', timeSlot: '02:00 PM - 03:30 PM', courseCode: 'CS-401', courseName: 'Advanced Software Eng', teacherName: 'Dr. Tariq Mahmood', roomNumber: 'Lab 304', building: 'CS Block', section: 'BSCS-6A' },
  { id: 'tt-5', day: 'Thursday', timeSlot: '10:00 AM - 11:30 AM', courseCode: 'CS-302', courseName: 'Database Systems & SQL', teacherName: 'Prof. Sidra Khan', roomNumber: 'Room 201', building: 'Academic Block', section: 'BSCS-6A' },
  { id: 'tt-6', day: 'Friday', timeSlot: '09:00 AM - 11:00 AM', courseCode: 'CS-405', courseName: 'Artificial Intelligence & ML', teacherName: 'Dr. Tariq Mahmood', roomNumber: 'AI Lab', building: 'Tech Complex', section: 'BSCS-6A' },
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Low Attendance Advisory',
    message: 'Bilal Siddiqui (BSCS-2023-059) attendance rate dropped below 75% in CS-401.',
    type: 'alert',
    date: '2026-07-26',
    read: false,
    targetRole: 'teacher'
  },
  {
    id: 'notif-2',
    title: 'Midterm Examination Schedule Released',
    message: 'Fall 2026 Midterm exams commence on August 15th. Check your timetable page.',
    type: 'announcement',
    date: '2026-07-25',
    read: false,
    targetRole: 'all'
  },
  {
    id: 'notif-3',
    title: 'Independence Day Academic Holiday',
    message: 'University campus will remain closed on August 14th for Independence Day.',
    type: 'info',
    date: '2026-07-24',
    read: true,
    targetRole: 'all'
  }
];

export const INITIAL_HOLIDAYS: Holiday[] = [
  { id: 'hol-1', title: 'Independence Day', startDate: '2026-08-14', endDate: '2026-08-14', type: 'National', description: 'National Independence Day Holiday' },
  { id: 'hol-2', title: 'Eid-ul-Milad-un-Nabi', startDate: '2026-09-15', endDate: '2026-09-15', type: 'Religious', description: 'Religious Holiday' },
  { id: 'hol-3', title: 'Semester Break', startDate: '2026-10-01', endDate: '2026-10-07', type: 'Academic', description: 'Mid-term recess for students' },
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'log-1', userId: 'u-teacher-1', userName: 'Dr. Tariq Mahmood', userRole: 'teacher', action: 'Attendance Taken', timestamp: '2026-07-26 09:35 AM', details: 'Marked 4 students for CS-401 section BSCS-6A' },
  { id: 'log-2', userId: 'u-sadmin', userName: 'System SuperAdmin', userRole: 'super_admin', action: 'System Settings Updated', timestamp: '2026-07-25 04:12 PM', details: 'Configured minimum attendance threshold to 75%' },
  { id: 'log-3', userId: 'u-student-1', userName: 'Ayesha Ahmed', userRole: 'student', action: 'UniAI Session Queried', timestamp: '2026-07-26 10:15 AM', details: 'Queried target attendance calculation for 90%' },
];
