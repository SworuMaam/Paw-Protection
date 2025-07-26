"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Loader2,
  Heart,
  Home,
  Users,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { UserPreferences } from "@/types/preferences";

const speciesOptions = ["Dog", "Cat"];
const sizeOptions = ["Small", "Medium", "Large", "Extra Large"];
const genderOptions = ["Male", "Female"];
const temperamentOptions = [
  "Friendly",
  "Energetic",
  "Calm",
  "Playful",
  "Loyal",
  "Independent",
  "Gentle",
  "Protective",
  "Social",
  "Quiet",
];
const activityLevelOptions = ["Low", "Moderate", "High", "Very High"];
const housingOptions = ["Apartment", "House", "Farm/Rural"];
const yardSizeOptions = ["No Yard", "Small Yard", "Medium Yard", "Large Yard"];
const experienceOptions = [
  "First-time Owner",
  "Some Experience",
  "Very Experienced",
];
const timeOptions = [
  "1-2 hours/day",
  "3-4 hours/day",
  "5+ hours/day",
  "Most of the day",
];

export default function PreferencesPage() {
  const { user, isLoading, isUser } = useAuth();
  const router = useRouter();

  const [preferences, setPreferences] = useState<UserPreferences>({
    userId: "",
    species: [],
    size: [],
    ageRange: [0, 15],
    gender: [],
    temperament: [],
    activityLevel: [],
    housingType: "",
    yardSize: "",
    experienceLevel: "",
    timeAvailable: "",
  });

  const [isLoadingPrefs, setIsLoadingPrefs] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const geocodeTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || !isUser)) {
      router.push("/login");
    }
  }, [user, isUser, isLoading, router]);

  useEffect(() => {
    if (user && isUser) {
      loadPreferences();
    }
  }, [user, isUser]);

  const loadPreferences = async () => {
    try {
      const response = await fetch("/api/preferences", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.preferences) {
          setPreferences(data.preferences);
        } else {
          setPreferences((prev) => ({ ...prev, userId: user!.id }));
        }
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
      toast.error("Failed to load preferences");
    } finally {
      setIsLoadingPrefs(false);
    }
  };

  const handleArrayToggle = (field: keyof UserPreferences, value: string) => {
    setPreferences((prev) => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      setHasUnsavedChanges(true);
      return { ...prev, [field]: newArray };
    });
  };

  const handleInputChange = (field: keyof UserPreferences, value: any) => {
    setPreferences((prev) => {
      setHasUnsavedChanges(true);
      return { ...prev, [field]: value };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setHasUnsavedChanges(false);
        toast.success("Preferences saved successfully!");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save preferences");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isLoadingPrefs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="page-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            Pet Preferences
          </h1>
          <p className="text-muted-foreground">
            Tell us about your ideal pet companion to get personalized
            recommendations
          </p>
        </div>

        {hasUnsavedChanges && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have unsaved changes. Don't forget to save your preferences!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Basic Preferences
                </CardTitle>
                <CardDescription>
                  What type of pet are you looking for?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Species */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Species
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {speciesOptions.map((species) => (
                      <Badge
                        key={species}
                        variant={
                          preferences.species.includes(species)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => handleArrayToggle("species", species)}
                      >
                        {species}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Size
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => (
                      <Badge
                        key={size}
                        variant={
                          preferences.size.includes(size)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => handleArrayToggle("size", size)}
                      >
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Age Range */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Age Range: {preferences.ageRange[0]} -{" "}
                    {preferences.ageRange[1]} years
                  </Label>
                  <Slider
                    value={preferences.ageRange}
                    onValueChange={(value) =>
                      handleInputChange("ageRange", value as [number, number])
                    }
                    max={15}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>

                {/* Gender */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Gender Preference
                  </Label>
                  <div className="flex gap-2">
                    {genderOptions.map((gender) => (
                      <Badge
                        key={gender}
                        variant={
                          preferences.gender.includes(gender)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => handleArrayToggle("gender", gender)}
                      >
                        {gender}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personality & Behavior */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personality & Behavior
                </CardTitle>
                <CardDescription>
                  What personality traits are you looking for?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Temperament */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Temperament
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {temperamentOptions.map((trait) => (
                      <Badge
                        key={trait}
                        variant={
                          preferences.temperament.includes(trait)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => handleArrayToggle("temperament", trait)}
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Activity Level */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Activity Level
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {activityLevelOptions.map((level) => (
                      <Badge
                        key={level}
                        variant={
                          preferences.activityLevel.includes(level)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() =>
                          handleArrayToggle("activityLevel", level)
                        }
                      >
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Living Situation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Living Situation
                </CardTitle>
                <CardDescription>
                  Tell us about your living environment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Housing Type */}
                <div>
                  <Label
                    htmlFor="housing-type"
                    className="text-base font-medium"
                  >
                    Housing Type
                  </Label>
                  <Select
                    value={preferences.housingType}
                    onValueChange={(value) =>
                      handleInputChange("housingType", value)
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select housing type" />
                    </SelectTrigger>
                    <SelectContent>
                      {housingOptions.map((option) => (
                        <SelectItem key={option} value={option.toLowerCase()}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Yard Size */}
                <div>
                  <Label htmlFor="yard-size" className="text-base font-medium">
                    Yard Size
                  </Label>
                  <Select
                    value={preferences.yardSize}
                    onValueChange={(value) =>
                      handleInputChange("yardSize", value)
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select yard size" />
                    </SelectTrigger>
                    <SelectContent>
                      {yardSizeOptions.map((option) => (
                        <SelectItem key={option} value={option.toLowerCase()}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Level */}
                <div>
                  <Label htmlFor="experience" className="text-base font-medium">
                    Experience Level
                  </Label>
                  <Select
                    value={preferences.experienceLevel}
                    onValueChange={(value) =>
                      handleInputChange("experienceLevel", value)
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceOptions.map((option) => (
                        <SelectItem key={option} value={option.toLowerCase()}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Available */}
                <div>
                  <Label
                    htmlFor="time-available"
                    className="text-base font-medium"
                  >
                    Time Available Daily
                  </Label>
                  <Select
                    value={preferences.timeAvailable}
                    onValueChange={(value) =>
                      handleInputChange("timeAvailable", value)
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select time available" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Save Button */}
            <Card>
              <CardContent className="p-6">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !hasUnsavedChanges}
                  className="w-full"
                  size="lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Save Preferences
                    </>
                  )}
                </Button>

                {!hasUnsavedChanges && (
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    All changes saved
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href="/recommendations">
                    <Star className="mr-2 h-4 w-4" />
                    View Recommendations
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href="/pets">
                    <Heart className="mr-2 h-4 w-4" />
                    Browse All Pets
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Be specific about your preferences for better matches</p>
                <p>• Consider your lifestyle and living situation</p>
                <p>• Update your location for accurate distance calculations</p>
                <p>
                  • Save your preferences to get personalized recommendations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
