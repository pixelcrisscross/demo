import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap, Globe, Shield } from 'lucide-react';
import { Button } from '../components/UI';

const Spline = lazy(() => import('@splinetool/react-spline'));

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-primary/30">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 flex justify-between items-center backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold italic text-lg">N</div>
          <span className="text-xl font-black tracking-tighter">NEXUS<span className="text-primary">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-[13px] font-medium text-white/60">
          <a href="#" className="hover:text-white transition-colors">Platform</a>
          <a href="#" className="hover:text-white transition-colors">Solutions</a>
          <a href="#" className="hover:text-white transition-colors">Resources</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-[13px] font-semibold text-white/80 hover:text-white">Login</Link>
          <button className="bg-white text-black px-5 py-2 rounded-full text-[13px] font-bold hover:bg-white/90 transition-all">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20">
        {/* Spline Background */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="w-full h-full bg-black animate-pulse" />}>
            {/* @ts-ignore */}
            <spline-viewer 
              url="https://prod.spline.design/Z9TXn2mrWvQ4b0op/scene.splinecode" 
              events-target="global"
            />
          </Suspense>
          {/* Gradient overlay to fade Spline into black */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black pointer-events-none" />
        </div>

        <div className="relative z-10 text-center px-6 mt-[10vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-black">
                <Zap size={40} fill="currentColor" />
              </div>
            </div>
            
            <h1 className="text-7xl md:text-[160px] font-black tracking-tighter leading-[0.8] mb-8">
              NEXUS<span className="text-primary">26</span>
            </h1>

            <div className="space-y-4 mb-12">
              <p className="text-xl md:text-2xl font-bold tracking-tight text-white/90">
                Starting on June 10th, 2026
              </p>
              <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
                Unlock the future of career intelligence. Join us at NEXUS26 where talent meets predictive AI.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <button className="bg-white text-black px-10 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform">
                  Accept Invite
                </button>
              </Link>
              <button className="bg-white/10 backdrop-blur-xl border border-white/10 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all">
                Double It & Pass
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid - Minimalist & Dark */}
      <section className="py-40 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-1px bg-white/10 border border-white/10 rounded-[40px] overflow-hidden">
            {[
              { title: "AI Core", desc: "Predictive matching with 99% accuracy.", icon: Zap },
              { title: "Global Sync", desc: "Real-time industry integration.", icon: Globe },
              { title: "Secure ID", desc: "Blockchain-verified talent credentials.", icon: Shield }
            ].map((item, i) => (
              <div key={i} className="bg-black p-12 hover:bg-white/[0.02] transition-colors group">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <item.icon size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive 3D Feature Section - Dark Mode */}
      <section className="py-40 bg-black overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative h-[600px] rounded-[40px] overflow-hidden border border-white/10 bg-white/[0.02] group">
            <Suspense fallback={<div className="w-full h-full bg-white/5 animate-pulse" />}>
              {/* @ts-ignore */}
              <spline-viewer url="https://prod.spline.design/6Wq1Q7YGyVuC8u6j/scene.splinecode" />
            </Suspense>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
          
          <div className="space-y-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              INTERACTIVE <br />
              <span className="text-primary">SKILL MAPPING.</span>
            </h2>
            <p className="text-xl text-white/50 leading-relaxed max-w-lg">
              Our 3D engine visualizes your career path in real-time. See how every skill you acquire opens new dimensions of opportunity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Real-time Sync",
                "3D Visualization",
                "Predictive Paths",
                "Global Benchmarks"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(124,77,255,0.8)]" />
                  <span className="text-sm font-bold text-white/80">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimalist */}
      <footer className="bg-black border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black font-bold italic text-sm">N</div>
            <span className="text-lg font-black tracking-tighter">NEXUS<span className="text-primary">AI</span></span>
          </div>
          <div className="flex gap-8 text-[12px] font-bold text-white/40 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-[12px] text-white/20 font-medium">
            © 2026 NexusAI Technologies Inc.
          </p>
        </div>
      </footer>
    </div>
  );
};
