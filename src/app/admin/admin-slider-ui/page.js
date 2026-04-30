"use client"
import { useState, useEffect } from 'react';

export default function AdminSlider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ title: '', subtitle: '' });

  const loadSlides = async () => {
    const res = await fetch('/api/getSlider');
    const data = await res.json();
    setSlides(data);
  };

  useEffect(() => { loadSlides(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select an image first!");

    setLoading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);

    const res = await fetch('/api/admin/slider', { method: 'POST', body: data });
    if (res.ok) {
      alert("Slide Added!");
      setFormData({ title: '', subtitle: '' });
      setFile(null);
      loadSlides();
    }
    setLoading(false);
  };

  const deleteSlide = async (id, fileId) => {
    if (confirm("Delete this slide?")) {
      await fetch(`/api/slider?id=${id}&fileId=${fileId}`, { method: 'DELETE' });
      loadSlides();
    }
  };

  return (
    <div className="p-8 bg-[#FFFBF2] min-h-screen font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left: Upload Form */}
        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 h-fit">
          <h2 className="text-2xl font-black text-[#FF5E00] mb-6 uppercase tracking-tighter">New Hero Slide</h2>
          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">1. Image</label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full text-xs" required />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">2. Heading</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm" placeholder="e.g. Best Alphonso" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">3. Subheading</label>
              <input type="text" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm" placeholder="e.g. Premium Quality" />
            </div>
            <button disabled={loading} className="w-full bg-black text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-[#FF5E00] transition-all">
              {loading ? "UPLOADING..." : "SAVE SLIDE"}
            </button>
          </form>
        </div>

        {/* Right: Preview & Manage */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black text-[#2D6A4F] mb-6 uppercase tracking-tighter">Current Sliders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slides.map((s) => (
              <div key={s._id} className="relative group bg-white rounded-[30px] overflow-hidden shadow-md border border-gray-50">
                <img src={s.imageUrl} className="h-40 w-full object-cover" />
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-black uppercase text-gray-800 truncate max-w-[150px]">{s.title}</p>
                    <p className="text-[10px] text-gray-400 font-bold italic">{s.subtitle}</p>
                  </div>
                  <button onClick={() => deleteSlide(s._id, s.imageFileId)} className="text-red-400 hover:text-red-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}