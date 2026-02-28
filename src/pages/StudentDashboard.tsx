import React, { Suspense, lazy, useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  FileText, 
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Search,
  MapPin,
  DollarSign,
  BookOpen,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Loader2
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { StatCard, Button } from '../components/UI';
import { AIChatPanel } from '../components/AIChatPanel';
import { jobService, userService } from '../services/api';
import { socket } from '../services/socket';
import { auth } from '../lib/firebase';

const Spline = lazy(() => import('@splinetool/react-spline'));

const chartData = [
  { name: 'Jan', score: 65 },
  { name: 'Feb', score: 72 },
  { name: 'Mar', score: 68 },
  { name: 'Apr', score: 85 },
  { name: 'May', score: 92 },
  { name: 'Jun', score: 94 },
];

const skillData = [
  { name: 'React', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'UI Design', level: 70 },
  { name: 'Node.js', level: 60 },
  { name: 'Python', level: 45 },
];

export const StudentDashboard: React.FC = () => {
  const { tab } = useParams();
  const [jobs, setJobs] = useState<any[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState({ name: '', bio: '' });

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const [jobsRes, studentRes] = await Promise.all([
        jobService.getAll(),
        userService.getProfile(user.uid)
      ]);
      setJobs(jobsRes.data);
      setStudent(studentRes.data);
      setEditForm({
        name: studentRes.data?.name || '',
        bio: studentRes.data?.bio || ''
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    socket.on('job:created', (newJob) => {
      setJobs((prev) => [newJob, ...prev]);
    });

    socket.on('job:deleted', (jobId) => {
      setJobs((prev) => prev.filter(j => j._id !== jobId));
    });

    return () => {
      socket.off('job:created');
      socket.off('job:deleted');
    };
  }, []);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleApply = async (job: any) => {
    const jobId = job._id || job.id;
    if (!jobId || isProcessing) return;
    const user = auth.currentUser;
    if (!user) return;
    setIsProcessing(true);
    try {
      await jobService.apply(jobId, user.uid);
      alert('Application submitted successfully!');
      fetchData(); // Refresh to show updated application count
    } catch (err) {
      console.error('Failed to apply', err);
      alert('Failed to submit application.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    try {
      await userService.update(user.uid, editForm);
      alert('Profile updated successfully!');
      fetchData();
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile.');
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white/[0.03] p-10 rounded-[40px] border border-white/10 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">
              HELLO, <span className="text-primary">{student?.name?.toUpperCase() || 'ALEX'}.</span>
            </h1>
            <p className="text-white/40 text-lg leading-relaxed">
              Your career trajectory is up {student?.profileStrength || 12}% this month. You have {student?.applications?.length || 0} active applications.
            </p>
            <div className="flex gap-4 mt-8">
              <button className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform">
                Optimize Resume
              </button>
              <button className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-white/10 transition-all">
                Skill Scan
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* 3D Interactive Element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block pointer-events-auto">
          <Suspense fallback={<div className="w-full h-full bg-white/5 animate-pulse" />}>
            {/* @ts-ignore */}
            <spline-viewer url="https://prod.spline.design/6Wq1Q7YGyVuC8u6j/scene.splinecode" />
          </Suspense>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20 pointer-events-none" />
          {/* Watermark Hider */}
          <div className="absolute bottom-0 right-0 w-48 h-12 bg-black z-10 pointer-events-none" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Profile Strength", value: `${student?.profileStrength || 94}%`, change: "+12%", icon: TrendingUp, color: "text-primary" },
          { title: "Applications", value: student?.applications?.length || "24", change: "+4", icon: Briefcase, color: "text-blue-400" },
          { title: "Interviews", value: "3", change: "+1", icon: Clock, color: "text-orange-400" },
          { title: "Offers", value: "1", change: "0", icon: CheckCircle, color: "text-secondary" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white/[0.03] p-8 rounded-[32px] border border-white/10 backdrop-blur-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</p>
            <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analytics */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/[0.03] p-8 rounded-[40px] border border-white/10 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-black text-2xl tracking-tighter uppercase">Skill Growth</h3>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C4DFF" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#7C4DFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 12}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#111', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}
                    itemStyle={{color: '#fff'}}
                  />
                  <Area type="monotone" dataKey="score" stroke="#7C4DFF" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recommended Jobs */}
            <div className="bg-white/[0.03] p-8 rounded-[40px] border border-white/10 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-xl tracking-tighter uppercase">Top Matches</h3>
                <Link to="/student/jobs" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All</Link>
              </div>
              <div className="space-y-6">
                {jobs.slice(0, 3).map((job) => (
                  <div key={job._id} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white font-black group-hover:bg-primary transition-colors">
                        {job.company[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold group-hover:text-primary transition-colors">{job.title}</p>
                        <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest font-bold">{job.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black">
                        {job.matchScore || 90}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="bg-white/[0.03] p-8 rounded-[40px] border border-white/10 backdrop-blur-xl">
              <h3 className="font-black text-xl tracking-tighter uppercase mb-8">Proficiency</h3>
              <div className="space-y-6">
                {skillData.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                      <span className="text-white/60">{skill.name}</span>
                      <span className="text-primary">{skill.level}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(124,77,255,0.5)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="space-y-8">
          <div className="h-[550px] bg-white/[0.03] rounded-[40px] border border-white/10 overflow-hidden backdrop-blur-xl">
            <AIChatPanel />
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black tracking-tighter uppercase">Opportunities <span className="text-primary">For You</span></h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              className="bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-primary transition-all"
              placeholder="Search jobs..."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <motion.div
            key={job._id || job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] p-8 rounded-[40px] border border-white/10 backdrop-blur-xl group hover:border-primary/50 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-2xl font-black group-hover:bg-primary transition-colors">
                {job.company[0]}
              </div>
              <div className="px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest">
                {job.matchScore || 95}% Match
              </div>
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-6">{job.company}</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <MapPin size={16} className="text-primary" />
                {job.location}
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <DollarSign size={16} className="text-primary" />
                {job.salary || '$80k - $120k'}
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <Clock size={16} className="text-primary" />
                {job.type} • {job.experienceLevel || 'Entry Level'}
              </div>
              {job.skillsRequired && job.skillsRequired.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {job.skillsRequired.slice(0, 3).map((skill: string) => (
                    <span key={skill} className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-white/40 font-bold uppercase tracking-widest">
                      {skill}
                    </span>
                  ))}
                  {job.skillsRequired.length > 3 && <span className="text-[10px] text-white/20 font-bold">+{job.skillsRequired.length - 3}</span>}
                </div>
              )}
            </div>

            <button 
              disabled={isProcessing}
              onClick={() => handleApply(job)}
              className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-full font-black text-sm hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Apply Now'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderLearning = () => (
    <div className="space-y-8">
      <h2 className="text-4xl font-black tracking-tighter uppercase">AI <span className="text-primary">Learning Path</span></h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {[
            { title: 'Frontend Mastery', progress: 75, modules: 12, icon: Globe },
            { title: 'Backend Architecture', progress: 30, modules: 8, icon: BookOpen },
            { title: 'UI/UX Principles', progress: 90, modules: 15, icon: Sparkles },
          ].map((path, i) => (
            <div key={i} className="bg-white/[0.03] p-8 rounded-[40px] border border-white/10 backdrop-blur-xl flex items-center justify-between group">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <path.icon size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tighter mb-2">{path.title}</h3>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{path.modules} Modules • {path.progress}% Complete</p>
                </div>
              </div>
              <div className="text-right">
                <button className="p-4 bg-white/5 rounded-2xl hover:bg-primary transition-all">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-primary/10 p-10 rounded-[40px] border border-primary/20">
          <h3 className="text-2xl font-black tracking-tighter uppercase mb-6">Next <span className="text-primary">Up</span></h3>
          <div className="p-6 bg-black/40 rounded-3xl border border-white/5 mb-6">
            <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">Module 4</p>
            <h4 className="text-lg font-bold mb-4">Advanced React Patterns</h4>
            <button className="w-full bg-primary text-white py-3 rounded-full font-black text-xs">Resume Learning</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNetwork = () => (
    <div className="space-y-8">
      <h2 className="text-4xl font-black tracking-tighter uppercase">Professional <span className="text-primary">Network</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Sarah Chen', role: 'Senior Dev @ Google', avatar: 'https://picsum.photos/seed/sarah/200' },
          { name: 'Marcus Bell', role: 'CTO @ TechFlow', avatar: 'https://picsum.photos/seed/marcus/200' },
          { name: 'Elena Rodriguez', role: 'Product Lead @ Meta', avatar: 'https://picsum.photos/seed/elena/200' },
          { name: 'David Kim', role: 'Staff Engineer @ Uber', avatar: 'https://picsum.photos/seed/david/200' },
        ].map((person, i) => (
          <div key={i} className="bg-white/[0.03] p-8 rounded-[40px] border border-white/10 backdrop-blur-xl text-center group">
            <img src={person.avatar} className="w-24 h-24 rounded-[32px] mx-auto mb-6 object-cover border-2 border-white/5 group-hover:border-primary transition-all" />
            <h4 className="text-xl font-black tracking-tighter mb-1">{person.name}</h4>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-6">{person.role}</p>
            <div className="flex justify-center gap-3">
              <button className="p-3 bg-white/5 rounded-xl hover:bg-primary transition-all"><Linkedin size={16} /></button>
              <button className="p-3 bg-white/5 rounded-xl hover:bg-primary transition-all"><Github size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-4xl font-black tracking-tighter uppercase">Account <span className="text-primary">Settings</span></h2>
      <form onSubmit={handleUpdateProfile} className="bg-white/[0.03] p-10 rounded-[40px] border border-white/10 backdrop-blur-xl space-y-10">
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Full Name</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary" 
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Email Address</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary opacity-50" value={student?.email} disabled />
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Bio</label>
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary h-32 resize-none" 
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
          />
        </div>
        <div className="flex justify-end pt-6">
          <button type="submit" className="bg-primary text-white px-10 py-4 rounded-full font-black text-sm hover:scale-105 transition-transform">Save Changes</button>
        </div>
      </form>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="p-8">
      {tab === 'jobs' ? renderJobs() :
       tab === 'learning' ? renderLearning() :
       tab === 'network' ? renderNetwork() :
       tab === 'settings' ? renderSettings() :
       renderOverview()}
    </div>
  );
};
