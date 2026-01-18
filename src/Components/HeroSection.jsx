import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

// Mock Data
const signatureFragrances = [
  {
    name: "AMIR AL OUD",
    img: "/assets/DFimg/Diamond_AMIRALOUD.webp",
    desc: "A majestic blend of royal agarwood and oriental spices.",
    price: 199,
    originalPrice: 399,
    isLimited: true,
    rating: 5,
    reviews: 128,
  },
  {
    name: "Lekin Jo",
    img: "/assets/DFimg/Lekinjo.webp",
    desc: "Fresh aquatic notes for a clean, breezy elegance.",
    price: 199,
    originalPrice: 399,
    rating: 4,
    reviews: 85,
  },
  {
    name: "LAVENDER MIST",
    img: "/assets/LF2/28.jpg",
    desc: "Deliciously sweet chocolate notes mixed with soft musk.",
    price: 250,
    originalPrice: 399,
    rating: 5,
    reviews: 210,
  },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    text: "The Amir Al Oud is absolutely regal. I wear it to every meeting and get compliments instantly.",
    rating: 5,
    location: "Mumbai",
  },
  {
    name: "Priya Kapoor",
    text: "I was skeptical about buying candles online, but the LuraFlame Jar smells divine even when not lit!",
    rating: 5,
    location: "Delhi",
  },
  {
    name: "Amit Verma",
    text: "Fast delivery and the packaging was so luxurious. Felt like opening a gift to myself.",
    rating: 4,
    location: "Bangalore",
  },
  {
    name: "Sneha R.",
    text: "The Aqua Kiss perfume is my new daily favorite. So fresh and long-lasting.",
    rating: 5,
    location: "Pune",
  },
];

const heroSlides = [
  
  "/assets/DFimg/Hero.jpeg",
  "/assets/DFimg/Diamond_AMIRALOUD.webp",
  "/assets/DFimg/Diamond_JADORE.webp",
  "/assets/DFimg/Diamond_ROYALPROPHECY.webp",
];

