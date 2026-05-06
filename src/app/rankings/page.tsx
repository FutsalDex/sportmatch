
"use client";

import { useState } from 'react';
import { 
  Trophy, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Award, 
  TrendingUp, 
  Activity, 
  History,
  Target,
  ArrowRight,
  Scale,
  X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_USERS, User } from '@/lib/db-mock';
import { TopNav } from '@/components/navigation/top-nav';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function RankingsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const userDocRef = useMemoFirebase(() => {
    return user ? doc(db, 'users', user.uid) : null;
  }, [db, user?.uid]);

  const { data: userData } = useDoc(userDocRef);
  const isClub = userData?.role === 'Club';
  
  const [selectedForComparison, setSelectedForComparison] = useState<User[]>([]);
  const sortedUsers = [...MOCK_USERS].sort((a, b) => b.score - a.score);

  const handleCompareClick = (e: React.MouseEvent, targetUser: User) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isClub) {
      toast({
        title: "Acceso Restringido",
        description: "La función de comparación Head-to-Head es exclusiva para perfiles de Club.",
        variant: "destructive"
      });
      return;
    }

    if (selectedForComparison.find(u => u.id === targetUser.id)) {
      setSelectedForComparison(prev => prev.filter(u => u.id !== targetUser.id));
      return;
    }

    if (selectedForComparison.length >= 2) {
      toast({
        title: "Límite de comparación",
        description: "Solo puedes comparar 2 jugadores a la vez.",
      });
      return;
    }

    setSelectedForComparison(prev => [...prev, targetUser]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white pb-32">
      <TopNav />

      {/* Hero Header exacto a la imagen */}
      <header className="pt-24 pb-16 space-y-8 text-center px-6">
        <div className="flex justify-center">
          <div className="border border-primary/40 rounded-full px-8 py-1.5 bg-primary/5">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">TERMINAL DE RANKING GLOBAL</span>
          </div>
        </div>
        <h1 className="text-7xl md:text-9xl font-bold font-headline tracking-tighter uppercase italic leading-[0.8] text-white">
          LÍDERES DEL TALENTO
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium opacity-60">
          Clasificación oficial basada en el <span className="text-white font-bold">IA Intelligence Score</span>.<br /> 
          Analizando rendimiento, impacto y potencial de mercado.
        </p>
      </header>

      {/* Barra de Filtros y Status */}
      <section className="max-w-[1400px] mx-auto w-full px-8 mb-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="space-y-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">TALENTO DINÁMICO</h2>
            <p className="text-[11px] text-muted-foreground font-medium italic">4 minutos • 847 perfiles analizados</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold px-10 gap-3 hover:bg-white/10 border-[1.5px]">
              <Filter className="w-4 h-4" /> Filtros Avanzados
            </Button>
            <Button className="h-14 rounded-2xl bg-primary text-background font-black uppercase tracking-[0.1em] px-10 hover:bg-primary/90 shadow-[0_0_40px_rgba(234,179,8,0.2)]">
              EXPORTAR INFORME
            </Button>
          </div>
        </div>
      </section>

      {/* Lista Principal de Rankings */}
      <section className="max-w-[1400px] mx-auto w-full px-8 space-y-6">
        {sortedUsers.map((userItem, idx) => {
          const isTopOne = idx === 0;
          const isSelected = selectedForComparison.find(u => u.id === userItem.id);
          
          return (
            <div key={userItem.id} className="group relative">
              <Link href={`/profile/${userItem.id}`} className="block">
                <Card 
                  className={cn(
                    "rounded-[2.5rem] transition-all duration-500 overflow-hidden border-white/5",
                    isTopOne 
                      ? "bg-gradient-to-r from-[#111827] to-[#030712] border-primary/20 shadow-[0_0_50px_rgba(234,179,8,0.05)]" 
                      : "bg-[#0a0f1c]/40 hover:bg-[#111827] hover:border-white/10",
                    isSelected && "border-primary ring-2 ring-primary/20"
                  )}
                >
                  <CardContent className="p-10 flex flex-col lg:flex-row items-center gap-14">
                    
                    {/* Rank e Identidad */}
                    <div className="flex items-center gap-10 min-w-[380px]">
                      <div className={cn(
                        "text-5xl font-black font-headline w-14 text-center italic",
                        idx === 0 ? "text-primary scale-110" : "text-muted-foreground opacity-20"
                      )}>
                        {(idx + 1).toString().padStart(2, '0')}
                      </div>
                      
                      <div className="relative">
                        {isTopOne && (
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                            <Trophy className="w-10 h-10 text-primary fill-primary drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
                          </div>
                        )}
                        <Avatar className={cn(
                          "rounded-[2.5rem] border-[3px] transition-all duration-500",
                          isTopOne ? "w-32 h-32 border-primary/40" : "w-24 h-24 border-white/5"
                        )}>
                          <AvatarImage src={userItem.avatarUrl} className="object-cover" />
                          <AvatarFallback className="bg-[#1F2937] text-2xl font-bold">{userItem.name[0]}</AvatarFallback>
                        </Avatar>
                        {userItem.verificationStatus === 'verified' && (
                          <div className="absolute -bottom-1 -right-1 bg-primary rounded-xl p-1.5 border-[4px] border-[#030712]">
                            <ShieldCheck className="w-5 h-5 text-background" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h3 className={cn(
                          "font-bold font-headline tracking-tighter text-white",
                          isTopOne ? "text-4xl" : "text-2xl"
                        )}>
                          {userItem.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-[9px] font-black uppercase tracking-widest px-4 py-1">
                            {userItem.role}
                          </Badge>
                          <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest px-4 py-1">
                            {userItem.discipline}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Rejilla de Datos Técnicos (Idéntica a la imagen 2) */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-12 w-full">
                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary" /> UBICACIÓN
                        </p>
                        <p className="text-base font-bold text-white">{userItem.province}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-primary" /> CATEGORÍA
                        </p>
                        <p className="text-base font-bold text-white">{userItem.level}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <History className="w-3.5 h-3.5 text-primary" /> TRAYECTORIA
                        </p>
                        <p className="text-base font-bold text-white">4 Clubes • 6 Temporadas</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-primary" /> ESTADO SALUD
                        </p>
                        <p className="text-base font-bold text-green-500 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> 100% Fitness
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                          <Target className="w-3.5 h-3.5 text-primary" /> MERCADO
                        </p>
                        <p className="text-base font-bold text-primary italic">Disponible</p>
                      </div>
                    </div>

                    {/* IA Score Box con Glow (Imagen 2) */}
                    <div className="flex flex-col items-center lg:items-end gap-4 min-w-[160px]">
                      <div className={cn(
                        "h-24 w-40 rounded-[2.5rem] flex flex-col items-center justify-center border transition-all duration-500 relative group-hover:scale-105",
                        isTopOne 
                          ? "bg-primary/10 border-primary/40 shadow-[0_0_30px_rgba(234,179,8,0.2)]" 
                          : "bg-white/5 border-white/10 group-hover:bg-white/10"
                      )}>
                        <span className={cn(
                          "text-4xl font-black font-headline italic leading-none",
                          isTopOne ? "text-primary" : "text-white"
                        )}>{userItem.score}</span>
                        <span className="text-[8px] font-black opacity-40 uppercase tracking-[0.2em] mt-1">IA SCORE</span>
                      </div>
                      
                      <Button
                        onClick={(e) => handleCompareClick(e, userItem)}
                        className={cn(
                          "w-full h-11 rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] transition-all",
                          isSelected 
                            ? "bg-primary text-background" 
                            : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-primary/20 hover:text-primary hover:border-primary/50"
                        )}
                      >
                        <Scale className="w-3.5 h-3.5 mr-2" />
                        {isSelected ? 'SELECCIONADO' : 'COMPARAR'}
                      </Button>
                    </div>

                    {/* Acción Flotante al Final */}
                    <div className="hidden lg:flex opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <div className="p-5 bg-primary rounded-3xl text-background shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                        <ArrowRight className="w-6 h-6 stroke-[3px]" />
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </Link>
            </div>
          );
        })}
      </section>

      {/* Barra de Comparación Estilizada */}
      {selectedForComparison.length > 0 && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
          <Card className="bg-black/95 backdrop-blur-3xl border-primary/40 rounded-[3rem] shadow-[0_0_80px_rgba(234,179,8,0.25)] px-10 py-5">
            <CardContent className="p-0 flex items-center gap-12">
              <div className="flex items-center gap-8">
                {selectedForComparison.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-4">
                    <Avatar className="w-14 h-14 border-2 border-primary/40 rounded-2xl">
                      <AvatarImage src={u.avatarUrl} />
                      <AvatarFallback>{u.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block">
                      <p className="text-sm font-black font-headline text-white">{u.name}</p>
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">{u.score} IA SCORE</p>
                    </div>
                    {i === 0 && selectedForComparison.length > 1 && (
                      <span className="text-primary font-black italic px-6 text-xl">VS</span>
                    )}
                  </div>
                ))}
                {selectedForComparison.length === 1 && (
                  <div className="flex items-center gap-4 opacity-30 italic">
                    <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em]">Siguiente candidato...</p>
                  </div>
                )}
              </div>
              
              <div className="h-12 w-px bg-white/10" />
              
              <div className="flex items-center gap-5">
                <Button 
                  disabled={selectedForComparison.length < 2}
                  className="h-16 px-12 rounded-[1.5rem] bg-primary text-background font-black uppercase text-[11px] tracking-[0.2em] shadow-[0_0_40px_rgba(234,179,8,0.4)] disabled:opacity-40"
                >
                  <TrendingUp className="w-4 h-4 mr-3" /> INICIAR ANÁLISIS HEAD-TO-HEAD
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSelectedForComparison([])}
                  className="h-16 w-16 rounded-[1.5rem] bg-white/5 border border-white/10 text-white hover:bg-red-500/20 hover:text-red-500"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hall of Fame Footer */}
      <footer className="py-32 text-center border-t border-white/5 bg-black/40 mt-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex justify-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <ShieldCheck className="w-12 h-12" />
             <Zap className="w-12 h-12" />
             <Trophy className="w-12 h-12" />
             <TrendingUp className="w-12 h-12" />
             <Award className="w-12 h-12" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.8em] text-muted-foreground italic">
            SPORTMATCH INTELLIGENCE UNIT • ALGORITMO V.4.5.1
          </p>
        </div>
      </footer>
    </div>
  );
}
