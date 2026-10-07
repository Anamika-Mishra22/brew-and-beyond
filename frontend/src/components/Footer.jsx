import React from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaTwitter, 
  FaFacebookF, 
  FaYoutube, 
  FaLinkedinIn 
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#18110b] text-[#c4b5a5] pt-16 pb-8 border-t border-[#2d2117]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#2d2117]">
        
        {/* Column 1: Company / Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[#e2b887] font-serif italic text-xs">Company</span>
            <div className="w-8 h-[1px] bg-[#e2b887]/40"></div>
          </div>
          <h3 className="text-2xl font-serif text-[#f4efe8] tracking-wider">
            BREW & BEYOND
          </h3>
          <p className="text-xs text-[#a89b8d] leading-relaxed font-light">
            Experience handcrafted specialty coffee, freshly baked artisanal delights, and unforgettable culinary moments in a warm, rustic atmosphere.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {[FaTwitter, FaFacebookF, FaYoutube, FaLinkedinIn].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="w-8 h-8 rounded-sm border border-[#36261a] bg-[#23170f] flex items-center justify-center text-[#c4b5a5] hover:bg-[#4a2c11] hover:border-[#613e1c] hover:text-[#f7ebd9] transition duration-300"
              >
                <Icon size={12} />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Contact Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[#e2b887] font-serif italic text-xs">Contact</span>
            <div className="w-8 h-[1px] bg-[#e2b887]/40"></div>
          </div>
          <ul className="space-y-3 text-xs text-[#a89b8d] font-light">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-[#e2b887] mt-0.5 flex-shrink-0 text-sm" />
              <span>226003 Napier Street, Chowk, Lucknow, India</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-[#e2b887] flex-shrink-0" />
              <span>+91 81270 81254</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-[#e2b887] flex-shrink-0" />
              <span>info@brewandbeyond.com</span>
            </li>
          </ul>
        </div>

        {/* Column 3: Opening Hours */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[#e2b887] font-serif italic text-xs">Opening Hours</span>
            <div className="w-8 h-[1px] bg-[#e2b887]/40"></div>
          </div>
          <div className="space-y-2 text-xs font-light">
            <h4 className="font-serif text-[#f4efe8]">Monday - Saturday</h4>
            <p className="text-[#a89b8d]">09:00 AM - 10:00 PM</p>
            <h4 className="font-serif text-[#f4efe8] pt-2">Sunday</h4>
            <p className="text-[#a89b8d]">10:00 AM - 11:00 PM</p>
          </div>
        </div>

        {/* Column 4: Newsletter Subscription */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[#e2b887] font-serif italic text-xs">Newsletter</span>
            <div className="w-8 h-[1px] bg-[#e2b887]/40"></div>
          </div>
          <p className="text-xs text-[#a89b8d] font-light">
            Subscribe to our newsletter for exclusive specialty coffee offers and seasonal updates.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="relative mt-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full py-2.5 pl-3.5 pr-24 bg-[#23170f] border border-[#36261a] rounded-sm text-[#f4efe8] placeholder-[#7a6a5b] text-xs focus:outline-none focus:border-[#e2b887]"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] font-medium px-3.5 rounded-sm text-[10px] uppercase tracking-wider transition border border-[#613e1c]"
            >
              SignUp
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Copyright Section */}
      <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8c7a6b] gap-4">
        <p>© <span className="text-[#c4b5a5] font-medium">Brew & Beyond</span>, All Rights Reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#e2b887] transition">Home</a>
          <a href="#" className="hover:text-[#e2b887] transition">Cookies</a>
          <a href="#" className="hover:text-[#e2b887] transition">Help</a>
          <a href="#" className="hover:text-[#e2b887] transition">FAQs</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;