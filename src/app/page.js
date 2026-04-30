import Image from "next/image";
import Navbar from "./components/Navbar/Navbar";
import ProductCards from "./components/ProductCards/ProducrCards";
import Products from "./components/Products/Products";

import SrforSlider from "./components/SrforSlider/page";

export default function Home() {
  return (
    <>
    <Navbar/>
    <SrforSlider/>
    <ProductCards/>
   
   
    <Products/>

    </>
  );
}
