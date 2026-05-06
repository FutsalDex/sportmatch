"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Check, X, Phone, Mail, ExternalLink, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TopNav } from '@/components/navigation/top-nav';

const MOCK_MATCHES = [
  {
    id: 'm1',
    user: { id: 'u3', name: 'Rayo Majadahonda', role: 'Club', avatarUrl: 'https://picsum.photos/seed/u3/100/100' },
    status: 'accepted',
    contact: { phone: '+34 600 000 000', email: 'scouting@rayo.es' }
  },
  {
    id: 'm2',
    user: { id: 'u2', name: 'Ana García', role: 'Coach', avatarUrl: 'https://picsum.photos/seed/u2/100/100' },
    status: 'pending'
  }
];

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-4xl mx-auto w-full px-6 py-12 space-y-10">
        <header className="space-y-2">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            Red de Contactos
          </Badge>
          <h1 className="text-5xl font-bold font-headline tracking-tighter">Mis Conexiones</h1>
          <p className="text-muted-foreground font-medium">Gestiona tus matches y accesos a perfiles privados.</p>
        </header>

        <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#111827] border border-white/5 rounded-2xl h-14 p-1">
            <TabsTrigger value="active" className="rounded-xl font-bold text-xs uppercase tracking-[0.2em] data-[state=active]:bg-primary data-[state=active]:text-background">
              Aceptados
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-xl font-bold text-xs uppercase tracking-[0.2em] data-[state=active]:bg-primary data-[state=active]:text-background">
              Pendientes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-10 space-y-6">
            {MOCK_MATCHES.filter(m => m.status === 'accepted').map((match) => (
              <Card key={match.id} className="card-elite rounded-[2.5rem] overflow-hidden border-primary/10">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <Avatar className="w-20 h-20 rounded-[1.5rem] border-2 border-white/5">
                        <AvatarImage src={match.user.avatarUrl} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{match.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h3 className="font-bold text-2xl font-headline tracking-tight">{match.user.name}</h3>
                        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">{match.user.role}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500 border-none font-black text-[10px] tracking-widest px-4 py-1.5">
                      MATCH ACTIVO
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 font-black uppercase text-[10px] tracking-widest gap-3">
                      <Phone className="w-4 h-4 text-primary" /> Llamar
                    </Button>
                    <Button variant="outline" className="h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 font-black uppercase text-[10px] tracking-widest gap-3">
                      <Mail className="w-4 h-4 text-primary" /> Email
                    </Button>
                  </div>
                  
                  <Button className="w-full h-14 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 border-none font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                    Ver Perfil Completo <ExternalLink className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {MOCK_MATCHES.filter(m => m.status === 'accepted').length === 0 && (
              <div className="text-center py-20 card-elite rounded-[3rem] border-dashed border-white/10">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No tienes conexiones activas aún.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-10 space-y-6">
            {MOCK_MATCHES.filter(m => m.status === 'pending').map((match) => (
              <Card key={match.id} className="card-elite rounded-[2.5rem] border-white/5">
                <CardContent className="p-8 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <Avatar className="w-16 h-16 rounded-2xl border-2 border-white/5">
                      <AvatarImage src={match.user.avatarUrl} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{match.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-bold text-xl font-headline tracking-tight">{match.user.name}</h3>
                      <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest">Esperando respuesta...</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button size="icon" variant="outline" className="w-12 h-12 rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/10">
                      <X className="w-5 h-5" />
                    </Button>
                    <Button size="icon" className="w-12 h-12 rounded-xl bg-green-500 text-background hover:bg-green-600">
                      <Check className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
