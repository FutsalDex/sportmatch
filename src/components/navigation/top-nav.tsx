
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Trophy, Home, BarChart3, LayoutDashboard, Briefcase, ShieldAlert, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDiscipline } from '@/context/discipline-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { icon: Home, label: 'INICIO', href: '/' },
  { icon: BarChart3, label: 'RANKING', href: '/rankings' },
  { icon: LayoutDashboard, label: 'DASHBOARD', href: '/dashboard' },
  { icon: Briefcase, label: 'SCOUTING', href: '/search' },
  { icon: ShieldAlert, label: 'ADMIN', href: '/admin' },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { discipline, setDiscipline } = useDiscipline();

  // Ocultamos el nav solo en el selector de disciplina inicial (sin deporte y en /)
  if (pathname === '/' && !discipline) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-white/5 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tighter">SportMatch</span>
          </Link>

          {discipline && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 rounded-full bg-white/5 border border-white/10 px-4 text-[10px] font-black uppercase tracking-widest gap-2 text-primary hover:bg-white/10">
                  {discipline === 'Football' ? 'Fútbol' : 'Fútbol Sala'}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#111827] border-[#1F2937] text-white">
                <DropdownMenuItem onClick={() => setDiscipline('Football')}>Fútbol</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDiscipline('Futsal')}>Fútbol Sala</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setDiscipline(null); router.push('/'); }} className="text-red-500">Cambiar Disciplina</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

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

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 h-10 px-6 gap-2">
            <Link href="/profile/me">
              <User className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Cuenta</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
