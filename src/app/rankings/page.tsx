
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
  X,
  Star
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

      {/* Hero Header con títulos reducidos al 50% */}
      <header className="pt-16 pb-12 space-y-6 text-center px-6">
        <div className="flex justify-center">
          <div className="border border-primary/40 rounded-full px-6 py-1 bg-primary/5">
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">TERMINAL DE RANKING GLOBAL</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter uppercase italic leading-tight text-white">
          LÍDERES DEL TALENTO
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm font-medium opacity-60">
          Clasificación oficial basada en el <span className="text-white font-bold">IA Intelligence Score</span>.<br /> 
          Analizando rendimiento, impacto y potencial de mercado.
        </p>
      </header>

      {/* Barra de Filtros y Status */}
      <section className="max-w-5xl mx-auto w-full px-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-white">TALENTO DINÁMICO</h2>
            <p className="text-[10px] text-muted-foreground font-medium italic">Actualizado hace 4 minutos • 847 perfiles analizados</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-11 rounded-xl bg-white/5 border-white/10 text-white text-xs font-bold px-6 gap-2 hover:bg-white/10">
              <Filter className="w-3.5 h-3.5" /> Filtros
            </Button>
            <Button className="h-11 rounded-xl bg-primary text-background text-xs font-black uppercase tracking-widest px-6 hover:bg-primary/90">
              EXPORTAR
            </Button>
          </div>
        </div>
      </section>

      {/* Lista Principal de Rankings (Estilo Imagen 1) */}
      <section className="max-w-5xl mx-auto w-full px-6 space-y-4">
        {sortedUsers.map((userItem, idx) => {
          const isSelected = selectedForComparison.find(u => u.id === userItem.id);
          
          return (
            <div key={userItem.id} className="group">
              <Link href={`/profile/${userItem.id}`}>
                <Card 
                  className={cn(
                    "rounded-[2rem] transition-all duration-300 overflow-hidden border-white/5 bg-[#111827]/40 hover:bg-[#111827] hover:border-primary/20",
                    isSelected && "border-primary ring-1 ring-primary/20"
                  )}
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    
                    <div className="flex items-center gap-6">
                      {/* Avatar e Identidad (Estilo Imagen 1) */}
                      <div className="relative">
                        <Avatar className="w-20 h-20 rounded-2xl border-2 border-white/5 group-hover:border-primary/20 transition-colors">
                          <AvatarImage src={userItem.avatarUrl} className="object-cover" />
                          <AvatarFallback className="bg-[#1F2937] text-xl font-bold">{userItem.name[0]}</AvatarFallback>
                        </Avatar>
                        {userItem.verificationStatus === 'verified' && (
                          <div className="absolute -bottom-1 -right-1 bg-primary rounded-lg p-1 border-2 border-[#030712]">
                            <ShieldCheck className="w-4 h-4 text-background" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl font-bold font-headline tracking-tight text-white group-hover:text-primary transition-colors">
                          {userItem.name}
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                          {userItem.role} • {userItem.discipline}
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                          <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                            <MapPin className="w-3 h-3" /> {userItem.province}
                          </span>
                          <span className="text-[10px] text-primary font-black uppercase tracking-tighter">
                            {userItem.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Score Badge y Acción (Estilo Imagen 1) */}
                    <div className="flex items-center gap-6">
                      <div className="hidden md:flex gap-2">
                        <Button
                          onClick={(e) => handleCompareClick(e, userItem)}
                          variant="ghost"
                          className={cn(
                            "h-9 rounded-xl text-[9px] font-black uppercase tracking-widest gap-2 transition-all",
                            isSelected 
                              ? "bg-primary text-background" 
                              : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          )}
                        >
                          <Scale className="w-3.5 h-3.5" />
                          {isSelected ? 'LISTO' : 'COMP'}
                        </Button>
                      </div>

                      <div className="bg-primary rounded-full px-4 py-2 flex items-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                        <Star className="w-4 h-4 fill-background text-background" />
                        <span className="text-background font-black text-sm">{userItem.score}</span>
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
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6">
          <Card className="bg-black/95 backdrop-blur-3xl border-primary/40 rounded-[2.5rem] shadow-[0_0_80px_rgba(234,179,8,0.25)] p-4">
            <CardContent className="p-0 flex items-center justify-between gap-4">
              <div className="flex items-center -space-x-3">
                {selectedForComparison.map((u) => (
                  <Avatar key={u.id} className="w-12 h-12 border-2 border-primary/40 rounded-xl bg-background">
                    <AvatarImage src={u.avatarUrl} />
                    <AvatarFallback>{u.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              
              <Button 
                disabled={selectedForComparison.length < 2}
                className="flex-1 h-12 rounded-2xl bg-primary text-background font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_0_40px_rgba(234,179,8,0.4)] disabled:opacity-40"
              >
                {selectedForComparison.length < 2 ? 'SELECCIONA OTRO' : 'ANALIZAR'}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedForComparison([])}
                className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-red-500/20 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
