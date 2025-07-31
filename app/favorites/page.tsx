'use client';

import { useEffect, useState } from 'react';
import { PetCard } from '@/components/pets/PetCard';
import { Pet } from '@/types/pet';
import { toast } from 'sonner';

export default function FavoritePetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch('/api/favorites/list');
        const data = await res.json();
        setPets(data);
      } catch (err) {
        toast.error('Failed to load favorites');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  if (loading) {
    return <div className="text-center py-16">Loading your saved pets...</div>;
  }

  if (!pets.length) {
    return <div className="text-center py-16">You haven’t saved any pets yet.</div>;
  }

  return (
    <div className="page-container py-8">
      <h1 className="text-2xl font-bold mb-6">My Saved Pets</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} showFavorite />
        ))}
      </div>
    </div>
  );
}
