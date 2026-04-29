import Image from "next/image";
import Navbar from "./components/Navbar/Navbar";
import ProductCards from "./components/ProductCards/ProducrCards";
import Products from "./components/Products/Products"

export default function Home() {
  return (
    <>
    <Navbar/>
    <ProductCards/>
    <Products/>

    </>
  );
}
