import Navbar from "~/components/global/navbar";
import Comparison from "~/components/marketing/comparison";
import Hero from "~/components/marketing/hero";
import FAQ from "~/components/marketing/faq";
import Footer from "~/components/marketing/footer";

export default function Page() {
  return (
    <>
    <Navbar />
    <Hero/>
    <Comparison/>
    <FAQ/>
    <Footer/>
    </>
  );
}
