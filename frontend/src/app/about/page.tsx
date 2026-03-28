"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, GraduationCap, Scale, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">About JurisMemo</h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Empowering law students with high-quality, accessible resources to achieve academic excellence and master the legal profession.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-2xl border border-gray-100"
            >
              <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center mb-6">
                <Scale size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To democratize access to premium legal education materials. We believe every law student in Nigeria deserves the best resources to pass their exams with flying colors, regardless of their background.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-2xl border border-gray-100"
            >
              <div className="w-12 h-12 bg-secondary text-white rounded-xl flex items-center justify-center mb-6">
                <Award size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the premier academic repository and largest digital community for law students across Africa, producing highly competent legal professionals through better education.
              </p>
            </motion.div>
          </div>
          
          <div className="prose prose-lg prose-blue max-w-none text-gray-700">
            <h2 className="text-3xl font-serif font-bold text-primary mb-6">Our Story</h2>
            <p className="mb-6">
              JurisMemo started as a small initiative at Imo State University to help students who struggled to find reliable lecture notes. Recognizing the massive gap in organized, high-quality study materials, our founder launched this platform to centralize resources.
            </p>
            <p>
              Today, JurisMemo serves thousands of students, offering beautifully formatted notes, case summaries, and past questions. We continue to evolve, integrating modern tools to make legal study not just bearable, but deeply engaging.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
