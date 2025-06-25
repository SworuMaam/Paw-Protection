'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Star, Award } from 'lucide-react';
import { PetRecommendation } from '@/types/preferences';
import Link from 'next/link';
import { useState } from 'react';

interface RecommendationCardProps {
  recommendation: PetRecommendation;
  compact?: boolean;
}

export function RecommendationCard({ recommendation, compact = false }: RecommendationCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { pet, score, matchReasons, distance } = recommendation;

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
      <Link href={`/pets/${pet.id}`}>
        <div className="relative overflow-hidden">
          {/* Image */}
          <div className={`aspect-[4/3] relative overflow-hidden rounded-t-lg ${compact ? 'aspect-[3/2]' : ''}`}>
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
                  <p className="text-sm text-muted-foreground">No image available</p>
                </div>
              </div>
            )}
            
            {/* Match Score Badge */}
            <div className="absolute top-3 left-3">
              <Badge className={`${getScoreColor(score)} border font-semibold`}>
                {Math.round(score)}% Match
              </Badge>
            </div>
            
            {/* Distance Badge */}
            {distance && (
              <div className="absolute top-3 right-12">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {Math.round(distance)} mi
                </Badge>
              </div>
            )}
            
            {/* Favorite Button */}
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full shadow-md"
              onClick={handleFavoriteToggle}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                }`}
              />
            </Button>
          </div>
          
          <CardContent className={compact ? 'p-4' : 'p-6'}>
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
              
              {/* Match Quality */}
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {getScoreLabel(score)}
                </span>
              </div>
              
              {/* Match Reasons */}
              {!compact && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Why it's a great match:</p>
                  {matchReasons.slice(0, 2).map((reason, index) => (
                    <p key={index} className="text-xs text-muted-foreground">
                      • {reason}
                    </p>
                  ))}
                  {matchReasons.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      • +{matchReasons.length - 2} more reasons
                    </p>
                  )}
                </div>
              )}
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  {pet.age} {pet.age === 1 ? 'year' : 'years'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {pet.gender}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {pet.size}
                </Badge>
              </div>
              
              {/* Action */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-lg font-semibold text-primary">
                  ${pet.adoptionFee}
                </div>
                <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}