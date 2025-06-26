'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  PawPrint,
  Settings,
  MapPin,
  Users,
  ClipboardList,
  Heart,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import Link from 'next/link';

export default function FosterDashboard() {
  const { user, isLoading, isFosterUser } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not a foster user
  useEffect(() => {
    if (!isLoading && (!user || !isFosterUser)) {
      router.push('/login'); // Redirect to login if not authenticated or not a foster user
    }
  }, [user, isLoading, isFosterUser, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // This check is important for rendering after isLoading is false
  if (!user || !isFosterUser) {
    return null; // Or a more explicit "Access Denied" message
  }

  const quickStats = [
    {
      title: 'Pets in Care',
      value: '2', // This would ideally come from a backend API call
      icon: PawPrint,
      color: 'text-green-500'
    },
    {
      title: 'Applications',
      value: '1', // This would ideally come from a backend API call
      icon: ClipboardList,
      color: 'text-blue-500'
    },
    {
      title: 'Available Capacity',
      value: user.fosterCapacity ? user.fosterCapacity - 2 : 'N/A', // Example calculation
      icon: Home,
      color: 'text-purple-500'
    }
  ];

  const recentActivity = [
    {
      action: 'Received new pet: Sparky',
      time: '3 hours ago',
      type: 'new_pet'
    },
    {
      action: 'Updated foster profile',
      time: '1 day ago',
      type: 'update'
    },
    {
      action: 'Application for Whiskers reviewed',
      time: '2 days ago',
      type: 'application'
    },
    {
      action: 'Scheduled vet visit for Buddy',
      time: '3 days ago',
      type: 'schedule'
    }
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="page-container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Home className="h-8 w-8 text-primary" />
                Welcome, Foster Parent {user.name}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your foster pets and profile.
              </p>
            </div>
            <Badge variant="secondary" className="bg-secondary/10 text-secondary">
              Foster Parent
            </Badge>
          </div>
        </div>

        {/* Foster Info Card */}
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
                  {user.fosterAddress && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{user.fosterAddress}</span>
                    </div>
                  )}
                  {user.fosterCapacity && (
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Capacity: {user.fosterCapacity} pets</span>
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
              <CardTitle>Foster Actions</CardTitle>
              <CardDescription>
                Manage your foster responsibilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" size="lg" asChild>
                <Link href="/foster-pets">
                  <PawPrint className="mr-2 h-4 w-4" />
                  View Pets in My Care
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link href="/foster-profile">
                  <Settings className="mr-2 h-4 w-4" />
                  Update Foster Profile
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link href="/foster-applications">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Review Applications
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                <Link href="/foster-resources">
                  <Heart className="mr-2 h-4 w-4" />
                  Foster Resources
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Foster Activity</CardTitle>
              <CardDescription>
                Your latest foster-related interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'new_pet' ? 'bg-green-500' :
                      activity.type === 'update' ? 'bg-blue-500' :
                      activity.type === 'application' ? 'bg-orange-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for Foster Pet List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="h-5 w-5" />
              Pets Currently in Your Care
            </CardTitle>
            <CardDescription>
              Overview of pets you are fostering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No pets currently assigned to you. Check back later!</p>
              <Button variant="link" className="mt-2" asChild>
                <Link href="/foster-pets">Manage Pets</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}