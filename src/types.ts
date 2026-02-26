export interface User {
  id: string;
  name: string;
  role: 'student' | 'college' | 'recruiter';
  email: string;
  avatar?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Internship' | 'Contract';
  postedAt: string;
  matchScore?: number;
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Rejected';
  appliedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}
