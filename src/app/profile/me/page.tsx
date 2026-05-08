
"use client";

import { useState, useEffect } from 'react';
import { 
  Globe, 
  FileText, 
  Sparkles, 
  MapPin,
  ExternalLink,
  Plus,
  Trash2,
  Camera,
  User as UserIcon,
  Ruler,
  Weight as WeightIcon,
  Calendar,
  Footprints,
  Upload,
  Lock,
  Trophy,
  Loader2,
  Activity,
  Flag,
  Star,
  Zap,
  Award,
  Pencil,
  Youtube,
  Instagram,
  Twitter,
  Music2,
  ChevronRight,
  Bot,
  GraduationCap,
  Medal,
  Info
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
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TopNav } from '@/components/navigation/top-nav';
import { useUser, useFirestore, useFirebase, useDoc, setDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { COUNTRIES, GET_LOCATION_LIST, GET_LOCATION_LABEL } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SeasonEntry {
  season: string;
  club: string;
  position?: string; // For players
  goals?: number; // For players
  assists?: number; // For players
  matches?: number; // For players
  league?: string; // For coaches
  leaguePosition?: string; // For coaches
  promotion?: string; // For coaches ("Sí" / "No")
  wins?: number; // For coaches
  draws?: number; // For coaches
  losses?: number; // For coaches
}

export default function MyProfilePage() {
  const router = useRouter();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { firestore: db, storage } = useFirebase();
  const { toast } = useToast();

  const userRef = useMemoFirebase(() => {
    return user ? doc(db, 'users', user.uid) : null;
  }, [db, user?.uid]);

  const profileRef = useMemoFirebase(() => {
    return user ? doc(db, 'userProfiles', user.uid) : null;
  }, [db, user?.uid]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userRef);
  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef);

  const [formData, setFormData] = useState({
    name: '',
    province: '',
    country: 'España',
    nationality: '',
    age: '',
    position: '',
    bio: '',
    isAiBio: false,
    height: '',
    weight: '',
    strongFoot: '',
    certifications: ['', '', ''], // For coaches
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

  const [uploading, setUploading] = useState<string | null>(null);

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

  const isElite = userData?.verificationStatus === 'verified' || userData?.plan === 'verified' || userData?.plan === 'pro';
  const isCoach = userData?.role === 'Coach';

  const calculateScore = () => {
    let score = 0;
    const isFree = !isElite;

    // 1. Datos Básicos (Máx 10)
    let basicScore = 0;
    if (formData.name) basicScore += 2;
    if (formData.nationality) basicScore += 2;
    if (formData.country && formData.province) basicScore += 2;
    if (formData.instagram || formData.tiktok || formData.twitter) basicScore += 4;
    score += Math.min(basicScore, 10);

    // 2. Física y Técnica / Titulaciones (Máx 10)
    let moduleScore = 0;
    if (isCoach) {
      formData.certifications.forEach(c => { if (c) moduleScore += 3.4; });
    } else {
      if (formData.age) moduleScore += 2;
      if (formData.height) moduleScore += 2;
      if (formData.weight) moduleScore += 2;
      if (formData.position) moduleScore += 2;
      if (formData.strongFoot) moduleScore += 2;
    }
    score += Math.min(moduleScore, 10);

    // 3. Galería Multimedia (Máx 25)
    let mediaScore = 0;
    if (formData.profileImageUrl) mediaScore += 10;
    formData.bookImageUrls.forEach(url => { if (url) mediaScore += 3; });
    formData.videoUrls.forEach(url => { if (url) mediaScore += 3; });
    formData.socialVideoUrls.forEach(url => { if (url) mediaScore += 3; });
    score += Math.min(mediaScore, 25);

    // 4. Biografía Profesional (Máx 10)
    if (!isFree && formData.isAiBio) {
      score += 10;
    } else if (formData.bio && formData.bio.length > 20) {
      score += 5;
    }

    // 5. Historial Deportivo (Máx 10)
    if (formData.teamHistory.length > 0) score += 10;

    // 6. Plan de Cuenta (Verificado +10, Pro +20)
    if (userData?.plan === 'pro') score += 20;
    else if (userData?.plan === 'verified' || userData?.verificationStatus === 'verified') score += 10;

    // 7. Análisis de SportMatch (IA) (Máx 15) - SOLO NO FREE
    if (!isFree && (profileData?.analysis || profileData?.summary)) {
      score += 15;
    }

    return Math.min(Math.round(score), 100);
  };

  const currentScore = calculateScore();

  const handleSave = () => {
    if (!user || !userRef || !profileRef) return;

    // Sincronizar la titulación principal como 'position' para el ranking de entrenadores
    const primaryCert = formData.certifications.find(c => !!c) || '';

    setDocumentNonBlocking(userRef, {
      name: formData.name,
      province: formData.province,
      country: formData.country,
      nationality: formData.nationality,
      age: parseInt(formData.age) || 0,
      position: isCoach ? primaryCert : formData.position,
      instagram: formData.instagram,
      tiktok: formData.tiktok,
      twitter: formData.twitter,
      profileImageUrl: formData.profileImageUrl,
      score: currentScore
    }, { merge: true });

    setDocumentNonBlocking(profileRef, {
      id: user.uid,
      userId: user.uid,
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
      title: "Perfil Actualizado",
      description: "Tu Score IA es ahora de " + currentScore + " puntos."
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'book', index?: number) => {
    const file = e.target.files?.[0];
    if (!file || !user || !storage) return;

    if (type === 'book' && !isElite) {
      toast({ variant: "destructive", title: "Acceso Denegado", description: "El Book multimedia es exclusivo para planes Verificados o Pro." });
      return;
    }

    const uploadKey = type === 'profile' ? 'profile-main' : `book-${index}`;
    setUploading(uploadKey);

    try {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `USUARIOS/${user.uid}/${fileName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      if (type === 'profile') setFormData(prev => ({ ...prev, profileImageUrl: url }));
      else if (type === 'book' && index !== undefined) {
        const updated = [...formData.bookImageUrls];
        updated[index] = url;
        setFormData(prev => ({ ...prev, bookImageUrls: updated }));
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo subir la imagen." });
    } finally {
      setUploading(null);
    }
  };

  const addSeason = () => {
    if (!isElite && formData.teamHistory.length >= 1) {
      toast({ variant: "destructive", title: "Límite Alcanzado", description: "El plan gratuito solo permite registrar 1 temporada." });
      return;
    }
    if (formData.newSeason.club.trim() && formData.newSeason.season.trim()) {
      const updatedHistory = [{ ...formData.newSeason }, ...formData.teamHistory];
      updatedHistory.sort((a, b) => b.season.localeCompare(a.season));
      setFormData(prev => ({ 
        ...prev, 
        teamHistory: updatedHistory, 
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
        } 
      }));
    }
  };

  const toggleAiBio = () => {
    if (!isElite) {
      toast({ variant: "destructive", title: "Función Bloqueada", description: "Solo los perfiles Verificados o Pro pueden solicitar una biografía con IA." });
      return;
    }
    setFormData(prev => ({ ...prev, isAiBio: !prev.isAiBio }));
    toast({
      title: !formData.isAiBio ? "Bonificación IA Activada" : "Bonificación IA Desactivada",
      description: !formData.isAiBio ? "Has ganado +10 puntos por usar IA." : "Se han restado puntos del Score."
    });
  };

  if (isAuthLoading || isUserLoading || isProfileLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#030712] text-white pb-32">
      <TopNav />
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold font-headline tracking-tighter">Mi Perfil</h1>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Análisis de Potencial IA</p>
          </div>
          <div className="flex-1 max-w-md bg-[#111827] border border-white/5 p-6 rounded-[2rem] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary fill-primary" /> Score de Scouting
              </span>
              <Badge className="bg-primary/10 text-primary border-none text-xs">PUNTOS: {currentScore}</Badge>
            </div>
            <Progress value={currentScore} className="h-2 bg-white/5" />
            <div className="flex justify-between text-[8px] text-muted-foreground font-bold uppercase tracking-tighter italic">
               <span>Perfil Técnico: {Math.min(currentScore - (isElite && (profileData?.analysis || profileData?.summary) ? 15 : 0), 85)}/85</span>
               <span>Análisis IA: {isElite && (profileData?.analysis || profileData?.summary) ? 15 : 0}/15</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* DATOS BÁSICOS */}
          <Card className="bg-[#111827] border-[#1F2937] rounded-[2.5rem]">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-primary">
                  <Globe className="w-6 h-6" />
                  <h2 className="text-2xl font-bold font-headline uppercase italic">Datos Básicos</h2>
                </div>
                <Badge variant="outline" className="border-primary/20 text-primary text-[8px] font-black">MÁX 10 PTS</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Nombre Completo</Label>
                  <Input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="h-14 bg-[#1F2937]/50 border-none rounded-2xl px-6" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Nacionalidad</Label>
                  <div className="relative">
                    <Flag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
                    <Input value={formData.nationality || ''} onChange={e => setFormData({...formData, nationality: e.target.value})} className="h-14 bg-[#1F2937]/50 border-none rounded-2xl pl-12 pr-6" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Edad</Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
                    <Input type="number" value={formData.age || ''} onChange={e => setFormData({...formData, age: e.target.value})} className="h-14 bg-[#1F2937]/50 border-none rounded-2xl pl-12 pr-6" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">País</Label>
                  <Select value={formData.country || 'España'} onValueChange={v => setFormData({...formData, country: v, province: ''})}>
                    <SelectTrigger className="h-14 bg-[#1F2937]/50 border-none rounded-2xl px-6"><SelectValue placeholder="País" /></SelectTrigger>
                    <SelectContent className="bg-[#111827] border-white/10 text-white">
                      {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">{GET_LOCATION_LABEL(formData.country)}</Label>
                  <Select value={formData.province || ''} onValueChange={v => setFormData({...formData, province: v})}>
                    <SelectTrigger className="h-14 bg-[#1F2937]/50 border-none rounded-2xl px-6"><SelectValue placeholder="Zona" /></SelectTrigger>
                    <SelectContent className="bg-[#111827] border-white/10 text-white max-h-60">
                      {GET_LOCATION_LIST(formData.country).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/5">
                {['instagram', 'tiktok', 'twitter'].map((social) => (
                  <div key={social} className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">{social.toUpperCase()}</Label>
                    <Input placeholder="@usuario" value={(formData as any)[social] || ''} onChange={e => setFormData({...formData, [social]: e.target.value})} className="h-14 bg-[#1F2937]/50 border-none rounded-2xl px-6" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* BIOGRAFÍA CON IA */}
          <Card className="bg-[#111827] border-[#1F2937] rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-primary">
                  <FileText className="w-6 h-6" />
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold font-headline uppercase italic">Biografía Profesional</h2>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-primary/60 hover:text-primary hover:bg-primary/10">
                          <Info className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-[#111827] border-white/10 text-white p-6 rounded-2xl">
                        <div className="space-y-4 text-xs">
                          <h4 className="font-black text-primary uppercase tracking-widest border-b border-white/10 pb-2">Guía Táctica de Biografía</h4>
                          <div className="space-y-3">
                            <div>
                              <p className="font-bold text-primary/80 mb-1">1. Perfil y Filosofía</p>
                              <p className="text-muted-foreground">Definición táctica (ej. juego asociativo, bloque bajo y contraataque) y tus principios innegociables en el campo.</p>
                            </div>
                            <div>
                              <p className="font-bold text-primary/80 mb-1">2. Metodología de Trabajo</p>
                              <p className="text-muted-foreground">Diseño de sesiones diarias y uso de tecnología (videoanálisis, datos y control de cargas).</p>
                            </div>
                            <div>
                              <p className="font-bold text-primary/80 mb-1">3. Gestión de Talento</p>
                              <p className="text-muted-foreground">Promoción de jóvenes (cantera) y estilo de liderazgo (autoritario, democrático, motivador).</p>
                            </div>
                            <div>
                              <p className="font-bold text-primary/80 mb-1">4. Staff y Estructura</p>
                              <p className="text-muted-foreground">Reparto de tareas con asistentes y coordinación con la dirección deportiva del club.</p>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-primary/20 text-primary text-[8px] font-black">
                    {formData.isAiBio ? "MÁX 10 PTS" : "MÁX 5 PTS FREE"}
                  </Badge>
                  {formData.isAiBio && <Badge className="bg-primary text-background text-[8px] font-black">+10 PTS IA</Badge>}
                </div>
              </div>
              <Textarea 
                value={formData.bio || ''} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
                className="min-h-[150px] bg-[#1F2937]/50 border-none rounded-[2rem] p-6 text-lg focus:ring-1 focus:ring-primary/40" 
                placeholder="Describe tu trayectoria, puntos fuertes y objetivos..." 
              />
              <Button 
                onClick={toggleAiBio} 
                variant={formData.isAiBio ? "default" : "outline"}
                disabled={!isElite}
                className={cn(
                  "w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2",
                  formData.isAiBio ? "bg-primary text-background" : "border-primary/20 text-primary hover:bg-primary/5",
                  !isElite && "opacity-50 cursor-not-allowed"
                )}
              >
                {!isElite ? <Lock className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                {formData.isAiBio ? "OPTIMIZADO CON IA ✓" : isElite ? "OPTIMIZAR BIOGRAFÍA CON IA" : "OPTIMIZACIÓN IA (SOLO PRO/VERIFICADO)"}
              </Button>
            </CardContent>
          </Card>

          {/* FICHA TÉCNICA (DINÁMICA: JUGADOR O ENTRENADOR) */}
          <Card className="bg-[#111827] border-[#1F2937] rounded-[2.5rem]">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-primary">
                  {isCoach ? <GraduationCap className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                  <h2 className="text-2xl font-bold font-headline uppercase italic">
                    {isCoach ? 'Titulaciones y Experiencia' : 'Física y Técnica'}
                  </h2>
                </div>
                <Badge variant="outline" className="border-primary/20 text-primary text-[8px] font-black">MÁX 10 PTS</Badge>
              </div>

              {isCoach ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {formData.certifications.map((cert, i) => (
                    <div key={i} className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Titulación {i + 1}</Label>
                      <Select 
                        value={cert} 
                        onValueChange={v => {
                          const updated = [...formData.certifications];
                          updated[i] = v;
                          setFormData({...formData, certifications: updated});
                        }}
                      >
                        <SelectTrigger className="h-14 bg-[#1F2937]/50 border-none rounded-2xl px-6">
                          <SelectValue placeholder="Selecciona titulación" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111827] border-white/10 text-white">
                          <SelectGroup>
                            <SelectLabel>Licencias Federativas (Ruta UEFA)</SelectLabel>
                            <SelectItem value="UEFA C">UEFA C</SelectItem>
                            <SelectItem value="UEFA B">UEFA B</SelectItem>
                            <SelectItem value="UEFA A">UEFA A</SelectItem>
                            <SelectItem value="UEFA PRO">UEFA PRO</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Títulos Académicos Oficiales</SelectLabel>
                            <SelectItem value="Técnico Deportivo Grado Medio (Ciclo Inicial)">Técnico Deportivo Grado Medio (Ciclo Inicial)</SelectItem>
                            <SelectItem value="Técnico Deportivo Grado Medio (Ciclo Final)">Técnico Deportivo Grado Medio (Ciclo Final)</SelectItem>
                            <SelectItem value="Técnico Deportivo Superior en Fútbol">Técnico Deportivo Superior en Fútbol</SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Especializaciones Técnicas</SelectLabel>
                            <SelectItem value="UEFA Elite Youth A">UEFA Elite Youth A</SelectItem>
                            <SelectItem value="UEFA Goalkeeper B">UEFA Goalkeeper B</SelectItem>
                            <SelectItem value="UEFA Goalkeeper A">UEFA Goalkeeper A</SelectItem>
                            <SelectItem value="Certificación en Videoanálisis y Scouting">Certificación en Videoanálisis y Scouting</SelectItem>
                            <SelectItem value="Especialista en Dirección de Metodología">Especialista en Dirección de Metodología</SelectItem>
                            <SelectItem value="Grado en Ciencias de la Actividad Física y del Deporte (CAFYD)">Grado en Ciencias de la Actividad Física y del Deporte (CAFYD)</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Altura (CM)', key: 'height', type: 'number' },
                    { label: 'Peso (KG)', key: 'weight', type: 'number' }
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">{field.label}</Label>
                      <Input type={field.type} value={(formData as any)[field.key] || ''} onChange={e => setFormData({...formData, [field.key]: e.target.value})} className="h-14 bg-[#1F2937]/50 border-none rounded-2xl px-6" />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Pierna</Label>
                    <Select value={formData.strongFoot || ''} onValueChange={v => setFormData({...formData, strongFoot: v})}>
                      <SelectTrigger className="h-14 bg-[#1F2937]/50 border-none rounded-2xl px-6"><SelectValue placeholder="Pierna" /></SelectTrigger>
                      <SelectContent className="bg-[#111827] border-white/10 text-white">
                        <SelectItem value="Derecha">Derecha</SelectItem>
                        <SelectItem value="Izquierda">Izquierda</SelectItem>
                        <SelectItem value="Ambidiestro">Ambidiestro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Posición</Label>
                    <Input value={formData.position || ''} onChange={e => setFormData({...formData, position: e.target.value})} className="h-14 bg-[#1F2937]/50 border-none rounded-2xl px-6" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* GALERÍA MULTIMEDIA */}
          <Card className="bg-[#111827] border-[#1F2937] rounded-[2.5rem]">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-primary">
                  <Camera className="w-6 h-6" />
                  <h2 className="text-2xl font-bold font-headline uppercase italic">Galería Multimedia</h2>
                </div>
                <Badge variant="outline" className="border-primary/20 text-primary text-[8px] font-black">MÁX 25 PTS</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Foto de Perfil</Label>
                  <div className="flex flex-col gap-4">
                    {formData.profileImageUrl && (
                      <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary/20 group shadow-xl">
                        <Image src={formData.profileImageUrl} alt="Profile preview" fill className="object-cover" />
                        <button 
                          onClick={() => setFormData(prev => ({ ...prev, profileImageUrl: '' }))}
                          className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-6 h-6 text-white" />
                        </button>
                      </div>
                    )}
                    <Button asChild className="h-14 rounded-xl bg-primary text-background font-black uppercase text-[10px] tracking-widest cursor-pointer w-fit">
                      <label htmlFor="p-up">
                        {uploading === 'profile-main' ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                        SUBIR FOTO PERFIL
                      </label>
                    </Button>
                    <input type="file" id="p-up" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'profile')} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Book de Scouting (Solo Pro/Verificado)</Label>{!isElite && <Lock className="w-3 h-3 text-muted-foreground" />}</div>
                  <div className="flex gap-4">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="flex flex-col gap-2">
                        <div className="relative w-20 h-20 rounded-xl border-2 border-dashed border-white/10 overflow-hidden bg-black/40 group">
                          {formData.bookImageUrls[i] ? (
                            <>
                              <Image src={formData.bookImageUrls[i]} alt="Book" fill className="object-cover" />
                              <button 
                                onClick={() => {
                                  const updated = [...formData.bookImageUrls];
                                  updated[i] = '';
                                  setFormData(prev => ({ ...prev, bookImageUrls: updated }));
                                }}
                                className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </>
                          ) : (
                            <label htmlFor={`b-up-${i}`} className="flex flex-col items-center justify-center h-full w-full cursor-pointer hover:bg-white/5 transition-colors">
                              {uploading === `book-${i}` ? <Loader2 className="animate-spin w-4 h-4 text-primary" /> : <Camera className="w-5 h-5 opacity-20" />}
                            </label>
                          )}
                          <input type="file" id={`b-up-${i}`} className="hidden" disabled={!isElite} onChange={e => handleFileUpload(e, 'book', i)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2 ml-2"><Youtube className="text-red-500 w-4 h-4" /> YouTube Highlights (Max 2)</Label>
                  {formData.videoUrls.map((v, i) => (
                    <Input key={i} placeholder="URL YouTube" value={v || ''} disabled={!isElite} onChange={e => { const u = [...formData.videoUrls]; u[i] = e.target.value; setFormData({...formData, videoUrls: u}); }} className="h-12 bg-[#1F2937]/50 border-none rounded-xl px-6" />
                  ))}
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2 ml-2"><Instagram className="text-pink-500 w-4 h-4" /> Clips Sociales (Max 2)</Label>
                  {formData.socialVideoUrls.map((v, i) => (
                    <Input key={i} placeholder="URL IG/TikTok" value={v || ''} disabled={!isElite} onChange={e => { const u = [...formData.socialVideoUrls]; u[i] = e.target.value; setFormData({...formData, socialVideoUrls: u}); }} className="h-12 bg-[#1F2937]/50 border-none rounded-xl px-6" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HISTORIAL DEPORTIVO (DINÁMICO: JUGADOR O ENTRENADOR) */}
          <Card className="bg-[#111827] border-[#1F2937] rounded-[2.5rem]">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-primary">
                  <Trophy className="w-6 h-6" />
                  <h2 className="text-2xl font-bold font-headline uppercase italic">Historial Deportivo</h2>
                </div>
                <Badge variant="outline" className="border-primary/20 text-primary text-[8px] font-black">MÁX 10 PTS</Badge>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-9 gap-4 bg-black/20 p-6 rounded-[2rem] items-end">
                  {isCoach ? (
                    <>
                      <div className="space-y-1">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">Temporada</Label>
                        <Input placeholder="24/25" value={formData.newSeason.season} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, season: e.target.value}})} className="bg-[#030712] border-none rounded-xl h-10 px-4" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">Club</Label>
                        <Input placeholder="Club" value={formData.newSeason.club} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, club: e.target.value}})} className="bg-[#030712] border-none rounded-xl h-10 px-4" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">Campeonato</Label>
                        <Input placeholder="Liga" value={formData.newSeason.league} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, league: e.target.value}})} className="bg-[#030712] border-none rounded-xl h-10 px-4" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">Pos.</Label>
                        <Input placeholder="1º" value={formData.newSeason.leaguePosition} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, leaguePosition: e.target.value}})} className="bg-[#030712] border-none rounded-xl h-10 px-4" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">Asc.</Label>
                        <Select value={formData.newSeason.promotion} onValueChange={v => setFormData({...formData, newSeason: {...formData.newSeason, promotion: v}})}>
                          <SelectTrigger className="bg-[#030712] border-none rounded-xl h-10 px-4"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-[#111827] border-white/10 text-white">
                            <SelectItem value="Sí">Sí</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">PG</Label>
                        <Input type="number" value={formData.newSeason.wins} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, wins: parseInt(e.target.value)}})} className="bg-[#030712] border-none rounded-xl h-10 px-4 text-center" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">PE</Label>
                        <Input type="number" value={formData.newSeason.draws} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, draws: parseInt(e.target.value)}})} className="bg-[#030712] border-none rounded-xl h-10 px-4 text-center" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">PP</Label>
                        <Input type="number" value={formData.newSeason.losses} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, losses: parseInt(e.target.value)}})} className="bg-[#030712] border-none rounded-xl h-10 px-4 text-center" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">Temporada</Label>
                        <Input placeholder="24/25" value={formData.newSeason.season} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, season: e.target.value}})} className="bg-[#030712] border-none rounded-xl h-10 px-4" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">Club</Label>
                        <Input placeholder="Real Madrid" value={formData.newSeason.club} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, club: e.target.value}})} className="bg-[#030712] border-none rounded-xl h-10 px-4" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">Posición</Label>
                        <Input placeholder="Extremo" value={formData.newSeason.position} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, position: e.target.value}})} className="bg-[#030712] border-none rounded-xl h-10 px-4" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">PJ</Label>
                        <Input type="number" value={formData.newSeason.matches} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, matches: parseInt(e.target.value)}})} className="bg-[#030712] border-none rounded-xl h-10 px-4" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">GOLES</Label>
                        <Input type="number" value={formData.newSeason.goals} onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, goals: parseInt(e.target.value)}})} className="bg-[#030712] border-none rounded-xl h-10 px-4" />
                      </div>
                    </>
                  )}
                  <Button onClick={addSeason} className="col-span-full md:col-span-1 h-10 bg-primary/10 text-primary border border-primary/20 font-black uppercase text-[10px] rounded-xl hover:bg-primary/20">AÑADIR</Button>
                </div>

                {formData.teamHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-[#1F2937]/30 rounded-2xl border border-white/5">
                    <div className="flex-1">
                      <div className="flex items-center gap-3"><span className="text-primary font-black text-xs">{item.season}</span><span className="font-bold text-xl">{item.club}</span></div>
                      <p className="text-[10px] text-muted-foreground uppercase font-black">
                        {isCoach ? `${item.league || 'S/C'} • Pos: ${item.leaguePosition || '-'}` : item.position}
                      </p>
                    </div>
                    {isCoach ? (
                      <div className="flex gap-8 mr-8">
                        <div><p className="text-[8px] font-black text-muted-foreground uppercase">Ascenso</p><p className={cn("font-bold text-lg", item.promotion === 'Sí' ? "text-primary" : "text-white")}>{item.promotion}</p></div>
                        <div><p className="text-[8px] font-black text-muted-foreground uppercase">PG</p><p className="font-bold text-lg text-green-400">{item.wins || 0}</p></div>
                        <div><p className="text-[8px] font-black text-muted-foreground uppercase">PE</p><p className="font-bold text-lg">{item.draws || 0}</p></div>
                        <div><p className="text-[8px] font-black text-muted-foreground uppercase">PP</p><p className="font-bold text-lg text-red-400">{item.losses || 0}</p></div>
                      </div>
                    ) : (
                      <div className="flex gap-8 mr-8">
                        {[
                          { label: 'PJ', value: item.matches },
                          { label: 'GOLES', value: item.goals },
                          { label: 'ASIST', value: item.assists }
                        ].map(stat => (
                          <div key={stat.label} className="text-center">
                            <p className="text-[8px] font-black text-muted-foreground uppercase">{stat.label}</p>
                            <p className="font-bold text-lg">{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setFormData({...formData, newSeason: item, teamHistory: formData.teamHistory.filter((_, i) => i !== idx)}); }} className="text-primary"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setFormData({...formData, teamHistory: formData.teamHistory.filter((_, i) => i !== idx)}); }} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Button onClick={handleSave} className="fixed bottom-10 right-10 z-50 h-20 px-12 rounded-[2.5rem] bg-primary text-background font-black uppercase tracking-widest shadow-[0_0_50px_rgba(234,179,8,0.4)] hover:scale-105 transition-transform group">
          <Sparkles className="w-6 h-6 mr-3 fill-current group-hover:animate-pulse" /> GUARDAR PERFIL
        </Button>
      </main>
    </div>
  );
}
