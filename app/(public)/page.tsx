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
