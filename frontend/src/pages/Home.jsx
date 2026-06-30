import { Header } from "../components/header"; 
import { HeroSection } from "../components/hero-section";
import { ImpactStats } from "../components/impact-stats";
import { PortalsSection } from "../components/portals-section";
import { Footer } from "../components/footer";

export default function Home({ session }) {
  return (
    <div className="min-h-screen flex flex-col">

      <Header session={session} />
      
      <main className="flex-1">
        <HeroSection session={session} />
        <ImpactStats />
        <PortalsSection session={session} />
      </main>
      
      <Footer />
    </div>
  );
}