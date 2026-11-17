import React from "react";
import Hero from "../features/home/Hero";
import ServiceGrid from "../features/home/ServiceGrid";
import PartnerMarquee from "../components/ui/PartnerMarquee";
import NavigationBar from "../components/ui/NavigationBar";
import FooterSection from "../components/ui/FooterSection";
import PersonalHome from "../features/home/PersonalHome";
import { useProfile } from "../contexts/ProfileContext";

const HomePage = () => {
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-light-950 transition-colors duration-700 ease-elegant selection:bg-accent/20">
      <NavigationBar />
      <main>
        {profile ? (
          <PersonalHome />
        ) : (
          <>
            <Hero />
            <PartnerMarquee />
            <ServiceGrid />
          </>
        )}
      </main>

      {profile ? null : <FooterSection />}
    </div>
  );
};
export default HomePage;
