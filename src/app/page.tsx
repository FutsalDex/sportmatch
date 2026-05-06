import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trophy, Shield, Zap, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 pt-12 pb-24 overflow-hidden bg-primary text-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-20">
          <Zap size={300} strokeWidth={1} />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full border border-white/20">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium">IA Deportiva Certificada</span>
          </div>
          
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Conecta con el Futuro del <span className="text-accent">Talento</span>
          </h1>
          
          <p className="text-lg opacity-90 max-w-md">
            La plataforma definitiva para jugadores, entrenadores y clubes impulsada por Inteligencia Artificial.
          </p>
          
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl h-14">
              <Link href="/search">Explorar Talento <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-xl h-14">
              <Link href="/onboarding">Unirme como Jugador</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="px-6 -mt-10 mb-12">
        <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded-2xl shadow-xl border border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">15k+</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Jugadores</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-2xl font-bold text-primary">800+</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Clubes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">92%</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Éxito Match</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 space-y-12 pb-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Optimizado para el éxito</h2>
          <div className="grid gap-4">
            <div className="flex items-start space-x-4 p-4 bg-white rounded-2xl border border-border">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Certificación Pro</h3>
                <p className="text-sm text-muted-foreground">Verificamos credenciales profesionales para garantizar confianza.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-white rounded-2xl border border-border">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Zap className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-bold">IA Scouting</h3>
                <p className="text-sm text-muted-foreground">Informes detallados generados por IA sobre fortalezas y potencial.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-white rounded-2xl border border-border">
              <div className="p-3 bg-secondary rounded-xl">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Matches Seguros</h3>
                <p className="text-sm text-muted-foreground">Sistema de conexión directa una vez ambas partes aceptan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}