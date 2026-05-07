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
  Target,
  Upload,
  Lock,
  Trophy,
  Loader2,
  Activity,
  Flag,
  Star,
  Zap,
  Award
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
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
    country: '',
    nationality: '',
    age: '',
    position: '',
    bio: '',
    height: '',
    weight: '',
    strongFoot: '',
    profileImageUrl: '',
    bookImageUrls: ['', '', ''],
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
        bookImageUrls: profileData.bookImageUrls || ['', '', ''],
        teamHistory: profileData.teamHistory || []
      }));
    }
  }, [userData, profileData]);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  const calculateScore = () => {
    let score = 0;
    if (formData.name) score += 5;
    if (formData.nationality) score += 5;
    if (formData.country) score += 5;
    if (formData.province) score += 5;
    if (formData.age) score += 5;
    if (formData.position) score += 5;
    
    if (formData.height) score += 5;
    if (formData.weight) score += 5;
    if (formData.strongFoot) score += 5;
    
    if (formData.profileImageUrl) score += 10;
    
    formData.bookImageUrls.forEach(url => {
      if (url) score += 5;
    });
    
    if (formData.bio && formData.bio.length > 50) score += 15;
    else if (formData.bio) score += 5;
    
    if (formData.teamHistory.length > 0) score += 15;
    
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
      bookImageUrls: formData.bookImageUrls,
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

    const isElite = userData?.verificationStatus === 'verified' || (userData?.score && userData?.score > 85);
    if (type === 'book' && !isElite) {
      toast({
        variant: "destructive",
        title: "Acceso Denegado",
        description: "El Book multimedia es exclusivo para planes Verificados o Pro."
      });
      return;
    }

    const uploadKey = `${type}-${index ?? 'main'}`;
    setUploading(uploadKey);

    try {
      const fileName = `${Date.now()}_${file.name}`;
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
    } catch (error) {
      console.error("Upload error:", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo subir la imagen." });
    } finally {
      setUploading(null);
    }
  };

  const addSeason = () => {
    if (formData.newSeason.club.trim() && formData.newSeason.season.trim()) {
      setFormData(prev => ({
        ...prev,
        teamHistory: [{ ...prev.newSeason }, ...prev.teamHistory],
        newSeason: { season: '', club: '', position: '', goals: 0, assists: 0, matches: 0 }
      }));
      toast({
        title: "Temporada Añadida",
        description: "Se ha agregado el registro a tu historial temporalmente. No olvides guardar tu perfil."
      });
    } else {
      toast({
        variant: "destructive",
        title: "Datos Incompletos",
        description: "Por favor, completa al menos la Temporada y el Club."
      });
    }
  };

  const removeSeason = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamHistory: prev.teamHistory.filter((_, i) => i !== index)
    }));
  };

  const isElite = userData?.verificationStatus === 'verified' || (userData?.score && userData?.score > 85);
  const isLoading = isAuthLoading || isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-primary font-bold uppercase tracking-[0.2em] animate-pulse">Cargando Terminal...</p>
      </div>
    );
  }

  const currentLocationList = GET_LOCATION_LIST(formData.country);
  const currentLocationLabel = GET_LOCATION_LABEL(formData.country);

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Header con Score IA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold font-headline tracking-tighter">Mi Perfil</h1>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">GESTIÓN DE IDENTIDAD DIGITAL</p>
          </div>
          
          <div className="flex-1 max-w-md bg-[#111827] border border-white/5 p-6 rounded-[2rem] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary fill-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Potencial de Scouting IA</span>
              </div>
              <Badge className="bg-primary/10 text-primary border-none font-black text-xs">SCORE {currentScore}</Badge>
            </div>
            <Progress value={currentScore} className="h-2 bg-white/5" />
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider text-center">
              {currentScore < 100 
                ? `Completa tu biografía y historial para subir ${100 - currentScore} puntos` 
                : "¡Perfil de Élite completado al 100%!"}
            </p>
          </div>

          <Button variant="outline" asChild className="rounded-xl border-primary/50 text-primary hover:bg-primary/10 px-6 font-bold h-12 gap-2">
            <Link href={`/profile/${user?.uid}`}>
              Ver Perfil Público <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="space-y-8 pb-24">
          {/* Tarjeta de Datos Básicos */}
          <Card className="bg-[#111827] border-[#1F2937] border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <Globe className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-headline tracking-tight uppercase">Datos Básicos</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">NOMBRE Y APELLIDOS</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">NACIONALIDAD</Label>
                  <div className="relative">
                    <Flag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      value={formData.nationality}
                      onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                      placeholder="Ej: Española"
                      className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg pl-12 pr-6 focus-visible:ring-1 focus-visible:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">PAÍS (RESIDENCIA ACTUAL)</Label>
                  <Select 
                    value={formData.country} 
                    onValueChange={(v) => {
                      setFormData({...formData, country: v, province: ''});
                    }}
                  >
                    <SelectTrigger className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50">
                      <div className="flex items-center gap-4">
                        <Globe className="w-4 h-4 text-primary" />
                        <SelectValue placeholder="Selecciona país" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-[#111827] border-[#1F2937] text-white">
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>{country.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">{currentLocationLabel}</Label>
                  <Select 
                    value={formData.province} 
                    onValueChange={(v) => setFormData({...formData, province: v})}
                  >
                    <SelectTrigger className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50">
                      <div className="flex items-center gap-4">
                        <MapPin className="w-4 h-4 text-primary" />
                        <SelectValue placeholder={`Selecciona ${currentLocationLabel.toLowerCase()}`} />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-[#111827] border-[#1F2937] text-white max-h-[300px]">
                      {currentLocationList.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Física y Técnica */}
          <Card className="bg-[#111827] border-[#1F2937] border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <Activity className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-headline tracking-tight uppercase">Física y Técnica</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">EDAD</Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg pl-12 pr-6 focus-visible:ring-1 focus-visible:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">ALTURA (CM)</Label>
                  <div className="relative">
                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      type="number"
                      step="1"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                      className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg pl-12 pr-6 focus-visible:ring-1 focus-visible:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">PESO (KG)</Label>
                  <div className="relative">
                    <WeightIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg pl-12 pr-6 focus-visible:ring-1 focus-visible:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">POSICIÓN</Label>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg pl-12 pr-6 focus-visible:ring-1 focus-visible:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">PIERNA HÁBIL</Label>
                  <div className="relative">
                    <Footprints className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Select 
                      value={formData.strongFoot} 
                      onValueChange={(v) => setFormData({...formData, strongFoot: v})}
                    >
                      <SelectTrigger className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg pl-12 pr-6 focus-visible:ring-1 focus-visible:ring-primary/50">
                        <div className="flex items-center gap-4">
                          <SelectValue placeholder="Selecciona pierna" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-[#111827] border-[#1F2937] text-white">
                        <SelectItem value="Derecha">Derecha</SelectItem>
                        <SelectItem value="Izquierda">Izquierda</SelectItem>
                        <SelectItem value="Ambidiestro">Ambidiestro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Galería Multimedia */}
          <Card className="bg-[#111827] border-[#1F2937] border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <Camera className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-headline tracking-tight uppercase">Galería Multimedia</h2>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">FOTO DE PERFIL</Label>
                  <div className="flex gap-4">
                    <Input 
                      value={formData.profileImageUrl}
                      onChange={(e) => setFormData({...formData, profileImageUrl: e.target.value})}
                      placeholder="URL o sube una imagen"
                      className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50 flex-1"
                    />
                    <div className="relative">
                      <input 
                        type="file" 
                        id="profile-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'profile')}
                      />
                      <Button 
                        asChild
                        className={cn(
                          "h-14 px-8 rounded-2xl bg-primary text-background hover:bg-primary/90 shadow-[0_0_30px_rgba(234,179,8,0.2)] cursor-pointer",
                          uploading === 'profile-main' && "opacity-50 pointer-events-none"
                        )}
                      >
                        <label htmlFor="profile-upload">
                          {uploading === 'profile-main' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="space-y-3">
                      <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-between">
                        FOTO BOOK {idx + 1}
                        {!isElite && <Lock className="w-3 h-3 text-primary" />}
                      </Label>
                      <div className="relative">
                        <Input 
                          value={formData.bookImageUrls[idx]}
                          disabled={!isElite}
                          placeholder={isElite ? "URL de imagen" : "Plan Élite Requerido"}
                          className={cn(
                            "h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50",
                            !isElite && "opacity-50 cursor-not-allowed"
                          )}
                        />
                        {isElite && (
                          <div className="mt-2">
                             <input 
                              type="file" 
                              id={`book-upload-${idx}`} 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'book', idx)}
                            />
                            <Button 
                              asChild
                              size="sm"
                              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest cursor-pointer"
                            >
                              <label htmlFor={`book-upload-${idx}`}>
                                {uploading === `book-${idx}` ? <Loader2 className="w-3 h-3 animate-spin" /> : "SUBIR A STORAGE"}
                              </label>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Biografía */}
          <Card className="bg-[#111827] border-[#1F2937] border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-headline tracking-tight uppercase">Biografía Profesional</h2>
              </div>
              <div className="space-y-3">
                <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">RESUMEN TÉCNICO</Label>
                <Textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="min-h-[200px] bg-[#1F2937]/50 border-none rounded-[2rem] text-lg p-8 focus-visible:ring-1 focus-visible:ring-primary/50"
                  placeholder="Describe tus habilidades, trayectoria y lo que buscas..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Historial Deportivo */}
          <Card className="bg-[#111827] border-[#1F2937] border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <Trophy className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-headline tracking-tight uppercase">Historial Deportivo</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-[#1F2937]/20 p-6 rounded-3xl border border-white/5">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Temporada</Label>
                    <Input 
                      placeholder="23/24" 
                      value={formData.newSeason.season}
                      onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, season: e.target.value}})}
                      className="bg-[#030712] border-none h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Club</Label>
                    <Input 
                      placeholder="Nombre Club" 
                      value={formData.newSeason.club}
                      onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, club: e.target.value}})}
                      className="bg-[#030712] border-none h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Posición</Label>
                    <Input 
                      placeholder="Delantero" 
                      value={formData.newSeason.position}
                      onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, position: e.target.value}})}
                      className="bg-[#030712] border-none h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Partidos</Label>
                    <Input 
                      type="number" 
                      value={formData.newSeason.matches}
                      onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, matches: parseInt(e.target.value) || 0}})}
                      className="bg-[#030712] border-none h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Goles</Label>
                    <Input 
                      type="number" 
                      value={formData.newSeason.goals}
                      onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, goals: parseInt(e.target.value) || 0}})}
                      className="bg-[#030712] border-none h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Asistencias</Label>
                    <Input 
                      type="number" 
                      value={formData.newSeason.assists}
                      onChange={e => setFormData({...formData, newSeason: {...formData.newSeason, assists: parseInt(e.target.value) || 0}})}
                      className="bg-[#030712] border-none h-12 rounded-xl"
                    />
                  </div>
                  <Button 
                    type="button"
                    onClick={addSeason}
                    className="col-span-full h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-black uppercase text-[10px] tracking-widest mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Añadir Temporada
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.teamHistory.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row items-center justify-between p-6 bg-[#1F2937]/50 rounded-2xl group border border-transparent hover:border-primary/30 transition-all gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-primary font-black text-xs uppercase tracking-widest">{item.season}</span>
                          <span className="font-bold text-xl">{item.club}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">{item.position}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-[8px] font-black text-muted-foreground uppercase">PJ</p>
                          <p className="font-bold text-lg">{item.matches}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] font-black text-muted-foreground uppercase">GOLES</p>
                          <p className="font-bold text-lg text-primary">{item.goals}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] font-black text-muted-foreground uppercase">ASIST</p>
                          <p className="font-bold text-lg">{item.assists}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeSeason(idx)}
                          className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6">
            <Button variant="link" className="text-destructive font-bold text-sm hover:no-underline p-0 uppercase tracking-widest opacity-50">
              Eliminar Cuenta
            </Button>
            
            <Button 
              onClick={handleSave}
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-background h-16 px-12 rounded-3xl text-lg font-black uppercase tracking-widest flex gap-3 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
            >
              <Sparkles className="w-6 h-6 fill-current" />
              Guardar Perfil
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
