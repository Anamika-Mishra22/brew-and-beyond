import React, { useEffect, useRef, useState } from 'react';
import { FaUtensils } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';



//images
import imgs1 from '../assets/images/imgs1.jpg';
import imgs2 from '../assets/images/imgs2.jpg';
import imgs3 from '../assets/images/imgs3.jpg';
import imgs4 from '../assets/images/imgs4.jpg';


const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  // Scroll detection trigger
  useEffect(() => {
    const currentRef = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-12 px-6 bg-[#b8956e] text-[#3a200a] overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SIDE: Image Grid */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Column 1 */}
          <div className="space-y-4">
            <div 
              className={`overflow-hidden rounded-sm shadow-sm border border-[#baa080] transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${
                isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-90'
              }`}
            >
              <img
                src={ imgs1}
                alt="Cafe Interior"
                className="w-full h-64 md:h-72 object-cover hover:scale-110 transition duration-500"
              />
            </div>

            <div 
              className={`overflow-hidden rounded-sm shadow-sm border border-[#baa080] w-3/4 justify-self-end transition-all duration-1000 delay-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${
                isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-28 opacity-0 scale-75'
              }`}
            >
              <img
                src={imgs2}
                alt="Fresh Coffee"
                className="w-full h-40 md:h-48 object-cover hover:scale-110 transition duration-500"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4 pt-8">
            <div 
              className={`overflow-hidden rounded-sm shadow-sm border border-[#baa080] w-3/4 transition-all duration-1000 delay-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${
                isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-90'
              }`}
            >
              <img
                src={imgs3}
                alt="Barista Pouring"
                className="w-full h-40 md:h-48 object-cover hover:scale-110 transition duration-500"
              />
            </div>

            <div 
              className={`overflow-hidden rounded-sm shadow-sm border border-[#baa080] transition-all duration-1000 delay-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${
                isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-32 opacity-0 scale-75'
              }`}
            >
              <img
                src={imgs4}
                alt="Cafe Food Dish"
                className="w-full h-64 md:h-72 object-cover hover:scale-110 transition duration-500"
              />
            </div>
          </div>

        </div>

        {/* RIGHT SIDE: Text Content */}
        <div 
          className={`space-y-5 transition-all duration-1000 delay-300 transform ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-16 opacity-0'
          }`}
        >
          <span className="text-xs font-serif italic text-[#613e1c] block mb-1">
            Featured Story
          </span>

          <h2 className="text-3xl md:text-5xl font-serif text-[#2e1806] font-normal leading-tight flex items-center gap-3">
            Welcome to <FaUtensils className="text-[#4a2c11] animate-bounce text-2xl md:text-3xl" /> Brew & Beyond
          </h2>

          <p className="text-xs md:text-sm text-[#4d3219] leading-relaxed">
            We serve coffee made from the finest beans, freshly brewed to perfection for a rich and delightful taste. Our commitment to ethical sourcing supports local farmers and ensures high-quality beans in every cup.
          </p>

          <p className="text-xs md:text-sm text-[#4d3219] leading-relaxed">
            With a wide variety of flavors and options, we cater to every coffee lover's preference. Your satisfaction is our priority and we strive to deliver excellence with every visit.
          </p>

          {/* Animated Stats Box */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-l-2 border-[#4a2c11] pl-6">
            <div className="flex items-center gap-4 group cursor-default">
              <span className="text-4xl md:text-5xl font-serif text-[#2e1806] group-hover:scale-110 transition duration-300">15</span>
              <div>
                <p className="text-[11px] text-[#613e1c] uppercase font-semibold">Years of</p>
                <p className="font-serif font-bold text-[#2e1806] text-xs tracking-wider">EXPERIENCE</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group cursor-default">
              <span className="text-4xl md:text-5xl font-serif text-[#2e1806] group-hover:scale-110 transition duration-300">50</span>
              <div>
                <p className="text-[11px] text-[#613e1c] uppercase font-semibold">Popular</p>
                <p className="font-serif font-bold text-[#2e1806] text-xs tracking-wider">MASTER CHEFS</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => navigate('/menu')}
              className="bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] font-medium text-xs tracking-wider px-7 py-3.5 rounded-sm transition flex items-center gap-2 shadow-sm"
            >
              ➔ Explore Menu
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;