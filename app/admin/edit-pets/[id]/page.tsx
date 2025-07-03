'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EditPetPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      const res = await fetch(`/api/admin/pets/${id}`);
      const data = await res.json();
      setPet(data.pet);
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

    Object.entries(pet).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => form.append(key, v));
      } else {
        form.append(key, value);
      }
    });

    const res = await fetch(`/api/admin/pets/${id}`, {
      method: "PUT",
      body: form,
    });

    if (res.ok) {
      toast.success("Pet updated successfully");
      router.push("/admin/edit-pets");
    } else {
      toast.error("Failed to update pet");
    }
  };

  if (loading || !pet) return <div className="p-4">Loading...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6"
    >
      <h2 className="text-2xl font-bold">Edit Pet: {pet.name}</h2>

      <div>
        <Label>Name</Label>
        <Input name="name" value={pet.name} onChange={handleChange} required />
      </div>

      <div>
        <Label>Breed</Label>
        <Input name="breed" value={pet.breed} onChange={handleChange} required />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          name="description"
          value={pet.description}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Location</Label>
        <Input
          name="location_address"
          value={pet.location_address}
          onChange={handleChange}
        />
      </div>

      <Button type="submit">Update Pet</Button>
    </form>
  );
}