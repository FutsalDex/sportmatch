
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFirestore, useDoc, useMemoFirebase, useUser, setDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { TopNav } from '@/components/navigation/top-nav';
import { useToast } from '@/hooks/use-toast';

export default function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useFirestore();
  const { user: viewer } = useUser();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => doc(db, 'users', id), [db, id]);
  const profileDocRef = useMemoFirebase(() => doc(db, 'userProfiles', id), [db, id]);
  const viewerDocRef = useMemoFirebase(() => viewer ? doc(db, 'users', viewer.uid) : null, [db, viewer?.uid]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);
  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileDocRef);
  const { data: viewerData } = useDoc(viewerDocRef);

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerForm, setOfferForm] = useState({
    position: '',
    salaryRange: '',
    duration: '',
    requirements: '',
    description: ''
  });

  const isLoading = isUserLoading || isProfileLoading;
  const isViewerAdmin = viewer?.email === 'admin01@gmail.com';
  const isOwnProfile = viewer?.uid === id;

  const isCoach = userData?.role === 'Coach';
  const isClub = userData?.role === 'Club';
  const isViewerClub = viewerData?.role === 'Club';
  
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

  const handleSendOffer = () => {
    if (!viewer || !id) return;
    
    const offerId = `off_${Date.now()}`;
    const offerRef = doc(db, 'offers', offerId);
    
    setDocumentNonBlocking(offerRef, {
      id: offerId,
      clubId: viewer.uid,
      clubName: viewerData?.name || 'Club Institucional',
      targetUserId: id,
      position: offerForm.position,
      salaryRange: offerForm.salaryRange,
      duration: offerForm.duration,
      requirements: offerForm.requirements,
      description: offerForm.description,
      status: 'pending',
      createdAt: new Date().toISOString()
    }, { merge: true });

    toast({
      title: "Oferta Enviada",
      description: `Se ha notificado a ${userData?.name} sobre tu propuesta de contratación.`
    });
    
    setIsOfferModalOpen(false);
  };

  if (isLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-primary font-black animate-pulse uppercase tracking-[0.3em] text-xs">Sincronizando Terminal...</div>;

  if (!userData) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white p-10 text-center text-sm font-bold">Usuario no encontrado o ID inválido.</div>;

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
        {/* RECRUITMENT TERMINAL FOR CLUBS */}
        {isViewerClub && !isClub && !isOwnProfile && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-700">
             <Card className="rounded-[2.5rem] bg-primary text-background p-8 md:p-12 relative overflow-hidden border-none shadow-[0_0_60px_rgba(234,179,8,0.2)]">
                <Briefcase className="absolute -top-6 -right-6 w-32 h-32 opacity-10 rotate-12" />
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <div className="bg-background/20 p-4 md:p-6 rounded-[2rem] backdrop-blur-md">
                    <Send className="w-10 h-10 text-background" />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-2">
                    <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">Terminal de Reclutamiento</h2>
                    <p className="font-bold text-sm md:text-lg leading-tight">Genera una oferta formal de contratación para incorporar a {userData.name} a tu entidad.</p>
                  </div>
                  
                  <Dialog open={isOfferModalOpen} onOpenChange={setIsOfferModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="h-16 px-10 rounded-2xl bg-background text-primary hover:bg-background/90 font-black uppercase tracking-widest text-sm shadow-xl">
                        GENERAR OFERTA
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#030712] border-white/10 text-white max-w-2xl rounded-[2.5rem] p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                      <DialogHeader className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-primary">
                          <FileCheck className="w-8 h-8" />
                          <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">Nueva Propuesta</DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
                          Define los parámetros del contrato para el sujeto: {userData.name}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Puesto / Rol Específico</Label>
                          <Input 
                            placeholder="Ej: Delantero Centro / Analista" 
                            className="h-14 bg-white/5 border-none rounded-2xl px-6"
                            value={offerForm.position}
                            onChange={e => setOfferForm({...offerForm, position: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Duración (Temporadas)</Label>
                          <Input 
                            placeholder="Ej: 1 Temp. + Variable" 
                            className="h-14 bg-white/5 border-none rounded-2xl px-6"
                            value={offerForm.duration}
                            onChange={e => setOfferForm({...offerForm, duration: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Rango Salarial (Opcional)</Label>
                          <Input 
                            placeholder="Ej: 18.000€ - 22.000€ brutos/año" 
                            className="h-14 bg-white/5 border-none rounded-2xl px-6 text-green-400 font-bold"
                            value={offerForm.salaryRange}
                            onChange={e => setOfferForm({...offerForm, salaryRange: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Requerimientos Técnicos</Label>
                          <Textarea 
                            placeholder="¿Qué esperas del perfil a nivel profesional?" 
                            className="min-h-[100px] bg-white/5 border-none rounded-[1.5rem] p-6"
                            value={offerForm.requirements}
                            onChange={e => setOfferForm({...offerForm, requirements: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Mensaje Personalizado de la Entidad</Label>
                          <Textarea 
                            placeholder="Presenta el proyecto del club y los beneficios adicionales..." 
                            className="min-h-[120px] bg-white/5 border-none rounded-[1.5rem] p-6"
                            value={offerForm.description}
                            onChange={e => setOfferForm({...offerForm, description: e.target.value})}
                          />
                        </div>
                      </div>

                      <DialogFooter className="mt-10">
                        <Button 
                          onClick={handleSendOffer}
                          className="w-full h-16 rounded-[2rem] bg-primary text-background font-black uppercase tracking-[0.2em] text-sm hover:bg-primary/90 shadow-2xl"
                        >
                          ENVIAR PROPUESTA FORMAL <Send className="ml-2 w-4 h-4" />
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
             </Card>
          </section>
        )}

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
                <p className="text-xs md:text-base text-muted-foreground leading-relaxed whitespace-pre-line font-medium">
                  {profileData?.bio || (isViewerAdmin ? "[ADMIN: El usuario no ha completado su biografía]" : "Sin biografía registrada.")}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SCOUTING (SOLO CLUB) */}
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
                  <div className="space-y-3 pt-2">
                    <p className="text-[8px] font-black text-muted-foreground uppercase">Filosofía de Juego</p>
                    <div className="flex flex-wrap gap-2">
                      {profileData?.philosophy?.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="border-primary/20 text-primary text-[8px] font-bold">{tag.toUpperCase()}</Badge>
                      )) || <span className="text-xs text-muted-foreground italic">No especificada</span>}
                    </div>
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
                  <div className="space-y-4 pt-2">
                    <div>
                      <p className="text-[8px] font-black text-muted-foreground uppercase mb-2">Preferencias Contractuales</p>
                      <div className="flex flex-wrap gap-2">
                        {profileData?.contractPrefs?.map((tag: string) => (
                          <Badge key={tag} className="bg-white/5 text-white border-white/10 text-[8px] font-bold">{tag}</Badge>
                        )) || '--'}
                      </div>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-muted-foreground uppercase mb-2">Mercados Preferentes</p>
                      <div className="flex flex-wrap gap-2">
                        {profileData?.preferredMarkets?.map((tag: string) => (
                          <Badge key={tag} className="bg-white/5 text-white border-white/10 text-[8px] font-bold">{tag}</Badge>
                        )) || '--'}
                      </div>
                    </div>
                  </div>
               </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="card-elite rounded-2xl bg-[#111827]/40 p-6 space-y-3">
                  <Users className="w-5 h-5 text-primary" />
                  <p className="text-[8px] font-black text-muted-foreground uppercase">Resp. Scouting</p>
                  <p className="font-bold text-sm">{profileData?.scoutingResponsible || 'Sin identificar'}</p>
               </Card>
               <Card className="card-elite rounded-2xl bg-[#111827]/40 p-6 space-y-3">
                  <MessagesSquare className="w-5 h-5 text-primary" />
                  <p className="text-[8px] font-black text-muted-foreground uppercase">Canal Contacto</p>
                  <p className="font-bold text-sm truncate">{profileData?.contactChannel || 'Interno'}</p>
               </Card>
               <Card className="card-elite rounded-2xl bg-[#111827]/40 p-6 space-y-3">
                  <Globe2 className="w-5 h-5 text-primary" />
                  <p className="text-[8px] font-black text-muted-foreground uppercase">Idiomas Req.</p>
                  <p className="font-bold text-sm">{profileData?.requiredLanguages?.join(', ') || '--'}</p>
               </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6 md:mt-8 space-y-3 md:space-y-4">
            {profileData?.teamHistory?.length > 0 ? (
              profileData.teamHistory.map((entry: any, idx: number) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-6 md:p-8 card-elite rounded-[1.5rem] md:rounded-[2.5rem] bg-[#111827]/40 border-white/5 hover:border-primary/20 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-primary font-black text-[10px] md:text-xs bg-primary/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full">{entry.season}</span>
                      <h4 className="font-bold text-lg md:text-2xl font-headline tracking-tight truncate">{isClub ? entry.league : entry.club}</h4>
                      {(isCoach || isClub) && entry.promotion === 'Sí' && (
                        <Badge className="bg-primary text-background text-[7px] md:text-[8px] font-black gap-1 uppercase tracking-tighter">
                          <ArrowUp className="w-2.5 h-2.5" /> {isClub ? 'Campeón' : 'Ascenso'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[7px] md:text-[10px] text-muted-foreground font-black uppercase tracking-[0.1em] md:tracking-[0.2em] mt-1">
                      {isClub ? entry.leaguePosition : (isCoach ? (entry.league || 'Competición') : entry.position)}
                    </p>
                  </div>
                  {isCoach || isClub ? (
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
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[8px] md:text-xs">
                  {isViewerAdmin ? "[ADMIN: Sin historial de temporadas]" : "Sin historial disponible."}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai" className="mt-6 md:mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-elite rounded-[2rem] md:rounded-[2.5rem] bg-[#111827]/60 border-white/5 overflow-hidden">
                <CardContent className="p-8 md:p-10 space-y-6">
                  <div className="flex items-center gap-3 text-primary">
                    <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
                    <h3 className="font-black text-[10px] md:text-xs uppercase tracking-widest">Impacto Total {isClub ? 'del Club' : 'de Carrera'}</h3>
                  </div>
                  
                  {careerTotals ? (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-[8px] md:text-[9px] font-black uppercase tracking-widest">Partidos Totales</p>
                        <p className="text-2xl md:text-4xl font-black font-headline tracking-tighter text-white">{careerTotals.matches}</p>
                      </div>
                      {isCoach || isClub ? (
                        <>
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-[8px] md:text-[9px] font-black uppercase tracking-widest">{isClub ? 'Títulos/Hitos' : 'Ascensos'}</p>
                            <p className="text-2xl md:text-4xl font-black font-headline tracking-tighter text-primary">{careerTotals.promotions}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-[8px] md:text-[9px] font-black uppercase tracking-widest">Victorias (PG)</p>
                            <p className="text-2xl md:text-4xl font-black font-headline tracking-tighter text-green-400">{careerTotals.wins}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-[8px] md:text-[9px] font-black uppercase tracking-widest">Ratio Ganados</p>
                            <p className="text-2xl md:text-4xl font-black font-headline tracking-tighter text-white">
                              {careerTotals.matches > 0 ? ((careerTotals.wins / careerTotals.matches) * 100).toFixed(0) : '0'}%
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-[8px] md:text-[9px] font-black uppercase tracking-widest">Goles Totales</p>
                            <p className="text-2xl md:text-4xl font-black font-headline tracking-tighter text-primary">{careerTotals.goals}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-[8px] md:text-[9px] font-black uppercase tracking-widest">Asistencias</p>
                            <p className="text-2xl md:text-4xl font-black font-headline tracking-tighter text-blue-400">{careerTotals.assists}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-[8px] md:text-[9px] font-black uppercase tracking-widest">Ratio Gol/PJ</p>
                            <p className="text-2xl md:text-4xl font-black font-headline tracking-tighter text-white">
                              {careerTotals.matches > 0 ? (careerTotals.goals / careerTotals.matches).toFixed(2) : '0.00'}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs italic">No hay suficientes datos para procesar métricas globales.</p>
                  )}
                </CardContent>
              </Card>

              <Card className={cn(
                "rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden flex flex-col justify-center",
                hasAiAccess 
                  ? "bg-primary text-primary-foreground shadow-[0_0_60px_rgba(234,179,8,0.3)] border-none" 
                  : "bg-[#111827]/40 border-white/5 border border-dashed"
              )}>
                {hasAiAccess && <Zap className="absolute -top-6 md:-top-10 -right-6 md:-right-10 w-32 md:w-40 h-32 md:h-40 opacity-10 rotate-12" />}
                <CardContent className="p-8 md:p-10 space-y-4 md:space-y-6 relative z-10">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Award className={cn("w-6 h-6 md:w-8 md:h-8", hasAiAccess ? "fill-primary-foreground" : "text-muted-foreground")} />
                    <h3 className={cn("text-xl md:text-2xl font-black uppercase italic tracking-tighter", hasAiAccess ? "text-primary-foreground" : "text-muted-foreground")}>
                      Análisis SportMatch IA
                    </h3>
                  </div>

                  {hasAiAccess ? (
                    <>
                      <p className="font-bold text-lg md:text-2xl italic leading-tight tracking-tight">
                        "{profileData?.summary || (isViewerAdmin ? "[ADMIN: El sistema aún no ha generado el resumen para este perfil]" : "Perfil en fase de análisis avanzado. El sistema está evaluando las métricas de rendimiento.")}"
                      </p>
                      <div className="flex flex-wrap gap-2 md:gap-3 pt-2">
                        <Badge variant="outline" className="bg-black/20 text-primary-foreground border-black/30 font-black text-[7px] md:text-[10px]">POTENCIAL DE RECLUTAMIENTO</Badge>
                        <Badge variant="outline" className="bg-black/20 text-primary-foreground border-black/30 font-black text-[7px] md:text-[10px]">ENTIDAD SOLVENTE</Badge>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                        El análisis de impacto institucional mediante IA es una función exclusiva de los planes **Elite Pro** y **Top**. Mejora la cuenta de la entidad para desbloquear la síntesis estratégica avanzada.
                      </p>
                      <Button asChild variant="outline" className="h-12 border-primary/40 text-primary hover:bg-primary/10 rounded-xl font-black uppercase text-[10px] tracking-widest w-full">
                        <Link href="/pricing">MEJORAR AHORA</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {isViewerAdmin && !isOwnProfile && (
           <div className="pt-10 flex justify-center">
              <Button asChild className="h-16 px-10 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest hover:bg-red-600 gap-3 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                <Link href={`/profile/me?edit=${id}`}>
                  <Pencil className="w-5 h-5" /> EDITAR COMO ADMINISTRADOR
                </Link>
              </Button>
           </div>
        )}
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
