"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PetCard } from "@/components/pets/PetCard";
import { Pet } from "@/types/pet";

export default function FavoritePetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch("/api/favorites/list", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setPets(data.pets);
        } else {
          console.error("Failed to load favorites:", data.error);
          setPets([]);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setPets([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  if (loading) return <div className="p-6">Loading favorite pets...</div>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Favorite Pets</CardTitle>
        </CardHeader>
        <CardContent>
          {pets.length === 0 ? (
            <p className="text-muted-foreground">
              You haven’t saved any pets yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={{ ...pet, isFavorited: true }} showFavorite />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
