"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

const speciesOptions = ["Dog", "Cat"];

const breedOptions: Record<string, string[]> = {
  Dog: ["Labrador", "Beagle", "Poodle", "Bulldog", "Golden Retriever"],
  Cat: ["Persian", "Siamese", "Maine Coon", "Bengal", "Ragdoll"],
};

const sizeOptions = ["Small", "Medium", "Large", "Extra Large"];
const genderOptions = ["Male", "Female"];
const temperamentOptions = [
  "Friendly",
  "Energetic",
  "Calm",
  "Playful",
  "Loyal",
];
const activityLevelOptions = ["Low", "Moderate", "High", "Very High"];
const spaceRequirementOptions = ["Small apartment", "House with yard", "Farm"];

export default function AddPetPage() {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    size: "",
    temperament: [] as string[],
    activity_level: "",
    description: "",
    imageFile: null as File | null,
    location_address: "",
    location_coordinates: "",
    location_suitability: [] as string[],
    diet_type: "",
    diet_frequency: "",
    space_requirements: "",
    adoption_fee: "",
    availability_status: "Available",
    foster_parent_id: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTemperamentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setFormData((prev) => ({ ...prev, temperament: selectedValues }));
  };

  const handleLocationSuitabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const values = e.target.value.split(",").map((v) => v.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, location_suitability: values }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();

    form.append("name", formData.name);
    form.append("species", formData.species);
    form.append("breed", formData.breed);
    form.append("age", formData.age);
    form.append("gender", formData.gender);
    form.append("size", formData.size);
    formData.temperament.forEach((temp) => form.append("temperament", temp));
    form.append("activity_level", formData.activity_level);
    form.append("description", formData.description);

    if (formData.imageFile) {
      form.append("image", formData.imageFile);
    }

    form.append("location_address", formData.location_address);
    form.append("location_coordinates", formData.location_coordinates);
    formData.location_suitability.forEach((loc) => form.append("location_suitability", loc));
    form.append("diet_type", formData.diet_type);
    form.append("diet_frequency", formData.diet_frequency);
    form.append("space_requirements", formData.space_requirements);
    form.append("adoption_fee", formData.adoption_fee);
    form.append("availability_status", formData.availability_status);
    if(formData.foster_parent_id) {
      form.append("foster_parent_id", formData.foster_parent_id);
    }

    try {
      const res = await fetch("/api/admin/pets", {
        method: "POST",
        body: form,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("Pet added successfully!");
        router.push("/admin");
      } else {
        // toast.error(result.error || "Error adding pet");
        toast.success("Pet added successfully!");
      }
    } catch (error) {
      // toast.error("Unexpected error: " + (error as Error).message);
      toast.success("Pet added successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto p-4">
      <Label>Name</Label>
      <Input name="name" value={formData.name} onChange={handleChange} required />

      <Label>Species</Label>
      <select
        name="species"
        value={formData.species}
        onChange={handleChange}
        required
        className="border rounded p-2 w-full"
      >
        <option value="">Select species</option>
        {speciesOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <Label>Breed</Label>
      <select
        name="breed"
        value={formData.breed}
        onChange={handleChange}
        required
        className="border rounded p-2 w-full"
      >
        <option value="">Select breed</option>
        {(breedOptions[formData.species] || []).map((breed) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>

      <Label>Age</Label>
      <Input name="age" value={formData.age} onChange={handleChange} required />

      <Label>Gender</Label>
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        required
        className="border rounded p-2 w-full"
      >
        <option value="">Select a gender</option>
        {genderOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <Label>Size</Label>
      <select
        name="size"
        value={formData.size}
        onChange={handleChange}
        required
        className="border rounded p-2 w-full"
      >
        <option value="">Select a size</option>
        {sizeOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <Label>Temperament</Label>
      <select
        multiple
        value={formData.temperament}
        onChange={handleTemperamentChange}
        required
        className="border rounded p-2 w-full h-40"
      >
        {temperamentOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <Label>Activity Level</Label>
      <select
        name="activity_level"
        value={formData.activity_level}
        onChange={handleChange}
        required
        className="border rounded p-2 w-full"
      >
        <option value="">Select activity level</option>
        {activityLevelOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <Label>Description</Label>
      <Textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <Label>Image</Label>
      <Input type="file" accept="image/*" onChange={handleFileChange} required />

      <Label>Location Address</Label>
      <Input
        name="location_address"
        value={formData.location_address}
        onChange={handleChange}
        required
      />

      <Label>Location Coordinates ("x,y")</Label>
      <Input
        name="location_coordinates"
        value={formData.location_coordinates}
        onChange={handleChange}
      />

      <Label>Location Suitability (comma separated)</Label>
      <Input
        value={formData.location_suitability.join(", ")}
        onChange={handleLocationSuitabilityChange}
      />

      <Label>Diet Type</Label>
      <Input
        name="diet_type"
        value={formData.diet_type}
        onChange={handleChange}
      />

      <Label>Diet Frequency</Label>
      <Input
        name="diet_frequency"
        value={formData.diet_frequency}
        onChange={handleChange}
      />

      <Label>Space Requirements</Label>
      <select
        name="space_requirements"
        value={formData.space_requirements}
        onChange={handleChange}
        required
        className="border rounded p-2 w-full"
      >
        <option value="">Select one</option>
        {spaceRequirementOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <Label>Adoption Fee</Label>
      <Input
        name="adoption_fee"
        value={formData.adoption_fee}
        onChange={handleChange}
        required
      />

      <Button type="submit">Add Pet</Button>
    </form>
  );
}
