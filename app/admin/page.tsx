'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  PawPrint,
  BarChart3,
  Settings,
  Plus,
  Shield,
  Activity,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const stats = [
    {
      title: 'Total Users',
      value: '11',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Available Pets',
      value: '3',
      change: '+5%',
      icon: PawPrint,
      color: 'text-green-600'
    },
    {
      title: 'Adoptions This Month',
      value: '0',
      change: '+18%',
      icon: TrendingUp,
      color: 'text-orange-600'
    },
    {
      title: 'Active Applications',
      value: '0',
      change: '+8%',
      icon: Activity,
      color: 'text-purple-600'
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
                <Shield className="h-8 w-8 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user.name}! Manage your pet adoption platform.
              </p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Administrator
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start" size="lg">
                <Link href="/admin/pets">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Pet
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <Link href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PawPrint className="h-5 w-5" />
                Pet Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage pet listings, photos, and adoption status
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/pets">Manage Pets</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View user profiles, preferences, and adoption history
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Manage Foster Parents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View foster parents available
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/foster-parents">View Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
