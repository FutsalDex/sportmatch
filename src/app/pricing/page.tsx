
"use client";

import { TopNav } from '@/components/navigation/top-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ShieldCheck, Zap, Star, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const PLANS = [
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
    subtitle: "Jugador · Entrenador · Representante",
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
    name: "CLUB",
    price: "GRATIS",
    subtitle: "Para organizaciones y clubes",
    badge: "CLUB ✓",
    features: [
      { text: "Todo lo del plan Verificado", included: true },
      { text: "Perfil de club u organización", included: true },
      { text: "Mayor visibilidad en búsquedas", included: true },
      { text: "Soporte prioritario 24/7", included: true },
      { text: "Panel de gestión de cantera", included: true },
    ],
    buttonText: "SOLICITAR INFORMACIÓN",
    highlight: false
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-6 py-20 space-y-20">
        {/* Header Section */}
        <header className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold font-headline tracking-tighter leading-none">
            Verificación <span className="text-primary italic">Anual</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            Pago único por 1 año de verificación. Sin renovación automática. <br />
            Empieza gratis y verifica cuando quieras destacar en la red global.
          </p>
        </header>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, i) => (
            <Card 
              key={i} 
              className={cn(
                "card-elite rounded-[3rem] border-white/5 flex flex-col transition-all duration-500 relative overflow-hidden",
                plan.highlight && "border-primary/40 shadow-[0_0_60px_rgba(234,179,8,0.1)] scale-105 z-10"
              )}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              )}
              
              <CardHeader className="p-10 pb-6 text-center space-y-4">
                <div className="flex justify-center">
                  {plan.badge ? (
                    <Badge className="bg-primary/20 text-primary border-none px-4 py-1 text-[10px] font-black tracking-widest uppercase">
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

              <CardContent className="p-10 pt-0 flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className={cn(
                      "flex items-start gap-3 text-sm font-medium",
                      !feature.included && "text-muted-foreground/40"
                    )}>
                      {feature.included ? (
                        <Check className="w-4 h-4 text-primary mt-0.5" />
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
        <footer className="text-center space-y-4 max-w-2xl mx-auto">
          <p className="text-[10px] text-muted-foreground font-medium leading-relaxed uppercase tracking-widest opacity-60">
            Pago único · La verificación es válida durante 1 año desde la compra · No se renueva automáticamente. <br />
            Impuestos incluidos. El precio final puede variar según tu país de residencia.
          </p>
          <div className="flex justify-center gap-8 opacity-40">
             <ShieldCheck className="w-5 h-5" />
             <Zap className="w-5 h-5" />
             <Star className="w-5 h-5" />
             <Users className="w-5 h-5" />
          </div>
        </footer>
      </main>
    </div>
  );
}
