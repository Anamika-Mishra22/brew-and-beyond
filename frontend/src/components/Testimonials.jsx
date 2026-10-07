import React, { useState, useEffect } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight, FaTimes, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    comment: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch reviews from Backend (Latest reviews first)
  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reviews");
      const data = await response.json();
      if (response.ok) {
        // Reverse array taaki sabse latest review pehle aaye
        setReviews(data.reverse());
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Smooth Auto-sliding effect
  useEffect(() => {
    if (reviews.length <= 3) return;

    const slideInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= reviews.length - 3 ? 0 : prev + 1));
    }, 7000);

    return () => clearInterval(slideInterval);
  }, [reviews.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) {
      setMessage({ type: 'error', text: 'Please fill name and comment!' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Review submitted successfully!' });
        setFormData({ name: '', location: '', rating: 5, comment: '' });
        await fetchReviews();
        
        setTimeout(() => {
          setIsModalOpen(false);
          setMessage({ type: '', text: '' });
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to submit review' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, reviews.length - 3) : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= reviews.length - 3 ? 0 : prev + 1));
  };

  return (
    <section className="py-12 bg-[#b8956e] text-[#3a200a] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="text-left">
            <span className="text-xs font-serif italic text-[#613e1c] block mb-1">Customer Stories</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#2e1806] font-normal">
              What Our Coffee Lovers Say
            </h2>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] text-xs font-medium px-7 py-3.5 rounded-sm transition shadow-sm shrink-0 cursor-pointer"
          >
            <span>➔ Write a Review</span>
          </button>
        </div>

        {/* Carousel / Cards Container */}
        <div className="relative mb-8 px-2 md:px-10">
          
          {/* Nav Controls - Properly Positioned & Fully Visible */}
          {reviews.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-[-8px] md:left-[-15px] top-1/2 -translate-y-1/2 z-30 bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] p-3.5 rounded-full shadow-2xl transition border border-[#613e1c] cursor-pointer"
                aria-label="Previous"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-[-8px] md:right-[-15px] top-1/2 -translate-y-1/2 z-30 bg-[#4a2c11] hover:bg-[#2b1706] text-[#f7ebd9] p-3.5 rounded-full shadow-2xl transition border border-[#613e1c] cursor-pointer"
                aria-label="Next"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Cards Sliding Track */}
          {loading ? (
            <div className="text-center py-16 text-[#4a2c11] font-semibold tracking-wide animate-pulse">
              Brewing reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 text-[#52371e] font-medium">
              No reviews yet. Be the first to share your experience!
            </div>
          ) : (
            <div className="overflow-hidden w-full">
              <div 
                className="flex transition-transform duration-700 ease-in-out gap-6"
                style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
              >
                {reviews.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="min-w-[100%] md:min-w-[calc(33.333%-16px)] group relative bg-[#e4cfb6] p-7 rounded-sm border border-[#c4a98a] shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between overflow-hidden flex-shrink-0"
                  >
                    {/* Watermark Quote Icon */}
                    <FaQuoteLeft className="absolute right-5 top-5 w-10 h-10 text-[#4a2c11]/10 group-hover:text-[#4a2c11]/20 transition-colors" />

                    <div className="relative z-10">
                      {/* User Profile */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-11 h-11 rounded-full bg-[#4a2c11] text-[#f7ebd9] font-serif font-bold text-sm flex items-center justify-center border border-[#613e1c]">
                          {getInitials(item.name)}
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-[#2e1806] text-base">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-[#613e1c] font-medium uppercase tracking-wider">
                            {item.location || 'Cafe Guest'}
                          </p>
                        </div>
                      </div>

                      {/* Star Rating Badge */}
                      <div className="flex text-[#b87d2a] gap-1 bg-[#d8bc98] px-3 py-1 rounded-sm w-fit mb-3 border border-[#baa080]">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < (item.rating || 5) ? "w-3 h-3 text-[#7a4812]" : "w-3 h-3 text-[#baa080]"}
                          />
                        ))}
                      </div>

                      {/* Review Comment */}
                      <p className="text-[#4d3219] text-xs leading-relaxed italic font-serif">
                        "{item.comment || item.review}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Banner */}
        <div className="bg-[#4a2c11] text-[#f7ebd9] rounded-sm p-8 md:p-10 shadow-lg border border-[#613e1c]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#613e1c]">
            <div className="pt-4 md:pt-0">
              <h3 className="text-3xl md:text-4xl font-serif text-[#ffffff] font-normal mb-1">5000+</h3>
              <p className="text-xs text-[#d8bc98] font-medium tracking-wider uppercase">Happy Customers</p>
            </div>

            <div className="pt-4 md:pt-0">
              <h3 className="text-3xl md:text-4xl font-serif text-[#ffffff] font-normal mb-1">4.9★</h3>
              <p className="text-xs text-[#d8bc98] font-medium tracking-wider uppercase">Average Rating</p>
            </div>

            <div className="pt-4 md:pt-0">
              <h3 className="text-3xl md:text-4xl font-serif text-[#ffffff] font-normal mb-1">10K+</h3>
              <p className="text-xs text-[#d8bc98] font-medium tracking-wider uppercase">Orders Delivered</p>
            </div>

            <div className="pt-4 md:pt-0">
              <h3 className="text-3xl md:text-4xl font-serif text-[#ffffff] font-normal mb-1">100%</h3>
              <p className="text-xs text-[#d8bc98] font-medium tracking-wider uppercase">Fresh Quality</p>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18110b]/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#e4cfb6] rounded-sm max-w-lg w-full p-8 shadow-2xl relative border border-[#c4a98a] text-[#3a200a]">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 text-[#613e1c] hover:text-[#2e1806] p-1.5 rounded-full hover:bg-[#d8bc98] transition-all cursor-pointer"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-serif text-[#2e1806] font-bold mb-1">Write a Review</h3>
            <p className="text-xs text-[#52371e] mb-6 font-light">Share your experience with Brew & Beyond!</p>

            {message.text && (
              <div className={`p-3.5 rounded-sm text-xs font-bold mb-5 text-center ${
                message.type === 'success' ? 'bg-[#d8bc98] text-[#2e1806] border border-[#baa080]' : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4a2c11] uppercase tracking-wider mb-1.5">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Anu Mishra"
                  required
                  className="w-full px-4 py-3 rounded-sm border border-[#c4a98a] text-xs focus:outline-none focus:border-[#4a2c11] transition-all bg-[#f0e2d1] text-[#2e1806] placeholder-[#8c7158]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a2c11] uppercase tracking-wider mb-1.5">City / Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Lucknow"
                  className="w-full px-4 py-3 rounded-sm border border-[#c4a98a] text-xs focus:outline-none focus:border-[#4a2c11] transition-all bg-[#f0e2d1] text-[#2e1806] placeholder-[#8c7158]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a2c11] uppercase tracking-wider mb-1.5">Your Rating *</label>
                <div className="flex gap-2 text-2xl py-1 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                    >
                      <FaStar
                        className={
                          star <= (hoverRating || formData.rating)
                            ? "text-[#7a4812]"
                            : "text-[#baa080]"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a2c11] uppercase tracking-wider mb-1.5">Your Review *</label>
                <textarea
                  name="comment"
                  rows="3"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="How was the coffee and ambiance?"
                  required
                  className="w-full px-4 py-3 rounded-sm border border-[#c4a98a] text-xs focus:outline-none focus:border-[#4a2c11] transition-all resize-none bg-[#f0e2d1] text-[#2e1806] placeholder-[#8c7158]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#4a2c11] hover:bg-[#2b1706] disabled:bg-[#4a2c11]/60 text-[#f7ebd9] font-medium rounded-sm shadow-md transition-all text-xs uppercase tracking-wider cursor-pointer"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};

export default Testimonials;