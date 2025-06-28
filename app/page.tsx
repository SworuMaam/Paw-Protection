'use client';

import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedPets } from '@/components/home/FeaturedPets';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Statistics } from '@/components/home/Statistics';
import { Testimonials } from '@/components/home/Testimonials';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedPets />
      <HowItWorks />
      <Statistics />
      {/* <Testimonials /> */}
    </>
  );
}