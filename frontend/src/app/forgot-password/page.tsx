"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { requestPasswordReset } from '../auth/actions';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('email', email);

    const result = await requestPasswordReset(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setMessage(result.success);
      setEmail('');
    }
    
    setIsSubmitting(false);
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
              Recovery
            </span>
            <h1 className="text-4xl md:text-5xl font-serif tracking-tighter text-primary uppercase leading-none mb-4">Reset <span className="text-secondary italic">Access</span></h1>
            <p className="text-sm font-sans text-primary/70 tracking-wide">Enter your email address to receive a recovery link.</p>
          </div>
          
          {error && (
            <div className="bg-secondary/10 text-secondary p-4 text-xs uppercase tracking-widest font-bold mb-8 border border-secondary/20 text-center">
              {error}
            </div>
          )}
          
          {message && (
            <div className="bg-green-100 text-green-800 p-4 text-xs uppercase tracking-widest font-bold mb-8 border border-green-200 text-center">
              {message}
            </div>
          )}
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-primary mb-2">Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary w-full py-4 text-xs uppercase tracking-[0.2em] font-bold mt-8 disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Recovery Link'}
            </button>
          </form>
          
          <div className="mt-12 pt-8 border-t border-primary/10 text-center">
            <p className="text-xs uppercase tracking-widest text-primary/60 font-medium">
              Remembered? <Link href="/login" className="text-primary font-bold hover:text-secondary transition-colors underline underline-offset-4 ml-1">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
