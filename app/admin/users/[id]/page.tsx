"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        User not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="font-semibold">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold">Role:</span>{" "}
            <Badge variant="outline">{user.role}</Badge>
          </div>
          <div>
            <span className="font-semibold">Location:</span>{" "}
            {user.location || "Not provided"}
          </div>
          <div>
            <span className="font-semibold">Contact Number:</span>{" "}
            {user.contact_number || "Not provided"}
          </div>
          <div>
            <span className="font-semibold">Adopted Pets:</span>{" "}
            {user.adoptedPetsCount}
          </div>
          {user.role === "foster-user" && (
            <div>
              <span className="font-semibold">Foster Capacity:</span>{" "}
              {user.foster_capacity ?? "Not specified"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
