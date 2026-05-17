import { Mail, Phone, MapPin, Clock } from "lucide-react"; // Make sure to install lucide-react if not already done

export default function ContactUs() {
  return (
    <div className="bg-[#FFFDF9] text-[#23533E] min-h-screen font-sans overflow-x-hidden selection:bg-[#FF5E00] selection:text-white">
      
      {/* 1. Hero Section */}
      <section className="relative py-24 text-center px-6 border-b border-[#EFE9DD]">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute right-[-5%] top-[5%] w-[400px] h-[400px] bg-[#FF5E00] rounded-full filter blur-[120px]" />
        </div>

        <div className="z-10 max-w-3xl mx-auto mt-10">
          <span className="text-sm uppercase tracking-[0.3em] text-[#FF5E00] font-black mb-4 block">
            Get In Touch
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#23533E] mb-6">
            Connect With The <br />Kairi Family
          </h1>
          <p className="text-base md:text-xl text-slate-800 max-w-xl mx-auto font-normal leading-relaxed">
            Whether you are waiting for your sweet mangoes, checking your delivery, or wanting to send a box of love to your family—reach out directly to us.
          </p>
        </div>
      </section>

      {/* 2. Direct Contact Channels Grid */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Email Card */}
          <div className="flex flex-col items-center text-center p-8 bg-white border border-[#23533E]/10 rounded-3xl shadow-xl shadow-[#23533E]/5 transition-transform hover:scale-[1.02] duration-300">
            <div className="p-4 bg-[#FF5E00]/10 rounded-2xl text-[#FF5E00] mb-6">
              <Mail className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-xs uppercase tracking-widest text-[#FF5E00] font-black mb-2">Email Us</h3>
            <a href="mailto:support@kairi.in" className="text-xl font-black text-[#23533E] hover:text-[#FF5E00] transition-colors break-all">
              support@kairi.in
            </a>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed font-normal">
              For order support, cancellations, and business queries. We respond within 3-4 hours.
            </p>
          </div>

          {/* Mobile Number Card */}
          <div className="flex flex-col items-center text-center p-8 bg-white border border-[#23533E]/10 rounded-3xl shadow-xl shadow-[#23533E]/5 transition-transform hover:scale-[1.02] duration-300">
            <div className="p-4 bg-[#23533E]/10 rounded-2xl text-[#23533E] mb-6">
              <Phone className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-xs uppercase tracking-widest text-[#23533E] font-black mb-2">Call / WhatsApp</h3>
            <a href="tel:+919876543210" className="text-xl font-black text-[#23533E] hover:text-[#FF5E00] transition-colors">
              +91 98765 43210
            </a>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed font-normal">
              Direct line for urgent tracking assistance. Available Mon - Sun, 9 AM to 7 PM IST.
            </p>
          </div>

          {/* Farm Location Card */}
          <div className="flex flex-col items-center text-center p-8 bg-white border border-[#23533E]/10 rounded-3xl shadow-xl shadow-[#23533E]/5 transition-transform hover:scale-[1.02] duration-300">
            <div className="p-4 bg-slate-100 rounded-2xl text-slate-700 mb-6">
              <MapPin className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-xs uppercase tracking-widest text-slate-700 font-black mb-2">Our Orchards</h3>
            <span className="text-xl font-black text-[#23533E]">
              Pindrai Kurai, Seoni
            </span>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed font-normal">
              Located in the heart of Madhya Pradesh, where our family legacy comes to life.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Bottom Timings & Alternate Contact Banner */}
      <section className="bg-[#23533E] text-white py-14 text-center px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12">
          <div className="flex items-center gap-3">
            <Clock className="text-[#FF5E00] w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-semibold tracking-wide">Fresh Harvest Dispatched Daily</span>
          </div>
          <div className="h-px w-12 bg-white/20 hidden sm:block"></div>
          <div className="text-sm font-medium tracking-wide">
            Bulk/B2B Inquiries: <a href="mailto:farm@kairi.in" className="text-[#FF5E00] font-bold underline hover:text-white transition-colors">farm@kairi.in</a>
          </div>
        </div>
      </section>

    </div>
  );
}