"use client";

import { motion } from "framer-motion";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-light relative selection:bg-secondary/20 selection:text-primary">
        
        {/* HERO SECTION */}
        <section className="pt-40 pb-24 lg:pt-56 lg:pb-32 border-b border-primary relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end"
            >
              
              <div className="lg:col-span-8 flex flex-col justify-end">
                <motion.div variants={fadeUp} className="mb-10 overflow-hidden">
                  <span className="inline-block border border-primary px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] font-bold text-primary">
                    Vol. I — Nigerian Legal Studies
                  </span>
                </motion.div>
                
                <motion.h1 
                  variants={fadeUp} 
                  className="text-6xl md:text-8xl lg:text-[8rem] leading-[0.85] font-serif tracking-tighter text-primary uppercase"
                >
                  <span className="block">Master Your</span>
                  <span className="block text-secondary italic pr-8">Legal</span>
                  <span className="block">Studies.</span>
                </motion.h1>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-end pb-2 lg:pl-12 border-l-0 lg:border-l border-primary">
                <motion.p variants={fadeUp} className="text-lg md:text-xl text-primary/80 leading-relaxed font-sans mb-12 max-w-md">
                  Access comprehensive, verified lecture notes, past questions, and academic resources tailored for high-achieving law students.
                </motion.p>
                
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register" className="btn-primary py-5 px-10 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 group w-full sm:w-auto">
                    Begin Journey
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </Link>
                </motion.div>
                
                <motion.div variants={fadeUp} className="mt-16 pt-8 border-t border-primary/20 flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`w-12 h-12 rounded-none border border-light bg-gray-${i*100} flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all duration-500`}>
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Student" />
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-1">Trusted By</p>
                    <p className="font-serif text-2xl text-secondary italic">500+ Scholars</p>
                  </div>
                </motion.div>
              </div>

            </motion.div>
          </div>
        </section>

        {/* IMAGE BREAK SECTION */}
        <section className="relative h-[50vh] md:h-[70vh] w-full border-b border-primary overflow-hidden">
          <motion.div 
            initial={{ scale: 1.05, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="absolute inset-0 grayscale-[50%] hover:grayscale-0 transition-all duration-1000"
          >
            <img 
              src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=2400" 
              alt="Law Library" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/30 mix-blend-multiply"></div>
          </motion.div>
        </section>

        {/* FEATURES SECTION - EDITORIAL GRID */}
        <section id="features" className="bg-light relative border-b border-primary">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-primary">
              
              <div className="lg:col-span-4 p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-primary flex flex-col justify-between">
                <div>
                  <span className="inline-block border text-center border-primary px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-primary mb-12">
                    Section 01
                  </span>
                  <h2 className="text-4xl md:text-6xl font-serif tracking-tighter text-primary uppercase leading-[0.9] mb-8">
                    An <span className="text-secondary italic">Arsenal</span> <br/> of Knowledge
                  </h2>
                </div>
                <p className="text-base text-primary/80 leading-relaxed font-sans mt-8 lg:mt-0 max-w-sm">
                  Built specifically for the rigorous demands of legal education. We provide structured, verified, and uncompromising academic materials.
                </p>
              </div>
              
              <div className="lg:col-span-8 lg:grid lg:grid-cols-2">
                {[
                  { 
                    num: "I.",
                    title: "Comprehensive Notes", 
                    desc: "Expertly curated lecture notes covering core courses like Constitutional Law, Criminal Law, and Property Law.",
                  },
                  { 
                    num: "II.",
                    title: "Offline Access", 
                    desc: "Download all materials in PDF formats for convenient access anywhere, anytime, without an internet connection.",
                  },
                  { 
                    num: "III.",
                    title: "Always Updated", 
                    desc: "Content is continuously revised to reflect the current curriculum and recent landmark judicial pronouncements.",
                  },
                  { 
                    num: "IV.",
                    title: "Case Summaries", 
                    desc: "Condensations of landmark Supreme Court decisions, focusing on critical ratios and essential obiter dicta.",
                  }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className={`p-10 lg:p-16 border-b text-primary hover:bg-primary hover:text-light transition-colors duration-500 group ${i % 2 === 0 ? 'border-primary lg:border-r' : 'border-primary'} ${i >= 2 ? 'lg:border-b-0' : ''}`}
                  >
                    <span className="font-serif text-secondary text-3xl italic mb-10 block group-hover:text-accent transition-colors">{feature.num}</span>
                    <h3 className="text-2xl font-serif uppercase tracking-tight mb-5">{feature.title}</h3>
                    <p className="text-sm leading-relaxed opacity-80 font-sans">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* TESTIMONIALS - PULL QUOTES */}
        <section className="py-32 bg-dark text-light border-b border-primary overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6 border-b border-light/20 pb-12">
              <div className="max-w-2xl">
                <span className="inline-block border border-light/30 px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-light mb-8">
                  Section 02 — Voices
                </span>
                <h2 className="text-5xl md:text-7xl font-serif tracking-tighter uppercase leading-[0.9]">
                  Words from <br/> <span className="text-accent italic">Scholars</span>
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24 relative">
              {[
                { name: "Emeka Emmanuel", role: "400L Law Student, IMSU", quote: "JurisMemo has been a lifesaver. The organized notes cut my study time in half and drastically improved my CGPA this semester." },
                { name: "Sarah Okafor", role: "Graduate, Nigerian Law School", quote: "The foundation I got from utilizing JurisMemo's materials during undergrad gave me a huge advantage at the Law School." },
                { name: "David Nwachukwu", role: "300L Law Student", quote: "The ability to download notes as PDFs means I can study on the bus without worrying about data. Absolutely brilliant platform." }
              ].map((t, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
                  className="relative group"
                >
                  <div className="absolute -top-12 -left-6 text-9xl text-light/5 font-serif leading-none group-hover:text-accent/10 transition-colors duration-700">"</div>
                  <p className="text-xl md:text-2xl text-light/90 mb-12 relative z-10 font-serif leading-snug italic">"{t.quote}"</p>
                  <div className="pt-6 border-t border-light/20">
                    <h4 className="font-bold text-light uppercase tracking-widest text-[11px] mb-2">{t.name}</h4>
                    <p className="text-[10px] text-accent uppercase tracking-widest">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-40 bg-secondary relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center opacity-[0.03] pointer-events-none">
            <span className="text-[30vw] font-serif uppercase tracking-tighter leading-none whitespace-nowrap text-light">Excellence</span>
          </div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-serif font-bold text-light uppercase tracking-tighter mb-12 leading-[1.1]"
            >
              Elevate Your <br/> <span className="italic font-normal text-accent/90">Academic</span> Standard
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <Link href="/register" className="bg-light text-secondary px-12 py-5 text-sm uppercase tracking-[0.2em] font-bold border border-light hover:bg-transparent hover:text-light transition-colors duration-500">
                Register Now
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
