
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
  Music2
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

  if (isLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-primary font-black animate-pulse">Sincronizando Terminal...</div>;

  if (!userData) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">Usuario no encontrado.</div>;

  const isElite = userData.verificationStatus === 'verified' || (userData.score && userData.score > 85);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('instagram.com/p/')) {
      const id = url.split('/p/')[1].split('/')[0];
      return `https://www.instagram.com/p/${id}/embed`;
    }
    if (url.includes('tiktok.com/')) {
      const id = url.split('/video/')[1]?.split('?')[0];
      return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white pb-20">
      <div className="relative pt-16 pb-20 px-6 overflow-hidden">
        <Link href="/rankings" className="absolute top-6 left-6 z-20">
          <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:border-primary/50">
            <ArrowLeft className="w-5 h-5" />
          </div>
        </Link>
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
          <Avatar className="w-40 h-40 border-4 border-primary rounded-[3rem] overflow-hidden bg-[#111827]">
            <AvatarImage src={userData.profileImageUrl} className="object-cover" />
            <AvatarFallback className="text-4xl font-black">{userData.name?.substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold font-headline tracking-tighter uppercase italic">{userData.name}</h1>
            <div className="flex items-center justify-center gap-4">
              {userData.instagram && (
                <a href={`https://instagram.com/${userData.instagram.replace('@', '')}`} target="_blank" className="text-muted-foreground hover:text-primary"><Instagram className="w-6 h-6" /></a>
              )}
              {userData.tiktok && (
                <a href={`https://tiktok.com/@${userData.tiktok.replace('@', '')}`} target="_blank" className="text-muted-foreground hover:text-primary"><Music2 className="w-6 h-6" /></a>
              )}
              {userData.twitter && (
                <a href={`https://twitter.com/${userData.twitter.replace('@', '')}`} target="_blank" className="text-muted-foreground hover:text-primary"><Twitter className="w-6 h-6" /></a>
              )}
            </div>
            <div className="flex items-center justify-center gap-3">
              <Badge variant="outline" className="text-primary border-primary/30">{userData.role}</Badge>
              <Badge className="bg-primary text-background font-black">IA SCORE {userData.score || 0}</Badge>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto w-full px-6 space-y-12">
        {/* VIDEOS SECTION */}
        {isElite && (
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <Youtube className="w-6 h-6 text-red-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Vídeo Highlights & Social Clips</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profileData?.videoUrls?.map((url: string, i: number) => {
                const vidId = getYoutubeId(url);
                if (!vidId) return null;
                return (
                  <iframe key={i} src={`https://www.youtube.com/embed/${vidId}`} className="w-full aspect-video rounded-[2rem] border border-white/5" allowFullScreen />
                );
              })}
              {profileData?.socialVideoUrls?.map((url: string, i: number) => {
                const embed = getEmbedUrl(url);
                if (!embed) return null;
                return (
                  <iframe key={`social-${i}`} src={embed} className="w-full aspect-square md:aspect-video rounded-[2rem] border border-white/5 bg-black" />
                );
              })}
            </div>
          </section>
        )}

        {/* STATS AND TABS (EXISTING LOGIC) */}
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#111827] border border-white/5 rounded-2xl h-16 p-1.5">
            <TabsTrigger value="stats" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-background">Ficha Técnica</TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-background">Trayectoria</TabsTrigger>
            <TabsTrigger value="ai" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-background">IA Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="stats" className="mt-8 space-y-6">
            <Card className="card-elite rounded-[2.5rem] bg-[#111827]/40 p-8">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{profileData?.bio || "Sin biografía registrada."}</p>
            </Card>
          </TabsContent>
          <TabsContent value="history" className="mt-8 space-y-4">
            {profileData?.teamHistory?.map((entry: any, idx: number) => (
              <div key={idx} className="flex flex-col md:flex-row items-center gap-6 p-6 card-elite rounded-[2rem] bg-[#111827]/40">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-black text-xs">{entry.season}</span>
                    <h4 className="font-bold text-xl">{entry.club}</h4>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">{entry.position}</p>
                </div>
                <div className="flex gap-8 text-center">
                  <div><p className="text-[8px] font-black text-muted-foreground">PJ</p><p className="font-bold">{entry.matches}</p></div>
                  <div><p className="text-[8px] font-black text-muted-foreground">GOLES</p><p className="font-bold text-primary">{entry.goals}</p></div>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="ai" className="mt-8">
            <div className="p-10 rounded-[3rem] bg-primary text-background">
              <h3 className="text-2xl font-black uppercase italic mb-4">Análisis IA SportMatch</h3>
              <p className="font-bold text-xl italic">{profileData?.summary || "Perfil en fase de análisis avanzado."}</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
