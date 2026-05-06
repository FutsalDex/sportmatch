import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trophy, Zap, ArrowRight, Star, Target, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />
        
        <div className="relative z-10 space-y-8 max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary rounded-full animate-pulse">
            <Star className="w-3.5 h-3.5 mr-2 fill-primary" />
            IA-Powered Sports Intelligence
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] font-headline tracking-tighter">
            Donde el Talento encuentra su <span className="text-gradient">Oportunidad</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Terminal de inteligencia deportiva para jugadores, entrenadores y clubes de élite.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 px-8 rounded-full text-lg">
              <Link href="/onboarding">Empezar Ahora <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/10 glass hover:bg-white/5 h-14 px-8 rounded-full text-lg">
              <Link href="/rankings">Ver Rankings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof / Discipline Selector */}
      <section className="px-6 -mt-10 mb-12 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/search?discipline=Football" className="group">
            <div className="card-elite p-8 rounded-[2.5rem] relative overflow-hidden group-hover:border-primary/50 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target size={120} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Fútbol 11</h3>
              <p className="text-muted-foreground text-sm mb-4">Estrategia, potencia y scouting profesional.</p>
              <Badge className="bg-white/5 text-white border-none group-hover:bg-primary group-hover:text-primary-foreground">Explorar</Badge>
            </div>
          </Link>
          <Link href="/search?discipline=Futsal" className="group">
            <div className="card-elite p-8 rounded-[2.5rem] relative overflow-hidden group-hover:border-primary/50 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={120} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Fútbol Sala</h3>
              <p className="text-muted-foreground text-sm mb-4">Técnica, velocidad y precisión máxima.</p>
              <Badge className="bg-white/5 text-white border-none group-hover:bg-primary group-hover:text-primary-foreground">Explorar</Badge>
            </div>
          </Link>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-3 gap-4 mt-12 bg-white/5 backdrop-blur-sm p-8 rounded-[3rem] border border-white/5">
          <div className="text-center space-y-1">
            <Users className="w-5 h-5 mx-auto text-primary mb-2" />
            <p className="text-3xl font-bold">18.4k</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Scouts Activos</p>
          </div>
          <div className="text-center space-y-1 border-x border-white/10">
            <Trophy className="w-5 h-5 mx-auto text-primary mb-2" />
            <p className="text-3xl font-bold">1.2k</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Clubes Pro</p>
          </div>
          <div className="text-center space-y-1">
            <Zap className="w-5 h-5 mx-auto text-primary mb-2" />
            <p className="text-3xl font-bold">94%</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Match Accuracy</p>
          </div>
        </div>
      </section>

      {/* IA Showcase */}
      <section className="px-6 py-20 bg-[#070B14]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold font-headline">Tecnología Scout IA</h2>
            <p className="text-muted-foreground">Nuestro algoritmo analiza miles de datos para predecir el rendimiento.</p>
          </div>
          
          <div className="grid gap-6">
            <div className="card-elite p-6 rounded-[2rem] flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Target size={32} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">Predicción de Trayectoria</h4>
                <p className="text-sm text-muted-foreground">Modelos predictivos sobre el crecimiento profesional del jugador.</p>
              </div>
            </div>
            <div className="card-elite p-6 rounded-[2rem] flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Users size={32} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">Smart Matching</h4>
                <p className="text-sm text-muted-foreground">Conexiones basadas en la filosofía técnica y necesidades del club.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
