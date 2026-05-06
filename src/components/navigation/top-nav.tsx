"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Home, BarChart3, LayoutDashboard, Briefcase, ShieldAlert, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: Home, label: 'INICIO', href: '/' },
  { icon: BarChart3, label: 'RANKING', href: '/rankings' },
  { icon: LayoutDashboard, label: 'PANEL', href: '/profile/me' },
  { icon: Briefcase, label: 'OFERTAS', href: '/search' },
  { icon: ShieldAlert, label: 'ADMIN', href: '/admin' },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#111827]/80 backdrop-blur-xl border-b border-white/5 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter">SportMatch</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-[11px] font-bold tracking-widest transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-white"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Profile Button */}
        <Button variant="outline" className="rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 h-10 px-6 gap-2">
          <User className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Cuenta</span>
        </Button>
      </div>
    </nav>
  );
}
