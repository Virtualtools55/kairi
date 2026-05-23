
import HeroSlider from "../HeroSlider/page";

async function getSlides() {
  try {
    // 1. Base URL तय करें (Server-side fetch के लिए absolute URL जरूरी है)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
    
    // 2. अपनी API को कॉल करें
    const res = await fetch(`${baseUrl}/api/getSlider`, {
      cache: 'no-store', // ताज़ा डेटा सुनिश्चित करने के लिए
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch slides: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Slider API Fetch Error:", err);
    return [];
  }
}

export default async function SrforSlider() {
  // API से डेटा मंगाया
  const slides = await getSlides();

  // अगर डेटा नहीं है तो कुछ न दिखाएं
  if (!slides || slides.length === 0) return null;

  return (
    <section className="w-full">
      {/* डेटा को प्रॉप्स के ज़रिए क्लाइंट कंपोनेंट में भेजा */}
      <HeroSlider slides={slides} />
     
    </section>
  );
}