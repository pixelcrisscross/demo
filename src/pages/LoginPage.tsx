import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, Briefcase, Building2, ArrowRight } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import { Button } from '../components/UI';

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'college' | 'recruiter' | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (selectedRole) {
      navigate(`/${selectedRole}`);
    }
  };

  const roles = [
    { id: 'student', title: 'Student', icon: GraduationCap, desc: 'Find your dream job and build your career.' },
    { id: 'college', title: 'College', icon: Building2, desc: 'Manage placements and track student success.' },
    { id: 'recruiter', title: 'Recruiter', icon: Briefcase, desc: 'Hire top talent with AI-powered matching.' }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background 3D */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Suspense fallback={null}>
          <Spline scene="https://prod.spline.design/6Wq1Q7YGyVuC8u6j/scene.splinecode" />
        </Suspense>
      </div>

      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold italic text-xl">N</div>
            <span className="text-2xl font-black tracking-tighter text-primary">NEXUS<span className="text-text-primary">AI</span></span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-text-primary mb-4 leading-tight">
            Welcome back to the <br />
            <span className="text-primary">Nexus Ecosystem.</span>
          </h2>
          <p className="text-text-muted text-lg">
            Choose your portal to continue your journey.
          </p>
        </div>

        <div className="bg-card p-8 rounded-3xl card-shadow border border-border/50">
          <div className="space-y-4 mb-8">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id as any)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedRole === role.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/30 hover:bg-gray-50'
                }`}
              >
                <div className={`p-3 rounded-xl ${selectedRole === role.id ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted'}`}>
                  <role.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">{role.title}</h4>
                  <p className="text-xs text-text-muted">{role.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <Button 
            size="lg" 
            className="w-full" 
            disabled={!selectedRole}
            onClick={handleLogin}
          >
            Enter Portal <ArrowRight className="ml-2" size={20} />
          </Button>

          <p className="text-center text-xs text-text-muted mt-6">
            Don't have an account? <a href="#" className="text-primary font-bold hover:underline">Request Access</a>
          </p>
        </div>
      </div>
    </div>
  );
};
