'use client';

import { useState, useEffect } from 'react';
import { PetCard } from '@/components/pets/PetCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Pet } from '@/types/pet';

export function FeaturedPets() {
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch('/api/pets'); // fetch all pets
        const data = await res.json();
        if (res.ok && data.pets) {
          // Sort by createdAt descending and take top 3
          const sortedPets = data.pets
            .slice()
            .sort(
              (a: Pet, b: Pet) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 3);
          setFeaturedPets(sortedPets);
        } else {
          console.error('Failed to fetch pets:', data.error);
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (isLoading) {
    return (
      <section className="section-padding bg-muted/50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Pets</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet some of our amazing pets waiting for their forever homes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                <div className="bg-muted h-48 rounded-lg mb-4" />
                <div className="bg-muted h-4 rounded mb-2" />
                <div className="bg-muted h-4 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-muted/50">
      <div className="page-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Pets</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet some of our amazing pets waiting for their forever homes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/pets">
              View All Pets
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
