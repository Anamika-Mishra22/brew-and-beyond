import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AboutSection from '../components/AboutSection';
import BookTable from '../components/BookTable';
import Footer from '../components/Footer';
import VisitUs from '../components/VisitUs';
import Testimonials from '../components/Testimonials';
import { useNavigate } from 'react-router-dom';
import Hero11 from '../assets/images/Hero11.jpg';
import Hero2 from '../assets/images/Hero2.jpg';
import Hero3 from '../assets/images/Hero3.jpg';
import Pic1 from '../assets/images/Pic1.jpg';
import Pic2 from '../assets/images/Pic2.jpg';
import Pic3 from '../assets/images/Pic3.jpg';
import Pic4 from '../assets/images/Pic4.jpg';
import happy from '../assets/images/happy.jpg';
import feature from '../assets/images/feature.jpg';
import feature2 from '../assets/images/feature2.jpg';
import feature3 from '../assets/images/feature3.jpg';
import feature4 from '../assets/images/feature4.jpg';
import feature5 from '../assets/images/feature5.jpg';


const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const heroSlides = [
    {
      id: 1,
      title: "Brewed For Coffee Lovers",
      subtitle: 'Where Every Sip Tells A Story',
      desc: 'Step into a cozy haven of rich aromas. A space built for coffee lovers, not just coffee drinkers.',
     image: Hero11
    },
    {
      id: 2,
      title: 'Experience Coffee Perfection',
      subtitle: 'HANDCRAFTED BEANS & COZY AMBIANCE',
      desc: 'Discover our ethically sourced beans, masterfully roasted to deliver rich, smooth, and unforgettable flavors every single day.',
      image: Hero2
    },
    {
      id: 3,
      title: 'Freshly Baked Goodness',
      subtitle: 'PARISIAN STYLE BAKERY',
      desc: 'Pair your warm morning espresso with our flaky butter croissants and freshly baked morning treats.',
      image: Hero3
    }
  ];

  // Sticky Note / Polaroid Image Slideshow States
  const polaroidImages = [
   Pic1 ,
    Pic2,
    Pic3,
   Pic4
  ];

  const [currentPolaroidIndex, setCurrentPolaroidIndex] = useState(0);

  useEffect(() => {
    const polaroidInterval = setInterval(() => {
      setCurrentPolaroidIndex((prevIndex) => (prevIndex + 1) % polaroidImages.length);
    }, 3500);
    return () => clearInterval(polaroidInterval);
  }, [polaroidImages.length]);

  // Hero Auto Slide Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const featuredItems = [
    {
      id: 1,
      title: 'Espresso',
      desc: 'Espresso is a rich and bold coffee brewed by forcing hot water through finely-ground beans for intense flavor.',
      image: feature
    },
    {
      id: 2,
      title: 'Americano Coffee',
      desc: 'Americano coffee is a smooth blend made by diluting espresso with hot water while keeping the rich essence intact.',
      image: feature2
    },
    {
      id: 3,
      title: 'Cold Brew',
      desc: 'Cold brew is a refreshing coffee made by steeping coarse grounds in cold water for hours for a smooth, low-acid taste.',
      image: feature3
    },
    {
      id: 4,
      title: 'Caramel Macchiato',
      desc: 'Layers of rich espresso, vanilla syrup, and steamed milk topped with a sweet caramel drizzle.',
      image: feature4
    },
    {
      id: 5,
      title: 'Matcha Latte',
      desc: 'Finely ground green tea powder whisked with warm milk for an earthy, smooth, and energizing treat.',
      image: feature5
    }
  ];

  const [featureIndex, setFeatureIndex] = useState(0);

  const nextFeature = () => {
    setFeatureIndex((prev) => (prev + 1) % featuredItems.length);
  };

  const prevFeature = () => {
    setFeatureIndex((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1));
  };

  useEffect(() => {
    const featureInterval = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % featuredItems.length);
    }, 3000);
    return () => clearInterval(featureInterval);
  }, [featuredItems.length]);

  const getVisibleItems = () => {
    let items = [];
    for (let i = 0; i < 3; i++) {
      let index = (featureIndex + i) % featuredItems.length;
      items.push(featuredItems[index]);
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-[#b8956e] text-[#3a200a] font-sans selection:bg-[#4a2c11] selection:text-white">

      {/* 1. DYNAMIC HERO CAROUSEL BANNER */}
      <section className="relative h-[520px] md:h-[600px] flex items-center justify-center text-center overflow-hidden group">
        <img 
          key={heroSlides[currentSlide].image}
          src={heroSlides[currentSlide].image} 
          alt="Coffee Ambiance" 
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 transform scale-105 animate-fadeIn"
        />
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-[#4a2c11]/60 hover:bg-[#2b1706] text-[#f7ebd9] p-3 rounded-full transition opacity-0 group-hover:opacity-100 border border-[#613e1c] cursor-pointer"
          aria-label="Previous Slide"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-[#4a2c11]/60 hover:bg-[#2b1706] text-[#f7ebd9] p-3 rounded-full transition opacity-0 group-hover:opacity-100 border border-[#613e1c] cursor-pointer"
          aria-label="Next Slide"
        >
          <FaChevronRight className="w-4 h-4" />
        </button>

        {/* Slide Content */}
        <div className="relative z-10 max-w-4xl px-6 space-y-5 text-[#f7ebd9]">
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-[#e5c197] block animate-fadeIn">
            {heroSlides[currentSlide].subtitle}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif leading-tight font-normal text-white animate-fadeIn">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base max-w-xl mx-auto text-[#ded2c3] font-light leading-relaxed animate-fadeIn">
            {heroSlides[currentSlide].desc}
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <a 
              href="#visit" 
              className="border border-[#f7ebd9]/80 hover:bg-[#f7ebd9] hover:text-[#3a200a] text-[#f7ebd9] font-medium text-xs tracking-wider px-7 py-3.5 rounded-sm transition-all shadow-sm flex items-center justify-center cursor-pointer"
            >
             Discover Brew & Beyond ↓
            </a>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide ? 'w-8 bg-[#e2b887]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. WHY CHOOSE US */}
      <section id="why-choose-us" className="py-14 md:py-18 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-block px-3 py-1 rounded-sm bg-[#1a1612] border border-[#baa080]">
              <span className="text-xs font-serif italic text-[#ecc3a0]">Crafted With Care</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#2e1806] leading-tight">
              Why Choose Us?
            </h2>
            <p className="text-xs md:text-sm text-[#4d3219] leading-relaxed font-light">
              We serve coffee made from the finest beans, freshly brewed to perfection for a rich and delightful taste. Our commitment to ethical sourcing supports local farmers and ensures high-quality beans in every cup.
            </p>
            <p className="text-xs md:text-sm text-[#4d3219] leading-relaxed font-light">
              Each sip offers a unique and unforgettable experience, carefully crafted to brighten your day. In our cozy and welcoming space, you can relax and enjoy the perfect atmosphere for work or leisure.
            </p>
            
            <div className="pt-2 flex items-center gap-6">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#cca880] bg-[#4a2c11] text-[#f7ebd9] flex items-center justify-center font-serif text-xs font-bold">4.9★</div>
                <div className="w-10 h-10 rounded-full border-2 border-[#cca880] bg-[#e4cfb6] text-[#2e1806] flex items-center justify-center font-serif text-xs font-bold">☕</div>
              </div>
              <div>
                <p className="text-xs font-serif font-bold text-[#2e1806]">Rated #1 Specialty Cafe</p>
                <p className="text-[11px] text-[#613e1c]">Loved by 5000+ Coffee Enthusiasts</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative flex justify-center items-center min-h-[420px] py-6">
            <div className="absolute w-[240px] sm:w-[280px] h-[320px] bg-[#e4cfb6] p-3 rounded-sm shadow-md border border-[#c4a98a] rotate-6 translate-x-12 -translate-y-4 opacity-75 hidden sm:block">
              <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500" alt="Back Card" className="w-full h-full object-cover rounded-sm grayscale hover:grayscale-0 transition duration-500" />
            </div>
            <div className="absolute w-[220px] sm:w-[260px] h-[290px] bg-[#d8bc98] p-3 rounded-sm shadow-lg border border-[#baa080] -rotate-12 -translate-x-16 translate-y-6 hidden sm:block">
              <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500" alt="Left Card" className="w-full h-full object-cover rounded-sm" />
            </div>
            <div className="relative z-10 w-[290px] sm:w-[340px] bg-[#f0e2d1] p-4 pb-7 rounded-sm shadow-2xl border border-[#c4a98a] -rotate-2 hover:rotate-0 transition-transform duration-500 group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#cca880]/80 backdrop-blur-sm border border-[#baa080]/50 rotate-1 shadow-sm z-20 pointer-events-none" />
              <div className="relative h-[280px] sm:h-[320px] w-full overflow-hidden rounded-sm bg-[#2b1706]">
                {polaroidImages.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt="Specialty Coffee"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                      index === currentPolaroidIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                    }`}
                  />
                ))}
              </div>
              <div className="pt-3 flex justify-between items-center px-1">
                <span className="font-serif italic text-xs text-[#4a2c11]">~ Freshly Brewed Daily ~</span>
                <span className="text-[10px] font-sans text-[#613e1c] font-semibold tracking-widest uppercase">Brew & Beyond</span>
              </div>
            </div>
            <div className="absolute -bottom-2 right-4 sm:right-12 z-20 bg-[#4a2c11] text-[#f7ebd9] p-4 rounded-full shadow-xl border-2 border-[#e4cfb6] animate-pulse flex flex-col items-center justify-center text-center w-20 h-20">
              <span className="text-[9px] font-bold tracking-widest uppercase text-[#d8bc98]">100%</span>
              <span className="text-[10px] font-serif italic">Organic</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MORNING HAPPY HOURS BANNER */}
      <section className="px-6 max-w-7xl mx-auto mb-12">
        <div className="relative rounded-lg overflow-hidden shadow-md h-[240px] md:h-[280px] flex items-center justify-center text-center">
          <img src={happy}
           alt="Morning Banner" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#3a200a]/60" />
          <div className="relative z-10 max-w-xl px-6 space-y-3 text-[#fdf6ec]">
            <h3 className="text-2xl md:text-4xl font-serif">Morning Happy Hours</h3>
            <p className="text-xs md:text-sm text-[#e0cfba] font-light">
              Start your day with our Morning Happy Hours, where every cup of coffee is brewed fresh just for you. Enjoy special discounts on your favorite blends.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS CAROUSEL / SLIDER */}
      <section id="menu" className="pb-14 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-serif italic text-[#613e1c]">Our Special Selection</span>
            <h3 className="text-3xl font-serif text-[#2e1806]">Featured Brews & Treats</h3>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={prevFeature}
              className="w-10 h-10 rounded-sm bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] flex items-center justify-center transition shadow-sm cursor-pointer"
              aria-label="Previous items"
            >
              ❮
            </button>
            <button 
              onClick={nextFeature}
              className="w-10 h-10 rounded-sm bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] flex items-center justify-center transition shadow-sm cursor-pointer"
              aria-label="Next items"
            >
              ❯
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 overflow-hidden transition-all duration-500">
          {getVisibleItems().map((item) => (
            <div 
              key={item.id} 
              className="bg-[#e4cfb6] p-4 rounded-md border border-[#c4a98a] shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="h-52 rounded-sm overflow-hidden bg-[#2b1706]">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-lg text-[#2e1806] font-bold">{item.title}</h4>
                <p className="text-xs text-[#52371e] leading-relaxed">{item.desc}</p>
              </div>
              <div>
                <button 
                  onClick={() => navigate('/menu')}
                  className="bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] text-xs font-medium px-5 py-2.5 rounded-sm transition flex items-center gap-2 cursor-pointer"
                >
                  ➔ Explore Menu
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EXPERIENCE COFFEE PERFECTION FULL-WIDTH BANNER */}
      <section className="relative h-[240px] flex items-center justify-center text-center overflow-hidden my-12 border-y border-[#b89a77]">
        <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200" alt="Experience Perfection" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#2b1706]/70" />
        <div className="relative z-10 px-4 space-y-2">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#e2b887] block">CRAFTED WITH PASSION</span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#fdf6ec] font-normal tracking-wide">A Symphony of Flavor in Every Sip</h2>
          <p className="text-xs md:text-sm text-[#ded2c3] font-light max-w-lg mx-auto pt-1">Slow-roasted organic beans brewed to elevate your everyday coffee moments.</p>
        </div>
      </section>

      {/* 6. ABOUT & TESTIMONIALS */}
      <AboutSection />
      <Testimonials />

      

      {/* 7. BOOK TABLE SECTION */}
      <div id="book" className="max-w-7xl mx-auto px-6 mb-14">
        <BookTable />
      </div>

      {/* 8. VisitUS */}
      <div id="visit">
        <VisitUs />
      </div>

      {/* 9. FOOTER */}
      <Footer />

    </div>
  );
};

HomePage.displayName = 'HomePage';
export default HomePage;