
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
  BarChart3,
  Youtube,
  Instagram,
  Twitter,
  Music2,
  Flag,
  Award,
  FileText
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
import { TopNav } from '@/components/navigation/top-nav';

export default function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useFirestore();

  const userDocRef = useMemoFirebase(() => doc(db, 'users', id), [db, id]);
  const profileDocRef = useMemoFirebase(() => doc(db, 'userProfiles', id), [db, id]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);
  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileDocRef);

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-primary font-black animate-pulse uppercase tracking-[0.3em]">Sincronizando Terminal...</div>;

  if (!userData) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">Usuario no encontrado.</div>;

  const isElite = userData.verificationStatus === 'verified' || userData.plan === 'verified' || userData.plan === 'pro';

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getEmbedUrl = (url: string) => {
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

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white pb-20">
      <TopNav />
      
      <div className="relative pt-16 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] -z-10 rounded-full" />
        
        <Link href="/rankings" className="absolute top-6 left-6 z-20">
          <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
        </Link>

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
          <div className="relative group">
            <Avatar className="w-40 h-40 border-4 border-primary rounded-[3rem] overflow-hidden bg-[#111827] shadow-[0_0_50px_rgba(234,179,8,0.2)]">
              <AvatarImage src={userData.profileImageUrl} className="object-cover" />
              <AvatarFallback className="text-4xl font-black bg-primary/10 text-primary">{userData.name?.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {userData.verificationStatus === 'verified' && (
              <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-2xl border-4 border-[#030712] shadow-xl">
                <ShieldCheck className="w-6 h-6 text-background" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-tighter uppercase italic">{userData.name}</h1>
              <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">
                <MapPin className="w-3 h-3 text-primary" /> {userData.province}, {userData.country}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              {userData.instagram && (
                <a href={`https://instagram.com/${userData.instagram.replace('@', '')}`} target="_blank" className="bg-white/5 p-3 rounded-xl hover:text-primary hover:bg-white/10 transition-all border border-white/5"><Instagram className="w-5 h-5" /></a>
              )}
              {userData.tiktok && (
                <a href={`https://tiktok.com/@${userData.tiktok.replace('@', '')}`} target="_blank" className="bg-white/5 p-3 rounded-xl hover:text-primary hover:bg-white/10 transition-all border border-white/5"><Music2 className="w-5 h-5" /></a>
              )}
              {userData.twitter && (
                <a href={`https://twitter.com/${userData.twitter.replace('@', '')}`} target="_blank" className="bg-white/5 p-3 rounded-xl hover:text-primary hover:bg-white/10 transition-all border border-white/5"><Twitter className="w-5 h-5" /></a>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <Badge variant="outline" className="text-primary border-primary/30 px-6 py-1.5 rounded-full font-black text-[10px] tracking-widest">{userData.role.toUpperCase()}</Badge>
              <Badge className="bg-primary text-background font-black px-6 py-1.5 rounded-full text-[10px] tracking-widest shadow-xl">IA SCORE {userData.score || 0}</Badge>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto w-full px-6 space-y-12">
        {isElite && (
          <section className="space-y-10">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <Play className="w-5 h-5 text-primary fill-primary" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Vídeo Highlights & Scouting Book</h2>
              </div>
              <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black tracking-widest uppercase">Elite Access</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {profileData?.videoUrls?.filter((u: string) => !!u).map((url: string, i: number) => {
                const vidId = getYoutubeId(url);
                if (!vidId) return null;
                return (
                  <iframe key={`yt-${i}`} src={`https://www.youtube.com/embed/${vidId}`} className="w-full aspect-video rounded-3xl border border-white/5 shadow-2xl" allowFullScreen />
                );
              })}
              {profileData?.socialVideoUrls?.filter((u: string) => !!u).map((url: string, i: number) => {
                const embed = getEmbedUrl(url);
                if (!embed) return null;
                return (
                  <iframe key={`social-${i}`} src={embed} className="w-full h-[400px] rounded-3xl border border-white/5 bg-black shadow-2xl" />
                );
              })}
              {profileData?.bookImageUrls?.filter((u: string) => !!u).map((url: string, i: number) => (
                <div key={`img-${i}`} className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden border border-white/5 group">
                  <Image src={url} alt={`Book ${i}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </section>
        )}

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#111827] border border-white/5 rounded-[2rem] h-16 p-1.5">
            <TabsTrigger value="stats" className="rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-background transition-all">Ficha Técnica</TabsTrigger>
            <TabsTrigger value="history" className="rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-background transition-all">Trayectoria</TabsTrigger>
            <TabsTrigger value="ai" className="rounded-2xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-background transition-all">IA Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard icon={Ruler} label="Altura" value={`${profileData?.height || '--'} cm`} />
              <StatCard icon={WeightIcon} label="Peso" value={`${profileData?.weight || '--'} kg`} />
              <StatCard icon={Footprints} label="Pierna" value={profileData?.strongFoot || '--'} />
              <StatCard icon={Target} label="Posición" value={userData.position || '--'} />
            </div>

            <Card className="card-elite rounded-[2.5rem] bg-[#111827]/40 border-white/5">
              <CardContent className="p-10 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-black text-[10px] uppercase tracking-widest">Biografía Profesional</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line font-medium">{profileData?.bio || "Sin biografía registrada en la terminal."}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {profileData?.teamHistory?.length > 0 ? (
              profileData.teamHistory.map((entry: any, idx: number) => (
                <div key={idx} className="flex flex-col md:flex-row items-center gap-6 p-8 card-elite rounded-[2.5rem] bg-[#111827]/40 border-white/5 hover:border-primary/20 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-black text-xs bg-primary/10 px-3 py-1 rounded-full">{entry.season}</span>
                      <h4 className="font-bold text-2xl font-headline tracking-tight">{entry.club}</h4>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1">{entry.position}</p>
                  </div>
                  <div className="flex gap-10 text-center">
                    <div><p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Partidos</p><p className="font-bold text-xl">{entry.matches || 0}</p></div>
                    <div><p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Goles</p><p className="font-bold text-xl text-primary">{entry.goals || 0}</p></div>
                    <div><p className="text-[8px] font-black text-muted-foreground uppercase mb-1">Asist</p><p className="font-bold text-xl">{entry.assists || 0}</p></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 card-elite rounded-[3rem] border-dashed border-white/10">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Historial deportivo no disponible.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-12 rounded-[3rem] bg-primary text-background shadow-[0_0_60px_rgba(234,179,8,0.3)] relative overflow-hidden">
              <Zap className="absolute -top-10 -right-10 w-40 h-40 opacity-10 rotate-12" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 fill-background" />
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter">Análisis IA SportMatch</h3>
                </div>
                <p className="font-bold text-2xl md:text-3xl italic leading-tight tracking-tight">
                  "{profileData?.summary || "Perfil en fase de análisis avanzado. El sistema está evaluando las métricas de rendimiento para generar una predicción de mercado."}"
                </p>
                <div className="flex gap-3">
                  <Badge variant="outline" className="bg-background/20 text-background border-background/30 font-black text-[10px] hover:bg-background/30">TENDENCIA POSITIVA</Badge>
                  <Badge variant="outline" className="bg-background/20 text-background border-background/30 font-black text-[10px] hover:bg-background/30">ALTA VISIBILIDAD</Badge>
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
    <div className="bg-[#111827] border border-white/5 p-6 rounded-[2rem] space-y-3 hover:border-primary/30 transition-all group">
      <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className="text-lg font-bold font-headline tracking-tight">{value}</p>
      </div>
    </div>
  );
}
