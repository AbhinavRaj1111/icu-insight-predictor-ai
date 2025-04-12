
import MainLayout from "@/layouts/MainLayout";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";

const HomePage = () => {
  return (
    <MainLayout>
      <Hero />
      <FeatureSection />
      <StatsSection />
      <HowItWorks />
    </MainLayout>
  );
};

export default HomePage;
