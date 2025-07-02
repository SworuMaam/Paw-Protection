import db from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PetDetailsProps {
  params: {
    id: string;
  };
}

export default async function PetDetails({ params }: PetDetailsProps) {
  const id = params.id;

  const res = await db.query(
    `SELECT 
      id, name, species, breed, age, gender, size, temperament, 
      activity_level, description, image, location_address, 
      adoption_fee, availability_status, created_at 
    FROM pets WHERE id = $1`,
    [id]
  );

  const pet = res.rows[0];

  if (!pet) {
    return notFound();
  }

  return (
    <div className="page-container py-10 space-y-8">
      <Link href="/pets" className="text-primary underline text-sm">← Back to Pets</Link>

      <h1 className="text-4xl font-bold">{pet.name}</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <img
          src={pet.image}
          alt={pet.name}
          className="rounded-lg w-full max-h-[400px] object-cover"
        />

        {/* Basic Info */}
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

      {/* Description */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">About {pet.name}</h2>
        <p className="text-muted-foreground">{pet.description}</p>
      </div>

      {/* Temperament */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Temperament</h2>
        <ul className="list-disc pl-5 space-y-1">
          {pet.temperament.map((t: string) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      {/* Location */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Location</h2>
        <p><strong>Address:</strong> {pet.location_address}</p>
      </div>
    </div>
  );
}
