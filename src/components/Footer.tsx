import Link from "next/link";
import { Mail, MapPin, Phone, Globe, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full pt-24 pb-12 bg-white border-t border-black/5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-4 md:px-16 max-w-[1280px] mx-auto mb-20">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-6 bg-magenta block rounded-sm" />
            <span className="text-xl font-extrabold tracking-tighter text-on-surface">
              PELMEL<span className="text-cyan">TECH</span>
            </span>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Precision printing and premium industrial fabrication for brands that demand excellence.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-on-surface-variant hover:text-cyan hover:border-cyan transition-all">
              <Globe size={16} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-on-surface-variant hover:text-magenta hover:border-magenta transition-all">
              <Share2 size={16} />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold tracking-[0.1em] uppercase text-magenta">Navigate</h4>
          <ul className="space-y-3">
            <li><Link href="/services" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Services</Link></li>
            <li><Link href="/catalog" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Product Catalog</Link></li>
            <li><Link href="/portfolio" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Portfolio</Link></li>
            <li><Link href="/investors" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Investors</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold tracking-[0.1em] uppercase text-cyan-dark">Legal</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Sustainability</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold tracking-[0.1em] uppercase text-on-surface">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm text-on-surface-variant">
              <MapPin size={14} className="text-cyan shrink-0" />
              123 Precision Way, Print District
            </li>
            <li className="flex items-center gap-3 text-sm text-on-surface-variant">
              <Mail size={14} className="text-magenta shrink-0" />
              contact@pelmeltech.com
            </li>
            <li className="flex items-center gap-3 text-sm text-on-surface-variant">
              <Phone size={14} className="text-cyan shrink-0" />
              +1 (555) 012-3456
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-16 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/50">
          &copy; 2025 PelmelTech. All rights reserved.
        </p>
        <div className="flex gap-6 text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/50">
          <a href="#" className="hover:text-on-surface-variant transition-colors">Status</a>
          <a href="#" className="hover:text-on-surface-variant transition-colors">Cookies</a>
          <a href="#" className="hover:text-on-surface-variant transition-colors">Security</a>
        </div>
      </div>
    </footer>
  );
}
