
"use client";

import { use, useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Trophy, 
  Calendar, 
  Play, 
  Zap, 
  MessageCircle,
  TrendingUp,
  Target,
  User as UserIcon,
  Ruler,
  Weight as WeightIcon,
  CalendarDays,
  Footprints,
  Lock,
  Star,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SeasonEntry {
  season: string;
  club: string;
  position: string;
  goals: number;
  assists: number;
  matches: number;
}

export default function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useFirestore();

  const userDocRef = useMemoFirebase(() => doc(db, 'users', id), [db, id]);
  const profileDocRef = useMemoFirebase(() => doc(db, 'userProfiles', id), [db, id]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);
  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileDocRef);

  const [isMatching, setIsMatching] = useState(false);
  const [matchSent, setMatchSent] = useState(false);

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="text-primary font-black animate-pulse uppercase tracking-[0.3em] text-center">
        INICIALIZANDO TERMINAL...
      </div>
    </div>
  );

  if (!userData) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="text-white font-black uppercase tracking-[0.3em] text-center p-6">
        USUARIO NO ENCONTRADO EN LA RED
        <br />
        <Button asChild variant="link" className="mt-4 text-primary">
          <Link href="/rankings">VOLVER AL RANKING</Link>
        </Button>
      </div>
    </div>
  );

  const isElite = userData.verificationStatus === 'verified' || (userData.score && userData.score > 85);

  // Ordenar el historial de más reciente a más antiguo
  const sortedHistory = profileData?.teamHistory ? [...profileData.teamHistory].sort((a: SeasonEntry, b: SeasonEntry) => b.season.localeCompare(a.season)) : [];

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white pb-20">
      <div className="relative pt-16 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent -z-10" />
        
        <Link href="/rankings" className="absolute top-6 left-6 z-20">
          <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </div>
        </Link>

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700" />
            <Avatar className="w-40 h-40 border-4 border-primary shadow-[0_0_50px_rgba(234,179,8,0.2)] rounded-[3rem] overflow-hidden relative z-10 bg-[#111827]">
              <AvatarImage src={userData.profileImageUrl || `https://picsum.photos/seed/${id}/400/400`} className="object-cover" />
              <AvatarFallback className="text-4xl font-black bg-[#111827]">{userData.name?.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {userData.verificationStatus === 'verified' && (
              <div className="absolute -bottom-2 -right-2 bg-primary rounded-2xl p-2.5 shadow-2xl border-4 border-[#030712] z-20">
                <ShieldCheck className="w-6 h-6 text-background" />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-bold font-headline tracking-tighter uppercase italic">{userData.name}</h1>
            <div className="flex items-center justify-center gap-3">
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 rounded-full px-4 py-1 font-black text-[10px] tracking-widest">
                {userData.role} • {userData.discipline === 'Football' ? 'FÚTBOL 11' : 'FUTSAL'}
              </Badge>
              <Badge className="bg-primary text-background border-none font-black rounded-full px-4 py-1 text-[10px]">
                IA SCORE {userData.score || 65}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto w-full px-6 space-y-12 -mt-10 relative z-10">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center">
              <Star className="w-4 h-4 mr-2 text-primary" /> Book de Jugador
            </h2>
            {!isElite && <Badge className="bg-white/5 text-muted-foreground text-[8px] border-white/10 uppercase">Solo Perfiles Pro</Badge>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(profileData?.bookImageUrls || [1, 2, 3]).map((url: string | number, i: number) => (
              <div key={i} className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 group">
                <Image 
                  src={typeof url === 'string' && url ? url : `https://picsum.photos/seed/book-${id}-${i}/600/800`}
                  alt={`Book ${i}`}
                  fill
                  className={cn(
                    "object-cover transition-all duration-700",
                    !isElite && "blur-xl opacity-40 scale-110",
                    isElite && "group-hover:scale-105"
                  )}
                />
                {!isElite && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-6 text-center">
                    <div className="bg-primary/20 p-3 rounded-2xl mb-3">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-tight">Activo solo para<br/>perfiles verificados</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-elite rounded-[2rem] bg-[#111827]/60">
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Edad</span>
              <span className="font-bold text-xl">{userData.age || '--'} años</span>
            </CardContent>
          </Card>
          <Card className="card-elite rounded-[2rem] bg-[#111827]/60">
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
              <Ruler className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Altura</span>
              <span className="font-bold text-xl">{profileData?.height || '--'} cm</span>
            </CardContent>
          </Card>
          <Card className="card-elite rounded-[2rem] bg-[#111827]/60">
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
              <WeightIcon className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Peso</span>
              <span className="font-bold text-xl">{profileData?.weight || '--'} kg</span>
            </CardContent>
          </Card>
          <Card className="card-elite rounded-[2rem] bg-[#111827]/60">
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
              <Footprints className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pierna Hábil</span>
              <span className="font-bold text-xl">{profileData?.strongFoot || '--'}</span>
            </CardContent>
          </Card>
        </section>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#111827] border border-white/5 rounded-2xl h-16 p-1.5">
            <TabsTrigger value="stats" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-background">Ficha Técnica</TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-background">Trayectoria</TabsTrigger>
            <TabsTrigger value="ai" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-background">IA Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-elite rounded-[2.5rem] bg-[#111827]/40">
                <CardHeader>
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center">
                    <Target className="w-4 h-4 mr-2" /> Demarcación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                    <span className="text-xs font-bold text-muted-foreground">Posición Principal</span>
                    <span className="font-bold">{userData.position || 'No especificada'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elite rounded-[2.5rem] bg-[#111827]/40">
                <CardHeader>
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center">
                    <MapPin className="w-4 h-4 mr-2" /> Localización
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                    <span className="text-xs font-bold text-muted-foreground">Provincia</span>
                    <span className="font-bold">{userData.province || 'No especificada'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-elite rounded-[2.5rem] bg-[#111827]/40 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <UserIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Biografía Técnica</h3>
                  <p className="text-lg font-bold font-headline">Resumen de Carrera</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {profileData?.bio || "Analizando el perfil del jugador..."}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-8 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-2">Historial Deportivo Estructurado</h3>
            <div className="space-y-4">
              {sortedHistory.length > 0 ? (
                sortedHistory.map((entry: SeasonEntry, idx: number) => (
                  <div key={idx} className="group flex flex-col md:flex-row items-center gap-6 p-6 card-elite rounded-[2rem] bg-[#111827]/40 hover:bg-[#111827] transition-all border-white/5">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-black text-xs uppercase tracking-widest">{entry.season}</span>
                        <h4 className="font-bold text-xl">{entry.club}</h4>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{entry.position}</p>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">PJ</p>
                        <p className="font-bold text-lg">{entry.matches}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Goles</p>
                        <p className="font-bold text-lg text-primary">{entry.goals}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Asist</p>
                        <p className="font-bold text-lg">{entry.assists}</p>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-xl">
                        <BarChart3 className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-[2rem] text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                  Sin historial registrado
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-8 space-y-6">
            <div className={cn(
              "p-10 rounded-[3rem] text-background shadow-[0_0_60px_rgba(234,179,8,0.2)] relative overflow-hidden group transition-all",
              isElite ? "bg-primary" : "bg-slate-800 text-white"
            )}>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 blur-3xl rounded-full" />
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className={cn("w-8 h-8 fill-current", isElite ? "text-background" : "text-primary")} />
                    <h3 className="text-2xl font-black font-headline tracking-tighter uppercase italic">Análisis IA SportMatch</h3>
                  </div>
                  <Badge className={cn("border-none font-black text-[10px] tracking-widest", isElite ? "bg-background text-primary" : "bg-primary text-background")}>
                    {isElite ? "POTENCIAL ELITE" : "ANÁLISIS EN CURSO"}
                  </Badge>
                </div>
                <p className="text-xl font-bold leading-tight italic">
                  {profileData?.summary || "Perfil en fase de análisis avanzado."}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {!matchSent ? (
          <Button 
            onClick={() => {
              setIsMatching(true);
              setTimeout(() => { setMatchSent(true); setIsMatching(false); }, 1000);
            }}
            disabled={isMatching}
            className="w-full h-20 rounded-[2.5rem] text-xl font-black uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(234,179,8,0.2)] bg-primary hover:bg-primary/90 text-background transition-all"
          >
            {isMatching ? "Validando Scouting..." : "Solicitar Match Técnico"} <Zap className="ml-2 w-6 h-6 fill-current" />
          </Button>
        ) : (
          <Button 
            disabled
            className="w-full h-20 rounded-[2.5rem] text-xl font-black uppercase tracking-[0.2em] bg-green-500/10 text-green-500 border border-green-500/20"
          >
            Match Enviado Correctamente <MessageCircle className="ml-2 w-6 h-6" />
          </Button>
        )}
      </main>
    </div>
  );
}
