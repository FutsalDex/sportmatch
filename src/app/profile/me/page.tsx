"use client";

import { useState, useEffect } from 'react';
import { 
  Globe, 
  FileText, 
  Sparkles, 
  MapPin,
  ExternalLink
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
    bio: ''
  });

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        province: userData.province || ''
      }));
    }
    if (profileData) {
      setFormData(prev => ({
        ...prev,
        bio: profileData.bio || ''
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
      province: formData.province
    }, { merge: true });

    setDocumentNonBlocking(profileRef, {
      bio: formData.bio
    }, { merge: true });

    toast({
      title: "Perfil Actualizado",
      description: "Tu identidad digital ha sido sincronizada con éxito."
    });
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
