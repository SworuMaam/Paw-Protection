import { pets } from '@/data/pets';
import { Pet } from '@/types/pet';
import Link from 'next/link';

interface PetDetailsProps {
  params: {
    id: string;
  };
}

export default function PetDetails({ params }: PetDetailsProps) {
  const id = params.id;
  const pet: Pet | undefined = pets.find((p) => p.id === id);

  if (!pet) {
    return (
      <div className="page-container py-8">
        <h1 className="text-3xl font-bold mb-4">Pet Not Found</h1>
        <Link href="/pets" className="text-primary underline">
          ← Back to Pets
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container py-10 space-y-8">
      <Link href="/pets" className="text-primary underline text-sm">← Back to Pets</Link>

      <h1 className="text-4xl font-bold">{pet.name}</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <img src={pet.images[0]} alt={pet.name} className="rounded-lg w-full max-h-[400px] object-cover" />

        {/* Basic Info */}
        <div className="space-y-4">
          <p><strong>Species:</strong> {pet.species}</p>
          <p><strong>Breed:</strong> {pet.breed}</p>
          <p><strong>Age:</strong> {pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
          <p><strong>Gender:</strong> {pet.gender}</p>
          <p><strong>Size:</strong> {pet.size}</p>
          <p><strong>Activity Level:</strong> {pet.activityLevel}</p>
          {/* <p><strong>Health Status:</strong> {pet.healthStatus}</p> */}
          <p><strong>Availability:</strong> {pet.availabilityStatus}</p>
          <p><strong>Adoption Fee:</strong> {pet.adoptionFee}</p>
          <p><strong>Created At:</strong> {new Date(pet.createdAt).toLocaleDateString()}</p>
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
          {pet.temperament.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>

      {/* Adoption Requirements */}
      {/* <div>
        <h2 className="text-xl font-semibold mb-2">Adoption Requirements</h2>
        <ul className="list-disc pl-5 space-y-1">
          {pet.adoptionRequirements.map((req) => (
            <li key={req}>{req}</li>
          ))}
        </ul>
      </div> */}

      {/* Compatibility */}
      {/* <div>
        <h2 className="text-xl font-semibold mb-2">Compatibility</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Children: {pet.compatibility.children ? 'Yes' : 'No'}</li>
          <li>Other Pets: {pet.compatibility.otherPets ? 'Yes' : 'No'}</li>
          <li>Suitable for Apartments: {pet.compatibility.apartments ? 'Yes' : 'No'}</li>
        </ul>
      </div> */}

      {/* Care Requirements */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Care Details</h2>
        <p><strong>Diet:</strong> {pet.care.diet.type} — {pet.care.diet.frequency}</p>

        {/* {pet.care.toys && pet.care.toys.length > 0 && (
          <p><strong>Favorite Toys:</strong> {pet.care.toys.join(', ')}</p>
        )} */}

        {pet.care.spaceRequirements && (
          <div className="mt-2">
            <p><strong>Indoor:</strong> {pet.care.spaceRequirements.indoor}</p>
            {pet.care.spaceRequirements.outdoor && (
              <p><strong>Outdoor:</strong> {pet.care.spaceRequirements.outdoor}</p>
            )}
            {pet.care.spaceRequirements.yardSize && (
              <p><strong>Yard Size:</strong> {pet.care.spaceRequirements.yardSize}</p>
            )}
          </div>
        )}
      </div>

      {/* Location */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Location</h2>
        <p><strong>Address:</strong> {pet.location.address}</p>
        {pet.location.suitability && (
          <p><strong>Best For:</strong> {pet.location.suitability.join(', ')}</p>
        )}
      </div>
    </div>
  );
}
