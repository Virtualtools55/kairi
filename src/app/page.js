export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import Products from "./components/Products/Products";
import SrforSlider from "./components/SrforSlider/SrforSlider";
import Footer from "./components/Footer/page";

export default function Home() {
  return (
    <>
      <SrforSlider />
       <Products />
       <Footer/>
    </>
  );
}
