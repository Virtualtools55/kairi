"use client"
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Swiper CSS (यह इम्पोर्ट होना बहुत जरूरी है)
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSlider({ slides }) {
  // अगर डेटा लोड हो रहा है या खाली है
  
  if (!slides || slides.length === 0) {
    return (
      <div className="w-full h-[40vh] md:h-screen bg-gray-100 animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading Kairi Sliders...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[45vh] md:h-screen relative overflow-hidden bg-gray-900">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={slides.length > 1}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="relative w-full h-full group">
              {/* Luxury Gradient Overlay - इसे z-10 पर रखें */}
              <div className="absolute inset-0 bg-black/40 z-10" />
              
              {/* Next.js Image Component */}
              <Image 
                src={slide.imageUrl} 
                alt={slide.title || "Kairi Mangoes"}
                fill 
                priority 
                sizes="100vw"
                className="object-cover transform transition-transform duration-[10s] scale-110 group-hover:scale-100"
              />

              {/* Content Overlay - इसे z-20 पर रखें */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-24">
                <div className="max-w-4xl">
                  <span className="text-[#FF5E00] font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4 block">
                    {slide.subtitle}
                  </span>
                  <h2 className="text-white text-4xl md:text-8xl font-black leading-none mb-8">
                    {slide.title}
                  </h2>
                  <button className="bg-white text-black font-bold py-3 px-10 rounded-full hover:bg-[#FF5E00] hover:text-white transition-colors duration-300">
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination Style */}
      <style jsx global>{`
        .swiper-pagination-bullet { background: white !important; opacity: 0.5; }
        .swiper-pagination-bullet-active { background: #FF5E00 !important; opacity: 1; width: 30px; border-radius: 4px; }
        .swiper-pagination { bottom: 20px !important; }
      `}</style>
    </div>
  );
}