
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Trophy, 
  Home, 
  BarChart3, 
  LayoutDashboard, 
  Briefcase, 
  ShieldAlert, 
  User, 
  ChevronDown,
  LogOut,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDiscipline } from '@/context/discipline-context';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  const auth = useAuth();
  const { user } = useUser();
  const { discipline, setDiscipline } = useDiscipline();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

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
                <Button variant="ghost" className="h-8 rounded-full bg-white/5 border border-white/10 px-4 text-[10px] font-black uppercase tracking-widest gap-2 text-primary hover:bg-white/10 hover:text-primary">
                  {discipline === 'Football' ? 'Fútbol' : 'Fútbol Sala'}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#111827] border-[#1F2937] text-white">
                <DropdownMenuItem className="focus:bg-primary focus:text-background font-bold cursor-pointer" onClick={() => setDiscipline('Football')}>Fútbol</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-primary focus:text-background font-bold cursor-pointer" onClick={() => setDiscipline('Futsal')}>Fútbol Sala</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={() => { setDiscipline(null); router.push('/'); }} className="text-red-500 font-bold focus:bg-red-500 focus:text-white cursor-pointer">Cambiar Disciplina</DropdownMenuItem>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-2xl bg-[#111827] border-white/10 hover:bg-white/10 hover:text-white text-white h-10 px-6 gap-2 transition-colors">
                <User className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">CUENTA</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#1a212e] border-[#2d3748] rounded-2xl p-2 shadow-2xl">
              <DropdownMenuItem asChild className="focus:bg-white/5 rounded-xl py-3 px-4 cursor-pointer">
                <Link href="/profile/me" className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-bold text-white">Ver Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-white/5 rounded-xl py-3 px-4 cursor-pointer">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-bold text-white">Panel Control</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10 my-1 mx-2" />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="focus:bg-red-500/10 rounded-xl py-3 px-4 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4 text-[#e57373] group-hover:text-red-400" />
                  <span className="text-sm font-bold text-[#e57373] group-hover:text-red-400">Cerrar Sesión</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
