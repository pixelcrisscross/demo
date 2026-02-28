import React, { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, Briefcase, Building2, ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { userService } from '../services/api';

const Spline = lazy(() => import('@splinetool/react-spline'));

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'college' | 'recruiter' | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setIsLoading(true);
    setError('');

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user in MongoDB
        await userService.create({
          uid: user.uid,
          email: user.email,
          name: name,
          role: selectedRole,
          profileStrength: 0
        });
        
        navigate(`/${selectedRole}`);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Fetch user from MongoDB to verify role
        const res = await userService.getProfile(user.uid);
        const dbUser = res.data;
        
        if (dbUser && dbUser.role === selectedRole) {
          navigate(`/${selectedRole}`);
        } else {
          setError(`Invalid role for this account. Expected ${selectedRole}.`);
          await auth.signOut();
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
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
            {isRegistering ? 'Create your account to join the Nexus ecosystem.' : 'Select your role to enter the Nexus ecosystem and start your journey.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/[0.03] backdrop-blur-3xl p-10 rounded-[40px] border border-white/10 shadow-2xl"
        >
          {!selectedRole ? (
            <div className="space-y-4 mb-10">
              <h3 className="text-2xl font-black tracking-tighter uppercase mb-6">Select <span className="text-primary">Role</span></h3>
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id as any)}
                  className="w-full flex items-center gap-5 p-6 rounded-3xl border border-white/5 hover:border-white/20 hover:bg-white/[0.02] transition-all duration-300 text-left group"
                >
                  <div className="p-4 rounded-2xl bg-white/5 text-white/40 group-hover:text-white transition-colors">
                    <role.icon size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white/60 group-hover:text-white transition-colors">{role.title}</h4>
                    <p className="text-xs text-white/30 group-hover:text-white/40 transition-colors">{role.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black tracking-tighter uppercase">
                  {isRegistering ? 'Register' : 'Login'} as <span className="text-primary">{selectedRole}</span>
                </h3>
                <button 
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white"
                >
                  Change Role
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold">
                  {error}
                </div>
              )}

              {isRegistering && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Full Name</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-primary transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-primary transition-colors"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Password</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                disabled={isLoading}
                className="w-full bg-white text-black py-5 rounded-full text-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isRegistering ? 'Create Account' : 'Enter Portal')} <ArrowRight size={20} />
              </button>

              <div className="mt-8 text-center">
                <p className="text-xs text-white/20 font-medium">
                  {isRegistering ? 'Already have an account?' : "Don't have an account?"} 
                  <button 
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-white hover:text-primary transition-colors ml-1"
                  >
                    {isRegistering ? 'Login' : 'Request Access'}
                  </button>
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};
