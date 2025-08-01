"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

interface AdoptionRequest {
  id: number;
  pet_id: number;
  pet_name: string;
  pet_image: string;
  status: string;
  created_at: string;
  action_performed_at?: string;
}

export default function UserAdoptionStatusPage() {
  const { user, isLoading } = useAuth();
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("/api/user/adoption-status", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setRequests(data.requests);
        } else {
          console.error("Failed to load adoption requests:", data.error);
          setRequests([]);
        }
      } catch (error) {
        console.error("Error fetching adoption requests:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (isLoading || loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Adoption Requests</h1>
      {requests.length === 0 ? (
        <p className="text-muted-foreground">You have no adoption requests yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="border rounded-xl overflow-hidden shadow flex flex-col"
            >
              <Image
                src={req.pet_image || "/placeholder.png"}
                alt={req.pet_name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold">{req.pet_name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Status:{" "}
                  <span
                    className={
                      req.status === "Accepted"
                        ? "text-green-600 font-semibold"
                        : req.status === "Rejected"
                        ? "text-red-600 font-semibold"
                        : "text-yellow-600 font-semibold"
                    }
                  >
                    {req.status}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Requested on:{" "}
                  {new Date(req.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {req.action_performed_at && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Updated on:{" "}
                    {new Date(req.action_performed_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
