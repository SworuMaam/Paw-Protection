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

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("/api/pets");
        const data = await res.json();
        if (res.ok) {
          setPets(data.pets);
          setFilteredPets(data.pets);
        } else {
          console.error("Failed to fetch pets:", data.error);
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setIsLoading(false);
      }
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

    if (searchTerm) {
      filtered = filtered.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.species.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Pet</h1>
        <p className="text-muted-foreground">
          Browse our available pets and find your new best friend
        </p>
      </div>

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

        {showFilters && <PetFilters onFiltersChange={handleFiltersChange} />}
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredPets.length} of {pets.length} pets
        </p>
      </div>

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
