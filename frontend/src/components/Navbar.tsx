"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-light/95 backdrop-blur-md border-b border-primary/10 py-4' : 'bg-transparent py-6 border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="border border-primary text-primary p-1.5 group-hover:bg-primary group-hover:text-light transition-all duration-300">
              <BookOpen size={22} className="stroke-[1.5]" />
            </div>
            <span className="font-serif font-bold text-2xl tracking-tighter text-primary uppercase">JurisMemo</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-xs font-bold text-primary uppercase tracking-widest editorial-link">
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-6 border-l border-primary/20 pl-8">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-xs font-bold text-primary uppercase tracking-widest editorial-link">
                    Dashboard
                  </Link>
                  {user.id === 1 && (
                    <Link href="/admin" className="text-xs font-bold text-secondary uppercase tracking-widest editorial-link flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-secondary"></span>
                      Admin
                    </Link>
                  )}
                  <button onClick={logout} className="btn-outline py-2 px-6 text-xs uppercase tracking-widest font-bold">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-xs font-bold text-primary uppercase tracking-widest editorial-link">
                    Log in
                  </Link>
                  <Link href="/register" className="btn-primary py-2 px-6 text-xs uppercase tracking-widest font-bold">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-primary hover:text-secondary focus:outline-none transition-colors">
              {isOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 w-full bg-light border-y border-primary/10 shadow-2xl"
          >
            <div className="px-6 pt-4 pb-8 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="block py-4 text-sm font-bold tracking-widest uppercase text-primary border-b border-primary/10 hover:text-secondary hover:pl-2 transition-all duration-300">
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 flex flex-col gap-4">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="w-full text-center py-4 border border-primary text-primary text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-light transition-colors">
                      Dashboard
                    </Link>
                    {user.id === 1 && (
                      <Link href="/admin" onClick={() => setIsOpen(false)} className="w-full text-center py-4 border border-secondary text-secondary text-xs uppercase tracking-widest font-bold hover:bg-secondary hover:text-light transition-colors">
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-center py-4 bg-primary text-light text-xs uppercase tracking-widest font-bold hover:bg-light hover:text-primary border border-primary transition-colors">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-4 border border-primary text-primary text-xs uppercase tracking-widest font-bold hover:bg-primary hover:text-light transition-colors">
                      Log in
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-4 bg-primary text-light border border-primary text-xs uppercase tracking-widest font-bold hover:bg-light hover:text-primary transition-colors">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
