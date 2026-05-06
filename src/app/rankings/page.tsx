
"use client";

import { useState } from 'react';
import { 
  Trophy, 
  Star, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Award, 
  TrendingUp, 
  Activity, 
  Calendar,
  History,
  Target,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_USERS } from '@/lib/db-mock';
import { TopNav } from '@/components/navigation/top-nav';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function RankingsPage() {
  const sortedUsers = [...MOCK_USERS].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white">
      <TopNav />

      {/* Hero Header */}
      <header className="pt-20 pb-12 space-y-4 text-center px-6">
        <div className="flex justify-center">
          <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-6 py-1.5 text-[10px] font-black uppercase tracking-[0.3em]">
            TERMINAL DE RANKING GLOBAL
          </Badge>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold font-headline tracking-tighter uppercase italic">Líderes del Talento</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium opacity-80 leading-relaxed">
          Clasificación oficial basada en el <span className="text-white">IA Intelligence Score</span>. <br className="hidden md:block" /> Analizando rendimiento, impacto y potencial de mercado.
        </p>
      </header>

      {/* Main Ranking Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12 space-y-12">
        
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-8 gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center justify-center md:justify-start">
              <Zap className="w-3 h-3 mr-2 text-primary fill-primary" /> Índice de Talento Dinámico
            </h2>
            <p className="text-xs text-muted-foreground font-medium italic">Actualizado hace 4 minutos • 847 perfiles analizados</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="h-12 rounded-2xl bg-white/5 border-white/10 text-white font-bold px-8 gap-3 hover:bg-white/10 transition-all">
              <Filter className="w-4 h-4" /> Filtros Avanzados
            </Button>
            <Button className="h-12 rounded-2xl bg-primary text-background font-black uppercase tracking-widest px-8 hover:bg-primary/90">
              Exportar Informe
            </Button>
          </div>
        </div>

        {/* Unified List */}
        <div className="grid gap-6">
          {sortedUsers.map((user, idx) => {
            const isTopThree = idx < 3;
            
            return (
              <Link key={user.id} href={`/profile/${user.id}`} className="group block">
                <Card 
                  className={cn(
                    "rounded-[2.5rem] transition-all duration-500 overflow-hidden border-white/5",
                    isTopThree 
                      ? "bg-gradient-to-r from-[#111827] to-transparent border-primary/20 shadow-[0_0_50px_rgba(234,179,8,0.05)] scale-[1.01] hover:scale-[1.02]" 
                      : "bg-[#0a0f1c]/50 hover:bg-[#0a0f1c] hover:border-white/10"
                  )}
                >
                  <CardContent className="p-8 md:p-10 flex flex-col lg:flex-row items-center gap-12">
                    
                    {/* Rank Indicator & Avatar */}
                    <div className="flex items-center gap-10 min-w-[340px]">
                      <div className={cn(
                        "text-4xl font-black font-headline w-12 text-center",
                        idx === 0 ? "text-primary italic scale-125" : 
                        idx === 1 ? "text-slate-300" : 
                        idx === 2 ? "text-amber-700" : "text-muted-foreground opacity-30"
                      )}>
                        {(idx + 1).toString().padStart(2, '0')}
                      </div>
                      
                      <div className="relative">
                        {idx === 0 && (
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce">
                            <Trophy className="w-8 h-8 text-primary fill-primary" />
                          </div>
                        )}
                        <Avatar className={cn(
                          "rounded-[2rem] border-4 transition-all duration-500 shadow-2xl",
                          isTopThree ? "w-28 h-28 border-primary/30 group-hover:border-primary" : "w-20 h-20 border-white/5 group-hover:border-white/20"
                        )}>
                          <AvatarImage src={user.avatarUrl} className="object-cover" />
                          <AvatarFallback className="bg-[#1F2937] text-2xl font-bold">{user.name[0]}</AvatarFallback>
                        </Avatar>
                        {user.verificationStatus === 'verified' && (
                          <div className="absolute -bottom-2 -right-2 bg-primary rounded-xl p-1.5 shadow-xl border-4 border-[#030712]">
                            <ShieldCheck className="w-5 h-5 text-background" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className={cn(
                          "font-bold font-headline tracking-tight group-hover:text-primary transition-colors",
                          isTopThree ? "text-3xl" : "text-xl"
                        )}>
                          {user.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-white/10 text-[9px] font-black uppercase tracking-widest px-3">
                            {user.role}
                          </Badge>
                          <Badge variant="outline" className="border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest px-3">
                            {user.discipline}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Technical Data Grid */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-10 w-full">
                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-3 h-3" /> UBICACIÓN
                        </p>
                        <p className="text-sm font-bold text-white">{user.province}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Award className="w-3 h-3" /> CATEGORÍA
                        </p>
                        <p className="text-sm font-bold text-white">{user.level}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <History className="w-3 h-3" /> TRAYECTORIA
                        </p>
                        <p className="text-sm font-bold text-white">4 Clubes • 6 Temporadas</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Activity className="w-3 h-3" /> ESTADO SALUD
                        </p>
                        <p className="text-sm font-bold text-green-500 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 100% Fitness
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Target className="w-3 h-3" /> MERCADO
                        </p>
                        <p className="text-sm font-bold text-primary italic">Disponible</p>
                      </div>
                    </div>

                    {/* Score Terminal */}
                    <div className="flex flex-col items-center lg:items-end gap-3 min-w-[140px]">
                      <div className={cn(
                        "h-20 w-32 rounded-[2rem] flex flex-col items-center justify-center border transition-all duration-500",
                        isTopThree 
                          ? "bg-primary/10 border-primary/40 shadow-[0_0_30px_rgba(234,179,8,0.2)]" 
                          : "bg-white/5 border-white/10 group-hover:bg-white/10"
                      )}>
                        <span className={cn(
                          "text-3xl font-black font-headline",
                          isTopThree ? "text-primary" : "text-white"
                        )}>{user.score}</span>
                        <span className="text-[8px] font-black opacity-60 uppercase tracking-widest">IA SCORE</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={cn(
                            "w-2.5 h-2.5",
                            s <= 3 ? "text-primary fill-primary" : "text-white/10 fill-white/10"
                          )} />
                        ))}
                      </div>
                    </div>

                    {/* Floating Action (Hover only) */}
                    <div className="hidden lg:flex opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                      <div className="p-4 bg-primary rounded-2xl text-background">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Hall of Fame Footer Info */}
      <footer className="py-24 text-center border-t border-white/5 bg-black/40">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
             <ShieldCheck className="w-10 h-10" />
             <Zap className="w-10 h-10" />
             <Trophy className="w-10 h-10" />
             <Star className="w-10 h-10" />
             <Award className="w-10 h-10" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground">
            SportMatch Intelligence Unit • Algoritmo V.4.2.1 • 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
