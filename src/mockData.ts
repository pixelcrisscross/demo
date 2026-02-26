import { User, Job, Notification } from './types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  role: 'student',
  email: 'alex.j@university.edu',
  avatar: 'https://picsum.photos/seed/alex/200/200'
};

export const mockJobs: Job[] = [
  {
    id: 'j1',
    title: 'Frontend Engineer',
    company: 'TechFlow',
    location: 'Remote',
    salary: '$120k - $150k',
    type: 'Full-time',
    postedAt: '2 days ago',
    matchScore: 94
  },
  {
    id: 'j2',
    title: 'Product Designer',
    company: 'CreativeCo',
    location: 'New York, NY',
    salary: '$110k - $140k',
    type: 'Full-time',
    postedAt: '5 hours ago',
    matchScore: 88
  },
  {
    id: 'j3',
    title: 'Software Intern',
    company: 'FutureSystems',
    location: 'San Francisco, CA',
    salary: '$40/hr',
    type: 'Internship',
    postedAt: '1 week ago',
    matchScore: 72
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Interview Scheduled',
    message: 'Your interview with TechFlow is set for tomorrow at 10 AM.',
    time: '2h ago',
    read: false,
    type: 'success'
  },
  {
    id: 'n2',
    title: 'New Job Match',
    message: 'A new Frontend role at InnovateAI matches 95% of your profile.',
    time: '5h ago',
    read: false,
    type: 'info'
  }
];
