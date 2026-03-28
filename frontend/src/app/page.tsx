"use client";

import { motion } from "framer-motion";
import Link from 'next/link';
import { ArrowRight, BookOpen, Download, Clock, Star, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
} as const;

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl shadow-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-primary/5 blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={staggerContainer}
                className="max-w-2xl"
              >
                <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-secondary text-sm font-medium mb-6">
                  Nigeria's Premium Law Resource
                </motion.div>
                <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary leading-tight mb-6">
                  Master Your Legal Studies with <span className="text-secondary relative">JurisMemo
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-secondary/20 -z-10 rounded"></span>
                  </span>
                </motion.h1>
                <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  Access comprehensive lecture notes, past questions, and academic resources tailored for law students at Imo State University and beyond. High-quality materials for high-achieving students.
                </motion.p>
                
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register" className="btn-primary py-4 px-8 text-lg font-medium flex items-center justify-center gap-2 group">
                    Get Started Free 
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="#features" className="btn-outline py-4 px-8 text-lg font-medium flex items-center justify-center">
                    Explore Resources
                  </Link>
                </motion.div>
                
                <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4 text-sm text-gray-500 font-medium">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-${i*100} flex items-center justify-center overflow-hidden`}>
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Student" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex text-yellow-500 mb-0.5"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                    <p>Trusted by 500+ Law Students</p>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200" 
                  alt="Law Books and Gavel" 
                  className="rounded-2xl shadow-2xl w-full object-cover h-[600px] border border-gray-100"
                />
                
                {/* Floating Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4"
                >
                  <div className="bg-green-100 text-green-600 p-3 rounded-full">
                    <Download size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">1,200+</p>
                    <p className="text-gray-500 font-medium text-sm">Downloads This Week</p>
                  </div>
                </motion.div>
              </motion.div>
              
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Everything You Need to Excel</h2>
              <p className="text-gray-600 text-lg">Built specifically for the rigorous demands of legal education. We provide structured, verified, and accessible reading materials.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: <BookOpen size={30} className="text-white" />, 
                  title: "Comprehensive Notes", 
                  desc: "Expertly curated lecture notes covering core courses like Constitutional Law, Criminal Law, and Property Law.",
                  color: "bg-blue-500"
                },
                { 
                  icon: <Download size={30} className="text-white" />, 
                  title: "Offline Access", 
                  desc: "Download all materials in PDF and MP3 formats for convenient access anywhere, anytime, without an internet connection.",
                  color: "bg-primary"
                },
                { 
                  icon: <Clock size={30} className="text-white" />, 
                  title: "Always Updated", 
                  desc: "Content is continuously revised to reflect the current curriculum and recent judicial pronouncements.",
                  color: "bg-accent"
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="card-hover bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-md`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">What Our Scholars Say</h2>
                <p className="text-gray-600">Join hundreds of students who rely on JurisMemo for their academic success.</p>
              </div>
              <Link href="/register" className="btn-secondary whitespace-nowrap hidden md:inline-flex">Join the Community</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Emeka Emmanuel", role: "400L Law Student, IMSU", quote: "JurisMemo has been a lifesaver. The organized notes cut my study time in half and drastically improved my CGPA this semester.", img: "https://i.pravatar.cc/150?img=11" },
                { name: "Sarah Okafor", role: "Graduate, Nigerian Law School", quote: "The foundation I got from utilizing JurisMemo's materials during undergrad gave me a huge advantage at the Law School.", img: "https://i.pravatar.cc/150?img=5" },
                { name: "David Nwachukwu", role: "300L Law Student", quote: "The ability to download notes as PDFs means I can study on the bus without worrying about data. Absolutely brilliant platform.", img: "https://i.pravatar.cc/150?img=12" }
              ].map((t, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
                >
                  <div className="text-6xl text-gray-200 absolute top-4 right-6 font-serif opacity-50">"</div>
                  <p className="text-gray-700 mb-6 relative z-10 italic leading-relaxed text-lg">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-900">{t.name}</h4>
                      <p className="text-sm text-secondary font-medium">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 relative overflow-hidden bg-primary">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">Ready to Elevate Your Academic Performance?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Create a free account today and get instant access to the most comprehensive legal repository in Nigeria.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="btn-secondary py-4 px-10 text-lg font-medium shadow-[0_0_20px_rgba(52,152,219,0.4)]">
                Create Free Account
              </Link>
            </div>
            <p className="text-sm text-blue-200 mt-6 mt-4">Takes less than 2 minutes. No credit card required.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
