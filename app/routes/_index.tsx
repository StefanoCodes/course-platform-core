import Navbar from "~/components/global/navbar";
import Comparison from "~/components/marketing/comparison";
import Hero from "~/components/marketing/hero";
import HowItWorks from "~/components/marketing/how-it-works";
import VideoDemo from "~/components/marketing/video-demo";
import Footer from "~/components/marketing/footer";
import { Pricing } from "~/components/marketing/pricing";
import FAQ from "~/components/marketing/faq";

export default function Page() {
  return (
    <>
    <Navbar />
    <Hero/>
    <VideoDemo/>
    <HowItWorks/>
    <Comparison/>
    <Pricing/>
    <FAQ/>
    <Footer/>
    </>
  );
}
