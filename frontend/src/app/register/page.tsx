"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { signup } from '../auth/actions';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        setError('Please enter a valid email address.');
        return;
      }
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      nextStep();
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('confirmPassword', formData.confirmPassword);

    const result = await signup(data);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light border-y-[16px] border-primary">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-24 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white p-10 md:p-16 border-y-2 border-primary w-full max-w-xl relative"
        >
          <div className="text-center mb-12">
            <span className="inline-block border border-primary px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-primary mb-6">
              Step 0{step} / 02
            </span>
            <h1 className="text-4xl md:text-5xl font-serif tracking-tighter text-primary uppercase leading-none mb-4">
              {step === 1 ? (
                <>Enter Your <span className="text-secondary italic">Email</span></>
              ) : (
                <>Secure Your <span className="text-secondary italic">Account</span></>
              )}
            </h1>
            <p className="text-sm font-sans text-primary/70 tracking-wide h-6">
              {step === 1 ? 'Where should we send your academic updates?' : 'Create a strong password for your archive.'}
            </p>
          </div>
          
          <div className="h-12 mb-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-secondary/10 text-secondary p-3 text-xs uppercase tracking-widest font-bold border border-secondary/20 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <form className="relative min-h-[220px]" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col justify-between"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-primary mb-4">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      className="w-full border-b-2 border-primary/20 bg-transparent py-4 text-xl md:text-2xl font-serif tracking-wide focus:outline-none focus:border-primary transition-colors placeholder:text-primary/20" 
                      placeholder="scholar@example.com" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      autoFocus
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="btn-primary w-full py-5 text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 group mt-12"
                  >
                    Continue
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-bold text-primary mb-2">Password</label>
                      <input 
                        type="password" 
                        name="password"
                        className="w-full border-b-2 border-primary/20 bg-transparent py-3 text-2xl tracking-[0.3em] font-serif focus:outline-none focus:border-primary transition-colors placeholder:text-primary/20 placeholder:tracking-normal" 
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={handleChange}
                        required 
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-bold text-primary mb-2">Confirm Password</label>
                      <input 
                        type="password" 
                        name="confirmPassword"
                        className="w-full border-b-2 border-primary/20 bg-transparent py-3 text-2xl tracking-[0.3em] font-serif focus:outline-none focus:border-primary transition-colors placeholder:text-primary/20 placeholder:tracking-normal" 
                        placeholder="••••••••" 
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-8">
                    <button 
                      type="button" 
                      onClick={prevStep}
                      className="py-5 px-6 border border-primary/20 text-primary hover:bg-light transition-colors flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary flex-1 py-5 text-xs uppercase tracking-[0.2em] font-bold disabled:opacity-70"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Establishing Record...' : 'Complete Registration'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          
          <div className="mt-16 pt-8 border-t border-primary/10 text-center">
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
