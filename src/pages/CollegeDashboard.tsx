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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">University Admin</h1>
          <p className="text-text-muted">Placement Season 2025-26 • Active</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download size={18} className="mr-2" /> Export Report
          </Button>
          <Button size="sm">
            <Filter size={18} className="mr-2" /> Filter Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="1,240" icon={Users} color="text-primary" />
        <StatCard title="Placed Students" value="842" change="+15%" icon={GraduationCap} color="text-secondary" />
        <StatCard title="Active Recruiters" value="48" change="+12" icon={Building2} color="text-blue-500" />
        <StatCard title="Avg. Package" value="$12.4 LPA" change="+8%" icon={TrendingUp} color="text-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-2xl card-shadow border border-border/50">
          <h3 className="font-bold text-lg mb-6">Placement by Department</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={placementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="placed" fill="#7C4DFF" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl card-shadow border border-border/50">
          <h3 className="font-bold text-lg mb-6">Sector-wise Distribution</h3>
          <div className="h-[350px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black">45%</span>
              <span className="text-[10px] text-text-muted uppercase font-bold">IT/Software</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="font-bold text-lg">Recent Placements</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-text-muted text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Package</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { name: 'Sarah Miller', dept: 'CS', company: 'Google', pkg: '$180k', status: 'Accepted' },
                { name: 'James Wilson', dept: 'IT', company: 'Amazon', pkg: '$165k', status: 'Accepted' },
                { name: 'Emily Chen', dept: 'ECE', company: 'Intel', pkg: '$140k', status: 'Pending' },
                { name: 'David Kumar', dept: 'ME', company: 'Tesla', pkg: '$130k', status: 'Accepted' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-sm">{row.name}</td>
                  <td className="px-6 py-4 text-sm text-text-muted">{row.dept}</td>
                  <td className="px-6 py-4 text-sm font-medium">{row.company}</td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">{row.pkg}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      row.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
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
