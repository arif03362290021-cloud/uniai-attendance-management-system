export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  isVerified: boolean;
  departmentId?: string;
  departmentName?: string;
  programId?: string;
  programName?: string;
  rollNumber?: string;
  employeeId?: string;
  semester?: number;
  batch?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  studentCount: number;
  teacherCount: number;
}

export interface Program {
  id: string;
  departmentId: string;
  departmentName: string;
  name: string;
  code: string;
  durationYears: number;
}

export interface Course {
  id: string;
  programId: string;
  programName: string;
  name: string;
  code: string;
  creditHours: number;
  semester: number;
}

export interface Teacher {
  id: string;
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  phone: string;
  joiningDate: string;
  assignedCourses: string[];
}

export interface Student {
  id: string;
  userId: string;
  rollNumber: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  departmentName: string;
  programId: string;
  programName: string;
  semester: number;
  batch: string;
  status: 'active' | 'suspended' | 'graduated' | 'leave';
  phone: string;
  avatar?: string;
}

export interface ClassSection {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  teacherId: string;
  teacherName: string;
  semester: number;
  section: string;
  roomNumber: string;
  building: string;
  scheduleDay: string;
  startTime: string;
  endTime: string;
  enrolledStudentsCount: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: string;
  qrScanned?: boolean;
  gpsVerified?: boolean;
}

export interface AttendanceSummary {
  totalClasses: number;
  presents: number;
  absents: number;
  lates: number;
  leaves: number;
  percentage: number;
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string;
  courseCode: string;
  courseName: string;
  teacherName: string;
  roomNumber: string;
  building: string;
  section: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'announcement';
  date: string;
  read: boolean;
  targetRole?: UserRole | 'all';
}

export interface Holiday {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: 'National' | 'Religious' | 'Academic' | 'Administrative';
  description: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  timestamp: string;
  details?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isUrdu?: boolean;
}

export interface AIResponseData {
  text: string;
  suggestions?: string[];
  analytics?: {
    attendanceRate: number;
    classesMissed: number;
    classesAttended: number;
    target75: { action: 'miss' | 'attend'; count: number };
    target80: { action: 'miss' | 'attend'; count: number };
    target90: { action: 'miss' | 'attend'; count: number };
  };
}
