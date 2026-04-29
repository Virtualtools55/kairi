"use client"
import { useState, useEffect } from 'react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    discountPrice: ''
  });

  // 1. Fetch Inventory
  const loadProducts = async () => {
    try {
      const res = await fetch('/api/admin/Products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  // 2. Submit Logic - Schema Sequence Followed Here
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a mango image!");

    setLoading(true);
    try {
      // Schema Sequence: Image -> Title -> Price -> Discount
      const data = new FormData();
      
      // A. Image details (Main part of upload process)
      data.append('file', file); 
      
      // B. Product details
      data.append('title', formData.title);
      data.append('price', formData.price);
      data.append('discountPrice', formData.discountPrice || 0);

      const response = await fetch('/api/admin/Products', {
        method: 'POST',
        body: data, 
      });

      const result = await response.json();

      if (response.ok) {
        alert("Premium Product Listed Successfully!");
        setFormData({ title: '', price: '', discountPrice: '' });
        setFile(null);
        e.target.reset(); 
        loadProducts();
      } else {
        alert(result.error || "Upload failed");
      }
    } catch (err) {
      console.error("Submission Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Logic
  const handleDelete = async (id) => {
    if (confirm("Kairi.in: Delete this premium harvest?")) {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      loadProducts();
    }
  };

  // 4. Toggle Sold Status
  const handleToggleSold = async (id, currentStatus) => {
    await fetch(`/api/products`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isSoldOut: !currentStatus }),
    });
    loadProducts();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8 bg-[#FFFBF2] min-h-screen font-sans text-[#1a1a1a]">
      
      {/* LEFT: UPLOAD FORM */}
      <div className="lg:w-[400px] bg-white p-8 rounded-[40px] shadow-sm border border-[#FF5C00]/5 h-fit sticky top-8">
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tighter text-[#FF5C00]">NEW HARVEST</h2>
          <div className="h-1 w-12 bg-[#2D5F47] mt-3"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* IMAGE FIRST (As per your Schema requirement) */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">1. Product Image</label>
            <div className="relative border-2 border-dashed border-gray-100 rounded-2xl p-4 bg-[#fcfcfc] hover:border-[#FF5C00]/20 transition-all">
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setFile(e.target.files[0])} 
                className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#FF5C00] file:text-white cursor-pointer"
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">2. Title</label>
            <input type="text" placeholder="e.g. Alphonso" className="w-full bg-[#fbfbfb] border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 ring-[#FF5C00]/5 text-sm"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">3. Price</label>
              <input type="number" className="w-full bg-[#fbfbfb] border border-gray-100 p-4 rounded-2xl outline-none text-sm"
                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 ml-1">4. Discount</label>
              <input type="number" className="w-full bg-[#fbfbfb] border border-gray-100 p-4 rounded-2xl outline-none text-sm"
                value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#FF5C00] hover:bg-[#e05200] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#FF5C00]/20 transition-all disabled:opacity-50 text-xs tracking-widest">
            {loading ? 'PROCESSING...' : 'CONFIRM LISTING'}
          </button>
        </form>
      </div>

      {/* RIGHT: INVENTORY */}
      <div className="flex-1">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-[#2D5F47]">INVENTORY</h2>
            <p className="text-[11px] font-bold text-gray-400 tracking-[2px] uppercase">Kairi.in Stock</p>
          </div>
          <div className="bg-[#2D5F47] text-white px-5 py-2 rounded-full text-[10px] font-bold">COUNT: {products.length}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p._id} className="bg-white rounded-[32px] p-5 border border-gray-50 shadow-sm hover:shadow-md transition-all">
              <div className="relative h-44 w-full rounded-[24px] overflow-hidden mb-4 bg-gray-50">
                <img src={p.imageUrl} className={`h-full w-full object-cover ${p.isSoldOut ? 'grayscale opacity-30' : ''}`} alt="" />
                {p.isSoldOut && <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black bg-black/20 text-white uppercase tracking-widest">Sold</span>}
              </div>
              <h3 className="font-black text-sm uppercase mb-1">{p.title}</h3>
              <div className="flex items-center gap-2 mb-4 font-bold italic text-[#2D5F47]">
                <span>₹{p.discountPrice || p.price}</span>
                {p.discountPrice > 0 && <span className="text-gray-300 line-through text-[10px]">₹{p.price}</span>}
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-50">
                <button onClick={() => handleToggleSold(p._id, p.isSoldOut)} className="flex-1 text-[9px] font-black uppercase py-3 rounded-xl bg-gray-50 hover:bg-black hover:text-white transition-all">
                  {p.isSoldOut ? 'Restock' : 'Mark Sold'}
                </button>
                <button onClick={() => handleDelete(p._id)} className="px-3 text-red-300 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}