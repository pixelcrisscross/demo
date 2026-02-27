import React, { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, Briefcase, Building2, ArrowRight } from 'lucide-react';
import { Button } from '../components/UI';

const Spline = lazy(() => import('@splinetool/react-spline'));

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
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden selection:bg-primary/30">
      {/* Background 3D */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Suspense fallback={null}>
          <Spline scene="https://prod.spline.design/z4Ct9MyrfGA-ubxx/scene.splinecode" />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black pointer-events-none" />
        {/* Watermark Hider */}
        <div className="absolute bottom-0 right-0 w-48 h-12 bg-black z-10 pointer-events-none" />
      </div>

      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-20 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-bold italic text-xl">N</div>
            <span className="text-2xl font-black tracking-tighter">NEXUS<span className="text-primary">AI</span></span>
          </div>
          <h2 className="text-6xl font-black tracking-tighter mb-6 leading-[0.9]">
            YOUR PORTAL <br />
            TO THE <span className="text-primary">FUTURE.</span>
          </h2>
          <p className="text-white/40 text-xl leading-relaxed max-w-md">
            Select your role to enter the Nexus ecosystem and start your journey.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/[0.03] backdrop-blur-3xl p-10 rounded-[40px] border border-white/10 shadow-2xl"
        >
          <div className="space-y-4 mb-10">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id as any)}
                className={`w-full flex items-center gap-5 p-6 rounded-3xl border transition-all duration-300 text-left group ${
                  selectedRole === role.id 
                    ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(124,77,255,0.2)]' 
                    : 'border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                }`}
              >
                <div className={`p-4 rounded-2xl transition-colors ${selectedRole === role.id ? 'bg-primary text-white' : 'bg-white/5 text-white/40 group-hover:text-white'}`}>
                  <role.icon size={28} />
                </div>
                <div>
                  <h4 className={`font-bold text-lg transition-colors ${selectedRole === role.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{role.title}</h4>
                  <p className="text-xs text-white/30 group-hover:text-white/40 transition-colors">{role.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <button 
            disabled={!selectedRole}
            onClick={handleLogin}
            className={`w-full py-5 rounded-full text-lg font-bold transition-all flex items-center justify-center gap-2 ${
              selectedRole 
                ? 'bg-white text-black hover:scale-[1.02] active:scale-[0.98]' 
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            Enter Portal <ArrowRight size={20} />
          </button>

          <div className="mt-8 text-center">
            <p className="text-xs text-white/20 font-medium">
              Don't have an account? <a href="#" className="text-white hover:text-primary transition-colors">Request Access</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
