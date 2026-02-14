/**
 * Home Page — Landing page / main public page
 * Home Page — Landing page / main public page
 *
 * Aa page Learnix ni main landing page chhe je badha public sections display kare chhe
 * This page is the main Learnix landing page displaying all public sections
 *
 * Sections: HeroSection, Features, LogoCloud, Testimonials, TeamSection, CallToAction, Footer
 * — Badha sections sequentially render thay chhe
 * — All sections render sequentially
 */
import HeroSection from "@/components/hero-section";
import Features from "@/components/features";
import LogoCloud from "@/components/logo-cloud";
import Testimonials from "@/components/testimonials";
import TeamSection from "@/components/team";
import CallToAction from "@/components/call-to-action";
import FooterSection from "@/components/footer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Features />
      <LogoCloud />
      <Testimonials />
      <TeamSection />
      <CallToAction />
      <FooterSection />
    </>
  );
}
