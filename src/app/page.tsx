import Footer from "@/components/Footer";
import AboutUs from "@/pages/aboutUs-page";
import HeroPage from "@/pages/hero-page";
import Seperation from "@/pages/seperation";
import TrendingMemes from "@/pages/trending-page";
import WhyChooseUs from "@/pages/why-choose-us";
import { currentUser } from "@clerk/nextjs/server";
import { ToastContainer } from 'react-toastify';

export default async function Home() {

  const user = await currentUser();

  return (
    <div className="flex flex-col bg-amber-500">
      <HeroPage isSignedIn = {user ? true : false} />
      <Seperation />
      <AboutUs />
      <TrendingMemes />
      <WhyChooseUs />
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
