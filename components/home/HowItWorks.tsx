'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Search, Heart, Home, UserCheck } from 'lucide-react';

const steps = [
  {
    icon: UserCheck,
    title: 'Create Your Profile',
    description: 'Sign up and tell us about your lifestyle, preferences, and what kind of pet you\'re looking for.',
    step: '01'
  },
  {
    icon: Search,
    title: 'Get Matched',
    description: 'Our intelligent algorithm analyzes your preferences and suggests pets that would be perfect for you.',
    step: '02'
  },
  {
    icon: Heart,
    title: 'Meet Your Match',
    description: 'Connect with pets that match your criteria and schedule visits to meet them in person.',
    step: '03'
  },
  {
    icon: Home,
    title: 'Welcome Home',
    description: 'Complete the adoption process and welcome your new family member into their forever home.',
    step: '04'
  }
];

export function HowItWorks() {
  return (
    <section className="section-padding">
      <div className="page-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our simple 4-step process makes finding and adopting your perfect pet companion easy and enjoyable
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Connection Lines for Desktop */}
        <div className="hidden lg:block relative -mt-32 mb-16">
          <div className="absolute top-16 left-1/4 w-1/4 h-0.5 bg-primary/20 transform -translate-y-1/2" />
          <div className="absolute top-16 left-2/4 w-1/4 h-0.5 bg-primary/20 transform -translate-y-1/2" />
          <div className="absolute top-16 left-3/4 w-1/4 h-0.5 bg-primary/20 transform -translate-y-1/2" />
        </div>
      </div>
    </section>
  );
}