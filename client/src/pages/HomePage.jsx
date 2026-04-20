import React from "react";
import Hero from "../features/home/Hero";
import ServiceGrid from "../features/home/ServiceGrid";
import PartnerMarquee from "../components/ui/PartnerMarquee";
import NavigationBar from "../components/ui/NavigationBar";
import FooterSection from "../components/ui/FooterSection";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-light-950 dark:bg-dark-950 transition-colors duration-700 ease-elegant selection:bg-accent/20">
      <NavigationBar />
      <main>
        <Hero />

        <div className="bg-light-900/50 dark:bg-white/5 border-y border-light-700 dark:border-white/5">
          <PartnerMarquee />
        </div>

        <section className="py-20 px-6 max-w-7xl mx-auto">
          <ServiceGrid />
        </section>
      </main>

      

      <FooterSection/>
    </div>
  );
};
export default HomePage;
