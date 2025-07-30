"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";

export default function AdoptionRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/admin/adoption-request", {
          credentials: "include",
        });
        const data = await res.json();
        setRequests(data.requests);
      } catch (err) {
        console.error("Failed to fetch requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (id: number, action: "Accepted" | "Rejected") => {
    const res = await fetch("/api/admin/adoption-request", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ requestId: id, status: action }),
    });

    if (res.ok) {
      const updated = await fetch("/api/admin/adoption-request", {
        credentials: "include",
      });
      const updatedData = await updated.json();
      setRequests(updatedData.requests);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin h-16 w-16 border-4 border-primary rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <PawPrint className="h-6 w-6" />
            Adoption Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="p-2">User</th>
                  <th className="p-2">Pet</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Requested On</th>
                  <th className="p-2">Action Performed On</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r: any) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">
                      {r.user_name}
                      <br />
                      <Link
                        href={`/admin/users/${r.user_id}`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        View
                      </Link>
                    </td>
                    <td className="p-2">
                      {r.pet_name}
                      <br />
                      <Link
                        href={`/pets/${r.pet_id}`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        View
                      </Link>
                    </td>
                    <td className="p-2">
                      <Badge
                        className={
                          r.status === "Accepted"
                            ? "bg-green-500 text-white"
                            : r.status === "Rejected"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-black"
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      {["Accepted", "Rejected"].includes(r.status) && r.action_performed_at
                        ? new Date(r.action_performed_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2 flex gap-2">
                      {r.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAction(r.id, "Accepted")}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAction(r.id, "Rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requests.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No adoption requests found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
