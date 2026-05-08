"use client";

import { useState, useEffect } from 'react';
import { TopNav } from '@/components/navigation/top-nav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Check, 
  ShieldCheck, 
  Zap, 
  Star, 
  Users, 
  Award, 
  Trophy, 
  Target,
  FileText,
  User,
  Search,
  TrendingUp,
  MessageCircle,
  Play,
  Lock,
  Crown,
  Sparkles
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
      { text: "Perfil técnico básico", included: true, icon: User },
      { text: "Búsqueda de ofertas", included: true, icon: Search },
      { text: "Acceso al ranking", included: true, icon: Zap },
      { text: "Sin análisis de IA", included: false, icon: Award },
      { text: "Book multimedia", included: false, icon: Play },
      { text: "Mensajes directos", included: false, icon: MessageCircle },
    ],
    buttonText: "COMENZAR GRATIS",
    highlight: false
  },
  {
    name: "ELITE VERIFICADO",
    price: "9,99 €",
    subtitle: "Pago Único",
    badge: "ELITE VERIFICADO ✓",
    features: [
      { text: "Lo incluido en el Plan Free", included: true, icon: Check },
      { text: "+10 PUNTOS SCORE IA", included: true, icon: Zap },
      { text: "Insignia de perfil oficial", included: true, icon: ShieldCheck },
      { text: "Desbloquea Book Multimedia", included: true, icon: Play },
      { text: "Biografía optimizada IA", included: true, icon: Star },
      { text: "Prioridad en búsqueda", included: true, icon: TrendingUp },
    ],
    buttonText: "SOLICITAR VERIFICACIÓN",
    highlight: false
  },
  {
    name: "ELITE PRO",
    price: "49,90 €",
    subtitle: "Scouting Profesional",
    badge: "ELITE PRO ✓",
    features: [
      { text: "Lo incluido en el Plan Verificado", included: true, icon: Check },
      { text: "+20 PUNTOS SCORE IA", included: true, icon: Zap },
      { text: "Análisis IA SportMatch", included: true, icon: Award },
      { text: "Informe PDF para clubes", included: true, icon: FileText },
      { text: "Asesor deportivo", included: false, icon: Users },
    ],
    buttonText: "SUSCRIBIRSE A ELITE PRO",
    highlight: true,
    dark: true
  },
  {
    name: "ELITE TOP",
    price: "199,90 €",
    subtitle: "Máximo Rendimiento",
    badge: "ELITE TOP ✓",
    features: [
      { text: "Lo incluido en el Plan Pro", included: true, icon: Check },
      { text: "Asesor deportivo SportMatch", included: true, icon: Users },
      { text: "Informes Técnico Detallado", included: true, icon: FileText },
      { text: "Videanálisis de Alto Nivel", included: true, icon: Play },
      { text: "Estrategia de Contenidos", included: true, icon: Sparkles },
      { text: "Gestión de Pruebas y Showcases", included: true, icon: Target },
      { text: "Contacto con secretarías técnicas", included: true, icon: MessageCircle },
    ],
    buttonText: "ACCEDER A ELITE TOP",
    highlight: false,
    gold: true
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

  const currentPlans = activeRole === 'Player' ? PLAYER_PLANS : PLAYER_PLANS;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-20 space-y-12 md:space-y-20">
        <header className="text-center space-y-6 md:space-y-8 max-w-3xl mx-auto">
          <div className="space-y-3 md:space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 md:px-6 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">
              Terminal de Suscripciones
            </Badge>
            <h1 className="text-4xl md:text-7xl font-bold font-headline tracking-tighter leading-none">
              Acelera tu <span className="text-primary italic">Scouting</span>
            </h1>
            <p className="text-xs md:text-base text-muted-foreground font-medium max-w-xl mx-auto px-4">
              Optimiza tu visibilidad en la red con el respaldo de nuestra Inteligencia Artificial deportiva.
            </p>
          </div>

          <Tabs 
            value={activeRole} 
            onValueChange={(v) => setActiveRole(v as 'Player' | 'Coach')} 
            className="w-full max-w-[280px] md:max-w-md mx-auto"
          >
            <TabsList className="grid w-full grid-cols-2 bg-[#111827] border border-white/5 rounded-xl md:rounded-2xl h-10 md:h-14 p-1">
              <TabsTrigger 
                value="Player" 
                className="rounded-lg md:rounded-xl font-bold text-[9px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] data-[state=active]:bg-primary data-[state=active]:text-background"
              >
                <Target className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> Jugador
              </TabsTrigger>
              <TabsTrigger 
                value="Coach" 
                className="rounded-lg md:rounded-xl font-bold text-[9px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] data-[state=active]:bg-primary data-[state=active]:text-background"
              >
                <Trophy className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> Entrenador
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </header>

        {/* PRICING SCROLL ON MOBILE, 4 COLS ON DESKTOP */}
        <div className="flex lg:grid lg:grid-cols-4 gap-4 md:gap-6 items-stretch pt-4 overflow-x-auto no-scrollbar snap-x-mandatory px-4 pb-8">
          {currentPlans.map((plan, i) => (
            <Card 
              key={i} 
              className={cn(
                "min-w-[85vw] lg:min-w-0 card-elite rounded-[2rem] md:rounded-[2.5rem] border-white/5 flex flex-col transition-all duration-500 relative overflow-hidden snap-center",
                plan.highlight && "border-primary/40 shadow-[0_0_60px_rgba(234,179,8,0.15)] lg:scale-105 z-10",
                plan.dark && "bg-[#090e1a] border-primary/20",
                plan.gold && "bg-[#0c0c0c] border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.1)]"
              )}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              )}
              {plan.gold && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
              )}
              {(plan.dark || plan.gold) && (
                <div className="absolute -top-12 -right-12 bg-primary/10 w-32 h-32 md:w-40 md:h-40 blur-[60px] md:blur-[80px] rounded-full" />
              )}
              
              <CardHeader className="p-6 md:p-8 pb-4 md:pb-6 text-center space-y-3 md:space-y-4 relative z-10">
                <div className="flex justify-center">
                  {plan.badge ? (
                    <Badge className={cn(
                      "border-none px-3 md:px-4 py-1 text-[8px] md:text-[9px] font-black tracking-widest uppercase",
                      plan.dark ? "bg-white/10 text-white" : plan.gold ? "bg-yellow-500 text-black" : "bg-primary text-background"
                    )}>
                      {plan.badge}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-white/10 text-muted-foreground px-3 md:px-4 py-1 text-[8px] md:text-[9px] font-black tracking-widest uppercase">
                      {plan.name}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-black font-headline tracking-tighter">
                    {plan.price}
                  </p>
                  <p className="text-[8px] md:text-[9px] text-muted-foreground font-bold uppercase tracking-widest pt-1">
                    {plan.subtitle}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="p-6 md:p-8 pt-0 flex-1 flex flex-col relative z-10">
                <div className="space-y-3 md:space-y-4 flex-1">
                  {plan.features.map((feature, idx) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div key={idx} className={cn(
                        "flex items-start gap-3 text-[11px] md:text-xs font-medium",
                        !feature.included && "text-muted-foreground/40"
                      )}>
                        <div className={cn(
                          "mt-0.5 p-1 rounded-md",
                          feature.included 
                            ? (plan.dark || plan.gold ? "bg-white/5" : "bg-primary/5") 
                            : "opacity-20"
                        )}>
                          <FeatureIcon className={cn(
                            "w-3 h-3", 
                            feature.included 
                              ? "text-primary" 
                              : "text-muted-foreground"
                          )} />
                        </div>
                        <span className="pt-0.5">{feature.text}</span>
                        {feature.included ? (
                          <Check className="w-2.5 h-2.5 ml-auto opacity-40" />
                        ) : (
                          <Lock className="w-2.5 h-2.5 ml-auto opacity-10" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-8 md:pt-10">
                  <Button 
                    className={cn(
                      "w-full h-12 md:h-14 rounded-xl font-black uppercase text-[8px] md:text-[10px] tracking-[0.1em] transition-all",
                      plan.highlight 
                        ? "bg-primary text-background hover:bg-primary/90 shadow-[0_0_30px_rgba(234,179,8,0.2)]" 
                        : plan.gold
                        ? "bg-yellow-500 text-black hover:bg-yellow-600 shadow-[0_0_30px_rgba(234,179,8,0.3)]"
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

        <footer className="text-center space-y-4 md:space-y-6 max-w-4xl mx-auto opacity-60 px-6">
          <div className="h-px bg-white/10 w-full" />
          <p className="text-[8px] md:text-[9px] text-muted-foreground font-medium leading-relaxed uppercase tracking-widest">
            Planes diseñados para ecosistemas profesionales · Verificación a 9,99€ (Pago único) · Sin renovación automática. <br />
            Los 100 puntos de Score IA se logran combinando Perfil Técnico (85 pts) y el Análisis IA de SportMatch (15 pts). <br />
            El plan Free está limitado a 45 pts totales y 1 temporada en trayectoria.
          </p>
        </footer>
      </main>
    </div>
  );
}
