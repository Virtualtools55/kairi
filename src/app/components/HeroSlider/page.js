"use client"
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSlider({ slides }) {
  
  if (!slides || slides.length === 0) {
    return (
      <div className="w-full h-[45vh] md:h-screen bg-[#FCFAF5] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#2D6A4F]/20 border-t-[#2D6A4F] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-[50vh]  md:h-screen relative overflow-hidden bg-white block leading-[0]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000} // 1s Crossfade: Fast yet very smooth
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={slides.length > 1}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute inset-0 bg-black/30 z-10" />
              
              <Image 
                src={slide.imageUrl} 
                alt={slide.title || "Kairi Mangoes"}
                fill 
                priority 
                sizes="100vw"
                className="object-cover"
              />

              <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-32">
                <div className="max-w-3xl">
                  {/* Animation: 1.2s duration for that 'Natural' feel */}
                  <div className="animate-[smoothReveal_1.2s_ease-in-out_forwards]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-5 h-[1px] bg-[#FF5E00]"></div>
                      <span className="text-white/80 font-bold tracking-[0.4em] uppercase text-[8px] md:text-[10px]">
                        {slide.subtitle || "Premium Selection"}
                      </span>
                    </div>

                    <h2 className="text-white text-4xl md:text-7xl font-black leading-[1.1] tracking-tight mb-10">
                      {slide.title}<span className="text-[#FF5E00]">.</span>
                    </h2>

                    <div className="flex flex-wrap gap-5">
                      <button className="bg-[#FF5E00] text-white font-bold py-4 px-12 rounded-xl hover:bg-[#2D6A4F] transition-all duration-500 text-[10px] uppercase tracking-widest cursor-pointer shadow-lg shadow-black/5 active:scale-95">
                        Discover
                      </button>
                      
                      <button className="bg-white/5 backdrop-blur-sm text-white border border-white/20 font-bold py-4 px-12 rounded-xl hover:bg-white hover:text-black transition-all duration-500 text-[10px] uppercase tracking-widest cursor-pointer active:scale-95">
                        Our Story
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination-bullet { 
          background: white !important; 
          opacity: 0.2; 
          height: 2px; 
          width: 25px;
          border-radius: 0px;
          transition: all 0.5s ease;
        }
        .swiper-pagination-bullet-active { 
          background: #FF5E00 !important; 
          opacity: 1; 
          width: 50px; 
        }
        .swiper-pagination { 
          bottom: 40px !important; 
          text-align: left !important;
          padding-left: 32px;
        }
        @media (min-width: 768px) {
          .swiper-pagination { padding-left: 128px; }
        }

        @keyframes smoothReveal {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}