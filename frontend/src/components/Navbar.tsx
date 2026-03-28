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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-white p-2 rounded-lg group-hover:bg-secondary transition-colors">
              <BookOpen size={24} />
            </div>
            <span className={`font-serif font-bold text-xl tracking-tight ${scrolled ? 'text-primary' : 'text-primary'}`}>JurisMemo</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-700 hover:text-secondary transition-colors">
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  {user.id === 1 && (
                    <Link href="/admin" className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                      Admin
                    </Link>
                  )}
                  <button onClick={logout} className="btn-primary py-2 px-5 text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                    Log in
                  </Link>
                  <Link href="/register" className="btn-primary py-2 px-5 text-sm">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-primary focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-secondary rounded-md">
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3 px-3">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="w-full text-center py-3 border border-gray-200 text-gray-800 rounded-md font-medium">
                      Dashboard
                    </Link>
                    {user.id === 1 && (
                      <Link href="/admin" onClick={() => setIsOpen(false)} className="w-full text-center py-3 border border-red-200 text-red-600 rounded-md font-bold bg-red-50">
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-center py-3 bg-primary text-white rounded-md font-medium">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-3 border border-gray-200 text-gray-800 rounded-md font-medium">
                      Log in
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-3 bg-primary text-white rounded-md font-medium">
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
