
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
  Bot
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
  // Si hay un editId y somos admin, editamos a ese sujeto, si no, a nosotros mismos
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

  const calculateScore = () => {
    // Si somos admin y editamos nuestro propio perfil (o el sistema de mando)
    if (isAdmin && !isEditingOther) return 100;
    
    // Si editamos a otro o somos usuario normal, calculamos
    let score = 0;
    const isFree = !isElite;

    let basicScore = 0;
    if (formData.name) basicScore += 2;
    if (formData.nationality) basicScore += 2;
    if (formData.country && formData.province) basicScore += 2;
    if (formData.instagram || formData.tiktok || formData.twitter) basicScore += 4;
    score += Math.min(basicScore, 10);

    let moduleScore = 0;
    if (isTargetCoach) {
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

        {isAdmin && !isEditingOther && (
          <Card className="bg-red-500/5 border-red-500/20 rounded-[2rem] p-8">
            <div className="flex items-start gap-4">
               <Terminal className="w-8 h-8 text-red-500 shrink-0" />
               <div className="space-y-2">
                 <h3 className="font-bold text-xl font-headline tracking-tight uppercase text-red-500">Super Administrador Activo</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                   Esta terminal te permite gestionar los parámetros de tu perfil de mando y auditar cualquier nodo de la red SportMatch.
                 </p>
               </div>
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
                {(!isAdmin || isEditingOther) && (
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
                  {isAdmin && !isEditingOther ? 'Protocolo de Mando' : 'Biografía'}
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

          {/* CAMPOS TÉCNICOS SI NO ES ADMIN EDITÁNDOSE A SÍ MISMO */}
          {(!isAdmin || isEditingOther) && (
            <Card className="card-elite rounded-[2.5rem]">
              <CardContent className="p-10 space-y-8">
                <div className="flex items-center space-x-3 text-primary">
                  {isTargetCoach ? <GraduationCap className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                  <h2 className="text-2xl font-bold font-headline uppercase italic">Ficha Técnica</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {isTargetCoach ? (
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

          {(!isAdmin || isEditingOther) && (
            <Card className="card-elite rounded-[2.5rem]">
              <CardContent className="p-10 space-y-8">
                <div className="flex items-center space-x-3 text-primary">
                  <Trophy className="w-6 h-6" />
                  <h2 className="text-2xl font-bold font-headline uppercase italic">Carrera</h2>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-black/20 p-6 rounded-[2rem] items-end">
                    <Input placeholder="Temporada" value={formData.newSeason.season} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, season: e.target.value}})} className="bg-white/5 border-none rounded-xl" />
                    <Input placeholder="Club" value={formData.newSeason.club} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, club: e.target.value}})} className="bg-white/5 border-none rounded-xl" />
                    <Button onClick={addSeason} className="h-10 bg-primary/10 text-primary border border-primary/20 font-black uppercase text-[10px] rounded-xl hover:bg-primary/20">AÑADIR</Button>
                  </div>
                  {formData.teamHistory.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl">
                      <div><p className="font-bold">{item.club} ({item.season})</p></div>
                      <Button variant="ghost" size="icon" onClick={() => setFormData({...formData, teamHistory: formData.teamHistory.filter((_, i) => i !== idx)})} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  ))}
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
