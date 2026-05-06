
"use client";

import { Trophy, Target, Zap, Users, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDiscipline } from '@/context/discipline-context';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TopNav } from '@/components/navigation/top-nav';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { discipline, setDiscipline } = useDiscipline();

  const handleSelect = (d: 'Football' | 'Futsal') => {
    setDiscipline(d);
  };

  // Si no hay disciplina seleccionada, mostramos el selector inicial
  if (!discipline) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white items-center justify-center p-6">
        <div className="text-center space-y-4 mb-16">
          <div className="flex justify-center mb-2">
            <Trophy className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-6xl font-black font-headline tracking-tighter uppercase">SportMatch</h1>
          <p className="text-muted-foreground text-sm font-medium tracking-[0.2em] uppercase">Terminal de Inteligencia Deportiva</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          <button 
            onClick={() => handleSelect('Football')}
            className="group relative h-[450px] rounded-[3rem] overflow-hidden border-none transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Image 
              src="https://picsum.photos/seed/football-landing/800/600" 
              alt="Fútbol"
              fill
              className="object-cover opacity-40 group-hover:opacity-50 transition-opacity"
              data-ai-hint="football stadium"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-12 flex flex-col justify-end text-left">
              <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                <Target className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-4xl font-bold font-headline mb-3 uppercase tracking-tighter">Fútbol</h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-[280px]">
                Scouting, fichajes y rankings profesionales de 11.
              </p>
            </div>
          </button>

          <button 
            onClick={() => handleSelect('Futsal')}
            className="group relative h-[450px] rounded-[3rem] overflow-hidden border-none transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Image 
              src="https://picsum.photos/seed/futsal-landing/800/600" 
              alt="Fútbol Sala"
              fill
              className="object-cover opacity-40 group-hover:opacity-50 transition-opacity"
              data-ai-hint="futsal player"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-12 flex flex-col justify-end text-left">
              <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-4xl font-bold font-headline mb-3 uppercase tracking-tighter">Fútbol Sala</h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-[280px]">
                La élite del 40x20. Perfiles y scouting futsal.
              </p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Página principal una vez seleccionada la disciplina
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <TopNav />
      
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-6 flex flex-col items-center text-center space-y-10 overflow-hidden">
          {/* Glow effect background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] -z-10 rounded-full" />
          
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 rounded-full px-4 py-1.5 gap-2 uppercase font-black text-[10px] tracking-widest">
            <Zap className="w-3 h-3 fill-current" /> {discipline === 'Football' ? 'Fútbol' : 'Fútbol Sala'}
          </Badge>

          <h1 className="text-6xl md:text-8xl font-bold font-headline tracking-tighter leading-none max-w-4xl mx-auto">
            Conecta con el <br />
            <span className="text-white">Talento</span>
          </h1>

          <p className="text-muted-foreground text-xl max-w-xl mx-auto font-medium">
            Encuentra jugadores, entrenadores y clubes de {discipline === 'Football' ? 'Fútbol' : 'Fútbol Sala'}.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild className="h-16 px-10 rounded-2xl bg-primary text-background font-black text-lg uppercase tracking-widest hover:bg-primary/90 shadow-[0_0_40px_rgba(234,179,8,0.3)]">
              <Link href="/onboarding">Crear cuenta</Link>
            </Button>
            <Button asChild variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 font-black text-lg uppercase tracking-widest hover:bg-white/10">
              <Link href="/onboarding?mode=login">Acceso cuenta</Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-3 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex -space-x-3">
              {['MR', 'SG', 'NV'].map((init, i) => (
                <Avatar key={i} className="border-2 border-black w-10 h-10 ring-2 ring-primary/20">
                  <AvatarFallback className={`text-[10px] font-bold ${i === 0 ? 'bg-primary text-black' : 'bg-secondary text-white'}`}>{init}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <p className="text-sm font-medium">
              <span className="text-white font-bold">Mediocentro</span> y otros buscando equipo <span className="text-primary font-bold">ahora mismo</span>
            </p>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-[#111827]/30 border-y border-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center gap-12 md:gap-24">
            <div className="flex items-center gap-3">
              <span className="text-primary font-black text-xl">847+</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">perfiles</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1.5">
                {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[8px] font-bold text-primary">CM</div>)}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">+83 clubes</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-primary font-black text-xl">38</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">activos hoy</span>
            </div>
          </div>
        </section>

        {/* Role Cards Section */}
        <section className="max-w-7xl mx-auto w-full px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card role="Jugadores" description="Crea tu perfil de fútbol, muestra tus estadísticas y encuentra el equipo ideal." />
            <Card role="Entrenadores" description="Muestra tu metodología y filosofía. Recibe ofertas de clubes que buscan tu liderazgo táctico." />
            <Card role="Clubes" description="Gestiona tus proyectos, publica vacantes y utiliza IA para encontrar el talento perfecto." />
          </div>
        </section>
      </main>

      {/* Footer minimalista */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.3em]">SportMatch – Elite Scouting Terminal</p>
      </footer>
    </div>
  );
}

function Card({ role, description }: { role: string; description: string }) {
  return (
    <div className="group p-10 bg-[#111827] border border-[#1F2937] rounded-[2.5rem] space-y-6 hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
      <div className="space-y-4 relative z-10">
        <h3 className="text-2xl font-bold font-headline tracking-tight">{role}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm font-medium">
          {description}
        </p>
      </div>
      <div className="h-1 w-12 bg-white/10 group-hover:bg-primary transition-colors duration-500 rounded-full" />
      
      {/* Decorative gradient */}
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />
    </div>
  );
}
