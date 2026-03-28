"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Get In Touch</h1>
            <p className="text-lg text-gray-600">
              Have a question about our resources or want to contribute to the platform? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6" onSubmit={(e) => e.preventDefault()}>Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" className="input-field" placeholder="John" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" className="input-field" placeholder="Doe" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" className="input-field" placeholder="john@example.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input type="text" className="input-field" placeholder="How can we help?" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea className="input-field min-h-[150px] resize-none" placeholder="Write your message here..." required></textarea>
                </div>
                <button type="submit" className="btn-primary w-full py-4 text-base font-medium flex items-center justify-center gap-2">
                  <Send size={18} /> Send Message
                </button>
              </form>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Our team is available during regular academic hours. We strive to respond to all inquiries within 24-48 hours.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex bg-white p-6 rounded-xl border border-gray-100 shadow-sm gap-4 items-start">
                  <div className="bg-blue-50 text-secondary p-3 rounded-lg shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Office Location</h4>
                    <p className="text-gray-600">Faculty of Law,<br />Imo State University, Owerri,<br />Imo State, Nigeria</p>
                  </div>
                </div>
                
                <div className="flex bg-white p-6 rounded-xl border border-gray-100 shadow-sm gap-4 items-center">
                  <div className="bg-blue-50 text-secondary p-3 rounded-lg shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
                    <a href="mailto:donugob1@gmail.com" className="text-secondary hover:underline transition-all">donugob1@gmail.com</a>
                  </div>
                </div>
                
                <div className="flex bg-white p-6 rounded-xl border border-gray-100 shadow-sm gap-4 items-center">
                  <div className="bg-blue-50 text-secondary p-3 rounded-lg shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Call Us</h4>
                    <a href="tel:+2348176642758" className="text-secondary hover:underline transition-all">+234 817 664 2758</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
