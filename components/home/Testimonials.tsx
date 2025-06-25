'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'San Francisco, CA',
    avatar: 'SJ',
    rating: 5,
    text: 'Paw Protection made finding our perfect dog so easy! The matching system connected us with Luna, and it was love at first sight. The whole process was smooth and supportive.',
    petName: 'Luna',
    petType: 'Golden Retriever'
  },
  {
    name: 'Michael Chen',
    location: 'Portland, OR',
    avatar: 'MC',
    rating: 5,
    text: 'I was nervous about adopting my first cat, but the team at Paw Protection guided me through everything. Whiskers has brought so much joy to my life!',
    petName: 'Whiskers',
    petType: 'Maine Coon'
  },
  {
    name: 'Emily Rodriguez',
    location: 'Austin, TX',
    avatar: 'ER',
    rating: 5,
    text: 'The recommendation algorithm is incredible! They matched us with the perfect family dog. Buddy fits in so well with our lifestyle and kids.',
    petName: 'Buddy',
    petType: 'Mixed Breed'
  }
];

export function Testimonials() {
  return (
    <section className="section-padding">
      <div className="page-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Happy Families</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Read what our adopters have to say about their experience and their new furry family members
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                {/* Pet Info */}
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-primary">
                    Adopted: {testimonial.petName} ({testimonial.petType})
                  </p>
                </div>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}