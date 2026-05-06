
"use client";

import { useUser, useFirestore, useDoc } from '@/firebase';
import { TopNav } from '@/components/navigation/top-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  TrendingUp, 
  Users, 
  Eye, 
  Star, 
  ChevronRight, 
  Crown,
  LayoutDashboard,
  ArrowUpRight
} from 'lucide-react';
import { doc } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { data: userData, isLoading } = useDoc(user ? doc(db, 'users', user.uid) : null);

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary font-bold animate-pulse">CARGANDO TERMINAL...</div>;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Header con Bienvenida */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              Centro de Mando Activo
            </Badge>
            <h1 className="text-5xl font-bold font-headline tracking-tighter">Hola, {userData?.name?.split(' ')[0] || 'Scout'}</h1>
            <p className="text-muted-foreground font-medium">Gestiona tu carrera y analiza tu impacto en el mercado.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#111827] border border-white/5 p-4 rounded-3xl flex items-center gap-4">
              <div className="bg-green-500/10 p-2 rounded-xl">
                <Crown className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Plan Actual</p>
                <p className="font-bold text-sm">Elite Free</p>
              </div>
            </div>
          </div>
        </header>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-elite rounded-[2.5rem] relative overflow-hidden group">
            <CardContent className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div className="bg-primary/10 p-3 rounded-2xl group-hover:bg-primary/20 transition-colors">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <Badge className="bg-primary/10 text-primary border-none text-[10px]">Top 5%</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black font-headline tracking-tighter">{userData?.score || 50}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Score IA Global</p>
              </div>
              <Progress value={userData?.score || 50} className="h-1.5 bg-white/5" />
            </CardContent>
          </Card>

          <Card className="card-elite rounded-[2.5rem]">
            <CardContent className="p-8 space-y-4">
              <div className="bg-blue-500/10 p-3 rounded-2xl w-fit">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black font-headline tracking-tighter">1,284</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Vistas de Perfil</p>
              </div>
              <p className="text-[10px] text-green-400 font-bold flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +12% esta semana
              </p>
            </CardContent>
          </Card>

          <Card className="card-elite rounded-[2.5rem]">
            <CardContent className="p-8 space-y-4">
              <div className="bg-purple-500/10 p-3 rounded-2xl w-fit">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black font-headline tracking-tighter">12</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Matches Activos</p>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold">3 pendientes de revisión</p>
            </CardContent>
          </Card>

          <Card className="card-elite rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-transparent border-primary/20">
            <CardContent className="p-8 space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <p className="font-bold text-lg font-headline">Hazte Pro</p>
                <p className="text-xs text-muted-foreground font-medium">Desbloquea análisis de riesgo de lesiones y comparador head-to-head.</p>
              </div>
              <Button className="w-full bg-primary text-background font-black uppercase text-[10px] tracking-widest rounded-2xl">
                Mejorar Ahora <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sección de Pipeline / Kanban (Simulado para Clubes o Interesados) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Pipeline de Scouting
            </h2>
            <Link href="/matches" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline flex items-center">
              Ver todos los matches <ChevronRight className="ml-1 w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Columna 1: Interesados */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Interesados (2)</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Leganés C.F.', role: 'Club', score: 72 },
                  { name: 'Agente FIFA J.M.', role: 'Scout', score: 88 }
                ].map((item, i) => (
                  <Card key={i} className="bg-[#111827] border-white/5 rounded-3xl hover:border-primary/20 transition-all cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <Avatar className="w-10 h-10 rounded-xl">
                        <AvatarFallback>{item.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{item.role}</p>
                      </div>
                      <Badge variant="outline" className="border-primary/20 text-primary text-[8px] font-black">{item.score}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Columna 2: En Revisión */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">En Revisión (1)</span>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              </div>
              <div className="space-y-3">
                <Card className="bg-[#111827] border-white/5 rounded-3xl border-l-2 border-l-yellow-500">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="w-10 h-10 rounded-xl">
                      <AvatarFallback>RM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-sm">Rayo Majadahonda</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Club • Análisis IA</p>
                    </div>
                    <div className="bg-yellow-500/10 p-1.5 rounded-lg">
                      <Zap className="w-3 h-3 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Columna 3: Pre-Seleccionados / Match */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Finalistas (0)</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              </div>
              <div className="h-24 border-2 border-dashed border-white/5 rounded-[2rem] flex items-center justify-center">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic">Área de éxito vacía</p>
              </div>
            </div>
          </div>
        </section>

        {/* IA Insights Section */}
        <section className="bg-primary rounded-[3rem] p-10 text-background flex flex-col md:flex-row items-center gap-10 shadow-[0_0_60px_rgba(234,179,8,0.2)]">
          <div className="bg-background p-6 rounded-[2rem] shadow-2xl">
            <Zap className="w-12 h-12 text-primary fill-primary" />
          </div>
          <div className="space-y-4 flex-1">
            <h2 className="text-3xl font-bold font-headline tracking-tighter uppercase italic">Predicción IA de Mercado</h2>
            <p className="font-bold text-lg leading-tight">
              "Tu Score ha subido +4 puntos tras actualizar tu biografía. El 80% de los clubes en {userData?.province || 'tu zona'} buscan perfiles con tu versatilidad táctica."
            </p>
            <div className="flex gap-4">
              <Badge className="bg-background text-primary border-none font-black text-[10px]">TENDENCIA ASCENDENTE</Badge>
              <Badge className="bg-background text-primary border-none font-black text-[10px]">ALTA VISIBILIDAD</Badge>
            </div>
          </div>
          <Button variant="outline" className="h-16 rounded-3xl border-background text-background hover:bg-background hover:text-primary font-black px-8">
            VER ANÁLISIS DETALLADO
          </Button>
        </section>
      </main>
    </div>
  );
}
