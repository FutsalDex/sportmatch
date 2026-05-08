
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Trophy, 
  Home, 
  BarChart3, 
  LayoutDashboard, 
  Briefcase, 
  User, 
  ChevronDown,
  LogOut,
  ShieldCheck,
  CreditCard,
  Star,
  Menu,
  Zap
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { icon: Home, label: 'INICIO', href: '/' },
  { icon: Briefcase, label: 'OFERTAS', href: '/offers' },
  { icon: BarChart3, label: 'RANKING', href: '/rankings' },
  { icon: Star, label: 'FAVORITOS', href: '/favorites' },
  { icon: LayoutDashboard, label: 'MI PANEL', href: '/dashboard' },
  { icon: CreditCard, label: 'PLANES', href: '/pricing' },
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
    <nav className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-1.5 md:p-2 rounded-lg md:rounded-xl group-hover:bg-primary/20 transition-colors">
              <Trophy className="w-4 h-4 md:w-6 md:h-6 text-primary" />
            </div>
            <span className="hidden sm:block font-headline font-bold text-lg md:text-xl tracking-tighter">SportMatch</span>
          </Link>

          {discipline && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 rounded-full bg-white/5 border border-white/10 px-2 md:px-4 text-[8px] md:text-[10px] font-black uppercase tracking-widest gap-1 md:gap-2 text-primary">
                  {discipline === 'Football' ? 'Fútbol' : 'Fútbol Sala'}
                  <ChevronDown className="w-2.5 h-2.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#111827] border-[#1F2937] text-white">
                <DropdownMenuItem onClick={() => setDiscipline('Football')}>Fútbol</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDiscipline('Futsal')}>Fútbol Sala</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-[10px] font-black tracking-widest transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-white"
                )}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl bg-[#111827] border-white/10 text-white h-8 md:h-10 px-2 md:px-4 gap-2">
                <User className="w-4 h-4" />
                <span className="hidden md:block text-[10px] font-black uppercase tracking-widest">CUENTA</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#1a212e] border-[#2d3748] rounded-2xl p-2">
              <DropdownMenuItem asChild className="focus:bg-white/5 rounded-xl py-3 px-4 cursor-pointer">
                <Link href="/profile/me">Ver Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-white/5 rounded-xl py-3 px-4 cursor-pointer">
                <Link href="/dashboard">Mi Panel</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={handleSignOut} className="focus:bg-red-500/10 rounded-xl py-3 px-4 cursor-pointer text-red-400">
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 text-white bg-white/5 rounded-xl">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#030712] border-l border-white/5 text-white">
              <SheetHeader className="pb-8">
                <SheetTitle className="text-white">Menú Navegación</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-4 p-4 rounded-2xl text-sm font-black tracking-widest hover:bg-white/5 transition-all">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
