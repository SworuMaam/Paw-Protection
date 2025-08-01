'use client';

import { useEffect, useState } from 'react';
import { PawPrint, Edit3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  availability_status: string;
  image: string;
};

export default function FosterPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingPetId, setUpdatingPetId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/foster-pets', {
      credentials: 'include', // important: sends auth-token cookie
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPets(data);
        } else {
          toast.error(data.error || 'Failed to load pets');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error fetching pets');
        setLoading(false);
      });
  }, []);

  const handleAvailabilityChange = async (petId: number, newStatus: string) => {
    setUpdatingPetId(petId);

    try {
      const res = await fetch(`/api/foster-pets/${petId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availability_status: newStatus }),
      });

      const updatedPet = await res.json();

      if (!res.ok) {
        toast.error(updatedPet.error || 'Failed to update availability');
      } else {
        setPets((prev) =>
          prev.map((p) => (p.id === petId ? { ...p, availability_status: updatedPet.availability_status } : p))
        );
        toast.success('Availability updated');
      }
    } catch (err) {
      toast.error('Update failed');
      console.error(err);
    } finally {
      setUpdatingPetId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <PawPrint className="h-7 w-7 text-primary" />
          Pets in Your Care
        </h1>
        <p className="text-muted-foreground mt-1">Manage availability status of pets assigned to you.</p>
      </div>

      {pets.length === 0 ? (
        <div className="text-center text-muted-foreground mt-20">
          <p>No pets are currently assigned to you.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden shadow-sm hover:shadow-md transition">
              <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle>{pet.name}</CardTitle>
                <CardDescription>
                  {pet.species} • {pet.breed} • {pet.age} yr • {pet.gender}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Availability Status</p>
                    <Select
                      value={pet.availability_status}
                      onValueChange={(value) => handleAvailabilityChange(pet.id, value)}
                      disabled={updatingPetId === pet.id}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Fostered_Not_Available">Fostered_Not_Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Edit3 className="h-4 w-4" />
                    <span className="text-sm">Editable</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
