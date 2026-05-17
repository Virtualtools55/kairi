import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="bg-[#FFFDF9] text-[#23533E] min-h-screen font-sans overflow-x-hidden selection:bg-[#FF5E00] selection:text-white">
      
      {/* 1. Hero Section: High Contrast Minimalist Landing */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-6 border-b border-[#EFE9DD]">
        {/* Soft Organic Background Glows */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <div className="absolute right-[-10%] top-[10%] w-[450px] h-[450px] bg-[#FF5E00] rounded-full filter blur-[150px]" />
          <div className="absolute left-[-5%] bottom-[5%] w-[350px] h-[350px] bg-[#23533E] rounded-full filter blur-[120px]" />
        </div>

        <div className="z-10 max-w-4xl">
          <span className="text-sm uppercase tracking-[0.3em] text-[#FF5E00] font-black mb-5 block">
            Our Legacy • Since Generation
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[#23533E] mb-6 leading-tight">
            From the Orchards of <br />
            <span className="text-[#FF5E00] font-serif italic font-normal">Pindrai Kurai</span> to Your Home.
          </h1>
          <p className="text-base md:text-xl text-[#23533E]/90 max-w-2xl mx-auto font-normal leading-relaxed">
            A family legacy rooted in the heart of Madhya Pradesh, reimagined 
            for an effortless digital experience without losing nature’s raw purity.
          </p>
        </div>
      </section>

      {/* 2. The Story Section: High Contrast Content */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#FF5E00] font-bold block">
            Chapter I: The Roots
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#23533E] leading-tight">
            It all started in a small family garden.
          </h2>
          <div className="h-[3px] w-20 bg-[#FF5E00]" />
          <p className="text-slate-900 leading-relaxed font-normal text-base md:text-lg">
            Years ago, our grandfather planted the very first sapling in the fertile soil of 
            <strong className="text-[#23533E] font-extrabold"> Pindrai Kurai, Seoni (M.P.)</strong>. What started as a modest family garden, 
            nurtured by the hands of our entire family, became renowned locally for producing 
            the sweetest, most fragrant mangoes.
          </p>
          <p className="text-slate-900 leading-relaxed font-normal text-base md:text-lg">
            For decades, these premium fruits were shared only offline—with neighbors, local markets, 
            and those lucky enough to visit our farm. It was a local treasure, kept close to the earth.
          </p>
        </div>

        {/* Transparent Layout Image Container */}
        <div className="relative group flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5E00] to-transparent opacity-20 rounded-3xl -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
          <div className="relative border border-[#23533E]/20 bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-xl shadow-[#23533E]/10 overflow-hidden w-full max-w-md">
            <Image 
              src="/images/about-mango-garden.jpg" 
              alt="Our Ancestral Mango Orchard in Seoni"
              width={500}
              height={600}
              className="rounded-2xl object-cover hover:scale-[1.02] transition-all duration-700"
            />
          </div>
        </div>
      </section>

      {/* 3. The Transformation: Maximum White-on-Green Contrast */}
      <section className="bg-[#23533E] text-[#FFFDF9] py-20 md:py-32 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
          <h1 className="text-[12rem] font-black tracking-tighter select-none translate-y-20 text-[#FF5E00]">KAIRI</h1>
        </div>

        <div className="max-w-4xl mx-auto text-center px-6">
          <span className="text-sm uppercase tracking-[0.3em] text-[#FF5E00] font-extrabold mb-4 block">
            Chapter II: The Evolution
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-white">
            Effortless Taste. <br />Direct from your Phone.
          </h2>
          <p className="text-white text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal mb-12">
            We noticed how difficult it was for fruit lovers to find truly genuine, untouched mangoes 
            without navigating chaotic markets. We asked ourselves: Why should getting fresh fruit 
            require so much effort?
          </p>
          
          {/* Enhanced Visibility Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mt-16">
            <div className="bg-black/20 border border-white/20 backdrop-blur-md p-6 rounded-2xl hover:border-[#FF5E00] transition-colors">
              <h4 className="text-[#FF5E00] font-black uppercase tracking-wider text-sm mb-2">Zero Effort</h4>
              <p className="text-xs text-white font-normal leading-relaxed">
                Order directly from your phone in under a minute. No complex or time-taking steps.
              </p>
            </div>
            <div className="bg-black/20 border border-white/20 backdrop-blur-md p-6 rounded-2xl hover:border-[#FF5E00] transition-colors">
              <h4 className="text-[#FF5E00] font-black uppercase tracking-wider text-sm mb-2">Fresh Delivery</h4>
              <p className="text-xs text-white font-normal leading-relaxed">
                Harvested directly at peak maturity and delivered straight to your home.
              </p>
            </div>
            <div className="bg-black/20 border border-white/20 backdrop-blur-md p-6 rounded-2xl hover:border-[#FF5E00] transition-colors">
              <h4 className="text-[#FF5E00] font-black uppercase tracking-wider text-sm mb-2">No Time Waste</h4>
              <p className="text-xs text-white font-normal leading-relaxed">
                Swift logistical channels handle transit so you receive it fresh from the branch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Philosophy: Premium Sharp Text */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        
        {/* Left Side: Transparent Layout Container */}
        <div className="relative group order-last md:order-first flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-bl from-[#FF5E00]/20 to-transparent opacity-40 rounded-3xl rotate-2 group-hover:rotate-0 transition-transform duration-500" />
          <div className="relative border border-[#23533E]/20 bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-xl shadow-[#23533E]/10 overflow-hidden w-full max-w-md">
            <Image 
              src="/images/about-fresh-mango.jpg" 
              alt="Kairi Premium Pure Natural Mango"
              width={500}
              height={600}
              className="rounded-2xl object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Right Side: Philosophy Content */}
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#FF5E00] font-bold block">
            Our Commitment
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#23533E] leading-tight">
            Untamed by chemicals. <br />
            Perfected by nature.
          </h2>
          <div className="h-[3px] w-20 bg-[#FF5E00]" />
          <p className="text-slate-900 leading-relaxed font-normal text-base md:text-lg">
            Every piece of fruit bearing the <span className="font-extrabold text-[#23533E]">Kairi.in</span> seal is 
            entirely <strong className="text-[#23533E] font-extrabold">100% natural</strong>. We strictly follow the rules passed down by our grandfather. 
            That means absolutely no artificial ripening accelerators, no chemical washes, and no bulk cold storage.
          </p>
          <p className="text-slate-900 leading-relaxed font-normal text-base md:text-lg">
            We pick only the mangoes that have basked perfectly in the Madhya Pradesh sun, ensuring that when you open your box at home, the pure, authentic aroma fills your entire room.
          </p>
        </div>
      </section>

      {/* 5. Clean Signature Footer Note */}
      <section className="bg-[#FFFDF9] text-center py-20 border-t border-[#EFE9DD]">
        <p className="font-serif italic text-3xl text-[#23533E] mb-3">
          "From our ancestral home to yours."
        </p>
        <span className="text-sm tracking-[0.3em] text-[#FF5E00] uppercase font-black">
          The Kairi Family • Pindrai Kurai
        </span>
      </section>

    </div>
  );
}