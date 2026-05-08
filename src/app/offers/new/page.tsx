
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Send, 
  Briefcase, 
  Info, 
  AlertTriangle, 
  Sparkles, 
  Coins, 
  Truck, 
  ShieldCheck, 
  Users, 
  FileText,
  Clock,
  Target
} from 'lucide-react';
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
    bonusObjectives: '',
    duration: '',
    onboardingDate: 'Inmediata',
    teamRole: 'Sin determinar',
    teamCategory: '',
    location: '',
    requirements: '',
    description: '',
    accommodation: 'No incluido',
    transport: 'No incluido',
    healthInsurance: 'Básico',
    careerPlan: 'No incluido',
    nationalityRequirement: 'Comunitario',
    preferredAgeRange: '',
    languageLevel: 'No requerido',
    mandatoryDocs: ''
  });

  const currentOffersCount = myOffers?.length || 0;
  const isFreePlan = !clubData?.plan || clubData?.plan === 'free';
  const isLimitReached = isFreePlan && currentOffersCount >= 3;
  const isFootball = clubData?.discipline === 'Football';

  const handleSubmit = () => {
    if (!user || !formData.position) {
      toast({ variant: "destructive", title: "Faltan Datos", description: "Debes seleccionar al menos la posición buscada." });
      return;
    }

    if (isLimitReached) {
      router.push('/pricing');
      return;
    }

    const offerId = `job_${Date.now()}`;
    const offerRef = doc(db, 'offers', offerId);

    setDocumentNonBlocking(offerRef, {
      id: offerId,
      clubId: user.uid,
      clubName: clubData?.name || 'Club Institucional',
      clubLogo: clubData?.profileImageUrl || '',
      role: formData.role,
      position: formData.position,
      salaryRange: formData.salaryRange,
      bonusObjectives: formData.bonusObjectives,
      duration: formData.duration,
      onboardingDate: formData.onboardingDate,
      teamRole: formData.teamRole,
      teamCategory: formData.teamCategory || clubData?.position || '',
      location: clubData?.province || '',
      requirements: formData.requirements,
      description: formData.description,
      accommodation: formData.accommodation,
      transport: formData.transport,
      healthInsurance: formData.healthInsurance,
      careerPlan: formData.careerPlan,
      nationalityRequirement: formData.nationalityRequirement,
      preferredAgeRange: formData.preferredAgeRange,
      languageLevel: formData.languageLevel,
      mandatoryDocs: formData.mandatoryDocs,
      status: 'active',
      createdAt: new Date().toISOString()
    }, { merge: true });

    toast({ title: "Oferta Publicada", description: "La vacante ya es visible en el Tablero de Reclutamiento." });
    router.push('/offers');
  };

  if (isClubLoading || isOffersLoading) {
    return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-primary font-black animate-pulse uppercase tracking-[0.3em] text-xs">Validando Terminal de Reclutamiento...</div>;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
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
                <h1 className="text-4xl font-bold font-headline tracking-tighter uppercase italic">Nueva Vacante</h1>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Protocolo de Reclutamiento Institucional</p>
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
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold font-headline uppercase italic">Capacidad Agotada</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Has alcanzado el límite de 3 ofertas del Plan Free.</p>
            <Button asChild className="h-14 px-10 rounded-2xl bg-primary text-background font-black uppercase text-xs tracking-widest">
              <Link href="/pricing">MEJORAR A PLAN TOP <Sparkles className="ml-2 w-4 h-4" /></Link>
            </Button>
          </Card>
        ) : (
          <Tabs defaultValue="base" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-[#111827] border border-white/5 rounded-2xl h-16 p-1.5 mb-10">
              <TabsTrigger value="base" className="rounded-xl font-black text-[9px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-background">1. Proyecto</TabsTrigger>
              <TabsTrigger value="money" className="rounded-xl font-black text-[9px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-background">2. Económico</TabsTrigger>
              <TabsTrigger value="logistics" className="rounded-xl font-black text-[9px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-background">3. Logística</TabsTrigger>
              <TabsTrigger value="reqs" className="rounded-xl font-black text-[9px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-background">4. Requisitos</TabsTrigger>
            </TabsList>

            <Card className="card-elite rounded-[3rem] bg-[#111827]/40 border-white/5 overflow-hidden">
              <CardContent className="p-10 space-y-10">
                <TabsContent value="base" className="space-y-8 mt-0">
                  <div className="flex items-center gap-3 text-primary mb-6">
                    <Target className="w-5 h-5" />
                    <h3 className="font-black text-xs uppercase tracking-widest">Definición de la Vacante</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">¿A quién buscas?</Label>
                      <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v, position: ''})}>
                        <SelectTrigger className="h-14 bg-white/5 border-none rounded-2xl px-6 font-bold"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#111827] border-white/10 text-white">
                          <SelectItem value="Player">JUGADOR</SelectItem>
                          <SelectItem value="Coach">ENTRENADOR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Puesto Específico</Label>
                      {formData.role === 'Player' ? (
                        <Select value={formData.position} onValueChange={(v) => setFormData({...formData, position: v})}>
                          <SelectTrigger className="h-14 bg-white/5 border-none rounded-2xl px-6 font-bold"><SelectValue placeholder="Selecciona posición" /></SelectTrigger>
                          <SelectContent className="bg-[#111827] border-white/10 text-white">
                            {isFootball ? (
                              Object.entries(POSICIONES_FUTBOL).map(([grupo, posis]) => (
                                <SelectGroup key={grupo}>
                                  <SelectLabel className="text-primary font-black uppercase text-[10px]">{grupo}</SelectLabel>
                                  {posis.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                                </SelectGroup>
                              ))
                            ) : (
                              POSICIONES_FUTSAL.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input placeholder="Ej: Analista Táctico" className="h-14 bg-white/5 border-none rounded-2xl px-6" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Rol en el Equipo</Label>
                      <Select value={formData.teamRole} onValueChange={(v) => setFormData({...formData, teamRole: v})}>
                        <SelectTrigger className="h-14 bg-white/5 border-none rounded-2xl px-6 font-bold"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#111827] border-white/10 text-white">
                          <SelectItem value="Sin determinar">Sin determinar</SelectItem>
                          <SelectItem value="Titular inmediato">Titular inmediato</SelectItem>
                          <SelectItem value="Jugador de rotación">Jugador de rotación</SelectItem>
                          <SelectItem value="Apuesta de futuro">Apuesta de futuro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Fecha de Incorporación</Label>
                      <Select value={formData.onboardingDate} onValueChange={(v) => setFormData({...formData, onboardingDate: v})}>
                        <SelectTrigger className="h-14 bg-white/5 border-none rounded-2xl px-6 font-bold"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#111827] border-white/10 text-white">
                          <SelectItem value="Inmediata">Inmediata</SelectItem>
                          <SelectItem value="Mercado de Invierno">Mercado de Invierno</SelectItem>
                          <SelectItem value="Próxima Temporada">Próxima Temporada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Descripción del Proyecto</Label>
                      <Textarea placeholder="Cuéntales sobre la ambición del club..." className="min-h-[120px] bg-white/5 border-none rounded-[1.5rem] p-6" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="money" className="space-y-8 mt-0">
                  <div className="flex items-center gap-3 text-primary mb-6">
                    <Coins className="w-5 h-5" />
                    <h3 className="font-black text-xs uppercase tracking-widest">Módulo Económico</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Salario Anual (Bruto)</Label>
                      <Input placeholder="Ej: 18.000€ - 24.000€" className="h-14 bg-white/5 border-none rounded-2xl px-6 text-green-400 font-bold" value={formData.salaryRange} onChange={e => setFormData({...formData, salaryRange: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Duración (Temporadas)</Label>
                      <Input placeholder="Ej: 1 año + 1 opcional" className="h-14 bg-white/5 border-none rounded-2xl px-6" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Bonus por Objetivos</Label>
                      <Textarea placeholder="Primas por goles, partidos jugados, ascenso..." className="min-h-[100px] bg-white/5 border-none rounded-[1.5rem] p-6" value={formData.bonusObjectives} onChange={e => setFormData({...formData, bonusObjectives: e.target.value})} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="logistics" className="space-y-8 mt-0">
                  <div className="flex items-center gap-3 text-primary mb-6">
                    <Truck className="w-5 h-5" />
                    <h3 className="font-black text-xs uppercase tracking-widest">Logística y Beneficios</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Alojamiento</Label>
                      <Input placeholder="Ej: Piso del club incluido" className="h-14 bg-white/5 border-none rounded-2xl px-6" value={formData.accommodation} onChange={e => setFormData({...formData, accommodation: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Transporte</Label>
                      <Input placeholder="Ej: Ayuda para combustible" className="h-14 bg-white/5 border-none rounded-2xl px-6" value={formData.transport} onChange={e => setFormData({...formData, transport: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Seguro Médico</Label>
                      <Input placeholder="Ej: Sanitas + Fisioterapia" className="h-14 bg-white/5 border-none rounded-2xl px-6" value={formData.healthInsurance} onChange={e => setFormData({...formData, healthInsurance: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Plan de Carrera</Label>
                      <Input placeholder="Ej: Facilidades para estudios" className="h-14 bg-white/5 border-none rounded-2xl px-6" value={formData.careerPlan} onChange={e => setFormData({...formData, careerPlan: e.target.value})} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reqs" className="space-y-8 mt-0">
                  <div className="flex items-center gap-3 text-primary mb-6">
                    <Users className="w-5 h-5" />
                    <h3 className="font-black text-xs uppercase tracking-widest">Filtro de Candidatos</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Nacionalidad / Pasaporte</Label>
                      <Select value={formData.nationalityRequirement} onValueChange={(v) => setFormData({...formData, nationalityRequirement: v})}>
                        <SelectTrigger className="h-14 bg-white/5 border-none rounded-2xl px-6 font-bold"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#111827] border-white/10 text-white">
                          <SelectItem value="Comunitario">Comunitario (UE)</SelectItem>
                          <SelectItem value="Extracomunitario aceptado">Extracomunitario aceptado</SelectItem>
                          <SelectItem value="Indiferente">Indiferente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Edad Preferente</Label>
                      <Input placeholder="Ej: 19 - 24 años" className="h-14 bg-white/5 border-none rounded-2xl px-6" value={formData.preferredAgeRange} onChange={e => setFormData({...formData, preferredAgeRange: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Nivel de Idioma Local</Label>
                      <Input placeholder="Ej: B2 Español obligatorio" className="h-14 bg-white/5 border-none rounded-2xl px-6" value={formData.languageLevel} onChange={e => setFormData({...formData, languageLevel: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground ml-2">Documentación Obligatoria</Label>
                      <Input placeholder="Ej: Transfer + Vídeo partidos" className="h-14 bg-white/5 border-none rounded-2xl px-6" value={formData.mandatoryDocs} onChange={e => setFormData({...formData, mandatoryDocs: e.target.value})} />
                    </div>
                  </div>
                </TabsContent>

                <div className="pt-10 border-t border-white/5">
                   <Button onClick={handleSubmit} className="w-full h-20 rounded-[2.5rem] bg-primary text-background font-black uppercase tracking-[0.3em] text-sm shadow-2xl hover:scale-[1.01] transition-transform">
                      LANZAR OFERTA A LA RED <Send className="ml-3 w-6 h-6" />
                   </Button>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        )}
      </main>
    </div>
  );
}
