'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  Wallet, 
  Home, 
  Truck, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Target,
  FileText,
  Users
} from 'lucide-react';
import { TopNav } from '@/components/navigation/top-nav';

interface OfferData {
  id: string;
  position: string;
  clubId: string;
  clubName?: string;
  clubLogo?: string;
  description: string;
  salaryRange: string;
  bonusObjectives?: string;
  location: string;
  accommodation?: string;
  transport?: string;
  healthInsurance?: string;
  requirements?: string;
  onboardingDate: string;
  duration: string;
  role: string;
  teamRole: string;
  teamCategory: string;
  createdAt: string;
  status: string;
}

const InfoCard = ({ title, items, icon: Icon }: { title: string; icon: any; items: Array<{ label: string; value: string; highlight?: boolean }> }) => {
  return (
    <Card className="card-elite rounded-[2rem] bg-[#111827]/40 border-white/5 overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-white/[0.02] p-6">
        <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
          <Icon className="w-4 h-4" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <div key={i} className="space-y-1">
              <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
              <p className={cn("text-sm font-bold", item.highlight ? "text-primary" : "text-white")}>
                {item.value || 'Consultar'}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function OfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const [offer, setOffer] = useState<OfferData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const offerId = params?.id as string;

  const loadOffer = useCallback(async () => {
    if (!db || !offerId) return;

    setIsLoading(true);
    setError(null);

    try {
      const offerRef = doc(db, 'offers', offerId);
      const offerSnap = await getDoc(offerRef);

      if (offerSnap.exists()) {
        const data = offerSnap.data();
        setOffer({
          id: offerSnap.id,
          position: data.position || 'Sin título',
          clubId: data.clubId || '',
          clubName: data.clubName,
          clubLogo: data.clubLogo,
          description: data.description || '',
          salaryRange: data.salaryRange || 'A convenir',
          bonusObjectives: data.bonusObjectives,
          location: data.location || 'No especificada',
          accommodation: data.accommodation,
          transport: data.transport,
          healthInsurance: data.healthInsurance,
          requirements: data.requirements,
          onboardingDate: data.onboardingDate || 'Inmediata',
          duration: data.duration || '--',
          role: data.role || 'Player',
          teamRole: data.teamRole || '--',
          teamCategory: data.teamCategory || '--',
          createdAt: data.createdAt,
          status: data.status || 'active',
        } as OfferData);
      } else {
        setError('La vacante solicitada no existe o ha sido retirada del mercado.');
      }
    } catch (err: any) {
      console.error('Error fetching offer:', err);
      setError('Error en la terminal de datos. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [db, offerId]);

  useEffect(() => {
    if (db && offerId) {
      loadOffer();
    }
  }, [db, offerId, loadOffer]);

  if (isLoading || isUserLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-primary font-black space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="uppercase tracking-[0.3em] text-[10px]">Sincronizando Expediente...</p>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-[#030712] text-white">
        <TopNav />
        <main className="max-w-xl mx-auto px-6 py-20 text-center space-y-6">
          <div className="bg-red-500/10 p-6 rounded-[2.5rem] border border-red-500/20 space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <p className="text-sm font-bold text-red-500 uppercase tracking-widest">{error || 'Expediente no encontrado'}</p>
          </div>
          <Button onClick={() => router.push('/offers')} variant="ghost" className="text-primary font-black uppercase text-[10px] tracking-widest">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Mercado
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white pb-20">
      <TopNav />
      
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16 space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-primary hover:text-primary/80 text-[10px] font-black uppercase tracking-[0.2em] gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> VOLVER
            </button>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  VACANTE {offer.role === 'Player' ? 'JUGADOR' : 'ENTRENADOR'}
                </Badge>
                <Badge className="bg-green-500/10 text-green-500 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {offer.status === 'active' ? 'ACTIVA' : 'CERRADA'}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-7xl font-bold font-headline tracking-tighter uppercase italic leading-none">{offer.position}</h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> {offer.clubName}</span>
                <span className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> {offer.teamCategory}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Publicada: {new Date(offer.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] p-8 rounded-[2.5rem] border border-white/5 text-center space-y-2 min-w-[240px]">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Incorporación</p>
            <p className="text-2xl font-black font-headline text-primary uppercase italic">{offer.onboardingDate}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                title="Módulo Económico"
                icon={Wallet}
                items={[
                  { label: 'Salario Anual (Bruto)', value: offer.salaryRange, highlight: true },
                  { label: 'Duración Contrato', value: offer.duration },
                  { label: 'Bonus por Objetivos', value: offer.bonusObjectives || 'No especificados' },
                ]}
              />

              <InfoCard
                title="Módulo Logístico"
                icon={Truck}
                items={[
                  { label: 'Ubicación', value: offer.location },
                  { label: 'Alojamiento', value: offer.accommodation || 'Consultar' },
                  { label: 'Transporte', value: offer.transport || 'Consultar' },
                  { label: 'Seguro Médico', value: offer.healthInsurance || 'Básico' },
                ]}
              />
            </div>

            <Card className="card-elite rounded-[2.5rem] bg-[#111827]/40 border-white/5 p-10 space-y-6">
              <div className="flex items-center gap-3 text-primary border-b border-white/5 pb-4">
                <FileText className="w-6 h-6" />
                <h2 className="text-xl font-bold font-headline uppercase italic">Proyecto Deportivo</h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                {offer.description || "Sin descripción adicional proporcionada por el club."}
              </p>
            </Card>

            {offer.requirements && (
              <Card className="card-elite rounded-[2.5rem] bg-[#111827]/40 border-white/5 p-10 space-y-6">
                <div className="flex items-center gap-3 text-primary border-b border-white/5 pb-4">
                  <ShieldCheck className="w-6 h-6" />
                  <h2 className="text-xl font-bold font-headline uppercase italic">Requisitos Técnicos</h2>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                  {offer.requirements}
                </p>
              </Card>
            )}
          </div>

          <aside className="space-y-8">
            <Card className="card-elite rounded-[2.5rem] bg-primary text-background p-10 space-y-8 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
               <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    <h3 className="font-black uppercase italic tracking-tighter text-xl leading-none">Postulación Directa</h3>
                  </div>
                  <p className="font-bold text-xs leading-relaxed">Al postularte, tu perfil técnico completo y tu Score IA serán enviados a la secretaría técnica del club.</p>
               </div>
               
               <Button 
                onClick={() => alert("Función de postulación en fase de despliegue.")}
                className="w-full h-16 rounded-2xl bg-background text-primary font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-colors"
               >
                 ENVIAR MI PERFIL
               </Button>

               <div className="pt-4 border-t border-background/20">
                 <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Protocolo SportMatch v2.4</p>
               </div>
            </Card>

            <Card className="card-elite rounded-[2.5rem] bg-[#111827]/40 border-white/5 p-8 text-center space-y-4">
               <Clock className="w-8 h-8 text-muted-foreground mx-auto" />
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                 Esta oferta está sujeta a la disponibilidad del presupuesto institucional del club.
               </p>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
