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
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_USERS, MOCK_PROFILES, User, UserProfile } from '@/lib/db-mock';
import Link from 'next/link';
import { generateProfileAnalysis } from '@/ai/flows/generate-profile-analysis';

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

  if (!user) return <div className="p-10 text-center">Cargando perfil...</div>;

  const handleMatch = async () => {
    setIsMatching(true);
    // Simulate API call
    setTimeout(() => {
      setIsMatching(false);
      setMatchSent(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Profile Header */}
      <div className="relative bg-primary px-4 pt-12 pb-24 overflow-hidden">
        <Link href="/search" className="absolute top-4 left-4 z-20 text-white/80 hover:text-white transition-colors">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </div>
        </Link>
        
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Zap size={200} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center text-white space-y-3">
          <div className="relative">
            <Avatar className="w-28 h-28 border-4 border-white/20 shadow-xl rounded-2xl overflow-hidden">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="text-2xl">{user.name.substring(0,2)}</AvatarFallback>
            </Avatar>
            {user.verificationStatus === 'verified' && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-white/80 font-medium">{user.role} • {user.discipline}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Badge className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
              <MapPin className="w-3 h-3 mr-1" /> {user.province}
            </Badge>
            <Badge className="bg-accent text-accent-foreground border-none font-bold">
              Score: {user.score}
            </Badge>
            <Badge className="bg-white text-primary font-bold">
              {user.level}
            </Badge>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 -mt-10 bg-background rounded-t-[2.5rem] px-4 pt-8 pb-20 relative z-10 space-y-6">
        {/* Match Button */}
        {!matchSent ? (
          <Button 
            onClick={handleMatch}
            disabled={isMatching}
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90"
          >
            {isMatching ? "Enviando..." : "Solicitar Match"} <Zap className="ml-2 w-5 h-5 fill-white" />
          </Button>
        ) : (
          <Button 
            disabled
            className="w-full h-14 rounded-2xl text-lg font-bold bg-green-500 text-white opacity-100"
          >
            Solicitud Enviada <MessageCircle className="ml-2 w-5 h-5" />
          </Button>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50 rounded-xl h-12">
            <TabsTrigger value="overview" className="rounded-lg">Info</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg">Carrera</TabsTrigger>
            <TabsTrigger value="ai" className="rounded-lg">IA Insight</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Biografía</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {profile?.bio || "No hay biografía disponible para este perfil."}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-none shadow-sm rounded-2xl bg-white">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">Logros</span>
                  <span className="font-bold">{profile?.achievements?.length || 0}</span>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm rounded-2xl bg-white">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                  <div className="p-2 bg-accent/20 rounded-full text-accent-foreground">
                    <Play className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">Videos</span>
                  <span className="font-bold">{profile?.videos?.length || 0}</span>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6 space-y-6">
            <Card className="border-none shadow-sm rounded-2xl bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" /> Historial de Equipos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.teamHistory?.map((team, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-xl border border-border/50">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-primary shadow-sm">
                      {team[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{team}</p>
                      <p className="text-xs text-muted-foreground">Última temporada</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="mt-6 space-y-4">
            <div className="p-4 bg-primary rounded-2xl text-white space-y-3 shadow-lg shadow-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 fill-accent text-accent" />
                  <span className="font-bold text-lg">Análisis de Talento IA</span>
                </div>
                <Badge className="bg-white/20 border-none text-[10px] uppercase font-bold">Beta</Badge>
              </div>
              <p className="text-sm opacity-90 leading-relaxed italic">
                "{profile?.summary || "Generando resumen inteligente..."}"
              </p>
            </div>

            <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
              <CardHeader className="bg-secondary/20 pb-4">
                <CardTitle className="text-base flex items-center text-primary">
                  <TrendingUp className="w-5 h-5 mr-2" /> Fortalezas Clave
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                {['Visión de juego', 'Capacidad técnica', 'Liderazgo'].map((s, i) => (
                  <div key={i} className="flex items-center text-sm p-2 rounded-lg bg-green-50 text-green-700 font-medium">
                    <ShieldCheck className="w-4 h-4 mr-2" /> {s}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
              <CardHeader className="bg-secondary/20 pb-4">
                <CardTitle className="text-base flex items-center text-destructive">
                  <AlertCircle className="w-5 h-5 mr-2" /> Áreas de Mejora
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                {['Resistencia física en minutos finales', 'Uso de pierna no hábil'].map((w, i) => (
                  <div key={i} className="flex items-center text-sm p-2 rounded-lg bg-red-50 text-red-700 font-medium">
                    <AlertCircle className="w-4 h-4 mr-2" /> {w}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}