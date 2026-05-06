"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Check, X, Phone, Mail, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <div className="flex flex-col min-h-screen bg-background p-4 space-y-6">
      <header className="pt-6">
        <h1 className="text-3xl font-bold">Mis Conexiones</h1>
        <p className="text-muted-foreground text-sm">Gestiona tus matches y contactos profesionales.</p>
      </header>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary/50 rounded-xl h-12">
          <TabsTrigger value="active" className="rounded-lg">Aceptados</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg">Pendientes</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6 space-y-4">
          {MOCK_MATCHES.filter(m => m.status === 'accepted').map((match) => (
            <Card key={match.id} className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-14 h-14 rounded-xl">
                    <AvatarImage src={match.user.avatarUrl} />
                    <AvatarFallback>{match.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-none">{match.user.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{match.user.role}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Match</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" className="rounded-xl h-12 border-border/50 text-xs font-bold">
                    <Phone className="w-4 h-4 mr-2 text-primary" /> Llamar
                  </Button>
                  <Button variant="outline" className="rounded-xl h-12 border-border/50 text-xs font-bold">
                    <Mail className="w-4 h-4 mr-2 text-primary" /> Email
                  </Button>
                </div>
                
                <Button className="w-full h-12 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold">
                  Ver Perfil Completo <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {MOCK_MATCHES.filter(m => m.status === 'accepted').length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Aún no tienes matches aceptados.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {MOCK_MATCHES.filter(m => m.status === 'pending').map((match) => (
            <Card key={match.id} className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
              <CardContent className="p-4 flex items-center space-x-4">
                <Avatar className="w-14 h-14 rounded-xl">
                  <AvatarImage src={match.user.avatarUrl} />
                  <AvatarFallback>{match.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-lg leading-none">{match.user.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Esperando respuesta...</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" className="rounded-full border-red-100 text-red-600">
                    <X className="w-5 h-5" />
                  </Button>
                  <Button size="icon" className="rounded-full bg-green-500 text-white">
                    <Check className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}