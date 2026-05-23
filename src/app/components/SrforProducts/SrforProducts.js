import ProductListClient from "@/app/components/Products/Products";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    // API Route call (Aapke project folder matching ke anusaar link update rakhein)
    const res = await fetch(`${baseUrl}/api/fetchproducts`, { 
      cache: "no-store" 
    });

    if (!res.ok) {
      throw new Error("API response error");
    }

    const data = await res.json();

    // Direct clean JSON array handle match step
    const productsArray = Array.isArray(data) ? data : [];

    return (
      <main className="bg-[#FDFBF7] min-h-screen">
        {/* Is prop structure ke naam ko hamne client component ke receive parameter se align kar diya hai */}
        <ProductListClient products={productsArray} />
      </main>
    );
    
  } catch (error) {
    console.error("Server Side API Fetch Failed:", error);
    return <ProductListClient products={[]} />;
  }
}