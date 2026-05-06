
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
          {sortedUsers.map((userItem, idx) => {
            const isTopThree = idx < 3;
            const isSelected = selectedForComparison.find(u => u.id === userItem.id);
            
            return (
              <div key={userItem.id} className="group relative">
                <Link href={`/profile/${userItem.id}`} className="block">
                  <Card 
                    className={cn(
                      "rounded-[2.5rem] transition-all duration-500 overflow-hidden border-white/5",
                      isTopThree 
                        ? "bg-gradient-to-r from-[#111827] to-transparent border-primary/20 shadow-[0_0_50px_rgba(234,179,8,0.05)] scale-[1.01] hover:scale-[1.02]" 
                        : "bg-[#0a0f1c]/50 hover:bg-[#0a0f1c] hover:border-white/10",
                      isSelected && "border-primary ring-2 ring-primary/20"
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
                            <AvatarImage src={userItem.avatarUrl} className="object-cover" />
                            <AvatarFallback className="bg-[#1F2937] text-2xl font-bold">{userItem.name[0]}</AvatarFallback>
                          </Avatar>
                          {userItem.verificationStatus === 'verified' && (
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
                            {userItem.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-white/10 text-[9px] font-black uppercase tracking-widest px-3">
                              {userItem.role}
                            </Badge>
                            <Badge variant="outline" className="border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest px-3">
                              {userItem.discipline}
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
                          <p className="text-sm font-bold text-white">{userItem.province}</p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Award className="w-3 h-3" /> CATEGORÍA
                          </p>
                          <p className="text-sm font-bold text-white">{userItem.level}</p>
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
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 100% Fitness
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
                          )}>{userItem.score}</span>
                          <span className="text-[8px] font-black opacity-60 uppercase tracking-widest">IA SCORE</span>
                        </div>
                        
                        {/* BOTÓN COMPARAR (Solo para Clubes) */}
                        <Button
                          onClick={(e) => handleCompareClick(e, userItem)}
                          className={cn(
                            "w-full h-10 rounded-xl font-black uppercase text-[8px] tracking-[0.2em] transition-all",
                            isSelected 
                              ? "bg-primary text-background" 
                              : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-primary/20 hover:text-primary hover:border-primary/50"
                          )}
                        >
                          <Scale className="w-3 h-3 mr-2" />
                          {isSelected ? 'SELECCIONADO' : 'COMPARAR'}
                        </Button>
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
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Comparison Bar */}
      {selectedForComparison.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 duration-500">
          <Card className="bg-black/90 backdrop-blur-2xl border-primary/40 rounded-[2.5rem] shadow-[0_0_60px_rgba(234,179,8,0.2)] px-8 py-4">
            <CardContent className="p-0 flex items-center gap-10">
              <div className="flex items-center gap-6">
                {selectedForComparison.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-primary/30">
                      <AvatarImage src={u.avatarUrl} />
                      <AvatarFallback>{u.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block">
                      <p className="text-xs font-bold font-headline">{u.name}</p>
                      <p className="text-[8px] font-black text-primary uppercase tracking-widest">{u.score} IA SCORE</p>
                    </div>
                    {i === 0 && selectedForComparison.length > 1 && (
                      <span className="text-primary font-black italic px-4">VS</span>
                    )}
                  </div>
                ))}
                {selectedForComparison.length === 1 && (
                  <div className="flex items-center gap-3 opacity-30 italic">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest">Selecciona otro...</p>
                  </div>
                )}
              </div>
              
              <div className="h-10 w-px bg-white/10" />
              
              <div className="flex items-center gap-4">
                <Button 
                  disabled={selectedForComparison.length < 2}
                  className="h-14 px-10 rounded-2xl bg-primary text-background font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_0_30px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:grayscale"
                >
                  <TrendingUp className="w-4 h-4 mr-2" /> INICIAR HEAD-TO-HEAD
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSelectedForComparison([])}
                  className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-red-500/20 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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

