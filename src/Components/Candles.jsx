import React from "react";
import { ProductSection, products } from "./Menu";

const Candles = () => {
  const candleItems = products.filter((p) => p.category.includes("candles"));

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 min-h-screen bg-[#0C0C0C]">
      <div className="text-center mb-16">
        <p className="text-[#DCCA87] tracking-[0.3em] uppercase text-sm mb-2 font-semibold">Atmospheric Elegance</p>
        <h1 className="text-4xl md:text-6xl font-serif text-[#DCCA87] uppercase tracking-widest">Scented Candles</h1>
      </div>

      {candleItems.length > 0 ? (
        <ProductSection title="Luxury Candle Collection" items={candleItems} />
      ) : (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-[#DCCA87]/20 rounded-3xl bg-white/5 backdrop-blur-sm">
          <h2 className="text-[#DCCA87] text-3xl font-serif mb-4">Collection Coming Soon</h2>
          <p className="text-gray-400 max-w-md text-center">We are currently hand-pouring our signature luxury candles. Subscribe to our newsletter to be notified when they arrive.</p>
        </div>
      )}
    </section>
  );
};

export default Candles;