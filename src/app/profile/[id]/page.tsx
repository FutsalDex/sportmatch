
"use client";

import { use, useState } from 'react';
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
  Footprints 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { TopNav } from '@/components/navigation/top-nav';

export default function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useFirestore();

  const userDocRef = useMemoFirebase(() => doc(db, 'users', id), [db, id]);
  const profileDocRef = useMemoFirebase(() => doc(db, 'userProfiles', id), [db, id]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);
  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileDocRef);

  const isLoading = isUserLoading || isProfileLoading;

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

  const isCoach = userData.role === 'Coach';

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white pb-20">
      <TopNav />
      
      <div className="relative pt-12 md:pt-16 pb-12 md:pb-20 px-4 md:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] md:w-[800px] h-[300px] md:h-[400px] bg-primary/10 blur-[80px] md:blur-[120px] -z-10 rounded-full" />
        
        <Link href="/rankings" className="absolute top-4 left-4 z-20">
          <div className="bg-black/40 backdrop-blur-md p-2 md:p-3 rounded-xl md:rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
        </Link>

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-4 md:space-y-6">
          <div className="relative group">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-primary rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-[#111827] shadow-[0_0_50px_rgba(234,179,8,0.2)]">
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
                <MapPin className="w-3 h-3 text-primary" /> {userData.province}, {userData.country}
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
                <h2 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground">Material Gráfico de Perfil</h2>
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
          <TabsList className="grid w-full grid-cols-3 bg-[#111827] border border-white/5 rounded-2xl md:rounded-[2rem] h-12 md:h-16 p-1 md:p-1.5">
            <TabsTrigger value="stats" className="rounded-xl md:rounded-2xl font-black text-[7px] md:text-[10px] uppercase tracking-wider md:tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {isCoach ? 'Títulos' : 'Técnica'}
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl md:rounded-2xl font-black text-[7px] md:text-[10px] uppercase tracking-wider md:tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Historial</TabsTrigger>
            <TabsTrigger value="ai" className="rounded-xl md:rounded-2xl font-black text-[7px] md:text-[10px] uppercase tracking-wider md:tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">IA Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="mt-6 md:mt-8 space-y-6 md:space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {isCoach ? (
                profileData?.certifications?.length > 0 ? (
                  profileData.certifications.slice(0, 3).map((cert: string, i: number) => (
                    <StatCard key={i} icon={GraduationCap} label={`Titulación ${i+1}`} value={cert} />
                  ))
                ) : (
                  <StatCard icon={GraduationCap} label="Titulaciones" value="Pendiente" />
                )
              ) : (
                <>
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
                  <h3 className="font-black text-[8px] md:text-[10px] uppercase tracking-widest">Biografía Profesional</h3>
                </div>
                <p className="text-xs md:text-base text-muted-foreground leading-relaxed whitespace-pre-line font-medium">{profileData?.bio || "Sin biografía registrada."}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6 md:mt-8 space-y-3 md:space-y-4">
            {profileData?.teamHistory?.length > 0 ? (
              profileData.teamHistory.map((entry: any, idx: number) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-6 md:p-8 card-elite rounded-[1.5rem] md:rounded-[2.5rem] bg-[#111827]/40 border-white/5 hover:border-primary/20 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-primary font-black text-[10px] md:text-xs bg-primary/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full">{entry.season}</span>
                      <h4 className="font-bold text-lg md:text-2xl font-headline tracking-tight truncate">{entry.club}</h4>
                    </div>
                    <p className="text-[7px] md:text-[10px] text-muted-foreground font-black uppercase tracking-[0.1em] md:tracking-[0.2em] mt-1">
                      {isCoach ? (entry.league || 'Competición') : entry.position}
                    </p>
                  </div>
                  {isCoach ? (
                    <div className="flex justify-between md:justify-end gap-6 md:gap-10 text-center">
                      <div><p className="text-[7px] font-black text-muted-foreground uppercase mb-1">Posición</p><p className="font-bold text-base md:text-xl">{entry.leaguePosition || '-'}</p></div>
                      <div><p className="text-[7px] font-black text-muted-foreground uppercase mb-1">PG</p><p className="font-bold text-base md:text-xl text-green-400">{entry.wins || 0}</p></div>
                      <div><p className="text-[7px] font-black text-muted-foreground uppercase mb-1">PE</p><p className="font-bold text-base md:text-xl">{entry.draws || 0}</p></div>
                      <div><p className="text-[7px] font-black text-muted-foreground uppercase mb-1">PP</p><p className="font-bold text-base md:text-xl text-red-400">{entry.losses || 0}</p></div>
                    </div>
                  ) : (
                    <div className="flex justify-between md:justify-end gap-6 md:gap-10 text-center">
                      <div><p className="text-[7px] font-black text-muted-foreground uppercase mb-1">PJ</p><p className="font-bold text-base md:text-xl">{entry.matches || 0}</p></div>
                      <div><p className="text-[7px] font-black text-muted-foreground uppercase mb-1">GOLES</p><p className="font-bold text-base md:text-xl text-primary">{entry.goals || 0}</p></div>
                      <div><p className="text-[7px] font-black text-muted-foreground uppercase mb-1">ASIST</p><p className="font-bold text-base md:text-xl">{entry.assists || 0}</p></div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-16 md:py-20 card-elite rounded-[2rem] md:rounded-[3rem] border-dashed border-white/10">
                <Trophy className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[8px] md:text-xs">Sin historial disponible.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai" className="mt-6 md:mt-8">
            <div className="p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-primary text-primary-foreground shadow-[0_0_60px_rgba(234,179,8,0.3)] relative overflow-hidden">
              <Zap className="absolute -top-6 md:-top-10 -right-6 md:-right-10 w-32 md:w-40 h-32 md:h-40 opacity-10 rotate-12" />
              <div className="relative z-10 space-y-4 md:space-y-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <Award className="w-6 h-6 md:w-8 md:h-8 fill-primary-foreground" />
                  <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter">Análisis IA SportMatch</h3>
                </div>
                <p className="font-bold text-lg md:text-3xl italic leading-tight tracking-tight">
                  "{profileData?.summary || "Perfil en fase de análisis avanzado. El sistema está evaluando las métricas de rendimiento."}"
                </p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <Badge variant="outline" className="bg-black/20 text-primary-foreground border-black/30 font-black text-[7px] md:text-[10px]">TENDENCIA POSITIVA</Badge>
                  <Badge variant="outline" className="bg-black/20 text-primary-foreground border-black/30 font-black text-[7px] md:text-[10px]">ALTA VISIBILIDAD</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-[#111827] border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-[2rem] space-y-2 md:space-y-3 hover:border-primary/30 transition-all group">
      <div className="bg-primary/10 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
      </div>
      <div>
        <p className="text-[7px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate">{label}</p>
        <p className="text-sm md:text-lg font-bold font-headline tracking-tight truncate">{value}</p>
      </div>
    </div>
  );
}
