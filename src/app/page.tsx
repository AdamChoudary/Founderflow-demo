import AtmosphereDefs from "@/components/AtmosphereDefs";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import BriefingPreview from "@/components/BriefingPreview";
import Integrations from "@/components/Integrations";
import Stats from "@/components/Stats";
import Experts from "@/components/Experts";
import HowItWorks from "@/components/HowItWorks";
import ClosingCTA from "@/components/ClosingCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <AtmosphereDefs />
      <Nav />
      <main className="flex-1">
        <Hero />
        <BriefingPreview />
        <Integrations />
        <Stats />
        <Experts />
        <HowItWorks />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