const HeroSection = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (fragrance) => {
    addToCart({
      name: fragrance.name,
      price: fragrance.price,
      image: fragrance.img,
      size: "3ml",
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert("Welcome to the Inner Circle! Use code WELCOME10 for 10% off.");
      setEmail("");
    }
  };

  return (
    // FIX: Changed 'bg-[#0C0C0C]' to 'bg-transparent' so the global video shows through
    <section className="bg-transparent pb-0 px-0 min-h-screen flex flex-col relative overflow-hidden">
      <style>{`
        .reveal-up { opacity: 0; transform: translateY(30px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-up.active { opacity: 1; transform: translateY(0); }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { bg: #DCCA87; border-radius: 4px; }
      `}</style>

      {/* --- TICKER --- */}
      <div className="w-full bg-black/20 backdrop-blur-sm border-b border-[#DCCA87]/20 py-2 px-4 relative z-20">
        <div className="flex justify-center items-center">
          <p className="text-[#DCCA87] text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] animate-bounce">
            ✨ FREE DELIVERY ON ALL ORDERS ABOVE ₹499 ✨
          </p>
        </div>
      </div>

      {/* --- HERO BANNER --- */}
      <div className="pt-8 sm:pt-16 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-12 text-center md:text-left">
          <div className="md:w-1/2 w-full z-10">
            <div
              className={`reveal-up ${isLoaded ? "active" : ""}`}
              style={{ transitionDelay: "100ms" }}
            >
              <p className="text-xs tracking-[0.3em] text-[#DCCA87] mb-2 uppercase font-semibold flex items-center justify-center md:justify-start gap-3">
                <span className="w-8 h-[1px] bg-[#DCCA87]"></span> Exquisite
                Perfumery
              </p>
            </div>
            <div
              className={`reveal-up ${isLoaded ? "active" : ""}`}
              style={{ transitionDelay: "300ms" }}
            >
              <h1 className="text-5xl lg:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-2xl">
                Discover Your
                <br />
                <span className="text-[#DCCA87] bg-gradient-to-r from-[#DCCA87] to-[#8c7e4e] bg-clip-text text-transparent">
                  Signature Scent
                </span>
              </h1>
            </div>
            <div
              className={`reveal-up ${isLoaded ? "active" : ""}`}
              style={{ transitionDelay: "500ms" }}
            >
              <p className="text-gray-300 mb-8 max-w-md mx-auto md:mx-0 leading-relaxed font-light">
                Diamond Fragrance blends rare essences with expert
                craftsmanship, creating scents that capture timeless luxury.
              </p>
            </div>
            <div
              className={`reveal-up ${isLoaded ? "active" : ""}`}
              style={{ transitionDelay: "700ms" }}
            >
              <button
                onClick={() => navigate("/menu")}
                className="group relative overflow-hidden bg-[#DCCA87] text-black px-10 py-4 rounded-full font-bold transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(220,202,135,0.4)]"
              >
                <span className="relative z-10 group-hover:text-[#DCCA87] transition-colors">
                  View Collection
                </span>
                <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>
            </div>
          </div>
          <div
            className={`relative w-full md:w-1/2 flex justify-center reveal-up ${
              isLoaded ? "active" : ""
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="relative w-full max-w-[500px] aspect-square rounded-3xl shadow-2xl overflow-hidden border border-[#DCCA87]/30">
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-[1500ms] ease-in-out transform ${
                    index === currentSlide
                      ? "opacity-100 scale-105"
                      : "opacity-0 scale-100"
                  }`}
                  style={{ backgroundImage: `url('${slide}')` }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BESTSELLERS --- */}
      <div className="max-w-6xl w-full mx-auto mt-24 lg:mt-32 px-4">
        <div className="text-center mb-12">
          <span className="text-[#DCCA87] tracking-[0.2em] text-xs uppercase font-bold">
            Curated For You
          </span>
          <h2 className="text-4xl font-serif text-white mt-2">
            Bestseller Fragrances
          </h2>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {signatureFragrances.map((fragrance) => (
            <div
              key={fragrance.name}
              className="relative bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col items-center group hover:bg-white/10 hover:-translate-y-2 transition-all duration-500"
            >
              {fragrance.isLimited && (
                <div className="absolute -top-4 bg-red-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg">
                  LIMITED STOCK
                </div>
              )}
              <img
                src={fragrance.img}
                alt={fragrance.name}
                className="w-48 h-48 object-cover rounded-full shadow-2xl border-4 border-[#DCCA87]/20 group-hover:border-[#DCCA87] transition-all duration-500 group-hover:scale-110 mb-6"
              />
              <h3 className="text-2xl font-bold text-white mb-2">
                {fragrance.name}
              </h3>
              <p className="text-[#DCCA87] font-serif text-xl mb-4">
                ₹{fragrance.price}
              </p>
              <button
                onClick={() => handleAddToCart(fragrance)}
                className="bg-[#DCCA87] text-black w-full py-3 rounded-xl font-bold uppercase hover:bg-white transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- NEW: CUSTOMER REVIEWS (Social Proof) --- */}
      <div className="mt-32 py-20 bg-[#DCCA87]/5 border-y border-[#DCCA87]/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#DCCA87] tracking-[0.2em] text-xs uppercase font-bold">
              Client Love
            </span>
            <h2 className="text-4xl font-serif text-white mt-2">
              What They Say
            </h2>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar snap-x snap-mandatory">
            {testimonials.map((review, i) => (
              <div
                key={i}
                className="min-w-[300px] md:min-w-[350px] bg-black/40 border border-[#DCCA87]/20 p-8 rounded-2xl snap-center"
              >
                <div className="flex text-[#DCCA87] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < review.rating ? "opacity-100" : "opacity-30"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-300 italic mb-6 leading-relaxed">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DCCA87] to-black flex items-center justify-center text-black font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      {review.name}
                    </p>
                    <p className="text-gray-500 text-xs">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- NEW: PARALLAX NEWSLETTER --- */}
      <div className="relative py-32 flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div
          className="absolute inset-0 z-0 bg-fixed bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('/assets/DFimg/Diamond_ROYALPROPHECY.webp')",
          }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-[#0C0C0C]"></div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-serif text-[#DCCA87] mb-4 tracking-wide">
            Join The Inner Circle
          </h2>
          <p className="text-gray-300 mb-8">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#DCCA87] backdrop-blur-sm"
            />
            <button
              type="submit"
              className="bg-[#DCCA87] text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(220,202,135,0.4)]"
            >
              Subscribe
            </button>
          </form>
          <p className="text-gray-500 text-xs mt-4 tracking-widest uppercase">
            Get 10% off your first order
          </p>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-black/60 backdrop-blur-md py-12 text-center border-t border-[#DCCA87]/10 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 px-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[#DCCA87] font-serif text-2xl tracking-[0.3em] mb-2 flex items-center gap-2">
              <span>💎</span> DIAMOND FRAGRANCE
            </span>
            <p className="text-gray-500 text-xs tracking-widest uppercase">
              Defining Luxury Through Scent
            </p>
          </div>
          <div className="text-gray-600 text-xs font-mono">
            &copy; {new Date().getFullYear()} Diamond Fragrance.
          </div>
          <div className="flex gap-8 text-xs font-bold tracking-widest">
            <a
              href="https://www.instagram.com/diamondfragrance.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#DCCA87] hover:text-white transition-colors"
            >
              INSTAGRAM
            </a>
            <a
              href="/contact"
              className="text-[#DCCA87] hover:text-white transition-colors"
            >
              CONTACT
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default HeroSection;
