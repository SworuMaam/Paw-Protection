"use client";

import { useEffect } from "react";
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
  Heart,
  Search,
  Star,
  Settings,
  PawPrint,
  MapPin,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const { user, isLoading, isUser } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isUser) {
    return null;
  }

  const quickStats = [
    {
      title: "Saved Pets",
      value: "12",
      icon: Heart,
      color: "text-red-500",
    },
    {
      title: "Recommendations",
      value: "8",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Applications",
      value: "3",
      icon: PawPrint,
      color: "text-blue-500",
    },
  ];

  const recentActivity = [
    {
      action: "Saved Luna to favorites",
      time: "2 hours ago",
      type: "save",
    },
    {
      action: "Updated preferences",
      time: "1 day ago",
      type: "update",
    },
    {
      action: "Viewed Buddy's profile",
      time: "2 days ago",
      type: "view",
    },
    {
      action: "Applied to adopt Whiskers",
      time: "3 days ago",
      type: "application",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="page-container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <UserIcon className="h-8 w-8 text-primary" />
                Welcome back, {user.name}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Continue your journey to find the perfect pet companion.
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-secondary/10 text-secondary"
            >
              Pet Lover
            </Badge>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  {user.location && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {user.location.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Member since</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Find your perfect pet companion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" size="lg" asChild>
                <Link href="/adopted-pets">
                  <Star className="mr-2 h-4 w-4" />
                  My adopted pets
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="lg"
                asChild
              >
                <Link href="/user/adoption-status">
                  <Search className="mr-2 h-4 w-4" />
                  Application Status
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="lg"
                asChild
              >
                <Link href="/preferences">
                  <Settings className="mr-2 h-4 w-4" />
                  Update Preferences
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="lg"
                asChild
              >
                <Link href="/favorites">
                  <Heart className="mr-2 h-4 w-4" />
                  My Saved Pets
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "save"
                          ? "bg-red-500"
                          : activity.type === "update"
                          ? "bg-blue-500"
                          : activity.type === "view"
                          ? "bg-green-500"
                          : "bg-purple-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
