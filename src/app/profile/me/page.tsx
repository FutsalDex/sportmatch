
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
  Target
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
import { TopNav } from '@/components/navigation/top-nav';
import { useUser, useFirestore, useDoc, setDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { PROVINCIAS_ESPANA } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MyProfilePage() {
  const router = useRouter();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const db = useFirestore();
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
    age: '',
    position: '',
    bio: '',
    height: '',
    weight: '',
    strongFoot: '',
    profileImageUrl: '',
    bookImageUrls: ['', '', ''],
    teamHistory: [] as string[],
    newTeam: ''
  });

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        province: userData.province || '',
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

  const handleSave = () => {
    if (!user || !userRef || !profileRef) return;

    setDocumentNonBlocking(userRef, {
      name: formData.name,
      province: formData.province,
      age: parseInt(formData.age) || 0,
      position: formData.position,
      profileImageUrl: formData.profileImageUrl
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

  const addTeam = () => {
    if (formData.newTeam.trim()) {
      setFormData({
        ...formData,
        teamHistory: [...formData.teamHistory, formData.newTeam.trim()],
        newTeam: ''
      });
    }
  };

  const removeTeam = (index: number) => {
    const updated = formData.teamHistory.filter((_, i) => i !== index);
    setFormData({ ...formData, teamHistory: updated });
  };

  const updateBookImage = (index: number, url: string) => {
    const updated = [...formData.bookImageUrls];
    updated[index] = url;
    setFormData({ ...formData, bookImageUrls: updated });
  };

  const isLoading = isAuthLoading || isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-primary font-bold uppercase tracking-[0.2em] animate-pulse">Cargando Terminal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold font-headline tracking-tighter">Mi Perfil</h1>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">GESTIÓN DE IDENTIDAD DIGITAL</p>
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
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">NOMBRE</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">PROVINCIA</Label>
                  <Select 
                    value={formData.province} 
                    onValueChange={(v) => setFormData({...formData, province: v})}
                  >
                    <SelectTrigger className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <SelectValue placeholder="Selecciona provincia" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-[#111827] border-[#1F2937] text-white max-h-[300px]">
                      {PROVINCIAS_ESPANA.map((prov) => (
                        <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Física y Técnica */}
          <Card className="bg-[#111827] border-[#1F2937] border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <Target className="w-6 h-6 text-primary" />
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
                      className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg pl-12 focus-visible:ring-1 focus-visible:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">ALTURA (M)</Label>
                  <div className="relative">
                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      type="number"
                      step="0.01"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                      className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg pl-12 focus-visible:ring-1 focus-visible:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">PESO (KG)</Label>
                  <div className="relative">
                    <WeightIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input 
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg pl-12 focus-visible:ring-1 focus-visible:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">POSICIÓN</Label>
                  <Input 
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    placeholder="Ej: Delantero Centro"
                    className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">PIERNA HÁBIL</Label>
                  <Select value={formData.strongFoot} onValueChange={(v) => setFormData({...formData, strongFoot: v})}>
                    <SelectTrigger className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50">
                      <div className="flex items-center gap-2">
                        <Footprints className="w-4 h-4 text-primary" />
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
            </CardContent>
          </Card>

          {/* Galería Multimedia */}
          <Card className="bg-[#111827] border-[#1F2937] border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <Camera className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-headline tracking-tight uppercase">Galería Multimedia</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">URL FOTO DE PERFIL</Label>
                  <Input 
                    value={formData.profileImageUrl}
                    onChange={(e) => setFormData({...formData, profileImageUrl: e.target.value})}
                    placeholder="https://example.com/foto.jpg"
                    className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {formData.bookImageUrls.map((url, idx) => (
                    <div key={idx} className="space-y-3">
                      <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">URL FOTO BOOK {idx + 1}</Label>
                      <Input 
                        value={url}
                        onChange={(e) => updateBookImage(idx, e.target.value)}
                        placeholder="URL de la imagen"
                        className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historial de Clubes */}
          <Card className="bg-[#111827] border-[#1F2937] border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <UserIcon className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-headline tracking-tight uppercase">Historial de Clubes</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Input 
                    value={formData.newTeam}
                    onChange={(e) => setFormData({...formData, newTeam: e.target.value})}
                    placeholder="Nombre del club anterior..."
                    className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50 flex-1"
                  />
                  <Button 
                    onClick={addTeam}
                    className="h-14 w-14 rounded-2xl bg-primary text-background hover:bg-primary/90"
                  >
                    <Plus className="w-6 h-6" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.teamHistory.map((team, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-[#1F2937]/50 rounded-2xl group border border-transparent hover:border-primary/30 transition-all">
                      <span className="font-bold text-lg">{team}</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeTeam(idx)}
                        className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tarjeta de Bio Profesional */}
          <Card className="bg-[#111827] border-[#1F2937] border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-headline tracking-tight uppercase">Bio Profesional</h2>
              </div>
              
              <div className="space-y-3">
                <Label className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">TRAYECTORIA Y HABILIDADES</Label>
                <Textarea 
                  placeholder="Describe tu trayectoria..."
                  className="min-h-[200px] bg-[#1F2937]/50 border-none rounded-3xl text-lg p-8 resize-none focus-visible:ring-1 focus-visible:ring-primary/50 placeholder:text-muted-foreground/30"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6">
            <Button variant="link" className="text-destructive font-bold text-sm hover:no-underline p-0 uppercase tracking-widest">
              Eliminar Cuenta (Zona de Riesgo)
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
