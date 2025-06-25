export interface User {
  id: number;
  name: string;
  email: string;
  location?: string;
  preferences?: Record<string, any>; // Use Record<string, any> for JSONB type
  createdAt: string; // Assuming this is returned as a string
  role: 'user' | 'admin'; // Assuming roles are 'user' or 'admin'
}

// You can add other interfaces here as needed, e.g., for Pet, AdoptionApplication, etc.
export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  temperament: string[];
  activity_level: string;
  health_status: string;
  adoption_requirements?: string[];
  description: string;
  images: string[];
  location_address: string;
  location_coordinates?: { x: number; y: number }; // POINT type in PostgreSQL
  location_suitability?: string[];
  diet_type?: string;
  diet_frequency?: string;
  toys?: string[];
  space_requirements?: Record<string, any>; // JSONB
  compatibility?: Record<string, any>; // JSONB
  adoption_fee: number;
  availability_status: 'Available' | 'Pending' | 'Adopted';
  created_at: string;
  updated_at: string;
}

export interface AdoptionApplication {
  id: number;
  user_id: number;
  pet_id: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  application_data?: Record<string, any>; // JSONB
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  id: number;
  user_id: number;
  pet_id: number;
  created_at: string;
}