'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function PetDetails() {
  const { id } = useParams();
  const { user, isUser } = useAuth();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      const res = await fetch(`/api/pets/${id}`);
      const data = await res.json();
      setPet(data.pet);
      setLoading(false);
    };

    fetchPet();
  }, [id]);

  const handleAdoptionRequest = async () => {
    const res = await fetch('/api/adoption-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ petId: pet.id }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Adoption request sent!');
      window.location.reload();
    } else {
      alert(data.error || 'Failed to send request.');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!pet) {
    return <div className="text-center py-10">Pet not found.</div>;
  }

  return (
    <div className="page-container py-10 space-y-8">
      <Link href="/pets" className="text-primary underline text-sm">← Back to Pets</Link>

      <h1 className="text-4xl font-bold">{pet.name}</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <img src={pet.image} alt={pet.name} className="rounded-lg w-full max-h-[400px] object-cover" />

        <div className="space-y-4">
          <p><strong>Species:</strong> {pet.species}</p>
          <p><strong>Breed:</strong> {pet.breed}</p>
          <p><strong>Age:</strong> {pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
          <p><strong>Gender:</strong> {pet.gender}</p>
          <p><strong>Size:</strong> {pet.size}</p>
          <p><strong>Activity Level:</strong> {pet.activity_level}</p>
          <p><strong>Availability:</strong> {pet.availability_status}</p>
          <p><strong>Adoption Fee:</strong> Rs. {pet.adoption_fee}</p>
          <p><strong>Posted On:</strong> {new Date(pet.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">About {pet.name}</h2>
        <p className="text-muted-foreground">{pet.description}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Temperament</h2>
        <ul className="list-disc pl-5 space-y-1">
          {pet.temperament.map((t: string) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Location</h2>
        <p><strong>Address:</strong> {pet.location_address}</p>
      </div>

      {/* Adoption Request Button */}
      {user?.role === 'user' && 
        (pet.availability_status === 'Available' || pet.availability_status === 'Fostered_Available') && (
        <button
          onClick={handleAdoptionRequest}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Send Adoption Request
        </button>
      )}
    </div>
  );
}
