"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar, User, Trash, Pencil } from "lucide-react";
import { Pet } from "@/types/pet";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface PetCardProps {
  pet: Pet & { isFavorited?: boolean };
  showFavorite?: boolean;
}

export function PetCard({ pet, showFavorite = false }: PetCardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(pet.isFavorited ?? false);
  const [imageError, setImageError] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { user } = useAuth();
  const isAdminEditPage = pathname === "/admin/edit-pets";

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete ${pet.name}?`)) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/pets/${pet.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete pet");

      toast.success("Pet deleted");
      router.refresh();
    } catch (err) {
      toast.error("Error deleting pet");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to save favorites");
      return;
    }

    try {
      const res = await fetch("/api/favorites", {
        method: isFavorited ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ petId: pet.id }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update favorite");
      }

      setIsFavorited(!isFavorited);
      toast.success(
        isFavorited ? "Removed from favorites" : "Added to favorites"
      );
    } catch (err) {
      toast.error("Could not update favorite");
      console.error(err);
    }
  };

  const getAgeText = (age: number) => {
    if (age < 1) return "Puppy/Kitten";
    if (age === 1) return "1 year";
    return `${age} years`;
  };

  return (
    <Card className="pet-card group">
      <Link href={isAdminEditPage ? "#" : `/pets/${pet.id}`}>
        <div className="relative overflow-hidden">
          {/* Image */}
          <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
            {!imageError && pet.image ? (
              <img
                src={pet.image}
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

            {/* Favorite */}
            {showFavorite && !isAdminEditPage && (
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full shadow-md"
                onClick={async (e) => {
                  e.preventDefault();

                  try {
                    const res = await fetch("/api/favorites", {
                      method: isFavorited ? "DELETE" : "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ petId: pet.id }),
                      credentials: "include",
                    });

                    if (!res.ok) throw new Error("Failed to update favorites");

                    toast.success(
                      isFavorited
                        ? "Removed from favorites"
                        : "Added to favorites"
                    );
                    setIsFavorited((prev) => !prev);
                  } catch (err) {
                    console.error(err);
                    toast.error("Unable to update favorites");
                  }
                }}
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
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                  {pet.name}
                </h3>
                <p className="text-muted-foreground">
                  {pet.breed} • {pet.species}
                </p>
              </div>

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
                  {pet.location?.address || "Unknown location"}
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {pet.temperament?.slice(0, 3).map((trait) => (
                  <Badge key={trait} variant="outline" className="text-xs">
                    {trait}
                  </Badge>
                ))}
                {pet.temperament?.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{pet.temperament.length - 3} more
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {pet.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-lg font-semibold text-primary">
                  Rs.{pet.adoption_fee}
                </div>

                {isAdminEditPage ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    <Button asChild variant="default" size="sm">
                      <Link href={`/admin/edit-pets/${pet.id}`}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    asChild
                  >
                    <Link href={`/pets/${pet.id}`}>Learn More</Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
