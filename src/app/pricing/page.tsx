
"use client";

import { useState, useEffect } from 'react';
import { TopNav } from '@/components/navigation/top-nav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Check, 
  X, 
  ShieldCheck, 
  Zap, 
  Star, 
  Users, 
  Award, 
  Trophy, 
  Target,
  Timer,
  Presentation,
  FileText,
  User,
  Search,
  Scale,
  Activity,
  TrendingUp,
  MessageCircle,
  Play,
  BarChart3,
  Gavel
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const PLAYER_PLANS = [
  {
    name: "ELITE FREE",
    price: "0 €",
    subtitle: "Siempre gratis",
    features: [
      { text: "Crea tu perfil completo", included: true, icon: User },
      { text: "Explora perfiles con filtros", included: true, icon: Search },
      { text: "Sigue a otros usuarios", included: true, icon: Users },
      { text: "Filtro 'Perfiles Verificados'", included: false, icon: ShieldCheck },
      { text: "Valoraciones y reseñas", included: false, icon: Star },
      { text: "Video de presentación", included: false, icon: Play },
      { text: "Mensajes directos", included: false, icon: MessageCircle },
    ],
    buttonText: "COMENZAR GRATIS",
    highlight: false
  },
  {
    name: "ELITE VERIFICADO",
    price: "9,90 €",
    oldPrice: "19,90 €",
    subtitle: "Jugador Profesional",
    badge: "ELITE VERIFICADO ✓",
    features: [
      { text: "Todo lo del plan gratuito", included: true, icon: Check },
      { text: "Badge de perfil verificado", included: true, icon: ShieldCheck },
      { text: "Aparecer en filtro exclusivo", included: true, icon: Award },
      { text: "Valoraciones y reseñas", included: true, icon: Star },
      { text: "Subir vídeo de presentación", included: true, icon: Play },
      { text: "Mensajes directos ilimitados", included: true, icon: MessageCircle },
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
      { text: "Todo lo del plan Verificado", included: true, icon: Check },
      { text: "Análisis IA riesgo lesiones", included: true, icon: Activity },
      { text: "Comparador head-to-head", included: true, icon: BarChart3 },
      { text: "Informe scouting PDF", included: true, icon: FileText },
      { text: "Posicionamiento prioritario", included: true, icon: TrendingUp },
      { text: "Asesoría marca personal", included: true, icon: Award },
    ],
    buttonText: "SUSCRIBIRSE A ELITE",
    highlight: false,
    dark: true
  }
];

const COACH_PLANS = [
  {
    name: "ELITE FREE",
    price: "0 €",
    subtitle: "Para empezar",
    features: [
      { text: "Perfil de entrenador", included: true, icon: User },
      { text: "Búsqueda de jugadores", included: true, icon: Target },
      { text: "Gestión de red básica", included: true, icon: Users },
      { text: "Badge de verificación", included: false, icon: ShieldCheck },
      { text: "Publicación metodología", included: false, icon: Presentation },
      { text: "Mensajería directa", included: false, icon: MessageCircle },
    ],
    buttonText: "COMENZAR GRATIS",
    highlight: false
  },
  {
    name: "ELITE VERIFICADO",
    price: "14,90 €",
    subtitle: "Entrenador Verificado",
    badge: "ELITE VERIFICADO ✓",
    features: [
      { text: "Todo lo del plan gratuito", included: true, icon: Check },
      { text: "Badge verificado", included: true, icon: ShieldCheck },
      { text: "Metodología en vídeo", included: true, icon: Presentation },
      { text: "Filtro exclusivo para clubes", included: true, icon: Award },
      { text: "Mensajes ilimitados", included: true, icon: MessageCircle },
      { text: "Gestión de sesiones", included: true, icon: Timer },
    ],
    buttonText: "VERIFICAR AHORA",
    highlight: true
  },
  {
    name: "ELITE PRO",
    price: "79,90 €",
    subtitle: "Liderazgo Táctico",
    badge: "ELITE PRO ✓",
    features: [
      { text: "Todo lo del plan Estrategia", included: true, icon: Check },
      { text: "Análisis IA táctico", included: true, icon: Zap },
      { text: "Comparador metodologías", included: true, icon: BarChart3 },
      { text: "Reportes scouting equipo", included: true, icon: FileText },
      { text: "Acceso vacantes premium", included: true, icon: Trophy },
      { text: "Soporte legal deportivo", included: true, icon: Gavel },
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
                  {plan.features.map((feature, idx) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div key={idx} className={cn(
                        "flex items-start gap-3 text-sm font-medium",
                        !feature.included && "text-muted-foreground/40"
                      )}>
                        <div className={cn(
                          "mt-0.5 p-1 rounded-md",
                          feature.included 
                            ? (plan.dark ? "bg-white/5" : "bg-primary/5") 
                            : "opacity-20"
                        )}>
                          <FeatureIcon className={cn(
                            "w-3.5 h-3.5", 
                            feature.included 
                              ? (plan.dark ? "text-white" : "text-primary") 
                              : "text-muted-foreground"
                          )} />
                        </div>
                        <span className="pt-0.5">{feature.text}</span>
                        {feature.included && <Check className="w-3 h-3 ml-auto opacity-40" />}
                      </div>
                    );
                  })}
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
