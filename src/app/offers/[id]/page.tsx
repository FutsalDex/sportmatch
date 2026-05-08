
"use client";

import { use, useMemo } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { TopNav } from '@/components/navigation/top-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Wallet, 
  Clock, 
  Target, 
  ShieldCheck, 
  Truck, 
  Coins, 
  Users, 
  FileText,
  Calendar,
  Globe2,
  Award,
  Send
} from 'lucide-react';
import Link from 'next/link';

export default function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const db = useFirestore();
  const offerRef = useMemoFirebase(() => doc(db, 'offers', id), [db, id]);
  const { data: offer, isLoading } = useDoc(offerRef);

  if (isLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-primary font-black animate-pulse uppercase tracking-[0.3em] text-xs">Sincronizando Protocolo de Vacante...</div>;
  if (!offer) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white font-bold">Oferta no encontrada.</div>;

  return (
    <div className="min-h-screen bg-[#030712] text-white pb-20">
      <TopNav />
      
      <div className="relative pt-16 pb-12 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] md:w-[800px] h-[300px] md:h-[400px] bg-primary/10 blur-[80px] -z-10 rounded-full" />
        
        <div className="max-w-4xl mx-auto space-y-8">
          <Link href="/offers" className="flex items-center text-primary hover:underline text-[10px] font-black uppercase tracking-[0.2em] gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" /> VOLVER AL TABLERO
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <Avatar className="w-32 h-32 rounded-[2rem] border-4 border-primary/20 shadow-2xl">
              <AvatarImage src={offer.clubLogo} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary text-4xl font-black">{offer.clubName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-4 flex-1">
              <div className="space-y-1">
                <Badge className="bg-primary text-background font-black text-[10px] px-4 py-1 mb-2">{offer.teamCategory || 'PROFESIONAL'}</Badge>
                <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter uppercase italic">{offer.position}</h1>
                <p className="text-xl text-muted-foreground font-bold flex items-center justify-center md:justify-start gap-3">
                  <Building2 className="w-5 h-5 text-primary" /> {offer.clubName}
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Badge variant="outline" className="border-white/10 text-white px-4 py-1.5 font-black uppercase text-[10px]">{offer.role}</Badge>
                <Badge variant="outline" className="border-white/10 text-white px-4 py-1.5 font-black uppercase text-[10px]">{offer.onboardingDate}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard icon={Coins} title="Económico" items={[
            { label: 'Rango Salarial', value: offer.salaryRange, highlight: true },
            { label: 'Bonus/Objetivos', value: offer.bonusObjectives || 'No especificado' },
            { label: 'Duración', value: offer.duration }
          ]} />
          
          <InfoCard icon={Truck} title="Logística" items={[
            { label: 'Alojamiento', value: offer.accommodation },
            { label: 'Transporte', value: offer.transport },
            { label: 'Seguro Médico', value: offer.healthInsurance }
          ]} />

          <InfoCard icon={Users} title="ADN y Rol" items={[
            { label: 'Rol en plantilla', value: offer.teamRole },
            { label: 'División', value: offer.teamCategory },
            { label: 'Plan de Carrera', value: offer.careerPlan }
          ]} />

          <InfoCard icon={Award} title="Requisitos" items={[
            { label: 'Pasaporte', value: offer.nationalityRequirement },
            { label: 'Edad Buscada', value: offer.preferredAgeRange || 'Indiferente' },
            { label: 'Idiomas', value: offer.languageLevel }
          ]} />
        </div>

        <div className="space-y-6">
           <SectionTitle icon={FileText} text="Descripción del Proyecto" />
           <Card className="card-elite rounded-[2.5rem] bg-[#111827]/40 border-white/5 p-8 md:p-12">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium">
                {offer.description || 'Sin descripción detallada.'}
              </p>
           </Card>
        </div>

        <div className="space-y-6">
           <SectionTitle icon={ShieldCheck} text="Documentación y Requisitos Técnicos" />
           <Card className="card-elite rounded-[2.5rem] bg-[#111827]/40 border-white/5 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">Requerimientos Técnicos</p>
                    <p className="text-sm text-muted-foreground font-medium">{offer.requirements || 'Contactar para más detalles.'}</p>
                 </div>
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">Documentación Obligatoria</p>
                    <p className="text-sm text-muted-foreground font-medium">{offer.mandatoryDocs || 'Currículum y Vídeos actualizados.'}</p>
                 </div>
              </div>
           </Card>
        </div>

        <div className="pt-10">
           <Button className="w-full h-20 rounded-[2.5rem] bg-primary text-background font-black uppercase tracking-[0.3em] text-sm shadow-[0_0_50px_rgba(234,179,8,0.2)] hover:scale-[1.01] transition-transform">
              POSTULARME A ESTA VACANTE <Send className="ml-3 w-6 h-6" />
           </Button>
        </div>
      </main>
    </div>
  );
}

function InfoCard({ icon: Icon, title, items }: { icon: any, title: string, items: { label: string, value: string, highlight?: boolean }[] }) {
  return (
    <Card className="card-elite rounded-[2rem] bg-[#111827]/40 border-white/5 p-8 space-y-6 hover:border-primary/30 transition-all">
      <div className="flex items-center gap-3 text-primary">
        <Icon className="w-5 h-5" />
        <h3 className="font-black text-xs uppercase tracking-widest">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="space-y-1">
            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
            <p className={cn("text-sm font-bold", item.highlight ? "text-primary" : "text-white")}>{item.value || 'Consultar'}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SectionTitle({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/5 pb-3">
      <Icon className="w-5 h-5 text-primary" />
      <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{text}</h2>
    </div>
  );
}
