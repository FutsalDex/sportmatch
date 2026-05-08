
"use client";

import { useState } from 'react';
import { useUser, useFirestore, setDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { TopNav } from '@/components/navigation/top-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Briefcase, FileCheck, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function NewOfferPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();

  const clubDocRef = useMemoFirebase(() => user ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: clubData } = useDoc(clubDocRef);

  const [formData, setFormData] = useState({
    role: 'Player',
    position: '',
    salaryRange: '',
    duration: '',
    location: '',
    requirements: '',
    description: ''
  });

  const handleSubmit = () => {
    if (!user || !formData.position) return;

    const offerId = `job_${Date.now()}`;
    const offerRef = doc(db, 'offers', offerId);

    setDocumentNonBlocking(offerRef, {
      id: offerId,
      clubId: user.uid,
      clubName: clubData?.name || 'Club Institucional',
      role: formData.role,
      position: formData.position,
      salaryRange: formData.salaryRange,
      duration: formData.duration,
      location: clubData?.province || '',
      requirements: formData.requirements,
      description: formData.description,
      status: 'active',
      createdAt: new Date().toISOString()
    }, { merge: true });

    toast({
      title: "Oferta Publicada",
      description: "La vacante ya es visible en el Tablero de Reclutamiento."
    });

    router.push('/offers');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-4">
          <Link href="/offers" className="flex items-center text-primary hover:underline text-[10px] font-black uppercase tracking-[0.2em] gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" /> VOLVER AL TABLERO
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-bold font-headline tracking-tighter uppercase italic">Publicar Vacante</h1>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest text-[10px]">Nueva oferta de empleo institucional</p>
            </div>
          </div>
        </header>

        <Card className="card-elite rounded-[3rem] bg-[#111827]/40 border-white/5 overflow-hidden">
          <CardContent className="p-10 md:p-12 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">¿A quién buscas?</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                  <SelectTrigger className="h-14 bg-white/5 border-none rounded-2xl px-6 text-white font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111827] border-white/10 text-white">
                    <SelectItem value="Player">JUGADOR</SelectItem>
                    <SelectItem value="Coach">ENTRENADOR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Puesto / Rol Específico</Label>
                <Input 
                  placeholder="Ej: Delantero Centro / Analista Sub-19" 
                  className="h-14 bg-white/5 border-none rounded-2xl px-6"
                  value={formData.position}
                  onChange={e => setFormData({...formData, position: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Rango Salarial (Anual)</Label>
                <Input 
                  placeholder="Ej: 15k - 20k €" 
                  className="h-14 bg-white/5 border-none rounded-2xl px-6 text-green-400 font-bold"
                  value={formData.salaryRange}
                  onChange={e => setFormData({...formData, salaryRange: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Duración (Temporadas)</Label>
                <Input 
                  placeholder="Ej: 1 Temp. + 1 opcional" 
                  className="h-14 bg-white/5 border-none rounded-2xl px-6"
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: e.target.value})}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Requerimientos Técnicos</Label>
                <Textarea 
                  placeholder="Especifica habilidades, experiencia mínima, titulaciones..." 
                  className="min-h-[120px] bg-white/5 border-none rounded-[1.5rem] p-6 text-lg"
                  value={formData.requirements}
                  onChange={e => setFormData({...formData, requirements: e.target.value})}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Descripción del Proyecto</Label>
                <Textarea 
                  placeholder="Cuéntales por qué deberían unirse a tu club..." 
                  className="min-h-[150px] bg-white/5 border-none rounded-[1.5rem] p-6 text-lg"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20 flex items-start gap-4">
               <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
               <p className="text-xs text-muted-foreground leading-relaxed">
                 Al publicar esta oferta, será visible para todos los perfiles cualificados de la red SportMatch AI. Los interesados podrán ver los parámetros económicos y técnicos definidos.
               </p>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full h-16 rounded-[2rem] bg-primary text-background font-black uppercase tracking-[0.2em] text-sm hover:bg-primary/90 shadow-2xl transition-all"
            >
              LANZAR OFERTA AL TABLERO <Send className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
