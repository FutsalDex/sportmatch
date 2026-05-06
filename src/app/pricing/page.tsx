
"use client";

import { useState, useEffect } from 'react';
import { TopNav } from '@/components/navigation/top-nav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, ShieldCheck, Zap, Star, Users, Award, Trophy, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const PLAYER_PLANS = [
  {
    name: "GRATUITO",
    price: "0 €",
    subtitle: "Siempre gratis",
    features: [
      { text: "Crea tu perfil completo", included: true },
      { text: "Explora perfiles con filtros", included: true },
      { text: "Sigue a otros usuarios", included: true },
      { text: "Filtro 'Perfiles Verificados'", included: false },
      { text: "Valoraciones y reseñas", included: false },
      { text: "Video de presentación", included: false },
      { text: "Mensajes directos", included: false },
    ],
    buttonText: "COMENZAR GRATIS",
    highlight: false
  },
  {
    name: "VERIFICADO",
    price: "9,90 €",
    oldPrice: "19,90 €",
    subtitle: "Jugador Profesional",
    badge: "VERIFICADO ✓",
    features: [
      { text: "Todo lo del plan gratuito", included: true },
      { text: "Badge de perfil verificado", included: true },
      { text: "Aparecer en filtro exclusivo", included: true },
      { text: "Valoraciones y reseñas", included: true },
      { text: "Subir vídeo de presentación", included: true },
      { text: "Mensajes directos ilimitados", included: true },
    ],
    buttonText: "VERIFICAR POR 1 AÑO",
    highlight: true
  },
  {
    name: "ELITE PRO",
    price: "49,90 €",
    subtitle: "Proyección Profesional",
    badge: "ELITE PRO ✓",
    features: [
      { text: "Todo lo del plan Verificado", included: true },
      { text: "Análisis IA riesgo lesiones", included: true },
      { text: "Comparador head-to-head", included: true },
      { text: "Informe scouting PDF", included: true },
      { text: "Posicionamiento prioritario", included: true },
      { text: "Asesoría marca personal", included: true },
    ],
    buttonText: "SUSCRIBIRSE A ELITE",
    highlight: false,
    dark: true
  }
];

const COACH_PLANS = [
  {
    name: "GRATUITO",
    price: "0 €",
    subtitle: "Para empezar",
    features: [
      { text: "Perfil de entrenador", included: true },
      { text: "Búsqueda de jugadores", included: true },
      { text: "Gestión de red básica", included: true },
      { text: "Badge de verificación", included: false },
      { text: "Publicación de metodología", included: false },
      { text: "Mensajería directa", included: false },
    ],
    buttonText: "COMENZAR GRATIS",
    highlight: false
  },
  {
    name: "ESTRATEGIA",
    price: "14,90 €",
    subtitle: "Entrenador Verificado",
    badge: "VERIFICADO ✓",
    features: [
      { text: "Todo lo del plan gratuito", included: true },
      { text: "Badge verificado", included: true },
      { text: "Muestra tu metodología en vídeo", included: true },
      { text: "Filtro exclusivo para clubes", included: true },
      { text: "Mensajes ilimitados", included: true },
      { text: "Gestión de plantilla básica", included: true },
    ],
    buttonText: "VERIFICAR AHORA",
    highlight: true
  },
  {
    name: "MASTER ELITE",
    price: "79,90 €",
    subtitle: "Liderazgo Táctico",
    badge: "MASTER ELITE ✓",
    features: [
      { text: "Todo lo del plan Estrategia", included: true },
      { text: "Análisis IA táctico avanzado", included: true },
      { text: "Comparador metodologías", included: true },
      { text: "Reportes de scouting equipo", included: true },
      { text: "Acceso a vacantes premium", included: true },
      { text: "Soporte legal deportivo", included: true },
    ],
    buttonText: "PLAN MAESTRÍA",
    highlight: false,
    dark: true
  }
];

