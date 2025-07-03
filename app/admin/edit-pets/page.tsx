'use client';

import { useEffect, useState } from "react";
import { PetCard } from "@/components/pets/PetCard";
import { Pet } from "@/types/pet";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPets = async () => {
      const res = await fetch("/api/pets");
      const data = await res.json();
      setPets(data.pets);
    };
    fetchPets();
  }, []);

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed.toLowerCase().includes(search.toLowerCase()) ||
      pet.species.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      !statusFilter || pet.availability_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container py-8">
      <h1 className="text-3xl font-bold mb-4">Edit Pets</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Search pets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Pending">Pending</option>
          <option value="Adopted">Adopted</option>
          <option value="Fostered_Available">Fostered Available</option>
          <option value="Fostered_Not_Available">Fostered Not Available</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPets.map((pet) => (
          <div key={pet.id} className="relative">
            <PetCard pet={pet} showFavorite={false} />
            {/* <Button
              className="absolute top-2 right-2"
              size="sm"
              onClick={() => router.push(`/admin/edit-pet/${pet.id}`)}
            >
              Edit
            </Button> */}
          </div>
        ))}
      </div>
    </div>
  );
}