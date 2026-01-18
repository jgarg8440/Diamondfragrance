import React, { useState, useMemo } from "react";
import { useCart } from "./CartContext";
import ProductModal from "./ProductModal";

// --- CONSTANTS & DATA ---

// updated pricing for perfumes (30ml, 50ml, 100ml) and attars (3ml, 6ml, 12ml)
export const pricing = {
  // Attar Pricing
  "3ml": { current: 199, original: 399 },
  "6ml": { current: 299, original: 599 },
  "12ml": { current: 599, original: 1199 },
  
  // Perfume Pricing (New Requirement)
  "30ml": { current: 399, original: 599 }, // derived original to show discount
  "50ml": { current: 799, original: 1199 },
  "100ml": { current: 1199, original: 1899 }
};

export const products = [
  // --- PERFUMES (Updated Volumes & Prices) ---
  { name: "AMIR AL OUD", image: "/assets/DFimg/Diamond_AMIRALOUD.webp", desc: "Majestic royal agarwood and oriental spices.", category: ["perfume"], isBestseller: true },
  { name: "AQUA KISS", image: "/assets/DFimg/Diamond_AQUAKISS.webp", desc: "Fresh aquatic notes for clean elegance.", category: ["perfume"] },
  { name: "ARABIAN NIGHT", image: "/assets/DFimg/Diamond_ARABIANNIGHT.webp", desc: "Mystical oud and musk for desert evenings.", category: ["perfume"], isSellingFast: true },
  { name: "HUGO BOSS", image: "/assets/DFimg/Diamond_HUGOBOSS.webp", desc: "Modern masculine scent with a sharp edge.", category: ["perfume"] },
  { name: "JADORE", image: "/assets/DFimg/Diamond_JADORE.webp", desc: "Timeless floral bouquet for femininity.", category: ["perfume"] },
  { name: "BOMBSHELL", image: "/assets/DFimg/Diamond_BOMBSHELI.webp", desc: "Confident and glamorous fruity-floral signature.", category: ["perfume"], isSellingFast: true },
  { name: "BLUE BERRY", image: "/assets/DFimg/Diamond_BLAUEBERRY.webp", desc: "Sweet, vibrant berry notes for energetic aura.", category: ["perfume"] },
  { name: "ICE", image: "/assets/DFimg/Diamond_Ice.webp", desc: "Crystalline freshness with a cool trail.", category: ["perfume"] },
  { name: "BLACK JAGUAR", image: "/assets/DFimg/Diamond_blackjaguoar.webp", desc: "Sleek, dark, powerful aromatic profile.", category: ["perfume"] },
  { name: "CR7", image: "/assets/DFimg/Diamond_CR7DF.webp", desc: "Sporty, energetic fragrance for active men.", category: ["perfume"] },
  { name: "WILD FIRE", image: "/assets/DFimg/Diamond_wildfire.webp", desc: "Intense and passionate smoky notes.", category: ["perfume"] },
  { name: "Z PARIS", image: "/assets/DFimg/Diamond_zParis .jpg", desc: "Sophisticated Parisian elegance.", category: ["perfume"] },
  // Extracted from Image list (Added to Perfume section as they look like main line scents)
  { name: "1 MILLION LUCKY", image: "/assets/Perfume/1 MILLION LUCKY.jpg", desc: "Hazelnut, honey, and ozonic notes.", category: ["perfume"], isSellingFast: true },
  { name: "INVITED", image: "/assets/Perfume/INVITED.jpg", desc: "Warm and inviting sophisticated blend.", category: ["perfume"] },
  { name: "CREED", image: "/assets/Perfume/CREED.jpg", desc: "Classic fresh citrus and woody scent.", category: ["perfume"], isBestseller: true },
  { name: "COOL WITH", image: "/assets/Perfume/COOL WITH.jpg", desc: "Chilled vibe with minty undertones.", category: ["perfume"] },
  { name: "COOL BLUE", image: "/assets/Perfume/COOL BLUE .jpg", desc: "Deep ocean freshness.", category: ["perfume"] },
  { name: "CLASSIC", image: "/assets/Perfume/CLASSIC.jpg", desc: "Timeless everyday elegance.", category: ["perfume"] },
  { name: "CLASS", image: "/assets/Perfume/CLASS.jpg", desc: "Refined and understated luxury.", category: ["perfume"] },
  { name: "CALL 0786", image: "/assets/Perfume/CALL 0786.jpg", desc: "Mysterious number signature blend.", category: ["perfume"] },
  { name: "CHANNEL 5", image: "/assets/Perfume/CHANNEL 5.jpg", desc: "Aldehydic floral masterpiece.", category: ["perfume"] },
  { name: "POLO SPORT", image: "/assets/Perfume/POLO SPORT.jpg", desc: "Aromatic green notes for the active spirit.", category: ["perfume"] },
  { name: "PREMIUM", image: "/assets/Perfume/PREMIUM.jpg", desc: "High-concentration luxury essence.", category: ["perfume"] },
  { name: "ROYAL PROPHECY", image: "/assets/Perfume/ROYAL PROPHECY.jpg", desc: "Regal blend fit for a king.", category: ["perfume"], isBestseller: true },
  { name: "ROYAL", image: "/assets/Perfume/ROYAL.jpg", desc: "Rich and commanding presence.", category: ["perfume"] },
  { name: "EVERGREEN", image: "/assets/Perfume/EVERGREEN.jpg", desc: "Fresh pine and woody notes.", category: ["perfume"] },
  { name: "ICE BERG", image: "/assets/Perfume/ICE BERG (1).jpg", desc: "Glacial purity and crisp air.", category: ["perfume"] },
  { name: "INTER COLL", image: "/assets/Perfume/INTER COLL.jpg", desc: "Modern international blend.", category: ["perfume"] },
  { name: "LELIN JO", image: "/assets/Perfume/LELIN JO.jpg", desc: "Soft floral with a hint of spice.", category: ["perfume"] },
  { name: "LONDON NIGHT", image: "/assets/Perfume/LONDON NIGHT.jpg", desc: "Sophisticated evening wear scent.", category: ["perfume"] },
  { name: "MT 15", image: "/assets/Perfume/MT 15.jpg", desc: "Bold and adventurous.", category: ["perfume"] },
  { name: "Z+PARIS", image: "/assets/Perfume/Z+PARIS.jpg", desc: "Chic Parisian night vibes.", category: ["perfume"] },


  // --- ATTARS (Existing + Extracted from Image List) ---
  { name: "MAJMUA", image: "/assets/DFimg/Diamond_majmua.jpg", desc: "Classic earthy, woody, floral blend.", category: ["attar"], isBestseller: true },
  { name: "CHOCO MUSK", image: "/assets/DFimg/Diamond_CHOCOMUSK.webp", desc: "Sweet chocolate notes with soft musk.", category: ["attar"], isSellingFast: true },
  { name: "JANNATUL FIRDOUS", image: "/assets/DFimg/Diamond_JANNATULFIRDOUS.webp", desc: "Garden of paradise: green and fresh.", category: ["attar"] },
  { name: "CLASSIC OUDH", image: "/assets/DFimg/Diamond_classicoudh.webp", desc: "Timeless spiritual agarwood essence.", category: ["attar"] },
  { name: "PINK OUDH", image: "/assets/DFimg/Diamond_pinkOudh .jpg", desc: "Delicate balance of rose and rich oud.", category: ["attar"] },
  { name: "WHITE LONDON", image: "/assets/DFimg/Diamond_WhiteLondon.webp", desc: "Sophisticated white floral musk.", category: ["attar"] },
  { name: "FAWAKE", image: "/assets/DFimg/Diamond_FAWAKE.webp", desc: "Rich fruity blend with Arabic undertones.", category: ["attar"] },
  { name: "D0786F", image: "/assets/DFimg/Diamond_D0786F.webp", desc: "Exquisite concentrated perfume oil.", category: ["attar"] },
  { name: "TURKISH OUDH", image: "/assets/DFimg/Diamond_TURKISHOUDH.webp", desc: "Rich and smoky traditional Turkish oud.", category: ["attar"] },
  { name: "VANILLA", image: "/assets/DFimg/Diamond_VANILLA .webp", desc: "Creamy, sweet gourmand vanilla perfection.", category: ["attar"] },
  { name: "SABAYA PREMIUM", image: "/assets/DFimg/Diamond_sabayapremium .jpg", desc: "Luxurious floral blend for all-day wear.", category: ["attar"] },
  { name: "WHITE OUDH", image: "/assets/DFimg/Diamond_WhiteOudh.webp", desc: "Clean, silky, and ethereal wood notes.", category: ["attar"] },
  { name: "PURE FIRDAUS", image: "/assets/DFimg/Diamond_pureFirdaus .jpg", desc: "Authentic refreshing botanical essence.", category: ["attar"] },
  { name: "LEKIN JO", image: "/assets/DFimg/Lekinjo.webp", desc: "Distinctive and memorable signature oil.", category: ["attar"] },
  { name: "MUSK AL THARA", image: "/assets/DFimg/MUSK AL THARA THIN.webp", desc: "Pure, thick, white clean musk.", category: ["attar"] },
  { name: "DF0786 MT15", image: "/assets/DFimg/Diamond_DF0786MT15.webp", desc: "Special edition concentrated blend.", category: ["attar"] },
  { name: "SABAYA", image: "/assets/DFimg/Diamond_SABAYA.webp", desc: "Bright and cheerful floral composition.", category: ["attar"] },
  // New Additions from Image List to Attar Section
  { name: "AMIRI AL OUD", image: "/assets/Perfume/AMIRI AL OUD.jpg", desc: "Deep and resonant agarwood oil.", category: ["attar"], isBestseller: true },
  { name: "ARABIAN NIGHT", image: "/assets/Perfume/ARABIAN NIGHT.jpg", desc: "The essence of desert nights in an oil.", category: ["attar"] },
  { name: "BLACK JAGVAR", image: "/assets/Perfume/BLACK JAGVAR .jpg", desc: "Powerful dark musk oil.", category: ["attar"] },
  { name: "BOMB SHELL", image: "/assets/Perfume/BOMB SHELL.jpg", desc: "Concentrated floral fruity oil.", category: ["attar"] },
  { name: "CHOCOL MUSK", image: "/assets/Perfume/CHOCOL MUSK.jpg", desc: "Rich chocolate musk oil.", category: ["attar"] },

  // --- CANDLES COLLECTION ---
  { name: "DIAMOND PILLAR", image: "/assets/LF2/0.jpg", desc: "Geometric 250g pillar for modern décor.", category: ["candles"], price: 130, originalPrice: 199, isBestseller: true },
  { name: "PILLAR TRIO", image: "/assets/LF2/1.jpg", desc: "Set of classic smooth pillar candles.", category: ["candles"], price: 200, originalPrice: 350 },
  { name: "BOHO ARCH", image: "/assets/LF2/2.jpg", desc: "Minimalist 200g arch-shaped design.", category: ["candles"], price: 95, originalPrice: 180 },
  { name: "SPHERE BALL", image: "/assets/LF2/3.jpg", desc: "Classic 3-inch 160g spherical candle.", category: ["candles"], price: 95, originalPrice: 150 },
  { name: "BUBBLE SMALL", image: "/assets/LF2/4.jpg", desc: "Trendy 40g aesthetic bubble cube.", category: ["candles"], price: 35, originalPrice: 70 },
  { name: "BIG BUBBLE", image: "/assets/LF2/5.jpg", desc: "Large statement bubble candle.", category: ["candles"], price: 95, originalPrice: 150 },
  { name: "PASTEL BUBBLE", image: "/assets/LF2/6.jpg", desc: "Soft pastel colored bubble candle.", category: ["candles"], price: 95, originalPrice: 150 },
  { name: "TRI-COLOUR BUBBLE", image: "/assets/LF2/7.jpg", desc: "Vibrant 250g multi-toned bubble.", category: ["candles"], price: 120, originalPrice: 200 },
  { name: "MINI CUBE SET", image: "/assets/LF2/10.jpg", desc: "Set of 4 mini aesthetic cubes.", category: ["candles"], price: 150, originalPrice: 250 },
  { name: "TEDDY HEART", image: "/assets/LF2/9.jpg", desc: "Adorable 120g bear holding a heart.", category: ["candles"], price: 100, originalPrice: 180, isSellingFast: true },
  { name: "BABY SWIRL", image: "/assets/LF2/10.png", desc: "Compact 50g intricate swirl pattern.", category: ["candles"], price: 55, originalPrice: 99 },
  { name: "TWISTED KNOT", image: "/assets/LF2/11.jpg", desc: "Modern yarn-ball style aesthetic candle.", category: ["candles"], price: 110, originalPrice: 199 },
  { name: "BEESWAX SPIRAL", image: "/assets/LF2/12.png", desc: "7-inch hand-rolled beeswax spiral.", category: ["candles"], price: 40, originalPrice: 80 },
  { name: "BEESWAX PILLAR", image: "/assets/LF2/13.jpg", desc: "Thick 7.5-inch natural beeswax pillar.", category: ["candles"], price: 80, originalPrice: 150 },
  { name: "TALL RIBBED", image: "/assets/LF2/14.jpg", desc: "Substantial 10-inch 175g ribbed design.", category: ["candles"], price: 140, originalPrice: 250 },
  { name: "RIBBED PILLAR", image: "/assets/LF2/15.jpg", desc: "Elegant 105g fluted pillar candle.", category: ["candles"], price: 100, originalPrice: 180 },
  { name: "THICK RIBBED", image: "/assets/LF2/16.jpg", desc: "Wide diameter ribbed statement piece.", category: ["candles"], price: 180, originalPrice: 299 },
  { name: "FLUTED RIBBED", image: "/assets/LF2/17.jpg", desc: "Dense 240g fluted luxury candle.", category: ["candles"], price: 200, originalPrice: 350 },
  { name: "ROMAN RIBBED", image: "/assets/LF2/18.jpg", desc: "Vintage style 10.5-inch tall ribbed.", category: ["candles"], price: 115, originalPrice: 220 },
  { name: "BUBBLE TRAY", image: "/assets/LF2/19.jpg", desc: "Assorted mini bubbles tray set.", category: ["candles"], price: 350, originalPrice: 599 },
  { name: "PASTEL CUBES", image: "/assets/LF2/20.jpg", desc: "Soft matte finish bubble cubes.", category: ["candles"], price: 95, originalPrice: 150 },
  { name: "BLUE OCEAN JAR", image: "/assets/LF2/21.jpg", desc: "Ocean breeze scented gel candle.", category: ["candles"], price: 250, originalPrice: 399 },
  { name: "TEA LIGHT SET", image: "/assets/LF2/22.jpg", desc: "Bulk pack of premium tea lights.", category: ["candles"], price: 299, originalPrice: 450 },
  { name: "FLOWER BOUQUET", image: "/assets/LF2/23.jpg", desc: "Handcrafted flower shape bouquet.", category: ["candles"], price: 350, originalPrice: 550 },
  { name: "HEART BOX", image: "/assets/LF2/24.jpg", desc: "Heart shaped candle in gift box.", category: ["candles"], price: 150, originalPrice: 250 },
  { name: "RAINBOW JAR", image: "/assets/LF2/25.jpg", desc: "Multi-layered colorful scented jar.", category: ["candles"], price: 250, originalPrice: 399 },
  { name: "SUNSET JAR", image: "/assets/LF2/26.jpg", desc: "Warm yellow and red layered wax.", category: ["candles"], price: 250, originalPrice: 399 },
  { name: "STRAWBERRY GEL", image: "/assets/LF2/27.jpg", desc: "Clear gel with strawberry embeds.", category: ["candles"], price: 280, originalPrice: 450 },
  { name: "LAVENDER MIST", image: "/assets/LF2/28.jpg", desc: "Purple soothing lavender jar.", category: ["candles"], price: 250, originalPrice: 399 },
  { name: "CLEAR GEL", image: "/assets/LF2/29.jpg", desc: "Transparent unscented gel candle.", category: ["candles"], price: 220, originalPrice: 350 },
  { name: "SNOW WHITE", image: "/assets/LF2/30.jpg", desc: "Pure white vanilla scented jar.", category: ["candles"], price: 250, originalPrice: 399 },
  { name: "PINK FLOATER", image: "/assets/LF2/31.jpg", desc: "Floating flower candle in glass.", category: ["candles"], price: 180, originalPrice: 299 },
  { name: "HEART JARS", image: "/assets/LF2/32.jpg", desc: "Cute jars with heart patterns.", category: ["candles"], price: 150, originalPrice: 250 },
  { name: "WINE GLASS", image: "/assets/LF2/33.jpg", desc: "Elegant candle in wine glass.", category: ["candles"], price: 300, originalPrice: 499 },
  { name: "COCKTAIL GLASS", image: "/assets/LF2/34.jpg", desc: "Layered cocktail scented candle.", category: ["candles"], price: 300, originalPrice: 499 },
  { name: "HONEYCOMB CYLINDER", image: "/assets/LF2/35.jpg", desc: "Textured beeswax honeycomb pattern.", category: ["candles"], price: 120, originalPrice: 200 },
  { name: "PEBBLE JAR", image: "/assets/LF2/36.jpg", desc: "Jar filled with colorful wax pebbles.", category: ["candles"], price: 250, originalPrice: 399 },
  { name: "AQUARIUM GEL", image: "/assets/LF2/37.jpg", desc: "Gel candle with marine themes.", category: ["candles"], price: 280, originalPrice: 450 },
  { name: "ROSE PETAL GEL", image: "/assets/LF2/38.jpg", desc: "Gel wax with dried rose petals.", category: ["candles"], price: 280, originalPrice: 450 },
  { name: "LOVE JAR", image: "/assets/LF2/39.jpg", desc: "Red hearts embedded in white wax.", category: ["candles"], price: 250, originalPrice: 399 },
  { name: "PURPLE GEL", image: "/assets/LF2/40.jpg", desc: "Violet scented translucent gel.", category: ["candles"], price: 250, originalPrice: 399 },
  { name: "FLOATING WICK", image: "/assets/LF2/41.jpg", desc: "Minimalist water floating candle.", category: ["candles"], price: 150, originalPrice: 250 },
  { name: "ONION DROP", image: "/assets/LF2/42.jpg", desc: "Unique twisted drop shape.", category: ["candles"], price: 95, originalPrice: 180 },
  { name: "MACARON TOWER", image: "/assets/LF2/43.jpg", desc: "Stack of 3 wax macarons.", category: ["candles"], price: 120, originalPrice: 200 },
  { name: "CITRUS BOWL", image: "/assets/LF2/44.jpg", desc: "Orange scented bowl candle.", category: ["candles"], price: 250, originalPrice: 399 },
  { name: "DAISY FLOWER", image: "/assets/LF2/45.jpg", desc: "Large daisy flower shape.", category: ["candles"], price: 80, originalPrice: 150 },
  { name: "DAISY POPS", image: "/assets/LF2/46.png", desc: "Daisy candle on a stick.", category: ["candles"], price: 60, originalPrice: 120 },
  { name: "DAISY GARDEN", image: "/assets/LF2/47.jpg", desc: "Pot with daisy wax flowers.", category: ["candles"], price: 350, originalPrice: 550 },
  { name: "HAPPY BIRTHDAY", image: "/assets/LF2/48.jpg", desc: "Cake shaped candle with message.", category: ["candles"], price: 220, originalPrice: 350, isBestseller: true },
  { name: "BERRY CAKE", image: "/assets/LF2/49.jpg", desc: "Dessert candle with berries.", category: ["candles"], price: 250, originalPrice: 399 },
  { name: "STRAWBERRY BOWL", image: "/assets/LF2/50.jpg", desc: "Bowl filled with wax strawberries.", category: ["candles"], price: 250, originalPrice: 399 },
  { name: "TROPICAL DRINK", image: "/assets/LF2/51.jpg", desc: "Fruity cocktail glass candle.", category: ["candles"], price: 280, originalPrice: 450 },
  { name: "TILTED GLASS", image: "/assets/LF2/52.jpg", desc: "Modern tilted glass dessert candle.", category: ["candles"], price: 280, originalPrice: 450 },
  { name: "BEER MUG", image: "/assets/LF2/53.jpg", desc: "Realistic foaming beer candle.", category: ["candles"], price: 350, originalPrice: 500, isSellingFast: true },
  { name: "HONEYCOMB SET", image: "/assets/LF2/54.jpg", desc: "Duo of honeycomb pillar candles.", category: ["candles"], price: 200, originalPrice: 350 },
  { name: "PREMIUM JAR", image: "/assets/LF2/55.jpg", desc: "High-end glass jar soy candle.", category: ["candles"], price: 299, originalPrice: 499 },
  { name: "BUBBLE DUO", image: "/assets/LF2/56.jpg", desc: "Set of two pastel bubbles.", category: ["candles"], price: 180, originalPrice: 300 },
  { name: "TRIPLE JAR", image: "/assets/LF2/57.jpg", desc: "Set of 3 mini scented jars.", category: ["candles"], price: 450, originalPrice: 700 },
  { name: "DESSERT CUP", image: "/assets/LF2/58.jpg", desc: "Whipped wax dessert cup.", category: ["candles"], price: 250, originalPrice: 399 },
  { name: "HEART GLASS", image: "/assets/LF2/59.jpg", desc: "Glass with heart wax embeds.", category: ["candles"], price: 200, originalPrice: 350 },
  { name: "PEBBLE GLASS", image: "/assets/LF2/60.jpg", desc: "Glass filled with colored pebbles.", category: ["candles"], price: 220, originalPrice: 380 },
  { name: "MINI COLLECTION", image: "/assets/LF2/61.jpg", desc: "Assorted small decorative candles.", category: ["candles"], price: 500, originalPrice: 900 },
  { name: "FLOWER TINS", image: "/assets/LF2/62.jpg", desc: "Travel tins with flower wax.", category: ["candles"], price: 150, originalPrice: 250 },
  { name: "ROSE BUD", image: "/assets/LF2/63.png", desc: "Single realistic rose bud.", category: ["candles"], price: 120, originalPrice: 200 },
  { name: "RED ROSES", image: "/assets/LF2/64.png", desc: "Set of deep red wax roses.", category: ["candles"], price: 200, originalPrice: 350 },
  { name: "PINK PEONY", image: "/assets/LF2/65.png", desc: "Large intricate peony flower.", category: ["candles"], price: 250, originalPrice: 399 },
  { name: "AROMA SET", image: "/assets/LF2/66.png", desc: "Aromatherapy spa candle set.", category: ["candles"], price: 599, originalPrice: 999 },
  { name: "TEA LIGHTS", image: "/assets/LF2/67.jpg", desc: "Classic unscented tea lights.", category: ["candles"], price: 90, originalPrice: 150 }
];

