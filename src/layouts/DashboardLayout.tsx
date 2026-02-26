import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  GraduationCap, 
  Users, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Menu
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { mockUser } from '../mockData';

interface SidebarItemProps {
  icon: any;
  label: string;
  path: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, path, active }) => (
  <Link 
    to={path}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active ? 'sidebar-active' : 'text-text-muted hover:bg-gray-100 hover:text-text-primary'
    }`}
  >
    <Icon size={20} className={active ? 'text-primary' : 'group-hover:text-primary'} />
    <span className="font-medium">{label}</span>
  </Link>
);

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.pathname.split('/')[1] || 'student';

  const menuItems = {
    student: [
      { icon: LayoutDashboard, label: 'Overview', path: '/student' },
      { icon: Briefcase, label: 'Jobs & Internships', path: '/student/jobs' },
      { icon: GraduationCap, label: 'Learning Path', path: '/student/learning' },
      { icon: Users, label: 'Network', path: '/student/network' },
    ],
    college: [
      { icon: LayoutDashboard, label: 'Admin Console', path: '/college' },
      { icon: Users, label: 'Student Directory', path: '/college/students' },
      { icon: Briefcase, label: 'Placement Stats', path: '/college/stats' },
    ],
    recruiter: [
      { icon: LayoutDashboard, label: 'Hiring Pipeline', path: '/recruiter' },
      { icon: Briefcase, label: 'My Jobs', path: '/recruiter/jobs' },
      { icon: Users, label: 'Talent Pool', path: '/recruiter/talent' },
    ]
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col hidden lg:flex">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold italic">N</div>
          <span className="text-xl font-black tracking-tighter text-primary">NEXUS<span className="text-text-primary">AI</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems[role as keyof typeof menuItems]?.map((item) => (
            <SidebarItem 
              key={item.path} 
              {...item} 
              active={location.pathname === item.path} 
            />
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <SidebarItem icon={Settings} label="Settings" path={`/${role}/settings`} />
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 mt-1"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={20} />
            </button>
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search jobs, students, or skills..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-text-muted hover:bg-gray-100 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-border mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{mockUser.name}</p>
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider mt-1">{role}</p>
              </div>
              <img 
                src={mockUser.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-xl object-cover border-2 border-primary/20"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
