'use client';

import { useState, useEffect } from 'react';
import { PetCard } from '@/components/pets/PetCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Pet } from '@/types/pet';

// Mock featured pets data
const mockFeaturedPets: Pet[] = [
  {
    id: '1',
    name: 'Luna',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'Female',
    size: 'Large',
    temperament: ['Friendly', 'Energetic', 'Loyal'],
    activityLevel: 'High',
    healthStatus: 'Excellent',
    adoptionRequirements: ['Fenced yard', 'Experience with large dogs'],
    description: 'Luna is a beautiful Golden Retriever who loves playing fetch and swimming.',
    images: [
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      'https://images.pexels.com/photos/160846/french-bulldog-summer-smile-joy-160846.jpeg'
    ],
    location: {
      address: 'San Francisco, CA',
      coordinates: [-122.4194, 37.7749],
      suitability: ['Urban', 'Suburban']
    },
    care: {
      diet: {
        type: 'High-quality dry food',
        frequency: 'Twice daily'
      },
      toys: ['Tennis balls', 'Rope toys', 'Frisbee'],
      spaceRequirements: {
        indoor: 'Large living space',
        outdoor: 'Large yard',
        yardSize: 'Medium to large'
      }
    },
    compatibility: {
      children: true,
      otherPets: true,
      apartments: false
    },
    adoptionFee: 250,
    availabilityStatus: 'Available',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Maine Coon',
    age: 2,
    gender: 'Male',
    size: 'Large',
    temperament: ['Calm', 'Affectionate', 'Independent'],
    activityLevel: 'Moderate',
    healthStatus: 'Good',
    adoptionRequirements: ['Indoor only', 'Regular grooming'],
    description: 'Whiskers is a gentle giant who loves cuddling and watching birds from the window.',
    images: [
      'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
      'https://images.pexels.com/photos/320014/pexels-photo-320014.jpeg'
    ],
    location: {
      address: 'Portland, OR',
      coordinates: [-122.6784, 45.5152],
      suitability: ['Urban', 'Suburban', 'Rural']
    },
    care: {
      diet: {
        type: 'Premium wet and dry food',
        frequency: 'Three times daily'
      },
      toys: ['Feather wands', 'Catnip mice', 'Scratching posts'],
      spaceRequirements: {
        indoor: 'Medium apartment or larger'
      }
    },
    compatibility: {
      children: true,
      otherPets: true,
      apartments: true
    },
    adoptionFee: 150,
    availabilityStatus: 'Available',
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z'
  },
  {
    id: '3',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Mixed Breed',
    age: 5,
    gender: 'Male',
    size: 'Medium',
    temperament: ['Gentle', 'Loyal', 'Calm'],
    activityLevel: 'Moderate',
    healthStatus: 'Good',
    adoptionRequirements: ['Patient family', 'No small children'],
    description: 'Buddy is a sweet senior dog looking for a quiet home to spend his golden years.',
    images: [
      'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg',
      'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg'
    ],
    location: {
      address: 'Austin, TX',
      coordinates: [-97.7431, 30.2672],
      suitability: ['Urban', 'Suburban']
    },
    care: {
      diet: {
        type: 'Senior dog formula',
        frequency: 'Twice daily'
      },
      toys: ['Soft chew toys', 'Comfort blankets'],
      spaceRequirements: {
        indoor: 'Small to medium space',
        outdoor: 'Small yard or regular walks'
      }
    },
    compatibility: {
      children: false,
      otherPets: true,
      apartments: true
    },
    adoptionFee: 100,
    availabilityStatus: 'Available',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
];

export function FeaturedPets() {
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchFeaturedPets = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFeaturedPets(mockFeaturedPets);
      setIsLoading(false);
    };

    fetchFeaturedPets();
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