"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

import { useState } from 'react';
import { signup } from '../auth/actions';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    level: '100L'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('level', formData.level);

    const result = await signup(data);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
    // Success redirect happens in the action
  };

  return (
    <div className="min-h-screen flex flex-col bg-light border-y-[16px] border-primary">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white p-10 md:p-16 border-y-2 border-primary w-full max-w-2xl relative"
        >
          <div className="text-center mb-12">
            <span className="inline-block border border-primary px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-primary mb-6">
              Registration
            </span>
            <h1 className="text-4xl md:text-5xl font-serif tracking-tighter text-primary uppercase leading-none mb-4">Establish <span className="text-secondary italic">Record</span></h1>
            <p className="text-sm font-sans text-primary/70 tracking-wide">Join the academic archive and access premium materials.</p>
          </div>
          
          {error && (
            <div className="bg-secondary/10 text-secondary p-4 text-xs uppercase tracking-widest font-bold mb-8 border border-secondary/20 text-center">
              {error}
            </div>
          )}
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-primary mb-2">Username</label>
                <input 
                  type="text" 
                  name="username"
                  className="input-field" 
                  placeholder="Student ID" 
                  value={formData.username}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-primary mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className="input-field" 
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-primary mb-2">Password</label>
                <input 
                  type="password" 
                  name="password"
                  className="input-field tracking-[0.3em] font-serif" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-primary mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  className="input-field tracking-[0.3em] font-serif" 
                  placeholder="••••••••" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-primary/10">
              <label className="block text-xs uppercase tracking-widest font-bold text-primary mb-4">Academic Level</label>
              <div className="relative">
                <select 
                  name="level"
                  className="w-full border border-primary bg-transparent px-4 py-4 focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-sm font-bold uppercase tracking-widest appearance-none cursor-pointer" 
                  value={formData.level}
                  onChange={handleChange}
                  required
                >
                  <option value="100L">100 Level — Freshman</option>
                  <option value="200L">200 Level — Sophomore</option>
                  <option value="300L">300 Level — Junior</option>
                  <option value="400L">400 Level — Senior</option>
                  <option value="500L">500 Level — Final Year</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 border-l border-primary">
                  <span className="text-secondary text-lg font-serif">▼</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 mt-8 pt-6 border-t border-primary/10">
              <input type="checkbox" id="terms" className="mt-1 w-4 h-4 text-secondary rounded-none border border-primary focus:ring-1 focus:ring-secondary appearance-none checked:bg-secondary cursor-pointer transition-colors" required />
              <label htmlFor="terms" className="text-xs uppercase tracking-wider text-primary/70 font-medium pt-0.5">
                I agree to the <a href="#" className="text-primary font-bold hover:text-secondary underline underline-offset-4">Terms of Service</a> and <a href="#" className="text-primary font-bold hover:text-secondary underline underline-offset-4">Privacy Policy</a>
              </label>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary w-full py-5 text-xs uppercase tracking-[0.2em] font-bold mt-10 disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Establishing Record...' : 'Complete Registration'}
            </button>
          </form>
          
          <div className="mt-12 text-center">
            <p className="text-xs uppercase tracking-widest text-primary/60 font-medium">
              Already have an account? <Link href="/login" className="text-primary font-bold hover:text-secondary transition-colors underline underline-offset-4 ml-1">Log In</Link>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
