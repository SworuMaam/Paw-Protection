// app/admin/add-pet/page.tsx (or wherever your AddPetPage component is)
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
    diet_type: "",
    diet_frequency: "",
    space_requirements: "",
    adoption_fee: "",
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "temperament" || key === "imageFile") return;
      form.append(key, value as string);
    });

    formData.temperament.forEach((t) => form.append("temperament", t));

    if (formData.imageFile) {
      form.append("image", formData.imageFile);
    } else {
      toast.error("Please upload an image.");
      return;
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
        toast.error(result.error || "Error adding pet");
      }
    } catch (error) {
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8"
    >
      <h1 className="text-3xl font-bold mb-4 text-center">Add New Pet</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <Label>Species</Label>
          <select
            name="species"
            value={formData.species}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select species</option>
            {speciesOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Breed</Label>
          <select
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select breed</option>
            {(breedOptions[formData.species] || []).map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Age</Label>
          <Input
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Gender</Label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select gender</option>
            {genderOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Size</Label>
          <select
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select size</option>
            {sizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Activity Level</Label>
          <select
            name="activity_level"
            value={formData.activity_level}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select level</option>
            {activityLevelOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Temperament</Label>
          <select
            multiple
            value={formData.temperament}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(
                (opt) => opt.value
              );
              setFormData((prev) => ({ ...prev, temperament: selected }));
            }}
            className="w-full border rounded p-2 h-28"
            required
          >
            {temperamentOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>

      <div>
        <Label>Image Upload (File Only)</Label>
        <Input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Location Address</Label>
          <Input
            name="location_address"
            value={formData.location_address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Diet Type</Label>
          <Input
            name="diet_type"
            value={formData.diet_type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Diet Frequency</Label>
          <Input
            name="diet_frequency"
            value={formData.diet_frequency}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Space Requirements</Label>
          <select
            name="space_requirements"
            value={formData.space_requirements}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select one</option>
            {spaceRequirementOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Adoption Fee</Label>
          <Input
            name="adoption_fee"
            type="number"
            value={formData.adoption_fee}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="text-center">
        <Button type="submit" size="lg">
          Submit Pet
        </Button>
      </div>
    </form>
  );
}
