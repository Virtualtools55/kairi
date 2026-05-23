export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import SrforProducts from "@/app/components/SrforProducts/SrforProducts";
import SrforSlider from "./components/SrforSlider/SrforSlider";
import Footer from "./components/Footer/page";

export default function Home() {
  return (
    <>
      <SrforSlider />
       <SrforProducts />
       <Footer/>
    </>
  );
}
