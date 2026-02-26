import React, { Suspense } from 'react';
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
import Spline from '@splinetool/react-spline';
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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl card-shadow border border-border/50 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight">Dashboard Overview</h1>
          <p className="text-text-muted text-lg mt-2">Welcome back, Alex! You have 2 interviews this week.</p>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" size="sm">
              <FileText size={18} className="mr-2" /> Resume Editor
            </Button>
            <Button size="sm">
              <Sparkles size={18} className="mr-2" /> AI Skill Scan
            </Button>
          </div>
        </div>
        
        {/* 3D Interactive Element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block pointer-events-auto">
          <Suspense fallback={<div className="w-full h-full bg-gray-50 animate-pulse" />}>
            <Spline scene="https://prod.spline.design/6Wq1Q7YGyVuC8u6j/scene.splinecode" />
          </Suspense>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Profile Strength" value="94%" change="+12%" icon={TrendingUp} color="text-primary" />
        <StatCard title="Applications" value="24" change="+4" icon={Briefcase} color="text-blue-500" />
        <StatCard title="Interviews" value="3" change="+1" icon={Clock} color="text-orange-500" />
        <StatCard title="Offers" value="1" change="0" icon={CheckCircle} color="text-secondary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-2xl card-shadow border border-border/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Skill Growth Index</h3>
              <select className="bg-gray-50 border border-border rounded-lg px-3 py-1 text-sm focus:outline-none">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C4DFF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7C4DFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="score" stroke="#7C4DFF" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recommended Jobs */}
            <div className="bg-card p-6 rounded-2xl card-shadow border border-border/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Top Matches</h3>
                <Link to="/student/jobs" className="text-xs font-bold text-primary hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {mockJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                        {job.company[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-none">{job.title}</p>
                        <p className="text-[10px] text-text-muted mt-1">{job.company} • {job.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/20 text-text-primary text-[10px] font-bold">
                        <Sparkles size={10} /> {job.matchScore}%
                      </div>
                      <p className="text-[10px] text-text-muted mt-1">{job.postedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="bg-card p-6 rounded-2xl card-shadow border border-border/50">
              <h3 className="font-bold mb-4">Skill Proficiency</h3>
              <div className="space-y-4">
                {skillData.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold">{skill.name}</span>
                      <span className="text-text-muted">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4 text-xs">
                Take Assessment <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="space-y-6">
          <div className="h-[500px]">
            <AIChatPanel />
          </div>
          
          {/* Resume Score Card */}
          <div className="bg-primary p-6 rounded-2xl shadow-xl shadow-primary/20 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-primary-foreground/80 text-xs font-bold uppercase tracking-wider mb-1">Resume Score</p>
              <h3 className="text-4xl font-black mb-4">82<span className="text-lg font-normal opacity-60">/100</span></h3>
              <p className="text-sm opacity-90 mb-6">Your resume is missing key keywords for 'Frontend Engineer' roles.</p>
              <Button variant="secondary" size="sm" className="w-full">
                Optimize Now
              </Button>
            </div>
            {/* Abstract background shape */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
