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
  Info,
  Map,
  ShieldAlert,
  Terminal,
  Server
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
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { firestore: db, storage } = useFirebase();
  const { toast } = useToast();

  const isAdmin = user?.email === 'admin01@gmail.com';

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
  const isCoach = userData?.role === 'Coach';

  const calculateScore = () => {
    if (isAdmin) return 100;
    let score = 0;
    const isFree = !isElite;

    let basicScore = 0;
    if (formData.name) basicScore += 2;
    if (formData.nationality) basicScore += 2;
    if (formData.country && formData.province) basicScore += 2;
    if (formData.instagram || formData.tiktok || formData.twitter) basicScore += 4;
    score += Math.min(basicScore, 10);

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

    let mediaScore = 0;
    if (formData.profileImageUrl) mediaScore += 10;
    formData.bookImageUrls.forEach(url => { if (url) mediaScore += 3; });
    formData.videoUrls.forEach(url => { if (url) mediaScore += 3; });
    formData.socialVideoUrls.forEach(url => { if (url) mediaScore += 3; });
    score += Math.min(mediaScore, 25);

    if (!isFree && formData.isAiBio) score += 10;
    else if (formData.bio && formData.bio.length > 20) score += 5;

    if (formData.teamHistory.length > 0) score += 10;

    if (userData?.plan === 'pro') score += 20;
    else if (userData?.plan === 'verified' || userData?.verificationStatus === 'verified') score += 10;

    if (!isFree && (profileData?.analysis || profileData?.summary)) score += 15;

    return Math.min(Math.round(score), 100);
  };

  const currentScore = calculateScore();

  const handleSave = () => {
    if (!user || !userRef || !profileRef) return;

    const primaryCert = formData.certifications.find(c => !!c) || '';

    setDocumentNonBlocking(userRef, {
      name: formData.name,
      province: formData.province,
      country: formData.country,
      nationality: formData.nationality,
      age: parseInt(formData.age) || 0,
      position: isCoach ? primaryCert : formData.position,
      mobility: formData.mobility,
      instagram: formData.instagram,
      tiktok: formData.tiktok,
      twitter: formData.twitter,
      profileImageUrl: formData.profileImageUrl,
      score: currentScore,
      role: isAdmin ? 'Admin' : userData?.role
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
      title: isAdmin ? "Configuración de Sistema Aplicada" : "Perfil Actualizado",
      description: isAdmin ? "Privilegios de administrador sincronizados." : "Tu Score IA es ahora de " + currentScore + " puntos."
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

  if (isAuthLoading || isUserLoading || isProfileLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#030712] text-white pb-32">
      <TopNav />
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className={cn("text-5xl font-bold font-headline tracking-tighter", isAdmin && "text-red-500 uppercase italic")}>
              {isAdmin ? 'Maestro de Red' : 'Mi Perfil'}
            </h1>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
              {isAdmin ? 'Acceso Total al Núcleo de SportMatch' : 'Análisis de Potencial IA'}
            </p>
          </div>
          
          <div className={cn(
            "flex-1 max-w-md border p-6 rounded-[2rem] space-y-4",
            isAdmin ? "bg-red-500/5 border-red-500/20" : "bg-[#111827] border-white/5"
          )}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-white flex items-center gap-2">
                {isAdmin ? <ShieldAlert className="w-4 h-4 text-red-500" /> : <Zap className="w-4 h-4 text-primary fill-primary" />}
                {isAdmin ? 'Autoridad de Sistema' : 'Score de Scouting'}
              </span>
              <Badge className={cn("border-none text-xs", isAdmin ? "bg-red-500 text-white" : "bg-primary/10 text-primary")}>
                {isAdmin ? 'NIVEL OMEGA' : `PUNTOS: ${currentScore}`}
              </Badge>
            </div>
            <Progress value={currentScore} className={cn("h-2", isAdmin ? "bg-red-500/10" : "bg-white/5")} />
            <div className="flex justify-between text-[8px] text-muted-foreground font-bold uppercase tracking-tighter italic">
               <span>{isAdmin ? 'Permisos: Root' : `Perfil Técnico: ${Math.min(currentScore - (isElite && (profileData?.analysis || profileData?.summary) ? 15 : 0), 85)}/85`}</span>
               <span>{isAdmin ? 'Acceso: Global' : `Análisis IA: ${isElite && (profileData?.analysis || profileData?.summary) ? 15 : 0}/15`}</span>
            </div>
          </div>
        </div>

        {isAdmin && (
          <Card className="bg-red-500/5 border-red-500/20 rounded-[2rem] p-8">
            <div className="flex items-start gap-4">
               <div className="bg-red-500/10 p-4 rounded-2xl">
                 <Terminal className="w-8 h-8 text-red-500" />
               </div>
               <div className="space-y-2">
                 <h3 className="font-bold text-xl font-headline tracking-tight uppercase text-red-500">Panel Super Administrador Activo</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                   Esta cuenta tiene privilegios para visualizar, editar y eliminar cualquier dato en la base de datos de producción. 
                   Utiliza esta terminal para gestionar la salud de la red y verificar identidades de alto nivel.
                 </p>
               </div>
            </div>
          </Card>
        )}

        <div className="space-y-8">
          {/* DATOS BÁSICOS (ESTILIZADOS PARA ADMIN) */}
          <Card className={cn("rounded-[2.5rem]", isAdmin ? "bg-[#1a0a0a] border-red-500/10" : "bg-[#111827] border-[#1F2937]")}>
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-primary">
                  {isAdmin ? <Server className="w-6 h-6 text-red-500" /> : <Globe className="w-6 h-6" />}
                  <h2 className={cn("text-2xl font-bold font-headline uppercase italic", isAdmin && "text-red-500")}>
                    {isAdmin ? 'Identidad de Sistema' : 'Datos Básicos'}
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Nombre Completo</Label>
                  <Input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl px-6" />
                </div>
                {!isAdmin && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Nacionalidad</Label>
                      <div className="relative">
                        <Flag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
                        <Input value={formData.nationality || ''} onChange={e => setFormData({...formData, nationality: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl pl-12 pr-6" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Edad</Label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
                        <Input type="number" value={formData.age || ''} onChange={e => setFormData({...formData, age: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl pl-12 pr-6" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">País</Label>
                      <Select value={formData.country || 'España'} onValueChange={v => setFormData({...formData, country: v, province: ''})}>
                        <SelectTrigger className="h-14 bg-white/5 border-none rounded-2xl px-6"><SelectValue placeholder="País" /></SelectTrigger>
                        <SelectContent className="bg-[#111827] border-white/10 text-white">
                          {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">{isAdmin ? 'Nivel de Acceso' : 'Movilidad Geográfica'}</Label>
                  {isAdmin ? (
                    <div className="h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center px-6 text-red-500 font-bold uppercase tracking-widest text-xs">
                       ROOT / OVERRIDE_ALL
                    </div>
                  ) : (
                    <Select value={formData.mobility || 'Nacional'} onValueChange={v => setFormData({...formData, mobility: v})}>
                      <SelectTrigger className="h-14 bg-white/5 border-none rounded-2xl px-6">
                        <div className="flex items-center gap-2">
                          <Map className="w-4 h-4 text-muted-foreground" />
                          <SelectValue placeholder="Selecciona movilidad" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-[#111827] border-white/10 text-white">
                        <SelectItem value="Local">Local</SelectItem>
                        <SelectItem value="Nacional">Nacional</SelectItem>
                        <SelectItem value="Internacional">Internacional</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BIOGRAFÍA / DESCRIPCIÓN */}
          <Card className={cn("rounded-[2.5rem]", isAdmin ? "bg-[#1a0a0a] border-red-500/10" : "bg-[#111827] border-[#1F2937]")}>
            <CardContent className="p-10 space-y-6">
              <div className="flex items-center space-x-3 text-primary">
                <FileText className={cn("w-6 h-6", isAdmin && "text-red-500")} />
                <h2 className={cn("text-2xl font-bold font-headline uppercase italic", isAdmin && "text-red-500")}>
                  {isAdmin ? 'Protocolo de Mando' : 'Biografía Profesional'}
                </h2>
              </div>
              <Textarea 
                value={formData.bio || ''} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
                className="min-h-[150px] bg-white/5 border-none rounded-[2rem] p-6 text-lg" 
                placeholder={isAdmin ? "Define las guías de administración..." : "Describe tu trayectoria..."} 
              />
            </CardContent>
          </Card>

          {/* OTRAS SECCIONES SOLO SI NO ES ADMIN */}
          {!isAdmin && (
            <>
              {/* FICHA TÉCNICA */}
              <Card className="bg-[#111827] border-[#1F2937] rounded-[2.5rem]">
                <CardContent className="p-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-primary">
                      {isCoach ? <GraduationCap className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                      <h2 className="text-2xl font-bold font-headline uppercase italic">
                        {isCoach ? 'Titulaciones y Experiencia' : 'Física y Técnica'}
                      </h2>
                    </div>
                  </div>
                  {isCoach ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {formData.certifications.map((cert, i) => (
                        <div key={i} className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Titulación {i + 1}</Label>
                          <Select 
                            value={cert || ""} 
                            onValueChange={v => {
                              const updated = [...formData.certifications];
                              updated[i] = v;
                              setFormData({...formData, certifications: updated});
                            }}
                          >
                            <SelectTrigger className="h-14 bg-white/5 border-none rounded-2xl px-6">
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111827] border-white/10 text-white">
                              <SelectItem value="UEFA PRO">UEFA PRO</SelectItem>
                              <SelectItem value="UEFA A">UEFA A</SelectItem>
                              <SelectItem value="UEFA B">UEFA B</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {['height', 'weight'].map((key) => (
                        <div key={key} className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">{key === 'height' ? 'Altura' : 'Peso'}</Label>
                          <Input type="number" value={(formData as any)[key] || ''} onChange={e => setFormData({...formData, [key]: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl px-6" />
                        </div>
                      ))}
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Pierna</Label>
                        <Select value={formData.strongFoot || ""} onValueChange={v => setFormData({...formData, strongFoot: v})}>
                          <SelectTrigger className="h-14 bg-white/5 border-none rounded-2xl px-6"><SelectValue placeholder="Pierna" /></SelectTrigger>
                          <SelectContent className="bg-[#111827] border-white/10 text-white">
                            <SelectItem value="Derecha">Derecha</SelectItem>
                            <SelectItem value="Izquierda">Izquierda</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-2">Posición</Label>
                        <Input value={formData.position || ''} onChange={e => setFormData({...formData, position: e.target.value})} className="h-14 bg-white/5 border-none rounded-2xl px-6" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* HISTORIAL */}
              <Card className="bg-[#111827] border-[#1F2937] rounded-[2.5rem]">
                <CardContent className="p-10 space-y-8">
                  <div className="flex items-center space-x-3 text-primary">
                    <Trophy className="w-6 h-6" />
                    <h2 className="text-2xl font-bold font-headline uppercase italic">Historial Deportivo</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-black/20 p-6 rounded-[2rem] items-end">
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
            </>
          )}
        </div>

        <Button 
          onClick={handleSave} 
          className={cn(
            "fixed bottom-10 right-10 z-50 h-20 px-12 rounded-[2.5rem] font-black uppercase tracking-widest transition-transform group",
            isAdmin ? "bg-red-500 text-white shadow-[0_0_50px_rgba(239,68,68,0.4)] hover:bg-red-600" : "bg-primary text-background shadow-[0_0_50px_rgba(234,179,8,0.4)]"
          )}
        >
          {isAdmin ? <ShieldAlert className="w-6 h-6 mr-3" /> : <Sparkles className="w-6 h-6 mr-3 fill-current" />}
          {isAdmin ? 'SINCRONIZAR NÚCLEO' : 'GUARDAR PERFIL'}
        </Button>
      </main>
    </div>
  );
}