'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const sizeOptions = ["Small", "Medium", "Large", "Extra Large"];
const genderOptions = ["Male", "Female"];
const temperamentOptions = ["Friendly", "Energetic", "Calm", "Playful", "Loyal"];
const activityLevelOptions = ["Low", "Moderate", "High", "Very High"];
const spaceRequirementOptions = ["Small apartment", "House with yard", "Farm"];
const availabilityOptions = ["Available", "Pending", "Adopted", "Fostered_Available", "Fostered_Not_Available"];

export default function EditPetPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      const res = await fetch(`/api/admin/pets/${id}`);
      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setPet({
        ...data.pet,
        temperament: Array.isArray(data.pet.temperament)
          ? data.pet.temperament
          : JSON.parse(data.pet.temperament || "[]"),
      });
      setLoading(false);
    };

    fetchPet();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPet((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = new FormData();

    const editableFields = [
      "description", "location_address", "availability_status", "age", "size",
      "gender", "activity_level", "diet_type", "diet_frequency",
      "space_requirements", "adoption_fee", "foster_parent_id"
    ];

    editableFields.forEach((field) => {
      if (pet[field] !== undefined && pet[field] !== null)
        form.append(field, pet[field]);
    });

    pet.temperament?.forEach((t: string) => form.append("temperament", t));

    const res = await fetch(`/api/admin/pets/${id}`, {
      method: "PUT",
      body: form,
    });

    const result = await res.json();

    if (res.ok) {
      toast.success("Pet updated successfully");
      router.push("/admin/edit-pets");
    } else {
      toast.error(result.error || "Failed to update pet");
      console.error("Update error:", result.details || result);
    }
  };

  if (loading || !pet) return <div className="p-4">Loading...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6"
    >
      <div className="flex items-center gap-4 mb-4">
        {pet.image && (
          <img
            src={pet.image}
            alt={pet.name}
            className="w-24 h-24 rounded object-cover border"
          />
        )}
        <h2 className="text-3xl font-bold">Edit Pet: {pet.name}</h2>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea name="description" value={pet.description} onChange={handleChange} required />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Age</Label>
          <Input name="age" type="number" value={pet.age} onChange={handleChange} required />
        </div>

        <div>
          <Label>Gender</Label>
          <select name="gender" value={pet.gender} onChange={handleChange} className="w-full border rounded p-2" required>
            <option value="">Select gender</option>
            {genderOptions.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <Label>Size</Label>
          <select name="size" value={pet.size} onChange={handleChange} className="w-full border rounded p-2" required>
            <option value="">Select size</option>
            {sizeOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <Label>Activity Level</Label>
          <select name="activity_level" value={pet.activity_level} onChange={handleChange} className="w-full border rounded p-2" required>
            <option value="">Select level</option>
            {activityLevelOptions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <Label>Temperament</Label>
          <select
            multiple
            value={pet.temperament}
            onChange={(e) =>
              setPet((prev: any) => ({
                ...prev,
                temperament: Array.from(e.target.selectedOptions).map((opt) => opt.value),
              }))
            }
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

        <div>
          <Label>Location Address</Label>
          <Input name="location_address" value={pet.location_address || ""} onChange={handleChange} />
        </div>

        <div>
          <Label>Diet Type</Label>
          <Input name="diet_type" value={pet.diet_type} onChange={handleChange} required />
        </div>

        <div>
          <Label>Diet Frequency</Label>
          <Input name="diet_frequency" value={pet.diet_frequency} onChange={handleChange} required />
        </div>

        <div>
          <Label>Space Requirements</Label>
          <select
            name="space_requirements"
            value={pet.space_requirements}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select space</option>
            {spaceRequirementOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <Label>Adoption Fee</Label>
          <Input name="adoption_fee" type="number" value={pet.adoption_fee} onChange={handleChange} required />
        </div>

        <div>
          <Label>Foster Parent ID (optional)</Label>
          <Input name="foster_parent_id" value={pet.foster_parent_id || ""} onChange={handleChange} placeholder="Enter foster user ID" />
        </div>

        <div>
          <Label>Availability Status</Label>
          <select
            name="availability_status"
            value={pet.availability_status}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select status</option>
            {availabilityOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-center pt-4">
        <Button type="submit" size="lg">Update Pet</Button>
      </div>
    </form>
  );
}
