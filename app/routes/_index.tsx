import Navbar from "~/components/global/navbar";
import Comparison from "~/components/marketing/comparison";
import Hero from "~/components/marketing/hero";
import FAQ from "~/components/marketing/faq";
import Footer from "~/components/marketing/footer";
import { features } from "~/config/app.config";
import { FeatureSteps } from "~/components/ui/feature-section";
import VideoDemo from "~/components/marketing/video-demo";

export default function Page() {
  return (
    <>
    <Navbar />
    <Hero/>

    <VideoDemo/>
    
    <FeatureSteps
        features={features}
        title="How it works"
        autoPlayInterval={4000}
        imageHeight="h-[600px]"
        className="md:pt-24 px-6"
      />
    <Comparison/>
    <FAQ/>
    <Footer/>
    </>
  );
}
