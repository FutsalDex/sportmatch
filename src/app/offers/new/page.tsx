
"use client";

import { useState } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
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
  SelectValue,
  SelectGroup,
  SelectLabel
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Briefcase, Info, AlertTriangle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { POSICIONES_FUTBOL, POSICIONES_FUTSAL } from '@/lib/constants';

export default function NewOfferPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();

  const clubDocRef = useMemoFirebase(() => user ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: clubData, isLoading: isClubLoading } = useDoc(clubDocRef);

  const myOffersQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'offers'), where('clubId', '==', user.uid));
  }, [db, user?.uid]);

  const { data: myOffers, isLoading: isOffersLoading } = useCollection(myOffersQuery);

  const [formData, setFormData] = useState({
    role: 'Player',
    position: '',
    salaryRange: '',
    duration: '',
    location: '',
    requirements: '',
    description: ''
  });

  const currentOffersCount = myOffers?.length || 0;
  const isFreePlan = !clubData?.plan || clubData?.plan === 'free';
  const isLimitReached = isFreePlan && currentOffersCount >= 3;
  const isFootball = clubData?.discipline === 'Football';

  const handleSubmit = () => {
    if (!user || !formData.position) return;

    if (isLimitReached) {
      toast({
        variant: "destructive",
        title: "Capacidad de Reclutamiento Agotada",
        description: "El Plan Free solo permite 3 ofertas activas. Pásate al Plan TOP para reclutamiento ilimitado.",
      });
      router.push('/pricing');
      return;
    }

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

  if (isClubLoading || isOffersLoading) {
    return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-primary font-black animate-pulse uppercase tracking-[0.3em] text-xs">Validando Cuotas de Reclutamiento...</div>;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-4">
          <Link href="/offers" className="flex items-center text-primary hover:underline text-[10px] font-black uppercase tracking-[0.2em] gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" /> VOLVER AL TABLERO
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-bold font-headline tracking-tighter uppercase italic">Publicar Vacante</h1>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest text-[10px]">Nueva oferta de empleo institucional</p>
              </div>
            </div>

            {isFreePlan && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-3 flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Cuota Plan Free</p>
                  <p className="text-xs font-bold text-white">{currentOffersCount} / 3 <span className="text-muted-foreground">OFERTAS</span></p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
            )}
          </div>
        </header>

        {isLimitReached ? (
          <Card className="card-elite rounded-[3rem] border-red-500/20 bg-red-500/5 p-12 text-center space-y-6">
            <div className="bg-red-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-headline uppercase italic">Límite de Publicaciones Alcanzado</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Has alcanzado el máximo de 3 ofertas permitidas en el **Plan Free**. Para publicar esta vacante necesitas subir de nivel.
              </p>
            </div>
            <Button asChild className="h-14 px-10 rounded-2xl bg-primary text-background font-black uppercase text-xs tracking-widest hover:bg-primary/90">
              <Link href="/pricing">MEJORAR A PLAN TOP <Sparkles className="ml-2 w-4 h-4" /></Link>
            </Button>
          </Card>
        ) : (
          <Card className="card-elite rounded-[3rem] bg-[#111827]/40 border-white/5 overflow-hidden">
            <CardContent className="p-10 md:p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">¿A quién buscas?</Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v, position: ''})}>
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
                  {formData.role === 'Player' ? (
                    <Select value={formData.position} onValueChange={(v) => setFormData({...formData, position: v})}>
                      <SelectTrigger className="h-14 bg-white/5 border-none rounded-2xl px-6 text-white font-bold">
                        <SelectValue placeholder="Selecciona posición" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111827] border-white/10 text-white">
                        {isFootball ? (
                          <>
                            {Object.entries(POSICIONES_FUTBOL).map(([grupo, posis]) => (
                              <SelectGroup key={grupo}>
                                <SelectLabel className="text-primary font-black uppercase text-[10px]">{grupo}</SelectLabel>
                                {posis.map(p => (
                                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                ))}
                              </SelectGroup>
                            ))}
                          </>
                        ) : (
                          <>
                            {POSICIONES_FUTSAL.map(p => (
                              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      placeholder="Ej: Analista Sub-19" 
                      className="h-14 bg-white/5 border-none rounded-2xl px-6"
                      value={formData.position}
                      onChange={e => setFormData({...formData, position: e.target.value})}
                    />
                  )}
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
        )}
      </main>
    </div>
  );
}
