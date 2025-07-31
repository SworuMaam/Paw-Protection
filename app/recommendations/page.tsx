"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PetCard } from "@/components/pets/PetCard";
import {
  Star,
  MapPin,
  Filter,
  RefreshCw,
  Heart,
  Settings,
  TrendingUp,
  Award,
} from "lucide-react";
import { PetRecommendation, RecommendationFilters } from "@/types/preferences";
import Link from "next/link";

export default function RecommendationsPage() {
  const { user, isLoading, isUser } = useAuth();
  const router = useRouter();

  const [recommendations, setRecommendations] = useState<PetRecommendation[]>(
    []
  );
  const [filteredRecommendations, setFilteredRecommendations] = useState<
    PetRecommendation[]
  >([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RecommendationFilters>({
    minScore: 0,
    maxDistance: 100,
    species: [],
    sortBy: "score",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isUser)) {
      router.push("/login");
    }
  }, [user, isUser, isLoading, router]);

  useEffect(() => {
    if (user && isUser) {
      loadRecommendations();
    }
  }, [user, isUser]);

  useEffect(() => {
    applyFilters();
  }, [recommendations, filters]);

  const loadRecommendations = async () => {
    setIsLoadingRecs(true);
    setError(null);

    try {
      const response = await fetch("/api/recommendations", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRecommendations(data.recommendations);
        } else {
          setError(data.error || "Failed to load recommendations");
        }
      } else {
        const data = await response.json();
        setError(data.error || "Failed to load recommendations");
      }
    } catch (error) {
      console.error("Failed to load recommendations:", error);
      setError("Failed to load recommendations");
    } finally {
      setIsLoadingRecs(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...recommendations];

    // Filter by minimum score
    if (filters.minScore && filters.minScore > 0) {
      filtered = filtered.filter((rec) => rec.score >= filters.minScore!);
    }

    // Filter by maximum distance
    if (filters.maxDistance && filters.maxDistance < 100) {
      filtered = filtered.filter(
        (rec) => !rec.distance || rec.distance <= filters.maxDistance!
      );
    }

    // Filter by species
    if (filters.species && filters.species.length > 0) {
      filtered = filtered.filter((rec) =>
        filters.species!.includes(rec.pet.species)
      );
    }

    // Sort recommendations
    switch (filters.sortBy) {
      case "score":
        filtered.sort((a, b) => b.score - a.score);
        break;
      case "distance":
        filtered.sort((a, b) => {
          if (!a.distance && !b.distance) return 0;
          if (!a.distance) return 1;
          if (!b.distance) return -1;
          return a.distance - b.distance;
        });
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.pet.createdAt).getTime() -
            new Date(a.pet.createdAt).getTime()
        );
        break;
    }

    setFilteredRecommendations(filtered);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-orange-600 bg-orange-50 border-orange-200";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Fair Match";
  };

  if (isLoading || isLoadingRecs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isUser) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="page-container py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Set Your Preferences First
              </h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button asChild>
                <Link href="/preferences">Set Preferences</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="page-container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Star className="h-8 w-8 text-primary" />
                Your Pet Recommendations
              </h1>
              <p className="text-muted-foreground">
                Personalized matches based on your preferences
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button
                variant="outline"
                onClick={loadRecommendations}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Matches
                  </p>
                  <p className="text-2xl font-bold">{recommendations.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Excellent Matches
                  </p>
                  <p className="text-2xl font-bold">
                    {recommendations.filter((r) => r.score >= 80).length}
                  </p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Score
                  </p>
                  <p className="text-2xl font-bold">
                    {recommendations.length > 0
                      ? Math.round(
                          recommendations.reduce((sum, r) => sum + r.score, 0) /
                            recommendations.length
                        )
                      : 0}
                    %
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Filter Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Minimum Score: {filters.minScore}%
                  </label>
                  <Slider
                    value={[filters.minScore || 0]}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, minScore: value[0] }))
                    }
                    max={100}
                    min={0}
                    step={10}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Max Distance: {filters.maxDistance} miles
                  </label>
                  <Slider
                    value={[filters.maxDistance || 100]}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, maxDistance: value[0] }))
                    }
                    max={100}
                    min={5}
                    step={5}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Sort By
                  </label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, sortBy: value as any }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score">Match Score</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        minScore: 0,
                        maxDistance: 100,
                        species: [],
                        sortBy: "score",
                      })
                    }
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredRecommendations.length} of {recommendations.length}{" "}
            recommendations
          </p>
        </div>

        {/* Recommendations Grid */}
        {filteredRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((recommendation) => (
              <div key={recommendation.pet.id} className="relative">
                <PetCard pet={recommendation.pet} showFavorite={true} />

                {/* Match Score Overlay */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge
                    className={`${getScoreColor(
                      recommendation.score
                    )} border font-semibold`}
                  >
                    {Math.round(recommendation.score)}% Match
                  </Badge>
                </div>

                {/* Distance Badge */}
                {typeof recommendation.distance === "number" &&
                  !isNaN(recommendation.distance) && (
                    <div className="absolute top-3 right-12 z-10">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <MapPin className="h-3 w-3" />
                        {recommendation.distance.toFixed(1)} mi
                      </Badge>
                    </div>
                  )}

                {/* Match Reasons */}
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">
                        {getScoreLabel(recommendation.score)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {recommendation.matchReasons
                        .slice(0, 3)
                        .map((reason, index) => (
                          <p
                            key={index}
                            className="text-xs text-muted-foreground"
                          >
                            • {reason}
                          </p>
                        ))}
                      {recommendation.matchReasons.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          • +{recommendation.matchReasons.length - 3} more
                          reasons
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No recommendations found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or updating your preferences
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/preferences">Update Preferences</Link>
              </Button>
              <Button asChild>
                <Link href="/pets">Browse All Pets</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
