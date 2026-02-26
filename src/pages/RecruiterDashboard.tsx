import React from 'react';
import { 
  Users, 
  Briefcase, 
  Search, 
  Plus,
  MoreVertical,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { StatCard, Button } from '../components/UI';

const pipelineStages = [
  { name: 'Applied', count: 124, color: 'bg-blue-500' },
  { name: 'Screening', count: 45, color: 'bg-purple-500' },
  { name: 'Interview', count: 12, color: 'bg-orange-500' },
  { name: 'Offer', count: 4, color: 'bg-green-500' },
];

export const RecruiterDashboard: React.FC = () => {
  return (
    <div className="space-y-8 bg-black min-h-screen p-8 text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Hiring <span className="text-primary">Console</span></h1>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Manage your active job postings and candidates.</p>
        </div>
        <button className="bg-primary text-white px-8 py-4 rounded-full font-black text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_10px_30px_rgba(124,77,255,0.3)]">
          <Plus size={20} /> Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Active Jobs", value: "8", icon: Briefcase, color: "text-primary" },
          { title: "Total Candidates", value: "185", change: "+24", icon: Users, color: "text-blue-400" },
          { title: "Interviews Today", value: "5", icon: Calendar, color: "text-orange-400" },
          { title: "Hires this Month", value: "12", change: "+2", icon: Plus, color: "text-secondary" }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Jobs List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/[0.03] rounded-[40px] border border-white/10 overflow-hidden backdrop-blur-xl">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
              <h3 className="font-black text-xl tracking-tighter uppercase">Active Job Postings</h3>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter jobs..." 
                  className="pl-12 pr-6 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs focus:outline-none focus:border-primary/50 transition-all font-bold"
                />
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { title: 'Senior React Developer', location: 'Remote', applicants: 45, new: 12, status: 'Active' },
                { title: 'Backend Engineer (Node.js)', location: 'New York', applicants: 32, new: 5, status: 'Active' },
                { title: 'Product Designer', location: 'San Francisco', applicants: 89, new: 24, status: 'Active' },
                { title: 'DevOps Specialist', location: 'Remote', applicants: 19, new: 3, status: 'Paused' },
              ].map((job, i) => (
                <div key={i} className="p-8 hover:bg-white/[0.02] transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white/5 text-white/40 rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-primary group-hover:text-white transition-all">
                      {job.title[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-lg group-hover:text-primary transition-colors tracking-tight">{job.title}</h4>
                      <div className="flex items-center gap-4 text-[10px] text-white/30 mt-2 font-black uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><MapPin size={12} /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><Users size={12} /> {job.applicants} Applicants</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    {job.new > 0 && (
                      <span className="px-3 py-1 bg-secondary text-black text-[10px] font-black rounded-full shadow-[0_0_15px_rgba(200,249,2,0.3)]">
                        {job.new} NEW
                      </span>
                    )}
                    <div className="text-right hidden sm:block">
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                        job.status === 'Active' ? 'bg-secondary/10 text-secondary' : 'bg-white/5 text-white/30'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <button className="p-3 hover:bg-white/5 rounded-2xl text-white/20 hover:text-white transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline Overview */}
        <div className="space-y-8">
          <div className="bg-white/[0.03] p-8 rounded-[40px] border border-white/10 backdrop-blur-xl">
            <h3 className="font-black text-xl tracking-tighter uppercase mb-10">Pipeline Overview</h3>
            <div className="space-y-8">
              {pipelineStages.map((stage) => (
                <div key={stage.name}>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{stage.name}</span>
                    <span className="text-3xl font-black tracking-tighter">{stage.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.count / 185) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${stage.color.replace('bg-', 'bg-')}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] p-10 rounded-[40px] border border-white/10 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Sparkles size={20} />
                <h4 className="font-black text-xs uppercase tracking-widest">AI Talent Insight</h4>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-8">
                We found 12 candidates from University of Tech that match your 'Senior React' role with 90%+ accuracy.
              </p>
              <button className="w-full bg-white text-black py-4 rounded-full font-black text-sm hover:scale-[1.02] transition-transform">
                View AI Shortlist
              </button>
            </div>
            {/* Abstract glow */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
