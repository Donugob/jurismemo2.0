import Link from 'next/link';
import { BookOpen, MapPin, Mail, Phone } from 'lucide-react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-white/10 p-2 rounded-lg group-hover:bg-secondary transition-colors">
                <BookOpen size={24} className="text-white" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-white">JurisMemo</span>
            </Link>
            <p className="text-sm leading-relaxed opacity-80">
              Your trusted platform for premium law lecture notes and academic resources, dedicated to helping law students in Nigeria achieve academic excellence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300"><FaTwitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300"><FaFacebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300"><FaInstagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300"><FaLinkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-serif font-semibold text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-0.5 after:bg-secondary">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-secondary transition-colors text-sm">Home</Link></li>
              <li><Link href="/about" className="hover:text-secondary transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition-colors text-sm">Contact</Link></li>
              <li><Link href="/dashboard" className="hover:text-secondary transition-colors text-sm">Student Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-serif font-semibold text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-0.5 after:bg-secondary">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/resources/notes" className="hover:text-secondary transition-colors text-sm">Lecture Notes</Link></li>
              <li><Link href="/resources/past-questions" className="hover:text-secondary transition-colors text-sm">Past Questions</Link></li>
              <li><Link href="/resources/cases" className="hover:text-secondary transition-colors text-sm">Case Summaries</Link></li>
              <li><Link href="/news" className="hover:text-secondary transition-colors text-sm">Faculty News</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-serif font-semibold text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-0.5 after:bg-secondary">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm items-start">
                <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                <span>Faculty of Law, Imo State University, Owerri, Nigeria</span>
              </li>
              <li className="flex gap-3 text-sm items-center">
                <Mail size={18} className="text-secondary shrink-0" />
                <a href="mailto:donugob1@gmail.com" className="hover:text-white transition-colors">donugob1@gmail.com</a>
              </li>
              <li className="flex gap-3 text-sm items-center">
                <Phone size={18} className="text-secondary shrink-0" />
                <a href="tel:+2348176642758" className="hover:text-white transition-colors">+234 817 664 2758</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-60">© {new Date().getFullYear()} JurisMemo. All rights reserved.</p>
          <div className="flex gap-6 text-sm opacity-60">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
