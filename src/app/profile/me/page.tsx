
"use client";

import { useState, useEffect } from 'react';
import { 
  Globe, 
  FileText, 
  Sparkles, 
  ChevronDown,
  ExternalLink,
  MapPin
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
import { useUser, useFirestore, useDoc, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { PROVINCIAS_ESPANA } from '@/lib/constants';

export default function MyProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { data: userData, isLoading } = useDoc(user ? doc(db, 'users', user.uid) : null);
  const { data: profileData } = useDoc(user ? doc(db, 'userProfiles', user.uid) : null);

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

  const handleSave = () => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    setDocumentNonBlocking(userRef, {
      name: formData.name,
      province: formData.province
    }, { merge: true });

    const profileRef = doc(db, 'userProfiles', user.uid);
    setDocumentNonBlocking(profileRef, {
      bio: formData.bio
    }, { merge: true });

    toast({
      title: "Perfiles Actualizado",
      description: "Tu identidad digital ha sido sincronizada con éxito."
    });
  };

  if (isLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-primary font-bold animate-pulse">Cargando Terminal...</div>;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <div className="flex items-center justify-between">
          <h1 className="text-5xl font-bold font-headline tracking-tighter">Mi Perfil</h1>
          <Button variant="outline" asChild className="rounded-xl border-primary/50 text-primary hover:bg-primary/10 px-6 font-bold h-12">
            <a href={`/profile/${user?.uid}`}>Ver Público</a>
          </Button>
        </div>

        <div className="space-y-8 pb-24">
          <Card className="bg-[#111827] border-[#1F2937] border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <Globe className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-headline tracking-tight">Datos Básicos</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Nombre</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Provincia</Label>
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
                <h2 className="text-2xl font-bold font-headline tracking-tight">Bio Profesional</h2>
              </div>
              
              <div className="space-y-3">
                <Textarea 
                  placeholder="Describe tu trayectoria..."
                  className="min-h-[200px] bg-[#1F2937]/50 border-none rounded-3xl text-lg p-8 resize-none focus-visible:ring-1 focus-visible:ring-primary/50 placeholder:text-muted-foreground/30"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-[#1F2937] border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 flex items-center justify-between">
              <Button variant="link" className="text-[#EF4444] font-bold text-lg hover:no-underline p-0">
                Eliminar Cuenta (Zona de Riesgo)
              </Button>
              
              <Button 
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 text-background h-16 px-10 rounded-3xl text-lg font-black uppercase tracking-widest flex gap-3 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
              >
                <Sparkles className="w-6 h-6 fill-current" />
                Guardar Perfil
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
