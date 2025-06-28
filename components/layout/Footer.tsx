'use client';

import Link from 'next/link';
import { PawPrint, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerLinks = {
  adoption: [
    { href: '/pets', label: 'Find Pets' },
    { href: '/recommendations', label: 'Get Recommendations' },
    { href: '/preferences', label: 'Set Preferences' },
    { href: '/adoption-process', label: 'Adoption Process' },
  ],
  support: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/support', label: 'Help Center' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookie-policy', label: 'Cookie Policy' },
    { href: '/accessibility', label: 'Accessibility' },
  ],
};

const contactInfo = {
  email: 'hello@pawprotection.com',
  phone: '+977 9841541254',
  address: 'Basantapur, Kathmandu',
};

const socialLinks = [
  { href: '#', icon: Facebook, label: 'Facebook' },
  { href: '#', icon: Twitter, label: 'Twitter' },
  { href: '#', icon: Instagram, label: 'Instagram' },
];

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="page-container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <PawPrint className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">Paw Protection</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Connecting loving families with pets in need. Every adoption saves a life and creates lasting bonds.
            </p>
            
            {/* Newsletter Signup */}
            {/* <div className="space-y-2">
              <h4 className="font-semibold">Stay Updated</h4>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button size="sm">Subscribe</Button>
              </div>
            </div> */}
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-3">
            <div>
              <h4 className="font-semibold mb-4">Adoption</h4>
              <ul className="space-y-2">
                {footerLinks.adoption.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t py-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{contactInfo.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t py-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 Paw Protection. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}