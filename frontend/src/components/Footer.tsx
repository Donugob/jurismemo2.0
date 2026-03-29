import Link from 'next/link';
import { BookOpen, MapPin, Mail, Phone } from 'lucide-react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-primary text-light pt-24 pb-12 border-t-[16px] border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20 relative">

          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="border border-light/30 p-2 group-hover:border-accent transition-colors">
                <BookOpen size={28} className="text-light group-hover:text-accent stroke-[1.5]" />
              </div>
              <span className="font-serif font-bold text-3xl tracking-tighter uppercase text-light">JurisMemo</span>
            </Link>
            <p className="text-base leading-relaxed text-light/80 max-w-sm font-serif italic">
              "Your trusted platform for premium law lecture notes and academic resources, dedicated to helping law students in Nigeria achieve academic excellence."
            </p>
            <div className="flex gap-4 pt-4">
              <a href="https://x.com/Don_ugob" className="w-12 h-12 border border-light/20 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"><FaTwitter size={18} /></a>
              <a href="https://x.com/Don_ugob" className="w-12 h-12 border border-light/20 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"><FaFacebook size={18} /></a>
              <a href="https://x.com/Don_ugob" className="w-12 h-12 border border-light/20 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"><FaInstagram size={18} /></a>
              <a href="https://x.com/Don_ugob" className="w-12 h-12 border border-light/20 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"><FaLinkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-accent font-sans font-bold text-xs uppercase tracking-[0.2em] mb-8">Navigation</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-accent transition-colors text-sm font-medium tracking-wide">Home</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors text-sm font-medium tracking-wide">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors text-sm font-medium tracking-wide">Contact</Link></li>
              <li><Link href="/dashboard" className="hover:text-accent transition-colors text-sm font-medium tracking-wide">Student Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h4 className="text-accent font-sans font-bold text-xs uppercase tracking-[0.2em] mb-8">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="hover:text-accent transition-colors text-sm font-medium tracking-wide">Lecture Notes</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors text-sm font-medium tracking-wide">Past Questions</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors text-sm font-medium tracking-wide">Case Summaries</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors text-sm font-medium tracking-wide">Faculty News</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-accent font-sans font-bold text-xs uppercase tracking-[0.2em] mb-8">Direct Contact</h4>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <MapPin size={20} className="text-accent shrink-0 mt-0.5 stroke-[1.5]" />
                <span className="text-sm leading-relaxed text-light/90 font-serif italic">Faculty of Law,<br />Imo State University,<br />Owerri, Nigeria</span>
              </li>
              <li className="flex gap-4 items-center">
                <Mail size={20} className="text-accent shrink-0 stroke-[1.5]" />
                <a href="mailto:donugob1@gmail.com" className="hover:text-accent transition-colors text-sm tracking-wide">donugob1@gmail.com</a>
              </li>
              <li className="flex gap-4 items-center">
                <Phone size={20} className="text-accent shrink-0 stroke-[1.5]" />
                <a href="tel:+2348176642758" className="hover:text-accent transition-colors text-sm tracking-wide">+234 817 664 2758</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-light/20 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs uppercase tracking-widest text-light/60 font-bold">© {new Date().getFullYear()} JurisMemo. All rights reserved.</p>
          <div className="flex gap-8 text-xs uppercase tracking-widest text-light/60 font-bold">
            <Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
