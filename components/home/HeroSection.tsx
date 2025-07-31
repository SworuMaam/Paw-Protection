'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  const [stats, setStats] = useState({
    adopted_count: 0,
    fostered_count: 0,
    available_count: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/pet-stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch pet stats:', err);
      }
    }

    fetchStats();
  }, []);

  return (
    <section className="relative hero-gradient text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Heart className="h-8 w-8 text-white/30" />
      </div>
      <div className="absolute top-32 right-20 animate-float" style={{ animationDelay: '2s' }}>
        <Search className="h-6 w-6 text-white/30" />
      </div>
      <div className="absolute bottom-20 left-20 animate-bounce-slow">
        <Users className="h-10 w-10 text-white/30" />
      </div>

      <div className="relative page-container section-padding">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-yellow-300">Pet Companion</span>
          </h1>

          <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Discover your ideal furry friend through our intelligent matching system. 
            Every adoption saves a life and creates lasting bonds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {isAuthenticated ? (
              <>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3" asChild>
                  <Link href="/recommendations">
                    Get My Matches
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3"
                  asChild
                >
                  <Link href="/pets">
                    Browse All Pets
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3" asChild>
                  <Link href="/register">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3"
                  asChild
                >
                  <Link href="/pets">
                    Browse Pets
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Dynamic Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.adopted_count}+</div>
              <div className="text-white/80">Pets Adopted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.fostered_count}+</div>
              <div className="text-white/80">Fostered Pets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats.available_count}+</div>
              <div className="text-white/80">Available Pets</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
