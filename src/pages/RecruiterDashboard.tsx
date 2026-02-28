import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  Search, 
  Plus,
  MoreVertical,
  Calendar,
  MapPin,
  Sparkles,
  X,
  Trash2,
  Mail,
  CheckCircle,
  Clock,
  ChevronRight,
  Settings as SettingsIcon,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams } from 'react-router-dom';
import { StatCard, Button } from '../components/UI';
import { jobService, userService } from '../services/api';
import { socket } from '../services/socket';
import { auth } from '../lib/firebase';

const pipelineStages = [
  { name: 'Applied', count: 124, color: 'bg-blue-500' },
  { name: 'Screening', count: 45, color: 'bg-purple-500' },
  { name: 'Interview', count: 12, color: 'bg-orange-500' },
  { name: 'Offer', count: 4, color: 'bg-green-500' },
];

export const RecruiterDashboard: React.FC = () => {
  const { tab } = useParams();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [newJob, setNewJob] = useState({
    title: '',
    company: 'NexusAI Tech',
    location: '',
    salary: '',
    type: 'Full-time',
    description: '',
    matchScore: 95,
    recruiterId: '',
    skillsRequired: '',
    experienceLevel: 'Entry Level',
    benefits: '',
    deadline: ''
  });

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const [jobsRes, profileRes] = await Promise.all([
        jobService.getAll(),
        userService.getProfile(user.uid)
      ]);
      setJobs(jobsRes.data);
      setProfile(profileRes.data);
      setNewJob(prev => ({ ...prev, recruiterId: user.uid }));
    } catch (err) {
      console.error('Failed to fetch recruiter data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    socket.on('job:created', (job) => {
      setJobs((prev) => [job, ...prev]);
    });

    socket.on('job:updated', (updatedJob) => {
      setJobs((prev) => prev.map(j => (j._id === updatedJob._id || j.id === updatedJob.id) ? updatedJob : j));
    });

    socket.on('job:deleted', (jobId) => {
      setJobs((prev) => prev.filter(j => (j._id !== jobId && j.id !== jobId)));
    });

    return () => {
      socket.off('job:created');
      socket.off('job:updated');
      socket.off('job:deleted');
    };
  }, []);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const jobData = {
        ...newJob,
        skillsRequired: newJob.skillsRequired.split(',').map(s => s.trim())
      };
      if (editingJob) {
        await jobService.update(editingJob._id || editingJob.id, jobData);
      } else {
        await jobService.create(jobData);
      }
      setIsModalOpen(false);
      setEditingJob(null);
      setNewJob({
        title: '',
        company: 'NexusAI Tech',
        location: '',
        salary: '',
        type: 'Full-time',
        description: '',
        matchScore: 95,
        recruiterId: auth.currentUser?.uid || '',
        skillsRequired: '',
        experienceLevel: 'Entry Level',
        benefits: '',
        deadline: ''
      });
    } catch (err) {
      console.error('Failed to post job', err);
    }
  };

  const handleEditJob = (job: any) => {
    setEditingJob(job);
    setNewJob({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.type,
      description: job.description,
      matchScore: job.matchScore,
      recruiterId: job.recruiterId,
      skillsRequired: Array.isArray(job.skillsRequired) ? job.skillsRequired.join(', ') : (job.skillsRequired || ''),
      experienceLevel: job.experienceLevel || 'Entry Level',
      benefits: job.benefits || '',
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeleteJob = async (job: any) => {
    const id = job._id || job.id;
    if (!id || isProcessing) return;
    if (window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      setIsProcessing(true);
      try {
        await jobService.delete(id);
        // Fallback if socket fails
        setJobs(prev => prev.filter(j => (j._id !== id && j.id !== id)));
      } catch (err) {
        console.error('Failed to delete job', err);
        alert('Failed to delete job.');
      } finally {
        setIsProcessing(false);
      }
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

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Hiring <span className="text-primary">Console</span></h1>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Manage your active job postings and candidates.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-8 py-4 rounded-full font-black text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_10px_30px_rgba(124,77,255,0.3)]"
        >
          <Plus size={20} /> Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Active Jobs", value: jobs.length, icon: Briefcase, color: "text-primary" },
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
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/[0.03] rounded-[40px] border border-white/10 overflow-hidden backdrop-blur-xl">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
              <h3 className="font-black text-xl tracking-tighter uppercase">Recent Applications</h3>
            </div>
            <div className="divide-y divide-white/5">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="p-8 hover:bg-white/[0.02] transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-6">
                    <img src={`https://picsum.photos/seed/${i}/200`} className="w-14 h-14 rounded-2xl object-cover" />
                    <div>
                      <h4 className="font-black text-lg group-hover:text-primary transition-colors tracking-tight">Candidate {i + 1}</h4>
                      <p className="text-[10px] text-white/30 mt-2 font-black uppercase tracking-widest">Applied for Senior React Developer</p>
                    </div>
                  </div>
                  <button className="p-4 bg-white/5 rounded-2xl hover:bg-primary transition-all">
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

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
                      className={`h-full rounded-full ${stage.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMyJobs = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black tracking-tighter uppercase">My <span className="text-primary">Postings</span></h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black px-8 py-4 rounded-full font-black text-sm hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus size={20} /> New Job
        </button>
      </div>

      <div className="bg-white/[0.03] rounded-[40px] border border-white/10 overflow-hidden backdrop-blur-xl">
        <div className="divide-y divide-white/5">
          {jobs.map((job) => (
            <div key={job._id || job.id} className="p-8 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5 text-white/40 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:bg-primary group-hover:text-white transition-all">
                  {job.title[0]}
                </div>
                <div>
                  <h4 className="font-black text-xl group-hover:text-primary transition-colors tracking-tight">{job.title}</h4>
                  <div className="flex items-center gap-6 text-[10px] text-white/30 mt-3 font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><Users size={12} className="text-primary" /> {job.applicants || 0} Applicants</span>
                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleEditJob(job)}
                  className="p-4 bg-white/5 rounded-2xl hover:bg-white hover:text-black transition-all"
                >
                  Edit
                </button>
                <button 
                  disabled={isProcessing}
                  onClick={() => handleDeleteJob(job)}
                  className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTalentPool = () => (
    <div className="space-y-8">
      <h2 className="text-4xl font-black tracking-tighter uppercase">Talent <span className="text-primary">Pool</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <div key={i} className="bg-white/[0.03] p-8 rounded-[40px] border border-white/10 backdrop-blur-xl group">
            <div className="flex justify-between items-start mb-6">
              <img src={`https://picsum.photos/seed/${i + 10}/200`} className="w-20 h-20 rounded-3xl object-cover border-2 border-white/5 group-hover:border-primary transition-all" />
              <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                98% Match
              </div>
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-1">Candidate {i + 1}</h3>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-6">Full Stack Developer • 5y Exp</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {['React', 'Node.js', 'AWS'].map(skill => (
                <span key={skill} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/60">{skill}</span>
              ))}
            </div>
            <button className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-full font-black text-sm hover:bg-primary transition-all">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-4xl font-black tracking-tighter uppercase">Recruiter <span className="text-primary">Settings</span></h2>
      <form onSubmit={handleUpdateProfile} className="bg-white/[0.03] p-10 rounded-[40px] border border-white/10 backdrop-blur-xl space-y-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Company Name</label>
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary" 
            value={profile?.name || ''} 
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Hiring Bio</label>
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
              <h2 className="text-3xl font-black tracking-tighter uppercase mb-8">{editingJob ? 'Edit' : 'Post'} <span className="text-primary">Job</span></h2>
              <form onSubmit={handlePostJob} className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Job Title</label>
                    <input 
                      required
                      value={newJob.title}
                      onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Senior Frontend Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Location</label>
                    <input 
                      required
                      value={newJob.location}
                      onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Remote / New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Salary Range</label>
                    <input 
                      required
                      value={newJob.salary}
                      onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors"
                      placeholder="$120k - $180k"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Job Type</label>
                    <select 
                      value={newJob.type}
                      onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Experience Level</label>
                    <select 
                      value={newJob.experienceLevel}
                      onChange={(e) => setNewJob({...newJob, experienceLevel: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                      <option value="Lead / Manager">Lead / Manager</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Application Deadline</label>
                    <input 
                      type="date"
                      value={newJob.deadline}
                      onChange={(e) => setNewJob({...newJob, deadline: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Required Skills (Comma separated)</label>
                  <input 
                    value={newJob.skillsRequired}
                    onChange={(e) => setNewJob({...newJob, skillsRequired: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors"
                    placeholder="React, TypeScript, Tailwind CSS, Node.js"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Job Description</label>
                  <textarea 
                    required
                    value={newJob.description}
                    onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors h-32 resize-none"
                    placeholder="Describe the role, responsibilities, and requirements..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Benefits & Perks</label>
                  <textarea 
                    value={newJob.benefits}
                    onChange={(e) => setNewJob({...newJob, benefits: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-colors h-24 resize-none"
                    placeholder="Health insurance, 401k, Unlimited PTO..."
                  />
                </div>

                <button type="submit" className="w-full bg-primary text-white py-5 rounded-full font-black text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-primary/20">
                  {editingJob ? 'Update Job Posting' : 'Launch Job Posting'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {tab === 'jobs' ? renderMyJobs() :
       tab === 'talent' ? renderTalentPool() :
       tab === 'settings' ? renderSettings() :
       renderOverview()}
    </div>
  );
};
