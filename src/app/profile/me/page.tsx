
"use client";

import { useState, useEffect } from 'react';
import { 
  Globe, 
  FileText, 
  Sparkles, 
  MapPin,
  Trash2,
  Activity,
  Flag,
  Zap,
  Award,
  Terminal,
  Server,
  ShieldAlert,
  Calendar,
  Loader2,
  Trophy,
  GraduationCap,
  Ruler,
  Weight as WeightIcon,
  Footprints,
  Map,
  User as UserIcon,
  ChevronLeft,
  Bot,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TopNav } from '@/components/navigation/top-nav';
import { useUser, useFirestore, useFirebase, useDoc, setDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { COUNTRIES } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SeasonEntry {
  season: string;
  club: string;
  position?: string;
  goals?: number;
  assists?: number;
  matches?: number;
  league?: string;
  leaguePosition?: string;
  promotion?: string;
  wins?: number;
  draws?: number;
  losses?: number;
}

export default function MyProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { firestore: db } = useFirebase();
  const { toast } = useToast();

  const isAdmin = user?.email === 'admin01@gmail.com';
  const targetUserId = (isAdmin && editId) ? editId : user?.uid;
  const isEditingOther = isAdmin && editId && editId !== user?.uid;

  const userRef = useMemoFirebase(() => {
    return targetUserId ? doc(db, 'users', targetUserId) : null;
  }, [db, targetUserId]);

  const profileRef = useMemoFirebase(() => {
    return targetUserId ? doc(db, 'userProfiles', targetUserId) : null;
  }, [db, targetUserId]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userRef);
  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef);

  const [formData, setFormData] = useState({
    name: '',
    province: '',
    country: 'España',
    nationality: '',
    age: '',
    position: '',
    mobility: 'Nacional',
    bio: '',
    isAiBio: false,
    height: '',
    weight: '',
    strongFoot: '',
    certifications: ['', '', ''],
    stadium: '',
    foundationYear: '',
    facilities: '',
    instagram: '',
    tiktok: '',
    twitter: '',
    profileImageUrl: '',
    bookImageUrls: ['', '', ''],
    videoUrls: ['', ''],
    socialVideoUrls: ['', ''],
    teamHistory: [] as SeasonEntry[],
    newSeason: {
      season: '',
      club: '',
      position: '',
      goals: 0,
      assists: 0,
      matches: 0,
      league: '',
      leaguePosition: '',
      promotion: 'No',
      wins: 0,
      draws: 0,
      losses: 0
    } as SeasonEntry
  });

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        province: userData.province || '',
        country: userData.country || 'España',
        nationality: userData.nationality || '',
        age: userData.age?.toString() || '',
        position: userData.position || '',
        mobility: userData.mobility || 'Nacional',
        instagram: userData.instagram || '',
        tiktok: userData.tiktok || '',
        twitter: userData.twitter || '',
        profileImageUrl: userData.profileImageUrl || ''
      }));
    }
    if (profileData) {
      setFormData(prev => ({
        ...prev,
        bio: profileData.bio || '',
        isAiBio: profileData.isAiBio || false,
        height: profileData.height?.toString() || '',
        weight: profileData.weight?.toString() || '',
        strongFoot: profileData.strongFoot || '',
        certifications: profileData.certifications?.length ? [...profileData.certifications, '', '', ''].slice(0, 3) : ['', '', ''],
        stadium: profileData.stadium || '',
        foundationYear: profileData.foundationYear || '',
        facilities: profileData.facilities || '',
        bookImageUrls: profileData.bookImageUrls?.length ? [...profileData.bookImageUrls, '', '', ''].slice(0, 3) : ['', '', ''],
        videoUrls: profileData.videoUrls?.length ? [...profileData.videoUrls, '', ''].slice(0, 2) : ['', ''],
        socialVideoUrls: profileData.socialVideoUrls?.length ? [...profileData.socialVideoUrls, '', ''].slice(0, 2) : ['', ''],
        teamHistory: (profileData.teamHistory || []).sort((a: SeasonEntry, b: SeasonEntry) => b.season.localeCompare(a.season))
      }));
    }
  }, [userData, profileData]);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  const isElite = isAdmin || userData?.verificationStatus === 'verified' || userData?.plan === 'verified' || userData?.plan === 'pro';
  const isTargetCoach = userData?.role === 'Coach';
  const isTargetClub = userData?.role === 'Club';

  const calculateScore = () => {
    if (isAdmin && !isEditingOther) return 100;
    let score = 0;
    let basicScore = 0;
    if (formData.name) basicScore += 2;
    if (formData.nationality) basicScore += 2;
    if (formData.country && formData.province) basicScore += 2;
    if (formData.instagram || formData.tiktok || formData.twitter) basicScore += 4;
    score += Math.min(basicScore, 10);

    let moduleScore = 0;
    if (isTargetClub) {
      if (formData.stadium) moduleScore += 3;
      if (formData.foundationYear) moduleScore += 3;
      if (formData.position) moduleScore += 4;
    } else if (isTargetCoach) {
      formData.certifications.forEach(c => { if (c) moduleScore += 3.4; });
    } else {
      if (formData.age) moduleScore += 2;
      if (formData.height) moduleScore += 2;
      if (formData.weight) moduleScore += 2;
      if (formData.position) moduleScore += 2;
      if (formData.strongFoot) moduleScore += 2;
    }
    score += Math.min(moduleScore, 10);

    let mediaScore = 0;
    if (formData.profileImageUrl) mediaScore += 10;
    formData.bookImageUrls.forEach(url => { if (url) mediaScore += 3; });
    formData.videoUrls.forEach(url => { if (url) mediaScore += 3; });
    formData.socialVideoUrls.forEach(url => { if (url) mediaScore += 3; });
    score += Math.min(mediaScore, 25);

    if (formData.bio && formData.bio.length > 20) score += 5;
    if (formData.teamHistory.length > 0) score += 10;
    if (userData?.plan === 'pro') score += 20;
    else if (userData?.plan === 'verified' || userData?.verificationStatus === 'verified') score += 10;

    return Math.min(Math.round(score), 100);
  };

  const currentScore = calculateScore();

  const handleSave = () => {
    if (!targetUserId || !userRef || !profileRef) return;

    const primaryCert = formData.certifications.find(c => !!c) || '';

    setDocumentNonBlocking(userRef, {
      name: formData.name,
      province: formData.province,
      country: formData.country,
      nationality: formData.nationality,
      age: parseInt(formData.age) || 0,
      position: isTargetCoach ? primaryCert : formData.position,
      mobility: formData.mobility,
      instagram: formData.instagram,
      tiktok: formData.tiktok,
      twitter: formData.twitter,
      profileImageUrl: formData.profileImageUrl,
      score: currentScore,
    }, { merge: true });

    setDocumentNonBlocking(profileRef, {
      id: targetUserId,
      userId: targetUserId,
      bio: formData.bio,
      isAiBio: formData.isAiBio,
      height: parseFloat(formData.height) || 0,
      weight: parseFloat(formData.weight) || 0,
      strongFoot: formData.strongFoot,
      certifications: formData.certifications.filter(c => !!c),
      stadium: formData.stadium,
      foundationYear: formData.foundationYear,
      facilities: formData.facilities,
      bookImageUrls: formData.bookImageUrls.filter(u => !!u),
      videoUrls: formData.videoUrls.filter(v => !!v),
      socialVideoUrls: formData.socialVideoUrls.filter(v => !!v),
      teamHistory: formData.teamHistory
    }, { merge: true });

    toast({
      title: isAdmin ? "Protocolo de Sincronización Completado" : "Perfil Actualizado",
      description: isEditingOther ? `Los datos del sujeto ${userData?.name} han sido actualizados.` : "Cambios aplicados correctamente."
    });
  };

  const addSeason = () => {
    if (!isElite && formData.teamHistory.length >= 1) {
      toast({ variant: "destructive", title: "Límite Alcanzado", description: "Suscripción Elite necesaria para más de 1 temporada." });
      return;
    }
    if (formData.newSeason.club.trim() && formData.newSeason.season.trim()) {
      const updatedHistory = [{ ...formData.newSeason }, ...formData.teamHistory];
      updatedHistory.sort((a, b) => b.season.localeCompare(a.season));
      setFormData(prev => ({ 
        ...prev, 
        teamHistory: updatedHistory, 
        newSeason: { 
          season: '', club: '', position: '', goals: 0, assists: 0, matches: 0,
          league: '', leaguePosition: '', promotion: 'No', wins: 0, draws: 0, losses: 0
        } 
      }));
    }
  };

  if (isAuthLoading || isUserLoading || isProfileLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-primary font-black animate-pulse uppercase tracking-[0.3em] text-xs">Accediendo al Núcleo...</div>;

  return (
    <div className="min-h-screen bg-[#030712] text-white pb-32">
      <TopNav />
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className={cn("text-5xl font-bold font-headline tracking-tighter", isAdmin && "text-red-500 uppercase italic")}>
              {isAdmin && !isEditingOther ? 'Maestro de Red' : 'Editor de Perfil'}
            </h1>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
              {isAdmin && !isEditingOther ? 'Terminal de Control Total' : (isEditingOther ? `Supervisión de Sujeto: ${userData?.name}` : 'Análisis de Potencial')}
            </p>
          </div>
          
          <div className={cn(
            "flex-1 max-w-md border p-6 rounded-[2rem] space-y-4",
            isAdmin ? "bg-red-500/5 border-red-500/20" : "bg-[#111827] border-white/5"
          )}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-white flex items-center gap-2">
                {isAdmin ? <ShieldAlert className="w-4 h-4 text-red-500" /> : <Zap className="w-4 h-4 text-primary fill-primary" />}
                {isAdmin && !isEditingOther ? 'Autoridad' : 'Score Scouting'}
              </span>
              <Badge className={cn("border-none text-xs", isAdmin ? "bg-red-500 text-white" : "bg-primary/10 text-primary")}>
                {isAdmin && !isEditingOther ? 'ROOT' : `${currentScore} PTS`}
              </Badge>
            </div>
            <Progress value={currentScore} className={cn("h-2", isAdmin ? "bg-red-500/10" : "bg-white/5")} />
          </div>
        </div>

        {isEditingOther && (
          <Card className="bg-red-500/10 border-red-500/30 rounded-3xl p-6 flex items-center gap-4">
             <Bot className="w-8 h-8 text-red-500" />
             <div className="space-y-1">
               <h3 className="font-bold text-red-500 uppercase text-xs tracking-widest">Aviso de Edición Externa</h3>
               <p className="text-xs text-muted-foreground">Estás modificando los datos de <b>{userData?.name}</b> con privilegios de administrador.</p>
             </div>
          </Card>
        )}

        <div className="space-y-8">
          {/* IDENTIDAD */}
          <Card className={cn("rounded-[2.5rem]", isAdmin ? "bg-[#1a0a0a] border-red-500/10" : "card-elite")}>
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                {isAdmin ? <Server className="w-6 h-6 text-red-500" /> : <UserIcon className="w-6 h-6" />}
                <h2 className={cn("text-2xl font-bold font-headline uppercase italic", isAdmin && "text-red-500")}>
                  {isAdmin && !isEditingOther ? 'Identidad de Sistema' : 'Datos del Sujeto'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Nombre Completo</Label>
                  <Input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl px-6" />
                </div>
                {(!isAdmin || isEditingOther) && (
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">País</Label>
                    <Select value={formData.country || 'España'} onValueChange={v => setFormData({...formData, country: v, province: ''})}>
                      <SelectTrigger className="h-14 bg-white/5 border-none rounded-2xl px-6"><SelectValue placeholder="País" /></SelectTrigger>
                      <SelectContent className="bg-[#111827] border-white/10 text-white">
                        {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {(!isAdmin || isEditingOther) && !isTargetClub && (
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Edad</Label>
                    <Input type="number" value={formData.age || ''} onChange={e => setFormData({...formData, age: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl px-6" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Movilidad</Label>
                  <Select value={formData.mobility || 'Nacional'} onValueChange={v => setFormData({...formData, mobility: v})}>
                    <SelectTrigger className="h-14 bg-white/5 border-none rounded-2xl px-6"><SelectValue placeholder="Movilidad" /></SelectTrigger>
                    <SelectContent className="bg-[#111827] border-white/10 text-white">
                      <SelectItem value="Local">Local</SelectItem>
                      <SelectItem value="Nacional">Nacional</SelectItem>
                      <SelectItem value="Internacional">Internacional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PROTOCOLO / BIO */}
          <Card className={cn("rounded-[2.5rem]", isAdmin ? "bg-[#1a0a0a] border-red-500/10" : "card-elite")}>
            <CardContent className="p-10 space-y-6">
              <div className="flex items-center space-x-3 text-primary">
                <FileText className={cn("w-6 h-6", isAdmin && "text-red-500")} />
                <h2 className={cn("text-2xl font-bold font-headline uppercase italic", isAdmin && "text-red-500")}>
                  {isAdmin && !isEditingOther ? 'Protocolo de Mando' : (isTargetClub ? 'Visión e Historia' : 'Biografía')}
                </h2>
              </div>
              <Textarea 
                value={formData.bio || ''} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
                className="min-h-[150px] bg-white/5 border-none rounded-[2rem] p-6 text-lg" 
                placeholder={isAdmin && !isEditingOther ? "Define las reglas del sistema..." : "Trayectoria deportiva..."} 
              />
            </CardContent>
          </Card>

          {/* FICHA TÉCNICA / DATOS CLUB */}
          {(!isAdmin || isEditingOther) && (
            <Card className="card-elite rounded-[2.5rem]">
              <CardContent className="p-10 space-y-8">
                <div className="flex items-center space-x-3 text-primary">
                  {isTargetClub ? <Building2 className="w-6 h-6" /> : (isTargetCoach ? <GraduationCap className="w-6 h-6" /> : <Activity className="w-6 h-6" />)}
                  <h2 className="text-2xl font-bold font-headline uppercase italic">
                    {isTargetClub ? 'Infraestructura y Categoría' : 'Ficha Técnica'}
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {isTargetClub ? (
                    <>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Categoría Principal</Label>
                        <Input value={formData.position || ''} onChange={e => setFormData({...formData, position: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl px-6" placeholder="Ej: 2ª RFEF" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Estadio / Sede</Label>
                        <Input value={formData.stadium || ''} onChange={e => setFormData({...formData, stadium: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl px-6" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Fundación (Año)</Label>
                        <Input value={formData.foundationYear || ''} onChange={e => setFormData({...formData, foundationYear: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl px-6" placeholder="Ej: 1923" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Instalaciones</Label>
                        <Input value={formData.facilities || ''} onChange={e => setFormData({...formData, facilities: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl px-6" placeholder="Ej: Ciudad Deportiva" />
                      </div>
                    </>
                  ) : isTargetCoach ? (
                    formData.certifications.map((cert, i) => (
                      <div key={i} className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Titulación {i+1}</Label>
                        <Input value={cert} onChange={e => {
                          const updated = [...formData.certifications];
                          updated[i] = e.target.value;
                          setFormData({...formData, certifications: updated});
                        }} className="h-14 bg-white/5 border-none rounded-2xl px-6" />
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Posición</Label>
                        <Input value={formData.position || ''} onChange={e => setFormData({...formData, position: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl px-6" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Pierna</Label>
                        <Input value={formData.strongFoot || ''} onChange={e => setFormData({...formData, strongFoot: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl px-6" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Altura (cm)</Label>
                        <Input type="number" value={formData.height || ''} onChange={e => setFormData({...formData, height: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl px-6" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Peso (kg)</Label>
                        <Input type="number" value={formData.weight || ''} onChange={e => setFormData({...formData, weight: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl px-6" />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* CARRERA / HISTORIAL */}
          {(!isAdmin || isEditingOther) && (
            <Card className="card-elite rounded-[2.5rem]">
              <CardContent className="p-10 space-y-8">
                <div className="flex items-center space-x-3 text-primary">
                  <Trophy className="w-6 h-6" />
                  <h2 className="text-2xl font-bold font-headline uppercase italic">
                    {isTargetClub ? 'Palmarés y Logros' : 'Historial de Carrera'}
                  </h2>
                </div>
                
                <div className="space-y-8">
                  {/* FORMULARIO DE NUEVA TEMPORADA */}
                  <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Registrar Nueva Etapa
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Temporada</Label>
                        <Input 
                          placeholder="Ej: 23/24" 
                          value={formData.newSeason.season} 
                          onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, season: e.target.value}})} 
                          className="bg-white/5 border-none rounded-xl h-11" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">{isTargetClub ? 'Competición' : 'Club / Entidad'}</Label>
                        <Input 
                          placeholder={isTargetClub ? "Ej: 1ª RFEF" : "Nombre del club"} 
                          value={formData.newSeason.club} 
                          onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, club: e.target.value}})} 
                          className="bg-white/5 border-none rounded-xl h-11" 
                        />
                      </div>
                      
                      {isTargetCoach || isTargetClub ? (
                        <>
                          <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">{isTargetClub ? 'Resultado Final' : 'Liga / Competición'}</Label>
                            <Input 
                              placeholder={isTargetClub ? "Ej: Campeón" : "Ej: 1ª RFEF"} 
                              value={formData.newSeason.league || ''} 
                              onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, league: e.target.value}})} 
                              className="bg-white/5 border-none rounded-xl h-11" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">{isTargetClub ? 'Hito / Ascenso' : 'Posición Final'}</Label>
                            <Input 
                              placeholder={isTargetClub ? "Ej: Ascenso a 2ª" : "Ej: 3º"} 
                              value={formData.newSeason.leaguePosition || ''} 
                              onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, leaguePosition: e.target.value}})} 
                              className="bg-white/5 border-none rounded-xl h-11" 
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Posición en Campo</Label>
                            <Input 
                              placeholder="Ej: Delantero" 
                              value={formData.newSeason.position || ''} 
                              onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, position: e.target.value}})} 
                              className="bg-white/5 border-none rounded-xl h-11" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Partidos Jugados</Label>
                            <Input 
                              type="number"
                              placeholder="0" 
                              value={formData.newSeason.matches || 0} 
                              onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, matches: parseInt(e.target.value) || 0}})} 
                              className="bg-white/5 border-none rounded-xl h-11" 
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {isTargetCoach || isTargetClub ? (
                        <>
                          <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Victorias</Label>
                            <Input type="number" value={formData.newSeason.wins || 0} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, wins: parseInt(e.target.value) || 0}})} className="bg-white/5 border-none rounded-xl h-11" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Empates</Label>
                            <Input type="number" value={formData.newSeason.draws || 0} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, draws: parseInt(e.target.value) || 0}})} className="bg-white/5 border-none rounded-xl h-11" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Derrotas</Label>
                            <Input type="number" value={formData.newSeason.losses || 0} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, losses: parseInt(e.target.value) || 0}})} className="bg-white/5 border-none rounded-xl h-11" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">{isTargetClub ? 'Logro Especial' : 'Ascenso'}</Label>
                            <Select value={formData.newSeason.promotion || 'No'} onValueChange={v => setFormData({...formData, newSeason: {...formData.newSeason, promotion: v}})}>
                              <SelectTrigger className="bg-white/5 border-none rounded-xl h-11"><SelectValue /></SelectTrigger>
                              <SelectContent className="bg-[#111827] border-white/10 text-white">
                                <SelectItem value="No">No</SelectItem>
                                <SelectItem value="Sí">Sí</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Goles</Label>
                            <Input type="number" value={formData.newSeason.goals || 0} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, goals: parseInt(e.target.value) || 0}})} className="bg-white/5 border-none rounded-xl h-11" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-bold text-muted-foreground ml-1">Asistencias</Label>
                            <Input type="number" value={formData.newSeason.assists || 0} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, assists: parseInt(e.target.value) || 0}})} className="bg-white/5 border-none rounded-xl h-11" />
                          </div>
                        </>
                      )}
                      
                      <div className="col-span-2 md:col-span-1 lg:col-start-6 flex items-end">
                        <Button 
                          onClick={addSeason} 
                          className="w-full h-11 bg-primary text-background font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-primary/90 shadow-lg"
                        >
                          REGISTRAR ETAPA
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* LISTADO DE TEMPORADAS */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2">Trayectoria Registrada</h3>
                    {formData.teamHistory.length === 0 ? (
                      <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-[2rem] opacity-30">
                        <p className="text-[10px] font-bold uppercase tracking-widest">Sin registros previos</p>
                      </div>
                    ) : (
                      formData.teamHistory.map((item, idx) => (
                        <div key={idx} className="group relative p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-primary/20 transition-all">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="bg-primary/10 px-3 py-1 rounded-full">
                                <span className="text-primary font-black text-[10px]">{item.season}</span>
                              </div>
                              <div>
                                <p className="font-bold text-lg leading-none">{item.club}</p>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">
                                  {isTargetCoach || isTargetClub ? (item.league || 'Competición') : (item.position || 'Posición')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                              {isTargetCoach || isTargetClub ? (
                                <div className="flex gap-4 text-center">
                                   <div><p className="text-[8px] font-black text-muted-foreground uppercase">PG</p><p className="text-xs font-bold">{item.wins || 0}</p></div>
                                   <div><p className="text-[8px] font-black text-muted-foreground uppercase">PE</p><p className="text-xs font-bold">{item.draws || 0}</p></div>
                                   <div><p className="text-[8px] font-black text-muted-foreground uppercase">PP</p><p className="text-xs font-bold">{item.losses || 0}</p></div>
                                </div>
                              ) : (
                                <div className="flex gap-4 text-center">
                                   <div><p className="text-[8px] font-black text-muted-foreground uppercase">PJ</p><p className="text-xs font-bold">{item.matches || 0}</p></div>
                                   <div><p className="text-[8px] font-black text-muted-foreground uppercase">G</p><p className="text-xs font-bold text-primary">{item.goals || 0}</p></div>
                                   <div><p className="text-[8px] font-black text-muted-foreground uppercase">A</p><p className="text-xs font-bold">{item.assists || 0}</p></div>
                                </div>
                              )}
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setFormData({...formData, teamHistory: formData.teamHistory.filter((_, i) => i !== idx)})} 
                                className="h-10 w-10 rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Button 
          onClick={handleSave} 
          className={cn(
            "fixed bottom-10 right-10 z-50 h-20 px-12 rounded-[2.5rem] font-black uppercase tracking-widest transition-all",
            isAdmin ? "bg-red-500 text-white shadow-[0_0_50px_rgba(239,68,68,0.4)] hover:bg-red-600" : "bg-primary text-background shadow-[0_0_50px_rgba(234,179,8,0.4)]"
          )}
        >
          {isAdmin ? <ShieldAlert className="w-6 h-6 mr-3" /> : <Sparkles className="w-6 h-6 mr-3 fill-current" />}
          {isAdmin ? 'SINCRONIZAR NÚCLEO' : 'GUARDAR CAMBIOS'}
        </Button>
      </main>
    </div>
  );
}
