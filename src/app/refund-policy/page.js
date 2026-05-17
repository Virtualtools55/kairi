export default function RefundPolicy() {
  return (
    <div className="bg-[#FFFDF9] text-[#23533E] min-h-screen font-sans overflow-x-hidden selection:bg-[#FF5E00] selection:text-white">
      
      {/* 1. Hero Header */}
      <section className="relative py-20 text-center px-6 border-b border-[#EFE9DD]">
        <div className="z-10 max-w-3xl mx-auto mt-10">
          <span className="text-sm uppercase tracking-[0.3em] text-[#FF5E00] font-black mb-4 block">
            Our Commitments
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#23533E] mb-6">
            Cancellation & <br />Refund Policy
          </h1>
          <p className="text-base md:text-lg text-slate-800 max-w-xl mx-auto font-normal leading-relaxed">
            At Kairi.in, we treat every single mango like a premium gift from nature. Here is how we handle modifications and order updates with care.
          </p>
        </div>
      </section>

      {/* 2. Policy Content Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-12">
        
        {/* Core Policy Highlight Card */}
        <div className="bg-white border border-[#23533E]/10 rounded-3xl p-8 md:p-10 shadow-xl shadow-[#23533E]/5">
          <span className="text-xs uppercase tracking-wider text-[#FF5E00] font-black mb-2 block">Important Window</span>
          <h2 className="text-2xl md:text-3xl font-black text-[#23533E] mb-4">The 1-Hour Cancellation Window</h2>
          <div className="h-[3px] w-16 bg-[#FF5E00] mb-6" />
          
          <p className="text-slate-900 text-base md:text-lg leading-relaxed font-normal mb-6">
            We completely understand that plans can change! If you need to cancel your order, you can easily do so within <strong className="text-[#FF5E00] font-black">1 hour of placing it</strong> through your dashboard or by contacting our team. In this case, a full 100% refund will be processed immediately to your original payment method.
          </p>
        </div>

        {/* The Heartfelt Explanation (Why we do this) */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-[#23533E]">Why Is This Window So Strict?</h3>
          <p className="text-slate-900 leading-relaxed font-normal text-base md:text-lg">
            Mangoes are delicate, perishable living fruits. To ensure you receive absolute top-tier freshness, our family farm at <span className="font-bold">Pindrai Kurai</span> works at lightning speed. 
          </p>
          
          {/* Transparent Detail Box */}
          <div className="border-l-4 border-[#FF5E00] bg-white/60 p-6 rounded-r-2xl space-y-3 shadow-sm">
            <p className="text-slate-950 font-medium md:text-lg">
              Within 60 minutes of your click, your specific mangoes are carefully selected, checked for blemishes, and placed into our customized, premium eco-friendly packaging. 
            </p>
            <p className="text-slate-800 font-normal text-sm md:text-base">
              Once this customized packaging is complete, the dedicated materials, transit safety seals, and labor costs are fully utilized for your batch. If an order is canceled after this stage, these customized fresh-keeping materials go to waste, and the plucked fruits lose their pristine journey timeline.
            </p>
          </div>

          <p className="text-slate-900 leading-relaxed font-normal text-base md:text-lg">
            Because of these specialized custom handling costs, we are unfortunately <span className="font-bold text-[#23533E]">unable to offer cancellations or refunds once that 1-hour window closes</span>. We highly value your support in helping us maintain zero-waste farming traditions.
          </p>
        </div>

        {/* What if something goes wrong? (Trust Builder) */}
        <div className="space-y-6 pt-6 border-t border-[#EFE9DD]">
          <h3 className="text-2xl font-black text-[#23533E]">Damaged or Quality Issues</h3>
          <p className="text-slate-900 leading-relaxed font-normal text-base md:text-lg">
            While we cannot cancel after 1 hour, your happiness remains our priority. Since we do not use artificial chemical ripening methods, nature can sometimes be unpredictable. 
          </p>
          <p className="text-slate-900 leading-relaxed font-normal text-base md:text-lg">
            If your box arrives damaged due to transit issues, please share a quick unboxing image or video with us at <a href="mailto:support@kairi.in" className="text-[#FF5E00] font-bold underline">support@kairi.in</a> within 24 hours of delivery. Our family will personally look into it to make things right for you.
          </p>
        </div>

      </section>

      {/* 3. Reassurance Footer Note */}
      <section className="bg-[#23533E] text-white py-12 text-center px-6">
        <p className="text-sm font-medium tracking-wide text-[#D4E4DC]">
          Have any questions before ordering? Reach out directly to us at{" "}
          <a href="tel:+919876543210" className="text-[#FF5E00] font-black underline hover:text-white transition-colors">
            +91 98765 43210
          </a>
        </p>
      </section>

    </div>
  );
}