"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Star, User, Home, BarChart3, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Inicio', href: '/' },
  { icon: Search, label: 'Scout', href: '/search' },
  { icon: BarChart3, label: 'Rankings', href: '/rankings' },
  { icon: Star, label: 'Favs', href: '/favorites' },
  { icon: LayoutDashboard, label: 'Panel', href: '/dashboard' },
  { icon: User, label: 'Perfil', href: '/profile/me' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 z-50 safe-bottom md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-all px-2 py-2 relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform", isActive && "stroke-[2.5px] scale-110")} />
              <span className="text-[8px] font-bold uppercase tracking-wider">{item.label}</span>
              {isActive && (
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
