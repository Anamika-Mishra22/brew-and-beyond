import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaExternalLinkAlt } from 'react-icons/fa';

const VisitUs = () => {
  return (
    <section className="pt-4 pb-16 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Clean Details */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2e1806] font-normal">Visit Brew & Beyond</h2>
           <p className="text-xs md:text-sm text-[#52371e] mt-3 leading-relaxed">
  Looking for Lucknow's finest specialty coffee or your favorite neighborhood spot? Brew & Beyond is your warm neighborhood escape — crafted for rich brews, artisanal bites, and timeless conversations.
</p>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-[#52371e]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#4a2c11] text-[#f7ebd9] flex items-center justify-center shrink-0 mt-0.5">
                <FaMapMarkerAlt size={14} />
              </div>
              <div>
                <p className="font-bold text-[#2e1806]">Location</p>
                <p className="leading-relaxed">Lucknow, Uttar Pradesh 226003, India</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#4a2c11] text-[#f7ebd9] flex items-center justify-center shrink-0">
                <FaPhoneAlt size={13} />
              </div>
              <div>
                <p className="font-bold text-[#2e1806]">Phone / WhatsApp</p>
                <p className="font-mono">+91 81 2708 31254</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#4a2c11] text-[#4a2c11] hover:bg-[#4a2c11] hover:text-[#f7ebd9] px-6 py-3 rounded-md font-medium text-xs tracking-wider uppercase transition-all cursor-pointer shadow-sm"
            >
              <FaExternalLinkAlt /> Find Us On Google Maps
            </a>
          </div>
        </div>

        {/* Right Side: Clean Google Map Embed */}
        <div className="lg:col-span-7 h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg border border-[#c4a98a]/40">
          <iframe
            title="Cafe Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.102394584288!2d80.94615!3d26.846708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDUwJzQ4LjIiTiA4MCU1NiciNDYuMiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

      </div>
    </section>
  );
};

export default VisitUs;