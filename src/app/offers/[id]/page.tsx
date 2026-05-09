'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { TopNav } from '@/components/navigation/top-nav';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  DollarSign, 
  Home, 
  Clock, 
  AlertCircle,
  Target,
  Briefcase,
  Users,
  Globe2,
  FileCheck,
  UserCheck
} from 'lucide-react';

interface OfferData {
  id: string;
  title: string;
  clubId: string;
  clubName?: string;
  clubLogo?: string;
  description: string;
  salaryRange?: string;
  bonusObjectives?: string;
  location: string;
  accommodation?: string;
  transport?: string;
  healthInsurance?: string;
  careerPlan?: string;
  nationalityRequirement?: string;
  preferredAgeRange?: string;
  languageLevel?: string;
  mandatoryDocs?: string;
  teamRole?: string;
  competition?: string;
  category?: string;
  onboardingDate?: string;
  duration?: string;
  createdAt: Date;
  status: string;
  role: string;
}

const InfoCard = ({ title, items, icon: Icon }: { title: string; items: Array<{ label: string; value: string; highlight?: boolean }>; icon?: any }) => {
  return (
    <Card className="bg-black/50 border-zinc-800 rounded-[2rem] overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
          <CardTitle className="text-lg text-primary uppercase italic font-headline tracking-tight">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
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
        
        let creationDate = new Date();
        if (data.createdAt?.toDate) creationDate = data.createdAt.toDate();
        else if (data.createdAt) creationDate = new Date(data.createdAt);

        setOffer({
          id: offerSnap.id,
          title: data.position || 'Sin título',
          clubId: data.clubId || '',
          clubName: data.clubName,
          clubLogo: data.clubLogo,
          description: data.description || '',
          salaryRange: data.salaryRange,
          bonusObjectives: data.bonusObjectives,
          location: data.location || 'No especificada',
          accommodation: data.accommodation,
          transport: data.transport,
          healthInsurance: data.healthInsurance,
          careerPlan: data.careerPlan,
          nationalityRequirement: data.nationalityRequirement,
          preferredAgeRange: data.preferredAgeRange,
          languageLevel: data.languageLevel,
          mandatoryDocs: data.mandatoryDocs,
          teamRole: data.teamRole,
          competition: data.competition || data.teamCategory,
          category: data.category,
          onboardingDate: data.onboardingDate,
          duration: data.duration,
          createdAt: creationDate,
          status: data.status || 'active',
          role: data.role || 'Player'
        });
      } else {
        setError('Oferta no localizada en el núcleo de datos');
      }
    } catch (err: any) {
      console.error('Error fetching offer:', err);
      setError('Error de conexión con la red SportMatch');
    } finally {
      setIsLoading(false);
    }
  }, [db, offerId]);

  useEffect(() => {
    if (db && offerId) {
      loadOffer();
    }
  }, [db, offerId, loadOffer]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-primary font-black animate-pulse uppercase tracking-[0.3em] text-xs">
        Sincronizando Dossier de Vacante...
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-6 p-6">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <p className="text-red-500 font-bold uppercase tracking-widest text-sm">{error || 'Oferta no encontrada'}</p>
        <Button onClick={() => router.push('/offers')} variant="outline" className="rounded-2xl border-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER AL TABLERO
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-6">
          <Button variant="ghost" onClick={() => router.back()} className="hover:bg-white/5 text-primary font-black uppercase text-[10px] tracking-widest px-0">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 rounded-[1.5rem] bg-[#111827] border-2 border-white/5 flex items-center justify-center overflow-hidden">
                {offer.clubLogo ? (
                  <Image src={offer.clubLogo} alt={offer.clubName || 'Club'} fill className="object-cover" />
                ) : (
                  <Building2 className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl md:text-5xl font-black font-headline tracking-tighter uppercase italic">{offer.title}</h1>
                <div className="flex items-center gap-3 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                  <Building2 className="w-3.5 h-3.5 text-primary" /> {offer.clubName}
                  <span className="opacity-20">•</span>
                  <Calendar className="w-3.5 h-3.5 text-primary" /> {offer.createdAt.toLocaleDateString()}
                </div>
              </div>
            </div>
            <Badge className={cn(
              "h-10 px-6 rounded-full font-black text-[10px] tracking-[0.2em] uppercase",
              offer.status === 'active' ? "bg-primary text-background" : "bg-white/10 text-muted-foreground"
            )}>
              {offer.status === 'active' ? '🟢 Vacante Activa' : '🔴 Finalizada'}
            </Badge>
          </div>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <InfoCard
              title="Módulo Económico"
              icon={DollarSign}
              items={[
                { label: 'Salario Ofrecido', value: offer.salaryRange || 'A convenir', highlight: true },
                { label: 'Duración Contrato', value: offer.duration || 'Sin especificar' },
              ]}
            />

            <Card className="bg-black/50 border-zinc-800 rounded-[2.5rem] p-8 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Target className="w-5 h-5" />
                <h3 className="font-black text-xs uppercase tracking-widest">Bonus por Objetivos</h3>
              </div>
              <p className="text-sm text-gray-300 font-medium leading-relaxed">
                {offer.bonusObjectives || 'Sin primas adicionales registradas.'}
              </p>
            </Card>

            <InfoCard
              title="Módulo Logístico"
              icon={Home}
              items={[
                { label: 'Ubicación', value: offer.location },
                { label: 'Alojamiento', value: offer.accommodation || 'No incluido' },
                { label: 'Transporte', value: offer.transport || 'No incluido' },
                { label: 'Seguro médico', value: offer.healthInsurance || 'No incluido' },
                { label: 'Plan de Carrera', value: offer.careerPlan || 'No incluido' },
              ]}
            />

            <Card className="bg-[#111827]/40 border-white/5 rounded-[2.5rem] p-8 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Briefcase className="w-5 h-5" />
                <h3 className="font-black text-xs uppercase tracking-widest">Descripción del Proyecto</h3>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                {offer.description}
              </p>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-primary/5 border-primary/20 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <Users className="w-5 h-5" />
                <h3 className="font-black text-xs uppercase tracking-widest">Incorporación y Rol</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-[10px] font-black text-muted-foreground uppercase">Incorporación</span>
                  <span className="text-xs font-bold text-white uppercase">{offer.onboardingDate || 'Inmediata'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-[10px] font-black text-muted-foreground uppercase">Rol en Plantilla</span>
                  <span className="text-xs font-bold text-primary uppercase">{offer.teamRole || 'Sin determinar'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-[10px] font-black text-muted-foreground uppercase">Competición</span>
                  <span className="text-xs font-bold text-white uppercase">{offer.competition || 'Élite'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                   <span className="text-[10px] font-black text-muted-foreground uppercase">Categoría</span>
                   <span className="text-xs font-bold text-white uppercase">{offer.category || 'Senior'}</span>
                </div>
              </div>
            </Card>

            <Card className="bg-black/50 border-zinc-800 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <UserCheck className="w-5 h-5" />
                <h3 className="font-black text-xs uppercase tracking-widest">Filtros de Candidato</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"><Globe2 className="w-3 h-3" /> Pasaporte</p>
                  <p className="text-xs font-bold text-white uppercase">{offer.nationalityRequirement || 'Indiferente'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"><Clock className="w-3 h-3" /> Edad Preferente</p>
                  <p className="text-xs font-bold text-white uppercase">{offer.preferredAgeRange || 'Sin límite'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"><FileCheck className="w-3 h-3" /> Idioma Local</p>
                  <p className="text-xs font-bold text-white uppercase">{offer.languageLevel || 'No requerido'}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2">
                <p className="text-[8px] font-black text-primary uppercase tracking-widest">Documentación Obligatoria</p>
                <p className="text-[10px] text-gray-400 leading-tight italic">{offer.mandatoryDocs || 'No se requiere documentación específica previa.'}</p>
              </div>
            </Card>

            <div className="space-y-4 pt-4">
              <Button 
                className="w-full h-16 rounded-[2rem] bg-primary text-background font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-transform"
                onClick={() => {
                  alert('Función de postulación técnica en desarrollo');
                }}
              >
                POSTULARME AHORA
              </Button>

              <p className="text-[9px] text-center text-muted-foreground font-medium px-4">
                Al postularte, tu **Dossier de Inteligencia Deportiva** será enviado a la secretaría técnica del club.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}