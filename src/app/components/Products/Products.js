"use client"
import { useState, useEffect } from 'react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Database se products fetch karne ka function
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Fresh Mangoes...</div>;

  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', padding: '40px 20px' }}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '36px', color: '#1A2B48', fontWeight: 'bold' }}>Kairi.in</h1>
        <p style={{ color: '#888', marginTop: '10px' }}>Premium Handpicked Mangoes Delivered to Your Doorstep</p>
      </div>

      {/* Products Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '30px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </main>
  );
}

// --- Product Card Component (Reference Image Style) ---
function ProductCard({ product }) {
  return (
    <div style={{ 
      backgroundColor: '#fff', 
      borderRadius: '20px', 
      padding: '24px', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
      border: '1px solid #f0f0f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
      position: 'relative'
    }}>
      
      {/* Sold Out Badge */}
      {product.isSoldOut && (
        <span style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          backgroundColor: '#000',
          color: '#fff',
          fontSize: '10px',
          padding: '4px 10px',
          borderRadius: '50px',
          fontWeight: 'bold',
          zIndex: 1
        }}>SOLD OUT</span>
      )}

      {/* Image Wrapper */}
      <div style={{ width: '100%', height: '220px', marginBottom: '20px', overflow: 'hidden' }}>
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            filter: product.isSoldOut ? 'grayscale(100%)' : 'none',
            opacity: product.isSoldOut ? 0.6 : 1
          }} 
        />
      </div>

      {/* Title */}
      <h3 style={{ 
        fontSize: '22px', 
        color: '#1A2B48', 
        marginBottom: '10px', 
        textAlign: 'center',
        fontWeight: '700'
      }}>
        {product.title}
      </h3>

      {/* Price Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        {product.discountPrice ? (
          <>
            <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '18px' }}>
              ₹{product.price}
            </span>
            <span style={{ color: '#219653', fontSize: '26px', fontWeight: 'bold' }}>
              ₹{product.discountPrice}
            </span>
          </>
        ) : (
          <span style={{ color: '#219653', fontSize: '26px', fontWeight: 'bold' }}>
            ₹{product.price}
          </span>
        )}
      </div>

      {/* Action Button */}
      <button 
        disabled={product.isSoldOut}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: product.isSoldOut ? '#e0e0e0' : '#FF7A1A',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: product.isSoldOut ? 'not-allowed' : 'pointer',
          transition: 'background 0.3s ease'
        }}
        onMouseOver={(e) => !product.isSoldOut && (e.target.style.backgroundColor = '#e66d16')}
        onMouseOut={(e) => !product.isSoldOut && (e.target.style.backgroundColor = '#FF7A1A')}
      >
        {product.isSoldOut ? 'Out of Stock' : 'Get Fresh Mangoes'}
      </button>
    </div>
  );
}