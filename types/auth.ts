export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  role: 'user' | 'admin';
  preferences?: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  species: string[];
  breeds: string[];
  ageRange: [number, number];
  gender: string[];
  size: string[];
  temperament: string[];
  activityLevel: string[];
  specialNeeds: boolean;
  location: {
    type: 'current' | 'manual';
    coordinates?: [number, number];
    address?: string;
    zipCode?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  location?: string;
}