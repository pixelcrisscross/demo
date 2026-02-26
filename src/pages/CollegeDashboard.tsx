import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  TrendingUp,
  Download,
  Filter
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
import { StatCard, Button } from '../components/UI';

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
  return (
    <div className="space-y-8 bg-black min-h-screen p-8 text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">University <span className="text-primary">Admin</span></h1>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Placement Season 2025-26 • Active</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-full font-bold text-xs hover:bg-white/10 transition-all flex items-center gap-2">
            <Download size={16} /> Export Report
          </button>
          <button className="bg-primary text-white px-6 py-3 rounded-full font-bold text-xs hover:scale-105 transition-transform flex items-center gap-2">
            <Filter size={16} /> Filter Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Students", value: "1,240", icon: Users, color: "text-primary" },
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

      {/* Recent Activity Table */}
      <div className="bg-white/[0.03] rounded-[40px] border border-white/10 overflow-hidden backdrop-blur-xl">
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-black text-xl tracking-tighter uppercase">Recent Placements</h3>
          <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] text-white/30 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-5">Student</th>
                <th className="px-8 py-5">Department</th>
                <th className="px-8 py-5">Company</th>
                <th className="px-8 py-5">Package</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'Sarah Miller', dept: 'CS', company: 'Google', pkg: '$180k', status: 'Accepted' },
                { name: 'James Wilson', dept: 'IT', company: 'Amazon', pkg: '$165k', status: 'Accepted' },
                { name: 'Emily Chen', dept: 'ECE', company: 'Intel', pkg: '$140k', status: 'Pending' },
                { name: 'David Kumar', dept: 'ME', company: 'Tesla', pkg: '$130k', status: 'Accepted' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5 font-bold text-sm group-hover:text-primary transition-colors">{row.name}</td>
                  <td className="px-8 py-5 text-sm text-white/40">{row.dept}</td>
                  <td className="px-8 py-5 text-sm font-medium">{row.company}</td>
                  <td className="px-8 py-5 text-sm font-black text-primary">{row.pkg}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      row.status === 'Accepted' ? 'bg-secondary/10 text-secondary' : 'bg-orange-400/10 text-orange-400'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
