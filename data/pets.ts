// data/pets.ts

import { Pet } from '@/types/pet';

export const pets: Pet[] = [
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
      address: 'Patan, Lalitpur',
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
    createdAt: '2025-06-27',
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
      address: 'Kirtipur, Kathmandu',
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
    adoptionFee: 15000,
    availabilityStatus: 'Available',
    createdAt: '2025-06-28',
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
      suitability: ['Bhaktapur']
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
    adoptionFee: 10000,
    availabilityStatus: 'Available',
    createdAt: '2025-06-27',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    name: 'Bella',
    species: 'Cat',
    breed: 'Siamese',
    age: 1,
    gender: 'Female',
    size: 'Medium',
    temperament: ['Playful'],
    activityLevel: 'High',
    healthStatus: 'Excellent',
    adoptionRequirements: ['Interactive play time', 'Mental stimulation'],
    description: 'Bella is a young Siamese with lots of personality and energy.',
    images: [
      'https://images.pexels.com/photos/156934/pexels-photo-156934.jpeg'
    ],
    location: {
      address: 'Kathmandu, Nepal',
      coordinates: [-122.3321, 47.6062],
      suitability: ['Normal']
    },
    care: {
      diet: { type: 'High-protein kitten food', frequency: 'Three times daily' },
      toys: ['Interactive puzzles', 'Laser pointers', 'Climbing trees'],
      spaceRequirements: { indoor: 'Medium space with vertical climbing' }
    },
    compatibility: { children: true, otherPets: false, apartments: true },
    adoptionFee: 2000,
    availabilityStatus: 'Available',
    createdAt: '2025-06-28',
    updatedAt: '2025-06-12T16:20:00Z'
  }
];
