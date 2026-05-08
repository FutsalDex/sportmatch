
"use client";

import { use, useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Trophy, 
  Play, 
  Zap, 
  Instagram, 
  Twitter, 
  Music2, 
  Award, 
  FileText, 
  GraduationCap, 
  Ruler, 
  Weight as WeightIcon, 
  Footprints,
  Map,
  BarChart3,
  TrendingUp,
  Target,
  ArrowUp,
  ShieldAlert,
  Pencil,
  Building2,
  Calendar,
  Wallet,
  Users,
  BrainCircuit,
  Globe2,
  MessagesSquare,
  Clock,
  Briefcase,
  Send,
  FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useFirestore, useDoc, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { TopNav } from '@/components/navigation/top-nav';

export default function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useFirestore();
  const { user: viewer } = useUser();

  const userDocRef = useMemoFirebase(() => doc(db, 'users', id), [db, id]);
  const profileDocRef = useMemoFirebase(() => doc(db, 'userProfiles', id), [db, id]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);
  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileDocRef);

  const isLoading = isUserLoading || isProfileLoading;
  const isViewerAdmin = viewer?.email === 'admin01@gmail.com';
  const isOwnProfile = viewer?.uid === id;

  const isCoach = userData?.role === 'Coach';
  const isClub = userData?.role === 'Club';
  
  const isVerified = isViewerAdmin || userData?.verificationStatus === 'verified' || userData?.plan === 'verified' || userData?.plan === 'pro' || userData?.plan === 'top';
  const hasAiAccess = isViewerAdmin || userData?.plan === 'pro' || userData?.plan === 'top';

  const careerTotals = useMemo(() => {
    if (!profileData?.teamHistory) return null;
    return profileData.teamHistory.reduce((acc: any, curr: any) => {
      if (isCoach || isClub) {
        acc.wins += (Number(curr.wins) || 0);
        acc.draws += (Number(curr.draws) || 0);
        acc.losses += (Number(curr.losses) || 0);
        acc.matches += (Number(curr.wins) || 0) + (Number(curr.draws) || 0) + (Number(curr.losses) || 0);
        if (curr.promotion === 'Sí') acc.promotions += 1;
      } else {
        acc.matches += (Number(curr.matches) || 0);
        acc.goals += (Number(curr.goals) || 0);
        acc.assists += (Number(curr.assists) || 0);
      }
      return acc;
    }, (isCoach || isClub) ? { wins: 0, draws: 0, losses: 0, matches: 0, promotions: 0 } : { matches: 0, goals: 0, assists: 0 });
  }, [profileData?.teamHistory, isCoach, isClub]);

  if (isLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-primary font-black animate-pulse uppercase tracking-[0.3em] text-xs">Sincronizando Terminal...</div>;

  if (!userData) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white p-10 text-center text-sm font-bold">Usuario no encontrado.</div>;

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('instagram.com/p/')) {
      const parts = url.split('/p/');
      const id = parts[1].split('/')[0];
      return `https://www.instagram.com/p/${id}/embed`;
    }
    if (url.includes('tiktok.com/')) {
      const parts = url.split('/video/');
      const id = parts[1]?.split('?')[0];
      return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
    }
    return null;
  };

  const hasMultimedia = 
    (profileData?.videoUrls?.some((u: string) => !!u)) || 
    (profileData?.socialVideoUrls?.some((u: string) => !!u)) || 
    (profileData?.bookImageUrls?.some((u: string) => !!u));

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white pb-20">
      <TopNav />
      
      <div className="relative pt-12 md:pt-16 pb-12 md:pb-20 px-4 md:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] md:w-[800px] h-[300px] md:h-[400px] bg-primary/10 blur-[80px] md:blur-[120px] -z-10 rounded-full" />
        
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <Link href="/rankings">
            <div className="bg-black/40 backdrop-blur-md p-2 md:p-3 rounded-xl md:rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          </Link>
          {isViewerAdmin && !isOwnProfile && (
            <Badge className="bg-red-500 text-white border-none font-black text-[9px] px-3 flex items-center gap-1.5 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="w-3 h-3" /> MODO SUPERVISIÓN ACTIVO
            </Badge>
          )}
        </div>

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-4 md:space-y-6">
          <div className="relative group">
            <Avatar className={cn(
              "w-32 h-32 md:w-40 md:h-40 border-4 border-primary rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-[#111827] shadow-[0_0_50px_rgba(234,179,8,0.2)]",
              isClub && "rounded-[1.5rem] md:rounded-[2rem]"
            )}>
              <AvatarImage src={userData.profileImageUrl} className="object-cover" />
              <AvatarFallback className="text-2xl md:text-4xl font-black bg-primary/10 text-primary">{userData.name?.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {userData.verificationStatus === 'verified' && (
              <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-primary p-1.5 md:p-2 rounded-xl md:rounded-2xl border-4 border-[#030712] shadow-xl">
                <ShieldCheck className="w-4 h-4 md:w-6 md:h-6 text-background" />
              </div>
            )}
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-6xl font-bold font-headline tracking-tighter uppercase italic">{userData.name}</h1>
              <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-[8px] md:text-[10px]">
                <MapPin className="w-3 h-3 text-primary" /> {userData.province}{userData.country ? `, ${userData.country}` : ''}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 md:gap-4">
              {userData.instagram && (
                <a href={`https://instagram.com/${userData.instagram.replace('@', '')}`} target="_blank" className="bg-white/5 p-2 md:p-3 rounded-lg md:rounded-xl hover:text-primary hover:bg-white/10 transition-all border border-white/5"><Instagram className="w-4 h-4 md:w-5 md:h-5" /></a>
              )}
              {userData.tiktok && (
                <a href={`https://tiktok.com/@${userData.tiktok.replace('@', '')}`} target="_blank" className="bg-white/5 p-2 md:p-3 rounded-lg md:rounded-xl hover:text-primary hover:bg-white/10 transition-all border border-white/5"><Music2 className="w-4 h-4 md:w-5 md:h-5" /></a>
              )}
              {userData.twitter && (
                <a href={`https://twitter.com/${userData.twitter.replace('@', '')}`} target="_blank" className="bg-white/5 p-2 md:p-3 rounded-lg md:rounded-xl hover:text-primary hover:bg-white/10 transition-all border border-white/5"><Twitter className="w-4 h-4 md:w-5 md:h-5" /></a>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 md:gap-3">
              <Badge variant="outline" className="text-primary border-primary/30 px-3 md:px-6 py-1 rounded-full font-black text-[8px] md:text-[10px] tracking-widest uppercase">
                {userData.role?.toUpperCase()}
              </Badge>
              <Badge className="bg-primary text-primary-foreground font-black px-3 md:px-6 py-1 rounded-full text-[8px] md:text-[10px] tracking-widest shadow-xl">
                IA SCORE {userData.score || 0}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto w-full px-4 md:px-6 space-y-8 md:space-y-12">
        {hasMultimedia && (
          <section className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 md:gap-3">
                <Play className="w-4 h-4 md:w-5 md:h-5 text-primary fill-primary" />
                <h2 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground">Material Gráfico {isClub ? 'Institucional' : 'de Perfil'}</h2>
              </div>
              <Badge className="bg-primary/10 text-primary border-none text-[7px] md:text-[8px] font-black tracking-widest uppercase">Visual Scouting</Badge>
            </div>
            
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x-mandatory pb-4">
               {profileData?.videoUrls?.filter((u: string) => !!u).map((url: string, i: number) => {
                const vidId = getYoutubeId(url);
                if (!vidId) return null;
                return (
                  <iframe key={`yt-${i}`} src={`https://www.youtube.com/embed/${vidId}`} className="min-w-[85vw] md:min-w-0 aspect-video rounded-2xl md:rounded-3xl border border-white/5 shadow-2xl snap-center" allowFullScreen />
                );
              })}
              {profileData?.socialVideoUrls?.filter((u: string) => !!u).map((url: string, i: number) => {
                const embed = getEmbedUrl(url);
                if (!embed) return null;
                return (
                  <iframe key={`social-${i}`} src={embed} className="min-w-[85vw] md:min-w-0 h-[350px] md:h-[400px] rounded-2xl md:rounded-3xl border border-white/5 bg-black shadow-2xl snap-center" />
                );
              })}
              {profileData?.bookImageUrls?.filter((u: string) => !!u).map((url: string, i: number) => (
                <div key={`img-${i}`} className="min-w-[85vw] md:min-w-0 relative aspect-square md:aspect-video rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 group bg-[#111827] snap-center">
                  <Image src={url} alt={`Book ${i}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </section>
        )}

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className={cn(
            "grid w-full bg-[#111827] border border-white/5 rounded-2xl md:rounded-[2rem] h-12 md:h-16 p-1 md:p-1.5",
            isClub ? "grid-cols-4" : "grid-cols-3"
          )}>
            <TabsTrigger value="stats" className="rounded-xl md:rounded-2xl font-black text-[7px] md:text-[10px] uppercase tracking-wider md:tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {isClub ? 'Entidad' : (isCoach ? 'Títulos' : 'Técnica')}
            </TabsTrigger>
            {isClub && (
              <TabsTrigger value="scouting" className="rounded-xl md:rounded-2xl font-black text-[7px] md:text-[10px] uppercase tracking-wider md:tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Scouting
              </TabsTrigger>
            )}
            <TabsTrigger value="history" className="rounded-xl md:rounded-2xl font-black text-[7px] md:text-[10px] uppercase tracking-wider md:tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {isClub ? 'Palmarés' : 'Historial'}
            </TabsTrigger>
            <TabsTrigger value="ai" className="rounded-xl md:rounded-2xl font-black text-[7px] md:text-[10px] uppercase tracking-wider md:tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Análisis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="mt-6 md:mt-8 space-y-6 md:space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {isClub ? (
                <>
                  <StatCard icon={Building2} label="Estadio" value={profileData?.stadium || 'Pendiente'} />
                  <StatCard icon={Calendar} label="Fundación" value={profileData?.foundationYear || '----'} />
                  <StatCard icon={Target} label="Categoría" value={userData.position || 'Amateur'} />
                  <StatCard icon={MapPin} label="Instalaciones" value={profileData?.facilities || 'Sede Social'} />
                </>
              ) : isCoach ? (
                <>
                  <StatCard icon={Globe2} label="Nacionalidad" value={userData.nationality || '----'} />
                  {profileData?.certifications?.length > 0 ? (
                    profileData.certifications.slice(0, 3).map((cert: string, i: number) => (
                      <StatCard key={i} icon={GraduationCap} label={`Titulación ${i+1}`} value={cert} />
                    ))
                  ) : (
                    <StatCard icon={GraduationCap} label="Titulaciones" value="Pendiente" />
                  )}
                </>
              ) : (
                <>
                  <StatCard icon={Globe2} label="Nacionalidad" value={userData.nationality || '----'} />
                  <StatCard icon={Ruler} label="Altura" value={`${profileData?.height || '--'} cm`} />
                  <StatCard icon={WeightIcon} label="Peso" value={`${profileData?.weight || '--'} kg`} />
                  <StatCard icon={Footprints} label="Pierna" value={profileData?.strongFoot || '--'} />
                </>
              )}
            </div>

            <Card className="card-elite rounded-[1.5rem] md:rounded-[2.5rem] bg-[#111827]/40 border-white/5">
              <CardContent className="p-6 md:p-10 space-y-3 md:space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <FileText className="w-4 h-4 md:w-5 md:h-5" />
                  <h3 className="font-black text-[8px] md:text-[10px] uppercase tracking-widest">
                    {isClub ? 'Visión Institucional' : 'Biografía Profesional'}
                  </h3>
                </div>
                <p className="text-xs md:text-base text-muted-foreground leading-relaxed font-medium">
                  {profileData?.bio || "Sin biografía registrada."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scouting" className="mt-6 md:mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="card-elite rounded-[2rem] bg-[#111827]/40 border-white/5 p-8 space-y-6">
                  <div className="flex items-center gap-3 text-primary">
                    <BrainCircuit className="w-5 h-5" />
                    <h3 className="font-black text-xs uppercase tracking-widest">ADN Deportivo</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div><p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Sistema Juego</p><p className="font-bold text-sm">{profileData?.tacticalSystem || '--'}</p></div>
                    <div><p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Edad Media</p><p className="font-bold text-sm">{profileData?.averageAge || '--'}</p></div>
                    <div><p className="text-[8px] font-black text-muted-foreground uppercase mb-1">% Cantera</p><p className="font-bold text-sm text-primary">{profileData?.academyUsage || 0}%</p></div>
                    <div><p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Urgencia</p><Badge className="bg-primary/20 text-primary border-none text-[8px] font-black">{profileData?.urgencyLevel || 'Baja'}</Badge></div>
                  </div>
               </Card>

               <Card className="card-elite rounded-[2rem] bg-[#111827]/40 border-white/5 p-8 space-y-6">
                  <div className="flex items-center gap-3 text-primary">
                    <Wallet className="w-5 h-5" />
                    <h3 className="font-black text-xs uppercase tracking-widest">Parámetros Mercado</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div><p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Rango Salarial</p><p className="font-bold text-sm text-green-400">{profileData?.salaryRange || '--'}</p></div>
                    <div><p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Cupos Extranjeros</p><p className="font-bold text-sm">{profileData?.foreignerSpots || 'No'}</p></div>
                  </div>
               </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6 md:mt-8 space-y-3 md:space-y-4">
            {profileData?.teamHistory?.length > 0 ? (
              profileData.teamHistory.map((entry: any, idx: number) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-6 md:p-8 card-elite rounded-[1.5rem] md:rounded-[2.5rem] bg-[#111827]/40 border-white/5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-primary font-black text-[10px] md:text-xs bg-primary/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full">{entry.season}</span>
                      <h4 className="font-bold text-lg md:text-2xl font-headline tracking-tight">{isClub ? entry.league : entry.club}</h4>
                    </div>
                    <p className="text-[7px] md:text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">
                      {isClub ? entry.leaguePosition : (isCoach ? entry.league : entry.position)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 md:py-20 border-dashed border-white/10 border rounded-[2rem]">
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[8px] md:text-xs">Sin historial disponible.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai" className="mt-6 md:mt-8 space-y-6">
            <Card className={cn(
              "rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden flex flex-col justify-center min-h-[200px]",
              hasAiAccess 
                ? "bg-primary text-primary-foreground shadow-2xl border-none" 
                : "bg-[#111827]/40 border-white/5 border border-dashed"
            )}>
              <CardContent className="p-8 md:p-10 space-y-4 relative z-10">
                <div className="flex items-center gap-2">
                  <Award className={cn("w-8 h-8", hasAiAccess ? "fill-primary-foreground" : "text-muted-foreground")} />
                  <h3 className={cn("text-xl md:text-2xl font-black uppercase italic tracking-tighter", hasAiAccess ? "text-primary-foreground" : "text-muted-foreground")}>
                    Análisis SportMatch IA
                  </h3>
                </div>
                {hasAiAccess ? (
                  <p className="font-bold text-lg md:text-2xl italic leading-tight">
                    "{profileData?.summary || "Perfil en fase de análisis avanzado."}"
                  </p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm font-medium">Análisis exclusivo de planes Elite Pro y Top.</p>
                    <Button asChild variant="outline" className="border-primary/40 text-primary rounded-xl font-black uppercase text-[10px] tracking-widest">
                      <Link href="/pricing">MEJORAR AHORA</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-[#111827] border border-white/5 p-4 md:p-6 rounded-2xl space-y-2 hover:border-primary/30 transition-all group">
      <div className="bg-primary/10 w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-primary/20">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-[7px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className="text-sm md:text-lg font-bold font-headline">{value}</p>
      </div>
    </div>
  );
}