export default function PricingPage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const userDocRef = useMemoFirebase(() => {
    return user ? doc(db, 'users', user.uid) : null;
  }, [db, user?.uid]);

  const { data: userData } = useDoc(userDocRef);
  const [activeRole, setActiveRole] = useState<'Player' | 'Coach'>('Player');

  useEffect(() => {
    if (userData?.role === 'Player' || userData?.role === 'Coach') {
      setActiveRole(userData.role);
    }
  }, [userData?.role]);

  const currentPlans = activeRole === 'Player' ? PLAYER_PLANS : COACH_PLANS;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-6 py-20 space-y-20">
        {/* Header Section */}
        <header className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              Suscripciones de Élite
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold font-headline tracking-tighter leading-none">
              Impulsa tu <span className="text-primary italic">Carrera</span>
            </h1>
          </div>

          <Tabs 
            value={activeRole} 
            onValueChange={(v) => setActiveRole(v as 'Player' | 'Coach')} 
            className="w-full max-w-md mx-auto"
          >
            <TabsList className="grid w-full grid-cols-2 bg-[#111827] border border-white/5 rounded-2xl h-14 p-1">
              <TabsTrigger 
                value="Player" 
                className="rounded-xl font-bold text-xs uppercase tracking-[0.2em] data-[state=active]:bg-primary data-[state=active]:text-background"
              >
                <Target className="w-4 h-4 mr-2" /> Jugador
              </TabsTrigger>
              <TabsTrigger 
                value="Coach" 
                className="rounded-xl font-bold text-xs uppercase tracking-[0.2em] data-[state=active]:bg-primary data-[state=active]:text-background"
              >
                <Trophy className="w-4 h-4 mr-2" /> Entrenador
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </header>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-10">
          {currentPlans.map((plan, i) => (
            <Card 
              key={i} 
              className={cn(
                "card-elite rounded-[3rem] border-white/5 flex flex-col transition-all duration-500 relative overflow-hidden",
                plan.highlight && "border-primary/40 shadow-[0_0_60px_rgba(234,179,8,0.15)] scale-105 z-10",
                plan.dark && "bg-[#090e1a] border-primary/20"
              )}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
              )}

              {plan.dark && (
                <div className="absolute -top-12 -right-12 bg-primary/10 w-40 h-40 blur-[80px] rounded-full" />
              )}
              
              <CardHeader className="p-10 pb-6 text-center space-y-4 relative z-10">
                <div className="flex justify-center">
                  {plan.badge ? (
                    <Badge className={cn(
                      "border-none px-4 py-1 text-[10px] font-black tracking-widest uppercase",
                      plan.dark ? "bg-white/10 text-white" : "bg-primary/20 text-primary"
                    )}>
                      {plan.badge}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-white/10 text-muted-foreground px-4 py-1 text-[10px] font-black tracking-widest uppercase">
                      {plan.name}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  {plan.oldPrice && (
                    <p className="text-muted-foreground/50 line-through text-sm font-bold">{plan.oldPrice}</p>
                  )}
                  <p className="text-5xl font-black font-headline tracking-tighter">
                    {plan.price}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest pt-2">
                    {plan.subtitle}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="p-10 pt-0 flex-1 flex flex-col relative z-10">
                <div className="space-y-4 flex-1">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className={cn(
                      "flex items-start gap-3 text-sm font-medium",
                      !feature.included && "text-muted-foreground/40"
                    )}>
                      {feature.included ? (
                        <Check className={cn("w-4 h-4 mt-0.5", plan.dark ? "text-white" : "text-primary")} />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground mt-0.5" />
                      )}
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-10">
                  <Button 
                    className={cn(
                      "w-full h-16 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all",
                      plan.highlight 
                        ? "bg-primary text-background hover:bg-primary/90 shadow-[0_0_30px_rgba(234,179,8,0.2)]" 
                        : plan.dark
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                    )}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer info */}
        <footer className="text-center space-y-4 max-w-2xl mx-auto opacity-60">
          <p className="text-[10px] text-muted-foreground font-medium leading-relaxed uppercase tracking-widest">
            Planes diseñados para ecosistemas profesionales · Facturación anual · Sin renovación automática. <br />
            Para clubes o agencias, contactar con nuestro equipo de ventas.
          </p>
          <div className="flex justify-center gap-8">
             <ShieldCheck className="w-5 h-5" />
             <Zap className="w-5 h-5" />
             <Star className="w-5 h-5" />
             <Users className="w-5 h-5" />
             <Award className="w-5 h-5" />
          </div>
        </footer>
      </main>
    </div>
  );
}
