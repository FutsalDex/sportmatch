"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Trophy, User, MessageSquare, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Inicio', href: '/' },
  { icon: Search, label: 'Talento', href: '/search' },
  { icon: Trophy, label: 'Clubes', href: '/clubs' },
  { icon: MessageSquare, label: 'Matches', href: '/matches' },
  { icon: User, label: 'Perfil', href: '/profile/me' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors px-4 py-2",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}