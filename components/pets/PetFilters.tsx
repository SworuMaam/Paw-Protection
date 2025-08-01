'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface PetFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const filterOptions = {
  species: ['Dog', 'Cat'],
  size: ['Small', 'Medium', 'Large', 'Extra Large'],
  gender: ['Male', 'Female'],
  temperament: ['Friendly', 'Energetic', 'Calm', 'Playful', 'Loyal', 'Independent', 'Gentle'],
  activityLevel: ['Low', 'Moderate', 'High', 'Very High'],
};

export function PetFilters({ onFiltersChange }: PetFiltersProps) {
  const [filters, setFilters] = useState({
    species: [] as string[],
    size: [] as string[],
    gender: [] as string[],
    temperament: [] as string[],
    activityLevel: [] as string[],
    ageRange: [0, 15] as [number, number],
  });

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    const newFilters = { ...filters };
    const categoryFilters = newFilters[category as keyof typeof filters] as string[];
    
    if (checked) {
      categoryFilters.push(value);
    } else {
      const index = categoryFilters.indexOf(value);
      if (index > -1) {
        categoryFilters.splice(index, 1);
      }
    }
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAgeRangeChange = (range: [number, number]) => {
    const newFilters = { ...filters, ageRange: range };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      species: [],
      size: [],
      gender: [],
      temperament: [],
      activityLevel: [],
      ageRange: [0, 15] as [number, number],
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      if (key === 'ageRange') {
        return count + (value[0] !== 0 || value[1] !== 15 ? 1 : 0);
      }
      return count + (value as string[]).length;
    }, 0);
  };

  const removeFilter = (category: string, value: string) => {
    handleFilterChange(category, value, false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Filters</h3>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFiltersCount()} active
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {getActiveFiltersCount() > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([category, values]) => {
                if (category === 'ageRange') {
                  const [min, max] = values as [number, number];
                  if (min !== 0 || max !== 15) {
                    return (
                      <Badge key={category} variant="outline" className="flex items-center gap-1">
                        Age: {min}-{max} years
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleAgeRangeChange([0, 15])}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  }
                  return null;
                }
                
                return (values as string[]).map((value) => (
                  <Badge key={`${category}-${value}`} variant="outline" className="flex items-center gap-1">
                    {value}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeFilter(category, value)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ));
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Species */}
          <div>
            <h4 className="font-medium mb-3">Species</h4>
            <div className="space-y-2">
              {filterOptions.species.map((species) => (
                <div key={species} className="flex items-center space-x-2">
                  <Checkbox
                    id={`species-${species}`}
                    checked={filters.species.includes(species)}
                    onCheckedChange={(checked) => 
                      handleFilterChange('species', species, checked as boolean)
                    }
                  />
                  <Label htmlFor={`species-${species}`} className="text-sm">
                    {species}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <h4 className="font-medium mb-3">Size</h4>
            <div className="space-y-2">
              {filterOptions.size.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={filters.size.includes(size)}
                    onCheckedChange={(checked) => 
                      handleFilterChange('size', size, checked as boolean)
                    }
                  />
                  <Label htmlFor={`size-${size}`} className="text-sm">
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <h4 className="font-medium mb-3">Gender</h4>
            <div className="space-y-2">
              {filterOptions.gender.map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <Checkbox
                    id={`gender-${gender}`}
                    checked={filters.gender.includes(gender)}
                    onCheckedChange={(checked) => 
                      handleFilterChange('gender', gender, checked as boolean)
                    }
                  />
                  <Label htmlFor={`gender-${gender}`} className="text-sm">
                    {gender}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Age Range */}
          <div>
            <h4 className="font-medium mb-3">
              Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years
            </h4>
            <Slider
              value={filters.ageRange}
              onValueChange={handleAgeRangeChange}
              max={15}
              min={0}
              step={1}
              className="mt-2"
            />
          </div>

          {/* Temperament */}
          <div>
            <h4 className="font-medium mb-3">Temperament</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filterOptions.temperament.map((trait) => (
                <div key={trait} className="flex items-center space-x-2">
                  <Checkbox
                    id={`temperament-${trait}`}
                    checked={filters.temperament.includes(trait)}
                    onCheckedChange={(checked) => 
                      handleFilterChange('temperament', trait, checked as boolean)
                    }
                  />
                  <Label htmlFor={`temperament-${trait}`} className="text-sm">
                    {trait}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <h4 className="font-medium mb-3">Activity Level</h4>
            <div className="space-y-2">
              {filterOptions.activityLevel.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`activity-${level}`}
                    checked={filters.activityLevel.includes(level)}
                    onCheckedChange={(checked) => 
                      handleFilterChange('activityLevel', level, checked as boolean)
                    }
                  />
                  <Label htmlFor={`activity-${level}`} className="text-sm">
                    {level}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}