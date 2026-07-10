import { Header } from "../components/header"; 
import { HeroSection } from "../components/hero-section";
import { ImpactStats } from "../components/impact-stats.jsx";
import { PortalsSection } from "../components/portals-section";
import { Footer } from "../components/footer.jsx";
import { Analytics } from "@vercel/analytics/react"

export default function Home({ session }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Analytics />

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