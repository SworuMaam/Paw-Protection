"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar, User } from "lucide-react";
import { Pet } from "@/types/pet";
import { useState } from "react";

interface PetCardProps {
  pet: Pet;
  showFavorite?: boolean;
}

export function PetCard({ pet, showFavorite = false }: PetCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const getAgeText = (age: number) => {
    if (age < 1) return "Puppy/Kitten";
    if (age === 1) return "1 year";
    return `${age} years`;
  };

  return (
    <Card className="pet-card group">
      <Link href={`/pets/${pet.id}`}>
        <div className="relative overflow-hidden">
          {/* Image */}
          <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
            {!imageError && pet.images.length > 0 ? (
              <img
                src={pet.images[0]}
                alt={pet.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No image available
                  </p>
                </div>
              </div>
            )}

            {/* Favorite Button */}
            {showFavorite && (
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full shadow-md"
                onClick={handleFavoriteToggle}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorited
                      ? "fill-red-500 text-red-500"
                      : "text-muted-foreground"
                  }`}
                />
              </Button>
            )}

            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <Badge
                variant={
                  pet.availabilityStatus === "Available"
                    ? "default"
                    : pet.availabilityStatus === "Pending"
                    ? "secondary"
                    : "outline"
                }
                className="shadow-sm"
              >
                {pet.availabilityStatus}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Pet Info */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                  {pet.name}
                </h3>
                <p className="text-muted-foreground">
                  {pet.breed} • {pet.species}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {getAgeText(pet.age)}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {pet.gender}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {pet.location.address}
                </div>
              </div>

              {/* Temperament Tags */}
              <div className="flex flex-wrap gap-1">
                {pet.temperament.slice(0, 3).map((trait) => (
                  <Badge key={trait} variant="outline" className="text-xs">
                    {trait}
                  </Badge>
                ))}
                {pet.temperament.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{pet.temperament.length - 3} more
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {pet.description}
              </p>

              {/* Adoption Fee */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-lg font-semibold text-primary">
                  Rs.{pet.adoptionFee}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  asChild
                >
                  <Link href={`/pets/${pet.id}`}>Learn More</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
