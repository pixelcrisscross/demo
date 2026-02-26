import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap, Globe, Shield } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import { Button } from '../components/UI';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold italic text-xl">N</div>
          <span className="text-2xl font-black tracking-tighter text-primary">NEXUS<span className="text-text-primary">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-text-muted">
          <a href="#" className="hover:text-primary transition-colors">Platform</a>
          <a href="#" className="hover:text-primary transition-colors">Solutions</a>
          <a href="#" className="hover:text-primary transition-colors">Resources</a>
          <a href="#" className="hover:text-primary transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-text-primary hover:text-primary">Login</Link>
          <Button size="sm">Get Started</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Spline Background */}
        <div className="absolute inset-0 z-0 opacity-80">
          <Suspense fallback={<div className="w-full h-full bg-gray-50 animate-pulse" />}>
            <Spline scene="https://prod.spline.design/6Wq1Q7YGyVuC8u6j/scene.splinecode" />
          </Suspense>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 backdrop-blur-sm">
              <Sparkles size={16} />
              <span>AI-Powered Career Intelligence</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-text-primary mb-8 leading-[0.85]">
              THE FUTURE <br />
              OF <span className="text-primary">TALENT.</span>
            </h1>
            <p className="text-xl text-text-muted mb-12 max-w-lg leading-relaxed">
              NexusAI bridges the gap between talent, education, and industry using advanced 3D career mapping and predictive intelligence.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto px-10">
                  Launch Platform <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 backdrop-blur-sm">
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive 3D Feature Section */}
      <section className="py-32 bg-text-primary text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative h-[500px] rounded-3xl overflow-hidden border border-white/10 group">
            <Suspense fallback={<div className="w-full h-full bg-white/5 animate-pulse" />}>
              <Spline scene="https://prod.spline.design/6Wq1Q7YGyVuC8u6j/scene.splinecode" />
            </Suspense>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-text-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
              <p className="text-sm font-medium text-gray-300">Interact with the AI Core to explore skill clusters.</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-5xl font-black tracking-tight leading-tight">
              Interactive <span className="text-secondary">Skill Mapping.</span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Our 3D engine visualizes your career path in real-time. See how every skill you acquire opens new dimensions of opportunity.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { title: "Real-time Sync", desc: "Instantly updates as you learn." },
                { title: "3D Visualization", desc: "Explore roles in 3D space." },
                { title: "Predictive Paths", desc: "AI-driven career forecasting." },
                { title: "Global Benchmarks", desc: "Compare with world leaders." }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-secondary mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-12">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map(brand => (
              <span key={brand} className="text-3xl font-black tracking-tighter">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold italic">N</div>
              <span className="text-xl font-black tracking-tighter">NEXUS<span className="text-primary">AI</span></span>
            </div>
            <p className="text-gray-400 max-w-sm mb-8">
              Building the infrastructure for the next generation of global talent.
            </p>
            <div className="flex gap-4">
              {/* Social icons placeholder */}
              <div className="w-10 h-10 rounded-full bg-white/10"></div>
              <div className="w-10 h-10 rounded-full bg-white/10"></div>
              <div className="w-10 h-10 rounded-full bg-white/10"></div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Solutions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-20 mt-20 border-t border-white/10 text-center text-gray-500 text-xs">
          © 2026 NexusAI Technologies Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
