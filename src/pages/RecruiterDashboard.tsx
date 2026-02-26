import React from 'react';
import { 
  Users, 
  Briefcase, 
  Search, 
  Plus,
  MoreVertical,
  Calendar,
  MapPin
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Hiring Console</h1>
          <p className="text-text-muted">Manage your active job postings and candidates.</p>
        </div>
        <Button size="sm">
          <Plus size={18} className="mr-2" /> Post New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Jobs" value="8" icon={Briefcase} color="text-primary" />
        <StatCard title="Total Candidates" value="185" change="+24" icon={Users} color="text-blue-500" />
        <StatCard title="Interviews Today" value="5" icon={Calendar} color="text-orange-500" />
        <StatCard title="Hires this Month" value="12" change="+2" icon={Plus} color="text-secondary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Jobs List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg">Active Job Postings</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter jobs..." 
                  className="pl-8 pr-4 py-1.5 bg-gray-50 border border-border rounded-lg text-xs focus:outline-none"
                />
              </div>
            </div>
            <div className="divide-y divide-border">
              {[
                { title: 'Senior React Developer', location: 'Remote', applicants: 45, new: 12, status: 'Active' },
                { title: 'Backend Engineer (Node.js)', location: 'New York', applicants: 32, new: 5, status: 'Active' },
                { title: 'Product Designer', location: 'San Francisco', applicants: 89, new: 24, status: 'Active' },
                { title: 'DevOps Specialist', location: 'Remote', applicants: 19, new: 3, status: 'Paused' },
              ].map((job, i) => (
                <div key={i} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-bold">
                      {job.title[0]}
                    </div>
                    <div>
                      <h4 className="font-bold group-hover:text-primary transition-colors">{job.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {job.applicants} Applicants</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {job.new > 0 && (
                      <span className="px-2 py-1 bg-secondary text-text-primary text-[10px] font-black rounded-lg">
                        {job.new} NEW
                      </span>
                    )}
                    <div className="text-right hidden sm:block">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <button className="p-2 hover:bg-gray-200 rounded-lg text-text-muted">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline Overview */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl card-shadow border border-border/50">
            <h3 className="font-bold mb-6">Pipeline Overview</h3>
            <div className="space-y-6">
              {pipelineStages.map((stage) => (
                <div key={stage.name}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold">{stage.name}</span>
                    <span className="text-2xl font-black">{stage.count}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.count / 185) * 100}%` }}
                      className={`h-full rounded-full ${stage.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-text-primary p-6 rounded-2xl text-white">
            <h4 className="font-bold mb-2">AI Talent Insight</h4>
            <p className="text-sm text-gray-400 mb-6">
              We found 12 candidates from University of Tech that match your 'Senior React' role with 90%+ accuracy.
            </p>
            <Button variant="secondary" size="sm" className="w-full">
              View AI Shortlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
