
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
  ChevronRight
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
} from "@/components/ui/select";
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
  position: string;
  goals: number;
  assists: number;
  matches: number;
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
    height: '',
    weight: '',
    strongFoot: '',
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
      matches: 0
    }
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
        height: profileData.height?.toString() || '',
        weight: profileData.weight?.toString() || '',
        strongFoot: profileData.strongFoot || '',
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

  const isElite = userData?.verificationStatus === 'verified' || (userData?.score && userData?.score > 85);

  const calculateScore = () => {
    let score = 0;

    // Datos Básicos (Máx 10)
    let basicScore = 0;
    if (formData.name) basicScore += 2;
    if (formData.nationality) basicScore += 2;
    if (formData.country && formData.province) basicScore += 2;
    if (formData.instagram || formData.tiktok || formData.twitter) basicScore += 4;
    score += Math.min(basicScore, 10);

    // Física y Técnica (Máx 10)
    let physScore = 0;
    if (formData.age) physScore += 2;
    if (formData.height) physScore += 2;
    if (formData.weight) physScore += 2;
    if (formData.position) physScore += 2;
    if (formData.strongFoot) physScore += 2;
    score += Math.min(physScore, 10);

    // Galería Multimedia (Máx 30)
    let mediaScore = 0;
    if (formData.profileImageUrl) mediaScore += 10;
    formData.bookImageUrls.forEach(url => { if (url) mediaScore += 4; });
    formData.videoUrls.forEach(url => { if (url) mediaScore += 4; });
    formData.socialVideoUrls.forEach(url => { if (url) mediaScore += 4; });
    score += Math.min(mediaScore, 30);

    // Biografía Profesional (Máx 10)
    if (formData.bio && formData.bio.length > 50) score += 10;
    else if (formData.bio) score += 5;

    // Historial Deportivo (Máx 10)
    if (formData.teamHistory.length > 0) score += 10;

    // El resto (30 pts) se asigna por Verificación o Análisis IA avanzado
    if (userData?.verificationStatus === 'verified') score += 30;

    return Math.min(score, 100);
  };

  const currentScore = calculateScore();

  const handleSave = () => {
    if (!user || !userRef || !profileRef) return;

    setDocumentNonBlocking(userRef, {
      name: formData.name,
      province: formData.province,
      country: formData.country,
      nationality: formData.nationality,
      age: parseInt(formData.age) || 0,
      position: formData.position,
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
      height: parseFloat(formData.height) || 0,
      weight: parseFloat(formData.weight) || 0,
      strongFoot: formData.strongFoot,
      bookImageUrls: formData.bookImageUrls.filter(u => !!u),
      videoUrls: formData.videoUrls.filter(v => !!v),
      socialVideoUrls: formData.socialVideoUrls.filter(v => !!v),
      teamHistory: formData.teamHistory
    }, { merge: true });

    toast({
      title: "Perfil Actualizado",
      description: "Tu identidad digital ha sido sincronizada con éxito."
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'book', index?: number) => {
    const file = e.target.files?.[0];
    if (!file || !user || !storage) return;

    if (type === 'book' && !isElite) {
      toast({
        variant: "destructive",
        title: "Acceso Denegado",
        description: "El Book multimedia es exclusivo para planes Verificados o Pro."
      });
      return;
    }

    const uploadKey = type === 'profile' ? 'profile-main' : `book-${index}`;
    setUploading(uploadKey);

    try {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `USUARIOS/${user.uid}/${fileName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      if (type === 'profile') {
        setFormData(prev => ({ ...prev, profileImageUrl: url }));
      } else if (type === 'book' && index !== undefined) {
        const updated = [...formData.bookImageUrls];
        updated[index] = url;
        setFormData(prev => ({ ...prev, bookImageUrls: updated }));
      }
      toast({ title: "Subida Completa", description: "Imagen almacenada correctamente." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo subir la imagen." });
    } finally {
      setUploading(null);
    }
  };

  const addSeason = () => {
    if (!isElite && formData.teamHistory.length >= 1) {
      toast({
        variant: "destructive",
        title: "Límite Alcanzado",
        description: "El plan gratuito solo permite registrar 1 temporada. ¡Pásate a Pro para historial ilimitado!"
      });
      return;
    }

    if (formData.newSeason.club.trim() && formData.newSeason.season.trim()) {
      const updatedHistory = [{ ...formData.newSeason }, ...formData.teamHistory];
      updatedHistory.sort((a, b) => b.season.localeCompare(a.season));

      setFormData(prev => ({
        ...prev,
        teamHistory: updatedHistory,
        newSeason: { season: '', club: '', position: '', goals: 0, assists: 0, matches: 0 }
      }));
      toast({ title: "Temporada Añadida", description: "Se ha actualizado tu historial." });
    }
  };

  const removeSeason = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamHistory: prev.teamHistory.filter((_, i) => i !== index)
    }));
  };

  const editSeason = (index: number) => {
    const seasonToEdit = formData.teamHistory[index];
    setFormData(prev => ({
      ...prev,
      newSeason: { ...seasonToEdit },
      teamHistory: prev.teamHistory.filter((_, i) => i !== index)
    }));
  };

  const isLoading = isAuthLoading || isUserLoading || isProfileLoading;

  if (isLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12 pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold font-headline tracking-tighter">Mi Perfil</h1>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Gestión de Identidad Digital</p>
          </div>
          <div className="flex-1 max-w-md bg-[#111827] border border-white/5 p-6 rounded-[2rem] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary fill-primary" /> Score IA
              </span>
              <Badge className="bg-primary/10 text-primary border-none text-xs">SCORE {currentScore}</Badge>
            </div>
            <Progress value={currentScore} className="h-2 bg-white/5" />
          </div>
        </div>

        <div className="space-y-8">
          {/* DATOS BÁSICOS */}
          <Card className="bg-[#111827] border-[#1F2937] rounded-[2.5rem]">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <Globe className="w-6 h-6" />
                <h2 className="text-2xl font-bold font-headline uppercase">Datos Básicos</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Nombre y Apellidos</Label>
                  <Input 
                    value={formData.name || ''} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="h-14 bg-[#1F2937]/50 border-none rounded-2xl pl-6 pr-6" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Nacionalidad</Label>
                  <div className="relative">
                    <Flag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      value={formData.nationality || ''} 
                      onChange={e => setFormData({...formData, nationality: e.target.value})} 
                      className="h-14 bg-[#1F2937]/50 border-none rounded-2xl pl-12 pr-6" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">País (Residencia Actual)</Label>
                  <Select value={formData.country || 'España'} onValueChange={v => setFormData({...formData, country: v, province: ''})}>
                    <SelectTrigger className="h-14 bg-[#1F2937]/50 border-none rounded-2xl pl-6 gap-3">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-primary" />
                        <SelectValue placeholder="País" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-[#111827] border-white/10 text-white">
                      {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">{GET_LOCATION_LABEL(formData.country)}</Label>
                  <Select value={formData.province || ''} onValueChange={v => setFormData({...formData, province: v})}>
                    <SelectTrigger className="h-14 bg-[#1F2937]/50 border-none rounded-2xl pl-6 gap-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-primary" />
                        <SelectValue placeholder="Selecciona zona" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-[#111827] border-white/10 text-white">
                      {GET_LOCATION_LIST(formData.country).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/5">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Instagram</Label>
                  <div className="relative">
                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      placeholder="@usuario" 
                      value={formData.instagram || ''} 
                      onChange={e => setFormData({...formData, instagram: e.target.value})} 
                      className="h-14 bg-[#1F2937]/50 border-none rounded-2xl pl-12 pr-6" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">TikTok</Label>
                  <div className="relative">
                    <Music2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      placeholder="@usuario" 
                      value={formData.tiktok || ''} 
                      onChange={e => setFormData({...formData, tiktok: e.target.value})} 
                      className="h-14 bg-[#1F2937]/50 border-none rounded-2xl pl-12 pr-6" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Twitter / X</Label>
                  <div className="relative">
                    <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      placeholder="@usuario" 
                      value={formData.twitter || ''} 
                      onChange={e => setFormData({...formData, twitter: e.target.value})} 
                      className="h-14 bg-[#1F2937]/50 border-none rounded-2xl pl-12 pr-6" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FÍSICA Y TÉCNICA */}
          <Card className="bg-[#111827] border-[#1F2937] rounded-[2.5rem]">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <Activity className="w-6 h-6" />
                <h2 className="text-2xl font-bold font-headline uppercase">Física y Técnica</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Edad</Label>
                  <Input 
                    type="number" 
                    value={formData.age || ''} 
                    onChange={e => setFormData({...formData, age: e.target.value})} 
                    className="h-14 bg-[#1F2937]/50 border-none rounded-2xl pl-6 pr-6" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Altura (CM)</Label>
                  <Input 
                    type="number" 
                    value={formData.height || ''} 
                    onChange={e => setFormData({...formData, height: e.target.value})} 
                    className="h-14 bg-[#1F2937]/50 border-none rounded-2xl pl-6 pr-6" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Peso (KG)</Label>
                  <Input 
                    type="number" 
                    value={formData.weight || ''} 
                    onChange={e => setFormData({...formData, weight: e.target.value})} 
                    className="h-14 bg-[#1F2937]/50 border-none rounded-2xl pl-6 pr-6" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Pierna Hábil</Label>
                  <Select value={formData.strongFoot || ''} onValueChange={v => setFormData({...formData, strongFoot: v})}>
                    <SelectTrigger className="h-14 bg-[#1F2937]/50 border-none rounded-2xl pl-6 gap-3">
                      <div className="flex items-center gap-3">
                        <Footprints className="w-4 h-4 text-primary" />
                        <SelectValue placeholder="Pierna" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-[#111827] border-white/10 text-white">
                      <SelectItem value="Derecha">Derecha</SelectItem>
                      <SelectItem value="Izquierda">Izquierda</SelectItem>
                      <SelectItem value="Ambidiestro">Ambidiestro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Posición</Label>
                  <Input 
                    value={formData.position || ''} 
                    onChange={e => setFormData({...formData, position: e.target.value})} 
                    className="h-14 bg-[#1F2937]/50 border-none rounded-2xl pl-6 pr-6" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GALERÍA MULTIMEDIA */}
          <Card className="bg-[#111827] border-[#1F2937] rounded-[2.5rem]">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <Camera className="w-6 h-6" />
                <h2 className="text-2xl font-bold font-headline uppercase">Galería Multimedia</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Foto Principal */}
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Foto de Perfil Principal</Label>
                  <div className="flex flex-col items-start gap-4">
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary/20 bg-black shadow-xl group">
                      {formData.profileImageUrl ? (
                        <Image src={formData.profileImageUrl} alt="Profile" fill className="object-cover" />
                      ) : (
                        <UserIcon className="w-10 h-10 m-auto opacity-20" />
                      )}
                      {uploading === 'profile-main' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                    <Button asChild className="h-14 rounded-2xl bg-primary text-background font-black uppercase text-[10px] tracking-widest cursor-pointer hover:scale-105 transition-transform">
                      <label htmlFor="profile-upload"><Upload className="w-4 h-4 mr-2" /> Subir Imagen</label>
                    </Button>
                    <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'profile')} />
                  </div>
                </div>

                {/* Book Multimedia */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Book de Scouting (Máx 3)</Label>
                    {!isElite && <Badge className="bg-primary/10 text-primary border-none text-[8px]">PLAN PRO</Badge>}
                  </div>
                  <div className="flex gap-4">
                    {[0, 1, 2].map(idx => (
                      <div key={idx} className="relative group">
                        <div className={cn(
                          "w-20 h-20 rounded-xl overflow-hidden border-2 border-dashed flex flex-col items-center justify-center transition-all relative",
                          formData.bookImageUrls[idx] ? "border-primary/40 bg-black" : "border-white/10 hover:border-primary/20"
                        )}>
                          {formData.bookImageUrls[idx] ? (
                            <Image src={formData.bookImageUrls[idx]} alt={`Book ${idx}`} fill className="object-cover" />
                          ) : (
                            <Camera className="w-5 h-5 opacity-20" />
                          )}
                          {uploading === `book-${idx}` && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            </div>
                          )}
                          <label htmlFor={`book-upload-${idx}`} className="absolute inset-0 cursor-pointer" />
                          <input 
                            type="file" 
                            id={`book-upload-${idx}`} 
                            disabled={!isElite}
                            className="hidden" 
                            accept="image/*" 
                            onChange={e => handleFileUpload(e, 'book', idx)} 
                          />
                        </div>
                        {formData.bookImageUrls[idx] && (
                           <button 
                             onClick={() => {
                               const updated = [...formData.bookImageUrls];
                               updated[idx] = '';
                               setFormData({...formData, bookImageUrls: updated});
                             }}
                             className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5 shadow-lg z-10"
                           >
                             <Trash2 className="w-3 h-3 text-white" />
                           </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                    <Youtube className="text-red-500 w-4 h-4" /> YouTube Highlights (Planes Pro)
                  </Label>
                  {[0, 1].map(idx => (
                    <Input 
                      key={idx} 
                      disabled={!isElite} 
                      placeholder="URL de YouTube" 
                      value={formData.videoUrls[idx] || ''} 
                      onChange={e => {
                        const updated = [...formData.videoUrls];
                        updated[idx] = e.target.value;
                        setFormData({...formData, videoUrls: updated});
                      }} 
                      className="h-12 bg-[#1F2937]/50 border-none rounded-xl focus:ring-1 focus:ring-primary/40 pl-6 pr-6" 
                    />
                  ))}
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                    <Instagram className="text-pink-500 w-4 h-4" /> Instagram / TikTok Clips
                  </Label>
                  {[0, 1].map(idx => (
                    <Input 
                      key={idx} 
                      disabled={!isElite} 
                      placeholder="URL de IG o TikTok" 
                      value={formData.socialVideoUrls[idx] || ''} 
                      onChange={e => {
                        const updated = [...formData.socialVideoUrls];
                        updated[idx] = e.target.value;
                        setFormData({...formData, socialVideoUrls: updated});
                      }} 
                      className="h-12 bg-[#1F2937]/50 border-none rounded-xl focus:ring-1 focus:ring-primary/40 pl-6 pr-6" 
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HISTORIAL DEPORTIVO */}
          <Card className="bg-[#111827] border-[#1F2937] rounded-[2.5rem]">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-primary">
                  <Trophy className="w-6 h-6" />
                  <h2 className="text-2xl font-bold font-headline uppercase">Historial Deportivo</h2>
                </div>
                {!isElite && <Badge className="bg-yellow-500/10 text-yellow-500 border-none font-black text-[8px] uppercase tracking-widest px-4 py-1.5 rounded-full">PLAN FREE: MÁX 1 TEMPORADA</Badge>}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-[#1F2937]/20 p-6 rounded-3xl">
                  <div className="space-y-1">
                    <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">Temporada</Label>
                    <Input 
                      placeholder="24/25" 
                      value={formData.newSeason.season || ''} 
                      onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, season: e.target.value}})} 
                      className="bg-[#030712] border-none rounded-xl pl-4 pr-4" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">Club</Label>
                    <Input 
                      placeholder="Nombre Club" 
                      value={formData.newSeason.club || ''} 
                      onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, club: e.target.value}})} 
                      className="bg-[#030712] border-none rounded-xl pl-4 pr-4" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[8px] uppercase font-black text-muted-foreground ml-2">Posición</Label>
                    <Input 
                      placeholder="Posición" 
                      value={formData.newSeason.position || ''} 
                      onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, position: e.target.value}})} 
                      className="bg-[#030712] border-none rounded-xl pl-4 pr-4" 
                    />
                  </div>
                  <div className="space-y-1 text-center">
                    <Label className="text-[8px] uppercase font-black text-muted-foreground">PJ</Label>
                    <Input 
                      type="number" 
                      value={formData.newSeason.matches || 0} 
                      onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, matches: parseInt(e.target.value) || 0}})} 
                      className="bg-[#030712] border-none rounded-xl text-center pl-2 pr-2" 
                    />
                  </div>
                  <div className="space-y-1 text-center">
                    <Label className="text-[8px] uppercase font-black text-muted-foreground">Goles</Label>
                    <Input 
                      type="number" 
                      value={formData.newSeason.goals || 0} 
                      onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, goals: parseInt(e.target.value) || 0}})} 
                      className="bg-[#030712] border-none rounded-xl text-center pl-2 pr-2" 
                    />
                  </div>
                  <div className="space-y-1 text-center">
                    <Label className="text-[8px] uppercase font-black text-muted-foreground">Asist</Label>
                    <Input 
                      type="number" 
                      value={formData.newSeason.assists || 0} 
                      onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, assists: parseInt(e.target.value) || 0}})} 
                      className="bg-[#030712] border-none rounded-xl text-center pl-2 pr-2" 
                    />
                  </div>
                  <Button onClick={addSeason} className="col-span-full h-12 bg-primary/10 text-primary border border-primary/20 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-primary/20">Añadir a Trayectoria</Button>
                </div>

                {formData.teamHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-[#1F2937]/50 rounded-2xl group border border-transparent hover:border-primary/30 transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-black text-xs">{item.season}</span>
                        <span className="font-bold text-xl font-headline tracking-tight">{item.club}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{item.position}</p>
                    </div>
                    
                    <div className="flex items-center gap-12 mr-10">
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] font-black text-muted-foreground uppercase">PJ</span>
                        <span className="font-bold">{item.matches}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] font-black text-muted-foreground uppercase">Goles</span>
                        <span className="font-bold text-primary">{item.goals}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] font-black text-muted-foreground uppercase">Asist</span>
                        <span className="font-bold">{item.assists}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => editSeason(idx)} className="text-primary hover:bg-primary/10"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => removeSeason(idx)} className="text-red-500 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Button onClick={handleSave} className="fixed bottom-10 right-10 z-50 h-20 px-12 rounded-3xl bg-primary text-background font-black uppercase tracking-widest shadow-[0_0_50px_rgba(234,179,8,0.4)] hover:scale-105 transition-transform group">
          <Sparkles className="w-6 h-6 mr-3 fill-current group-hover:animate-pulse" /> GUARDAR PERFIL
        </Button>
      </main>
    </div>
  );
}
