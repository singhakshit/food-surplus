import { Header } from "../components/header";
import { HeroSection } from "../components/hero-section";
import { ImpactStats } from "../components/impact-stats";
import { PortalsSection } from "../components/portals-section";
import { Footer } from "../components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ImpactStats />
        <PortalsSection />
      </main>
      <Footer />
    </div>
  );
}
