"use client";

import { useState, useEffect } from "react";
import { PetCard } from "@/components/pets/PetCard";
import { PetFilters } from "@/components/pets/PetFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Grid, List } from "lucide-react";
import { Pet } from "@/types/pet";

// Mock pets data
const mockPets: Pet[] = [
  {
    id: "1",
    name: "Luna",
    species: "Dog",
    breed: "Golden Retriever",
    age: 3,
    gender: "Female",
    size: "Large",
    temperament: ["Friendly", "Energetic", "Loyal"],
    activityLevel: "High",
    healthStatus: "Excellent",
    adoptionRequirements: ["Fenced yard", "Experience with large dogs"],
    description:
      "Luna is a beautiful Golden Retriever who loves playing fetch and swimming.",
    images: [
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
      "https://images.pexels.com/photos/160846/french-bulldog-summer-smile-joy-160846.jpeg",
    ],
    location: {
      address: "Patan, Lalitpur",
      coordinates: [-122.4194, 37.7749],
      suitability: ["Urban", "Suburban"],
    },
    care: {
      diet: {
        type: "High-quality dry food",
        frequency: "Twice daily",
      },
      toys: ["Tennis balls", "Rope toys", "Frisbee"],
      spaceRequirements: {
        indoor: "Large living space",
        outdoor: "Large yard",
        yardSize: "Medium to large",
      },
    },
    compatibility: {
      children: true,
      otherPets: true,
      apartments: false,
    },
    adoptionFee: 250,
    availabilityStatus: "Available",
    createdAt: "2025-06-27",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Whiskers",
    species: "Cat",
    breed: "Maine Coon",
    age: 2,
    gender: "Male",
    size: "Large",
    temperament: ["Calm", "Affectionate", "Independent"],
    activityLevel: "Moderate",
    healthStatus: "Good",
    adoptionRequirements: ["Indoor only", "Regular grooming"],
    description:
      "Whiskers is a gentle giant who loves cuddling and watching birds from the window.",
    images: [
      "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg",
      "https://images.pexels.com/photos/320014/pexels-photo-320014.jpeg",
    ],
    location: {
      address: "Kirtipur, Kathmandu",
      coordinates: [-122.6784, 45.5152],
      suitability: ["Urban", "Suburban", "Rural"],
    },
    care: {
      diet: {
        type: "Premium wet and dry food",
        frequency: "Three times daily",
      },
      toys: ["Feather wands", "Catnip mice", "Scratching posts"],
      spaceRequirements: {
        indoor: "Medium apartment or larger",
      },
    },
    compatibility: {
      children: true,
      otherPets: true,
      apartments: true,
    },
    adoptionFee: 15000,
    availabilityStatus: "Available",
    createdAt: "2025-06-28",
    updatedAt: "2024-01-14T14:30:00Z",
  },
  {
    id: "3",
    name: "Buddy",
    species: "Dog",
    breed: "Mixed Breed",
    age: 5,
    gender: "Male",
    size: "Medium",
    temperament: ["Gentle", "Loyal", "Calm"],
    activityLevel: "Moderate",
    healthStatus: "Good",
    adoptionRequirements: ["Patient family", "No small children"],
    description:
      "Buddy is a sweet senior dog looking for a quiet home to spend his golden years.",
    images: [
      "https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg",
      "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg",
    ],
    location: {
      address: "Austin, TX",
      coordinates: [-97.7431, 30.2672],
      suitability: ["Bhaktapur"],
    },
    care: {
      diet: {
        type: "Senior dog formula",
        frequency: "Twice daily",
      },
      toys: ["Soft chew toys", "Comfort blankets"],
      spaceRequirements: {
        indoor: "Small to medium space",
        outdoor: "Small yard or regular walks",
      },
    },
    compatibility: {
      children: false,
      otherPets: true,
      apartments: true,
    },
    adoptionFee: 10000,
    availabilityStatus: "Available",
    createdAt: "2025-06-27",
    updatedAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    name: "Bella",
    species: "Cat",
    breed: "Siamese",
    age: 1,
    gender: "Female",
    size: "Medium",
    temperament: ["Playful", "Vocal", "Intelligent"],
    activityLevel: "High",
    healthStatus: "Excellent",
    adoptionRequirements: ["Interactive play time", "Mental stimulation"],
    description:
      " is a young Siamese with lots Bellaof personality and energy.",
    images: [
      "https://images.pexels.com/photos/156934/pexels-photo-156934.jpeg",
    ],
    location: {
      address: "Kathmandu, Nepal",
      coordinates: [27.69913199083734, 85.30755976707229],
      suitability: ["Normal "],
    },
    care: {
      diet: {
        type: "Highkitten food-protein ",
        frequency: "Three times daily",
      },
      toys: ["Interactive puzzles", "Laser pointers", "Climbing trees"],
      spaceRequirements: { indoor: "Small apartment" },
    },
    compatibility: { children: true, otherPets: false, apartments: true },
    adoptionFee: 2000,
    availabilityStatus: "Available",
    createdAt: "2025-06-12T16:20:00Z",
    updatedAt: "2025-06-12T16:20:00Z",
  },
];

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchPets = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPets(mockPets);
      setFilteredPets(mockPets);
      setIsLoading(false);
    };

    fetchPets();
  }, []);

  useEffect(() => {
    let filtered = pets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.species.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort pets
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "age":
        filtered.sort((a, b) => a.age - b.age);
        break;
      case "fee":
        filtered.sort((a, b) => a.adoptionFee - b.adoptionFee);
        break;
    }

    setFilteredPets(filtered);
  }, [pets, searchTerm, sortBy]);

  const handleFiltersChange = (filters: any) => {
    let filtered = pets;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.species.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.species?.length > 0) {
      filtered = filtered.filter((pet) =>
        filters.species.includes(pet.species)
      );
    }

    if (filters.size?.length > 0) {
      filtered = filtered.filter((pet) => filters.size.includes(pet.size));
    }

    if (filters.gender?.length > 0) {
      filtered = filtered.filter((pet) => filters.gender.includes(pet.gender));
    }

    if (filters.ageRange) {
      const [min, max] = filters.ageRange;
      filtered = filtered.filter((pet) => pet.age >= min && pet.age <= max);
    }

    setFilteredPets(filtered);
  };

  if (isLoading) {
    return (
      <div className="page-container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-12 bg-muted rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-lg p-6">
                <div className="bg-muted h-48 rounded mb-4" />
                <div className="bg-muted h-4 rounded mb-2" />
                <div className="bg-muted h-4 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Pet</h1>
        <p className="text-muted-foreground">
          Browse our available pets and find your new best friend
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pets by name, breed, or species..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="age">Age (Low to High)</SelectItem>
                <SelectItem value="fee">Adoption Fee</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && <PetFilters onFiltersChange={handleFiltersChange} />}
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredPets.length} of {pets.length} pets
        </p>
      </div>

      {/* Pets Grid */}
      {filteredPets.length > 0 ? (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} showFavorite={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No pets found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
}
