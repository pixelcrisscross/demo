import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  TrendingUp,
  Download,
  Filter,
  Search,
  Plus,
  Mail,
  MoreVertical,
  ChevronRight,
  Settings as SettingsIcon,
  Loader2,
  CheckCircle,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useParams } from 'react-router-dom';
import { StatCard, Button } from '../components/UI';
import { userService } from '../services/api';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

const placementData = [
  { name: 'CS', placed: 85, total: 100 },
  { name: 'IT', placed: 78, total: 90 },
  { name: 'ECE', placed: 65, total: 95 },
  { name: 'ME', placed: 45, total: 80 },
  { name: 'EE', placed: 52, total: 85 },
];

const sectorData = [
  { name: 'IT/Software', value: 45 },
  { name: 'Finance', value: 20 },
  { name: 'Core Eng', value: 15 },
  { name: 'Consulting', value: 10 },
  { name: 'Others', value: 10 },
];

const COLORS = ['#7C4DFF', '#C8F902', '#3B82F6', '#F59E0B', '#EF4444'];

export const CollegeDashboard: React.FC = () => {
  const { tab } = useParams();
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', role: 'student', collegeId: 'univ-1' });

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const [studentsRes, profileRes] = await Promise.all([
        userService.getCollegeStudents('univ-1'),
        userService.getProfile(user.uid)
      ]);
      setStudents(studentsRes.data);
      setProfile(profileRes.data);
    } catch (err) {
      console.error('Failed to fetch college data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.create({ ...newStudent, uid: `temp-${Date.now()}` });
      setIsModalOpen(false);
      setNewStudent({ name: '', email: '', role: 'student', collegeId: 'univ-1' });
      fetchData();
      alert('Student added successfully!');
    } catch (err) {
      console.error('Failed to add student', err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !profile) return;
    try {
      await userService.update(user.uid, profile);
      alert('Profile updated successfully!');
      fetchData();
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile.');
    }
  };

  const handleExport = () => {
    alert('Generating placement report... Your download will start shortly.');
  };

  const handleFilter = () => {
    alert('Filter options: Department, Year, Status. (UI coming soon)');
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">University <span className="text-primary">Admin</span></h1>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Placement Season 2025-26 • Active</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExport}
            className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-full font-bold text-xs hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Download size={16} /> Export Report
          </button>
          <button 
            onClick={handleFilter}
            className="bg-primary text-white px-6 py-3 rounded-full font-bold text-xs hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Filter size={16} /> Filter Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Students", value: students.length || "1,240", icon: Users, color: "text-primary" },
          { title: "Placed Students", value: "842", change: "+15%", icon: GraduationCap, color: "text-secondary" },
          { title: "Active Recruiters", value: "48", change: "+12", icon: Building2, color: "text-blue-400" },
          { title: "Avg. Package", value: "$12.4 LPA", change: "+8%", icon: TrendingUp, color: "text-green-400" }
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.03] p-8 rounded-[32px] border border-white/10 backdrop-blur-xl">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              {stat.change && <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">{stat.change}</span>}
            </div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</p>
            <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/[0.03] p-8 rounded-[40px] border border-white/10 backdrop-blur-xl">
          <h3 className="font-black text-xl tracking-tighter uppercase mb-8">Placement by Department</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={placementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 12}} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#111', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)'}} />
                <Bar dataKey="placed" fill="#7C4DFF" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/[0.03] p-8 rounded-[40px] border border-white/10 backdrop-blur-xl relative">
          <h3 className="font-black text-xl tracking-tighter uppercase mb-8">Sector Distribution</h3>
          <div className="h-[350px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#111', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black tracking-tighter">45%</span>
              <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">IT/Software</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black tracking-tighter uppercase">Student <span className="text-primary">Directory</span></h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black px-8 py-4 rounded-full font-black text-sm hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus size={20} /> Add Student
        </button>
      </div>

      <div className="bg-white/[0.03] rounded-[40px] border border-white/10 overflow-hidden backdrop-blur-xl">
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
          <div className="relative group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs focus:outline-none focus:border-primary/50 transition-all font-bold"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] text-white/30 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-5">Name</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Profile Strength</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((student, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black text-primary">
                        {student.name[0]}
                      </div>
                      <span className="font-bold text-sm group-hover:text-primary transition-colors">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-white/40">{student.email}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-[100px]">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${student.profileStrength}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-primary">{student.profileStrength}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest">Active</span>
                  </td>
                  <td className="px-8 py-5">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="space-y-8">
      <h2 className="text-4xl font-black tracking-tighter uppercase">Placement <span className="text-primary">Analytics</span></h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/[0.03] p-10 rounded-[40px] border border-white/10 backdrop-blur-xl">
          <h3 className="text-2xl font-black tracking-tighter uppercase mb-10">Yearly Comparison</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={placementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 12}} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#111', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)'}} />
                <Bar dataKey="placed" fill="#7C4DFF" radius={[8, 8, 0, 0]} barSize={40} />
                <Bar dataKey="total" fill="rgba(255,255,255,0.05)" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white/[0.03] p-10 rounded-[40px] border border-white/10 backdrop-blur-xl">
          <h3 className="text-2xl font-black tracking-tighter uppercase mb-10">Top Recruiters</h3>
          <div className="space-y-8">
            {[
              { name: 'Google', count: 12, pkg: '45 LPA' },
              { name: 'Microsoft', count: 8, pkg: '42 LPA' },
              { name: 'Amazon', count: 15, pkg: '38 LPA' },
              { name: 'Adobe', count: 5, pkg: '40 LPA' },
            ].map((rec, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black group-hover:bg-primary transition-all">{rec.name[0]}</div>
                  <div>
                    <h4 className="font-bold text-sm">{rec.name}</h4>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">{rec.count} Offers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary">{rec.pkg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-4xl font-black tracking-tighter uppercase">University <span className="text-primary">Settings</span></h2>
      <form onSubmit={handleUpdateProfile} className="bg-white/[0.03] p-10 rounded-[40px] border border-white/10 backdrop-blur-xl space-y-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Institution Name</label>
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary" 
            value={profile?.name || ''} 
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Institution Bio</label>
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary h-32 resize-none" 
            value={profile?.bio || ''} 
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
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
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-zinc-900 border border-white/10 p-10 rounded-[40px] w-full max-w-2xl shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 text-white/40 hover:text-white">
                <X size={24} />
              </button>
              <h2 className="text-3xl font-black tracking-tighter uppercase mb-8">Add <span className="text-primary">New Student</span></h2>
              <form onSubmit={handleAddStudent} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Full Name</label>
                  <input 
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors"
                    placeholder="john@univ.edu"
                  />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-5 rounded-full font-black text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-primary/20">
                  Add to Directory
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {tab === 'students' ? renderStudents() :
       tab === 'stats' ? renderStats() :
       tab === 'settings' ? renderSettings() :
       renderOverview()}
    </div>
  );
};
