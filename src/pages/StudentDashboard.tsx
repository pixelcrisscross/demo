import React, { Suspense, lazy } from 'react';
import { 
  TrendingUp, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  FileText, 
  Sparkles,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
import { mockJobs } from '../mockData';

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
  return (
    <div className="space-y-8 bg-black min-h-screen p-8 text-white">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white/[0.03] p-10 rounded-[40px] border border-white/10 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">
              HELLO, <span className="text-primary">ALEX.</span>
            </h1>
            <p className="text-white/40 text-lg leading-relaxed">
              Your career trajectory is up 12% this month. You have 2 interviews scheduled for this week.
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
          { title: "Profile Strength", value: "94%", change: "+12%", icon: TrendingUp, color: "text-primary" },
          { title: "Applications", value: "24", change: "+4", icon: Briefcase, color: "text-blue-400" },
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
              <select className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-bold focus:outline-none hover:bg-white/10 transition-colors">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
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
                {mockJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center justify-between group cursor-pointer">
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
                        {job.matchScore}%
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
          
          {/* Resume Score Card */}
          <div className="bg-primary p-10 rounded-[40px] shadow-2xl shadow-primary/20 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Resume Score</p>
              <h3 className="text-6xl font-black tracking-tighter mb-6">82<span className="text-xl font-normal opacity-40">/100</span></h3>
              <p className="text-sm text-white/80 leading-relaxed mb-8">Your resume is missing key keywords for 'Frontend Engineer' roles.</p>
              <button className="w-full bg-white text-black py-4 rounded-full font-black text-sm hover:scale-[1.02] transition-transform">
                Optimize Now
              </button>
            </div>
            {/* Abstract background shape */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
