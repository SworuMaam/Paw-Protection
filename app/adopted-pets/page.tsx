"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  gender: string;
  age: number;
  size: string;
  image: string;
  location_address?: string;
  adopted_at?: string;      // ISO date string
  adoption_fee?: number;
}

export default function AdoptedPetsPage() {
  const { user, isLoading } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdoptedPets() {
      try {
        const res = await fetch("/api/adopted-pets", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setPets(data.pets);
        } else {
          console.error("Failed to load adopted pets:", data.error);
          setPets([]);
        }
      } catch (error) {
        console.error("Error fetching adopted pets:", error);
        setPets([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAdoptedPets();
  }, []);

  if (isLoading || loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Adopted Pets</CardTitle>
        </CardHeader>
        <CardContent>
          {pets.length === 0 ? (
            <p className="text-muted-foreground">
              You haven’t adopted any pets yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="border rounded-xl overflow-hidden shadow"
                >
                  <Image
                    src={pet.image || "/placeholder.png"}
                    alt={pet.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pet.species} — {pet.breed}
                    </p>
                    {pet.adopted_at && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Adopted on:{" "}
                        {new Date(pet.adopted_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    {pet.adoption_fee !== undefined && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Adoption Fee: ${pet.adoption_fee.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
