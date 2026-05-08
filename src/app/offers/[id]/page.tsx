'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider'; // 👈 Cambia a useFirebase
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Calendar, DollarSign, Home, Car, Shield, Clock, AlertCircle } from 'lucide-react';

interface OfferData {
  id: string;
  title: string;
  clubId: string;
  clubName?: string;
  description: string;
  salary: number;
  bonus?: string;
  location: string;
  accommodation?: string;
  transport?: string;
  healthInsurance?: boolean;
  requirements?: string[];
  deadline: Date;
  createdAt: Date;
  status: 'active' | 'closed' | 'filled';
}

const InfoCard = ({ title, items }: { title: string; items: Array<{ label: string; value: string; highlight?: boolean }> }) => {
  return (
    <Card className="bg-black/50 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
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
  const { firestore, user, isUserLoading } = useFirebase(); // 👈 Usa useFirebase
  const [offer, setOffer] = useState<OfferData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const offerId = params?.id as string;

  const loadOffer = useCallback(async () => {
    if (!firestore || !offerId) {
      console.log('Missing firestore or offerId:', { firestore: !!firestore, offerId });
      return;
    }

    console.log('Loading offer:', offerId);
    setIsLoading(true);
    setError(null);

    try {
      const offerRef = doc(firestore, 'offers', offerId);
      const offerSnap = await getDoc(offerRef);

      if (offerSnap.exists()) {
        const data = offerSnap.data();
        console.log('Offer data loaded:', data);
        
        setOffer({
          id: offerSnap.id,
          title: data.title || 'Sin título',
          clubId: data.clubId || '',
          clubName: data.clubName,
          description: data.description || '',
          salary: data.salary || 0,
          bonus: data.bonus,
          location: data.location || 'No especificada',
          accommodation: data.accommodation,
          transport: data.transport,
          healthInsurance: data.healthInsurance,
          requirements: data.requirements || [],
          deadline: data.deadline?.toDate?.() || new Date(),
          createdAt: data.createdAt?.toDate?.() || new Date(),
          status: data.status || 'active',
        });
      } else {
        setError('Oferta no encontrada');
      }
    } catch (err: any) {
      console.error('Error fetching offer:', err);
      setError(err.message || 'Error al cargar la oferta');
    } finally {
      setIsLoading(false);
    }
  }, [firestore, offerId]);

  useEffect(() => {
    if (!firestore) {
      console.log('Waiting for firestore...');
      return;
    }

    if (!offerId) {
      console.log('No offerId provided');
      setError('ID de oferta no válido');
      setIsLoading(false);
      return;
    }

    loadOffer();
  }, [firestore, offerId, loadOffer]);

  // Mostrar loading
  if (isLoading || isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground font-mono">Cargando oferta...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error || !offer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-red-500/10 border-red-500/50">
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p className="text-red-500 font-medium">{error || 'Oferta no encontrada'}</p>
              <Button onClick={() => router.push('/offers')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al mercado
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const daysRemaining = Math.ceil((offer.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-zinc-800">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{offer.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span>{offer.clubName || 'Club'}</span>
              <span>•</span>
              <Calendar className="w-4 h-4" />
              <span>{offer.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
          <Badge variant={offer.status === 'active' ? 'default' : 'secondary'}>
            {offer.status === 'active' ? 'Activa' : offer.status === 'filled' ? 'Cubierta' : 'Cerrada'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <InfoCard
            title="Módulo Económico"
            items={[
              { label: 'Salario', value: `€${offer.salary.toLocaleString()}/mes`, highlight: true },
              { label: 'Bonus por objetivos', value: offer.bonus || 'No especificado' },
            ]}
          />

          <InfoCard
            title="Módulo Logístico"
            items={[
              { label: 'Ubicación', value: offer.location },
              { label: 'Alojamiento', value: offer.accommodation || 'No incluido' },
              { label: 'Transporte', value: offer.transport || 'No incluido' },
              { label: 'Seguro médico', value: offer.healthInsurance ? 'Incluido' : 'No incluido' },
            ]}
          />

          {offer.requirements && offer.requirements.length > 0 && (
            <Card className="bg-black/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Requisitos Técnicos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {offer.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-gray-300">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-black/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Descripción del puesto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 whitespace-pre-wrap">{offer.description}</p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Plazo de inscripción</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Fecha límite:</span>
                </div>
                <span className={`font-bold ${daysRemaining < 7 ? 'text-red-500' : 'text-white'}`}>
                  {offer.deadline.toLocaleDateString()} ({daysRemaining} días)
                </span>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-6 text-lg"
            onClick={() => {
              if (!user) {
                router.push('/auth/login?redirect=' + encodeURIComponent(`/offers/${offerId}`));
              } else {
                alert('Función de postulación en desarrollo');
              }
            }}
          >
            {user ? 'Postularme a esta oferta' : 'Iniciar sesión para postular'}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Al postularte, tu perfil será compartido con el club para evaluación.
          </p>
        </div>
      </div>
    </div>
  );
}