import React, { useState, useEffect } from 'react';
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
import { userService } from '../services/api';
import { auth } from '../lib/firebase';

interface SidebarItemProps {
  icon: any;
  label: string;
  path: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, path, active }) => (
  <Link 
    to={path}
    className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group ${
      active 
        ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(124,77,255,0.1)]' 
        : 'text-white/40 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={20} className={active ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </Link>
);

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const role = location.pathname.split('/')[1] || 'student';

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const res = await userService.getProfile(user.uid);
          setProfile(res.data);
        } catch (err) {
          console.error('Failed to fetch profile', err);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Failed to logout', err);
    }
  };

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
    <div className="flex h-screen bg-black text-white overflow-hidden selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-72 bg-black border-r border-white/5 flex flex-col hidden lg:flex relative z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold italic">N</div>
          <span className="text-xl font-black tracking-tighter">NEXUS<span className="text-primary">AI</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems[role as keyof typeof menuItems]?.map((item) => (
            <SidebarItem 
              key={item.path} 
              {...item} 
              active={location.pathname === item.path} 
            />
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <SidebarItem icon={Settings} label="Settings" path={`/${role}/settings`} />
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all duration-300 mt-2"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm tracking-tight">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-black/50 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between z-40">
          <div className="flex items-center gap-6 flex-1">
            <button className="lg:hidden p-2 hover:bg-white/5 rounded-xl">
              <Menu size={20} />
            </button>
            <div className="relative max-w-md w-full hidden md:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search Nexus Intelligence..." 
                className="w-full pl-12 pr-6 py-3 bg-white/[0.03] border border-white/5 rounded-2xl focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-3 text-white/40 hover:bg-white/5 hover:text-white rounded-2xl relative transition-all">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(124,77,255,1)]"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/5 mx-2"></div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black tracking-tight">{profile?.name || 'User'}</p>
                <p className="text-[10px] text-primary uppercase font-black tracking-widest mt-1">{role}</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-primary">
                {profile?.name?.[0] || '?'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-black">
          {children}
        </div>
      </main>
    </div>
  );
};
