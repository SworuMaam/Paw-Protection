"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu, User, Settings, LogOut, Shield, Home,
  Search, Star, Info, Mail, PawPrint, Edit
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const defaultNavItems = [
  { href: "/pets", label: "Find Pets", icon: Search },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

const adminNavItems = [
  { href: "/admin/edit-pets", label: "Edit Pets", icon: Edit },
];

const userMenuItems = [
  { href: "/recommendations", label: "Recommendations", icon: Star },
  { href: "/preferences", label: "Preferences", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  let homeLink = "/";
  if (isAuthenticated && user?.role) {
    if (user.role === "admin") homeLink = "/admin";
    else if (user.role === "foster-user") homeLink = "/foster-dashboard";
    else homeLink = "/dashboard";
  }

  const navigationItems = isAdmin ? adminNavItems : defaultNavItems;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="page-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={homeLink} className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <PawPrint className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">
              Paw Protection
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href={homeLink}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === homeLink
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === "user" &&
                  userMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col space-y-4 mt-4">
                <Link
                  href={homeLink}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === homeLink
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                {isAuthenticated ? (
                  <div className="border-t pt-4">
                    {user?.role === "user" &&
                      userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            pathname === item.href
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t pt-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
