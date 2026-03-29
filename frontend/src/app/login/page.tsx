"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ username, password });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white p-10 md:p-14 border border-primary w-full max-w-lg relative"
        >
          {/* Decorative Corner Element */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary -translate-x-1 -translate-y-1"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary translate-x-1 -translate-y-1"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary -translate-x-1 translate-y-1"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary translate-x-1 translate-y-1"></div>

          <div className="text-center mb-12">
            <span className="inline-block border border-primary px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-primary mb-6">
              Authentication
            </span>
            <h1 className="text-4xl md:text-5xl font-serif tracking-tighter text-primary uppercase leading-none mb-4">Welcome <span className="text-secondary italic">Back</span></h1>
            <p className="text-sm font-sans text-primary/70 tracking-wide">Enter your credentials to access the archive.</p>
          </div>
          
          {error && (
            <div className="bg-secondary/10 text-secondary p-4 text-xs uppercase tracking-widest font-bold mb-8 border border-secondary/20 text-center">
              {error}
            </div>
          )}
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-primary mb-2">Username</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Student ID or Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs uppercase tracking-widest font-bold text-primary">Password</label>
                <a href="#" className="text-[10px] uppercase tracking-widest text-secondary hover:text-primary transition-colors">Forgot?</a>
              </div>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary w-full py-4 text-xs uppercase tracking-[0.2em] font-bold mt-8 disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-12 pt-8 border-t border-primary/10 text-center">
            <p className="text-xs uppercase tracking-widest text-primary/60 font-medium">
              Not yet a scholar? <Link href="/register" className="text-primary font-bold hover:text-secondary transition-colors underline underline-offset-4 ml-1">Establish Record</Link>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