// --- COMPONENTS ---

export const ProductCard = ({ p, handleAddToCart, onQuickView }) => {
  // --- Updated Size Logic based on category ---
  const isPerfume = p.category.includes("perfume");
  // Default sizes: Attars (3ml), Perfumes (30ml)
  const defaultSize = isPerfume ? "30ml" : "3ml";
  
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  
  // Calculate price dynamically
  const currentPrice = p.price || (pricing[selectedSize] ? pricing[selectedSize].current : "N/A");
  const originalPrice = p.originalPrice || (pricing[selectedSize] ? pricing[selectedSize].original : "N/A");

  // Filter available sizes based on category
  const availableSizes = isPerfume 
    ? ["30ml", "50ml", "100ml"] 
    : ["3ml", "6ml", "12ml"];

  return (
    <div className="relative bg-white/95 rounded-2xl shadow-lg border-2 border-[#DCCA87] p-3 sm:p-4 flex flex-col transition-all hover:shadow-2xl group animate-fadeInUp">
      
      {/* --- QUICK VIEW (EYE ICON) --- */}
      <button 
        onClick={(e) => { 
          e.stopPropagation(); 
          if (onQuickView) onQuickView(p); 
        }}
        className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/80 backdrop-blur-sm text-[#DCCA87] rounded-full flex items-center justify-center hover:bg-[#DCCA87] hover:text-black transition-all shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
        title="Quick View"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>

      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {p.isBestseller && (
          <span className="bg-[#DCCA87] text-black text-[7px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight shadow-sm">
            ★ Bestseller
          </span>
        )}
        {p.isSellingFast && (
          <span className="bg-orange-500 text-white text-[7px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight shadow-sm">
            🔥 Fast
          </span>
        )}
      </div>

      {/* Image */}
      <div 
        className="h-40 sm:h-48 rounded-xl overflow-hidden mb-3 relative bg-gray-100 cursor-pointer" 
        onClick={() => onQuickView && onQuickView(p)}
      >
        <img 
          src={p.image} 
          alt={p.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
        />
      </div>
      
      {/* Name & Desc */}
      <h4 className="text-base sm:text-lg font-black text-gray-900 truncate tracking-tight uppercase">
        {p.name}
      </h4>
      <p className="text-[10px] sm:text-xs text-gray-600 my-1 line-clamp-2 h-8">
        {p.desc}
      </p>

      {/* Size Selector - DYNAMIC */}
      {!p.price && (
        <div className="mb-3">
          <div className="flex gap-1">
            {availableSizes.map((size) => (
              <button 
                key={size} 
                onClick={() => setSelectedSize(size)} 
                className={`flex-1 py-1 text-[9px] sm:text-[11px] rounded border transition-all ${selectedSize === size ? "bg-[#DCCA87] border-[#DCCA87] text-black font-bold" : "border-gray-200 text-gray-500 hover:border-[#DCCA87]"}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price & Add */}
      <div className="flex justify-between items-center mt-auto pt-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg font-bold text-black">₹{currentPrice}</span>
            <span className="text-[10px] text-gray-400 line-through">₹{originalPrice}</span>
          </div>
        </div>
        <button 
          onClick={(e) => handleAddToCart(e, { ...p, size: p.price ? "unit" : selectedSize, price: currentPrice })} 
          type="button" 
          className="bg-[#DCCA87] text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-transform active:scale-90 shadow-sm hover:bg-[#bfa760]"
        >
          + Cart
        </button>
      </div>
    </div>
  );
};

export const ProductSection = ({ title, items, id, onQuickView }) => {
  const { addToCart } = useCart();
  if (items.length === 0) return null;
  
  return (
    <div className="mb-12" id={id}>
      <h3 className="text-2xl sm:text-3xl font-bold text-[#DCCA87] mb-6 uppercase tracking-widest">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {items.map((p) => (
          <ProductCard 
            key={p.name} 
            p={p} 
            handleAddToCart={(e, prod) => addToCart(prod)} 
            onQuickView={onQuickView} 
          />
        ))}
      </div>
    </div>
  );
};

// --- MAIN MENU COMPONENT WITH SEARCH & FILTER ---

const Menu = () => {
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // --- FILTER LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== "All") {
      result = result.filter(p => p.category.some(c => c.toLowerCase().includes(activeCategory.toLowerCase().slice(0, -1))));
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.desc.toLowerCase().includes(lowerTerm)
      );
    }

    return result;
  }, [searchTerm, activeCategory]);

  const categories = ["All", "Perfumes", "Attars", "Candles"];

  return (
    <section id="collection" className="max-w-7xl mx-auto px-4 pt-32 pb-12 scroll-mt-20">
      
      {/* 1. Header & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-[#DCCA87]/20 pb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#DCCA87] uppercase tracking-widest mb-2">
            Collection
          </h2>
          <p className="text-gray-400 text-sm">Curated scents for the elite.</p>
        </div>
        
        {/* Search Input - Aligned to right */}
        <div className="relative group w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search perfumes..." 
            className="w-full bg-black border border-[#DCCA87]/40 rounded-full py-2.5 px-5 pl-11 text-sm text-white placeholder-gray-500 focus:border-[#DCCA87] focus:bg-white/5 outline-none transition-all shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Search Icon */}
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#DCCA87] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              activeCategory === cat 
                ? "bg-[#DCCA87] text-black border-[#DCCA87] shadow-[0_0_15px_rgba(220,202,135,0.4)]" 
                : "bg-transparent text-gray-400 border-gray-800 hover:border-[#DCCA87] hover:text-[#DCCA87]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* 3. Product Grid Logic */}
      <div className="min-h-[400px]">
        {(searchTerm || activeCategory !== "All") ? (
          <div className="animate-fadeIn">
            {filteredProducts.length > 0 ? (
              <ProductSection 
                title={searchTerm ? `Searching: "${searchTerm}"` : `${activeCategory}`}
                items={filteredProducts}
                id="search-results"
                onQuickView={setSelectedProduct}
              />
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-lg mb-2">No scents found matching your criteria.</p>
                <button onClick={() => {setSearchTerm(""); setActiveCategory("All")}} className="text-[#DCCA87] text-sm font-bold uppercase tracking-widest hover:underline">
                  Clear Search
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Default View */
          <div className="animate-fadeIn">
            <ProductSection 
              title="Luxury Perfumes" 
              items={products.filter(p => p.category.includes("perfume"))} 
              id="perfume" 
              onQuickView={setSelectedProduct} 
            />
            <ProductSection 
              title="Premium Attars" 
              items={products.filter(p => p.category.includes("attar"))} 
              id="attar" 
              onQuickView={setSelectedProduct} 
            />
            <ProductSection 
              title="Handcrafted Candles" 
              items={products.filter(p => p.category.includes("candles"))} 
              id="candles" 
              onQuickView={setSelectedProduct} 
            />
          </div>
        )}
      </div>

      {/* 4. Render Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </section>
  );
};

export default Menu;