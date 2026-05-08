
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
  { icon: BarChart3, label: 'RANKING', href: '/rankings' },
  { icon: Star, label: 'FAVORITOS', href: '/favorites' },
  { icon: LayoutDashboard, label: 'MI PANEL', href: '/dashboard' },
  { icon: Briefcase, label: 'SCOUTING', href: '/search' },
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
        {/* LOGO & DISCIPLINE */}
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
                <Button variant="ghost" className="h-8 rounded-full bg-white/5 border border-white/10 px-2 md:px-4 text-[8px] md:text-[10px] font-black uppercase tracking-widest gap-1 md:gap-2 text-primary hover:bg-white/10 hover:text-primary">
                  {discipline === 'Football' ? 'Fútbol' : 'Fútbol Sala'}
                  <ChevronDown className="w-2.5 h-2.5" />
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

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-[10px] font-black tracking-widest transition-colors whitespace-nowrap",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-white"
                )}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* ACCOUNT & MOBILE MENU */}
        <div className="flex items-center gap-2">
          {/* USER DROPDOWN (Compact on mobile) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="rounded-xl bg-[#111827] border-white/10 text-white h-8 md:h-10 px-2 md:px-4 gap-2 transition-colors hover:bg-white/20 hover:text-white"
              >
                <User className="w-4 h-4" />
                <span className="hidden md:block text-[10px] font-black uppercase tracking-widest">CUENTA</span>
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
                  <span className="text-sm font-bold text-white">Mi Panel</span>
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

          {/* MOBILE MENU (SHEET) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 text-white bg-white/5 rounded-xl">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#030712] border-l border-white/5 text-white p-6">
              <SheetHeader className="pb-8">
                <SheetTitle className="text-left font-headline font-bold text-2xl tracking-tighter text-white flex items-center gap-2">
                  <Zap className="w-6 h-6 text-primary fill-primary" /> Menú Navegación
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl text-sm font-black tracking-[0.1em] transition-all",
                        isActive 
                          ? "bg-primary text-background" 
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-10 p-6 bg-primary/10 rounded-[2rem] border border-primary/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Estado Terminal</p>
                <p className="text-xs text-white/60 leading-relaxed">
                  Sistema de Inteligencia Deportiva SportMatch activo. Filtros y rankings sincronizados.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
