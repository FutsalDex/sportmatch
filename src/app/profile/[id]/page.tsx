"use client";

import { use, useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Trophy, 
  Calendar, 
  Play, 
  Zap, 
  MessageCircle,
  TrendingUp,
  AlertCircle,
  Target,
  LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_USERS, MOCK_PROFILES, User, UserProfile } from '@/lib/db-mock';
import Link from 'next/link';

export default function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchSent, setMatchSent] = useState(false);

  useEffect(() => {
    const userData = MOCK_USERS.find(u => u.id === id);
    if (userData) {
      setUser(userData);
      setProfile(MOCK_PROFILES[id] || null);
    }
  }, [id]);

  if (!user) return <div className="p-10 text-center text-muted-foreground">Inicializando terminal de scouting...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      {/* Profile Header */}
      <div className="relative pt-12 pb-24 px-6">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
        
        <Link href="/search" className="absolute top-4 left-4 z-20">
          <div className="bg-white/5 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
            <ArrowLeft className="w-5 h-5" />
          </div>
        </Link>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="text-3xl">{user.name.substring(0,2)}</AvatarFallback>
            </Avatar>
            {user.verificationStatus === 'verified' && (
              <div className="absolute -bottom-2 -right-2 bg-primary rounded-2xl p-2 shadow-xl border-4 border-background">
                <ShieldCheck className="w-6 h-6 text-background" />
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <h1 className="text-4xl font-bold font-headline tracking-tighter">{user.name}</h1>
            <p className="text-primary font-bold text-sm tracking-widest uppercase">{user.role} • {user.discipline}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Badge variant="outline" className="bg-white/5 border-white/10 rounded-full px-4">
              <MapPin className="w-3 h-3 mr-2" /> {user.province}
            </Badge>
            <Badge className="bg-primary text-background border-none font-bold rounded-full px-4">
              SCORE {user.score}/100
            </Badge>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 -mt-12 bg-[#030712] rounded-t-[3rem] border-t border-white/5 px-6 pt-10 pb-24 relative z-10 space-y-8">
        {/* Match Button */}
        {!matchSent ? (
          <Button 
            onClick={() => {
              setIsMatching(true);
              setTimeout(() => { setMatchSent(true); setIsMatching(false); }, 1000);
            }}
            disabled={isMatching}
            className="w-full h-16 rounded-[2rem] text-lg font-bold shadow-2xl bg-primary hover:bg-primary/90 text-background"
          >
            {isMatching ? "Analizando..." : "Solicitar Scouting"} <Zap className="ml-2 w-5 h-5 fill-current" />
          </Button>
        ) : (
          <Button 
            disabled
            className="w-full h-16 rounded-[2rem] text-lg font-bold bg-green-500/10 text-green-500 border border-green-500/20"
          >
            Solicitud de Match Enviada <MessageCircle className="ml-2 w-5 h-5" />
          </Button>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 rounded-2xl h-14 p-1">
            <TabsTrigger value="overview" className="rounded-xl font-bold text-xs uppercase tracking-wider">Ficha</TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl font-bold text-xs uppercase tracking-wider">Carrera</TabsTrigger>
            <TabsTrigger value="ai" className="rounded-xl font-bold text-xs uppercase tracking-wider">IA Scout</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="card-elite rounded-[2rem]">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Nivel</Badge>
                  <span className="font-bold text-lg">{user.level}</span>
                </CardContent>
              </Card>
              <Card className="card-elite rounded-[2rem]">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Estado</Badge>
                  <span className="font-bold text-lg text-green-500">Activo</span>
                </CardContent>
              </Card>
            </div>

            <Card className="card-elite rounded-[2rem] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" /> Perfil Técnico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {profile?.bio || "Analizando trayectoria profesional..."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-8 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Cronología de Clubes</h3>
            {profile?.teamHistory?.map((team, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-4 card-elite rounded-2xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary">
                  {team[0]}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base">{team}</p>
                  <p className="text-xs text-muted-foreground uppercase font-medium">Temporada 2023/24</p>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="ai" className="mt-8 space-y-6">
            <div className="p-8 bg-primary rounded-[2.5rem] text-background space-y-4 shadow-[0_0_40px_rgba(234,179,8,0.3)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-6 h-6 fill-background" />
                  <span className="font-bold text-xl font-headline tracking-tight uppercase">Predicción de Trayectoria</span>
                </div>
                <Badge className="bg-background text-primary border-none font-black">ASCENDENTE</Badge>
              </div>
              <p className="text-sm font-medium leading-relaxed italic opacity-90">
                "{profile?.summary || "Generando informe de inteligencia deportiva de alto nivel..."}"
              </p>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-background text-background">Riesgo Lesión: BAJO</Badge>
                <Badge variant="outline" className="border-background text-background">Potencial: ELITE</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" /> Fortalezas Scout
              </h3>
              <div className="grid gap-2">
                {['Visión de juego 360°', 'Potencia en duelos', 'Liderazgo positivo'].map((s, i) => (
                  <div key={i} className="flex items-center text-sm p-4 rounded-2xl bg-white/5 border border-white/5 font-bold">
                    <ShieldCheck className="w-4 h-4 mr-3 text-primary" /> {s}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
