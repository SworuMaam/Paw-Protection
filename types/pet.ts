export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: 'Male' | 'Female';
  size: 'Small' | 'Medium' | 'Large' | 'Extra Large';
  temperament: string[];
  activityLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  healthStatus: string;
  adoptionRequirements: string[];
  description: string;
  images: string[];
  location: {
    address: string;
    coordinates: [number, number];
    suitability: string[];
  };
  care: {
    diet: {
      type: string;
      frequency: string;
      specialRequirements?: string;
    };
    toys: string[];
    spaceRequirements: {
      indoor: string;
      outdoor?: string;
      yardSize?: string;
    };
  };
  compatibility: {
    children: boolean;
    otherPets: boolean;
    apartments: boolean;
  };
  adoptionFee: number;
  availabilityStatus: 'Available' | 'Pending' | 'Adopted';
  createdAt: string;
  updatedAt: string;
}

export interface PetFilters {
  species?: string[];
  breeds?: string[];
  ageRange?: [number, number];
  gender?: string[];
  size?: string[];
  temperament?: string[];
  activityLevel?: string[];
  location?: string;
  availabilityStatus?: string[];
}

export interface RecommendationScore {
  petId: string;
  score: number;
  reasons: string[];
}