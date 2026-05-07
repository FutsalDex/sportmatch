"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  Star,
  Zap,
  Calendar,
  Search,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { MOCK_USERS, User } from '@/lib/db-mock';
import { TopNav } from '@/components/navigation/top-nav';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function RankingsPage() {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Estados de filtrado
  const [roleFilter, setRoleFilter] = useState<'Player' | 'Coach' | 'all'>('Player');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  
  useEffect(() => {
    const saved = localStorage.getItem('sm_favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (e: React.MouseEvent, userId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    let newFavs;
    if (favorites.includes(userId)) {
      newFavs = favorites.filter(id => id !== userId);
      toast({ title: "Eliminado", description: "Jugador quitado de favoritos." });
    } else {
      newFavs = [...favorites, userId];
      toast({ title: "Guardado", description: "Jugador añadido a tus favoritos." });
    }
    
    setFavorites(newFavs);
    localStorage.setItem('sm_favorites', JSON.stringify(newFavs));
  };

  // Lógica de filtrado y ordenación
  const filteredAndSortedUsers = useMemo(() => {
    return [...MOCK_USERS]
      .filter(user => {
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesPosition = positionFilter === 'all' || user.position === positionFilter;
        const matchesZone = zoneFilter === 'all' || user.province === zoneFilter;
        return matchesRole && matchesPosition && matchesZone;
      })
      .sort((a, b) => b.score - a.score);
  }, [roleFilter, positionFilter, zoneFilter]);

  // Obtener posiciones únicas basadas en el rol seleccionado para los filtros
  const positions = useMemo(() => {
    const filteredByRole = roleFilter === 'all' ? MOCK_USERS : MOCK_USERS.filter(u => u.role === roleFilter);
    return Array.from(new Set(filteredByRole.map(u => u.position)));
  }, [roleFilter]);

  // Obtener zonas únicas
  const zones = useMemo(() => {
    return Array.from(new Set(MOCK_USERS.map(u => u.province)));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white pb-20">
      <TopNav />

      <header className="pt-10 pb-6 space-y-4 text-center px-6">
        <div className="flex justify-center">
          <div className="border border-primary/40 rounded-full px-6 py-1 bg-primary/5">
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">TERMINAL DE RANKING GLOBAL</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter uppercase italic text-white leading-none">
          LÍDERES DEL TALENTO
        </h1>
      </header>

      {/* Barra de Filtros Técnica */}
      <section className="max-w-5xl mx-auto w-full px-6 mb-8">
        <div className="bg-[#111827]/50 border border-white/5 p-4 rounded-[2rem] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Toggle de Roles */}
            <div className="flex bg-[#030712] p-1 rounded-2xl border border-white/5">
              <Button 
                variant="ghost" 
                onClick={() => setRoleFilter(roleFilter === 'Player' ? 'all' : 'Player')}
                className={cn(
                  "h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  roleFilter === 'Player' ? "bg-primary text-background" : "text-muted-foreground hover:text-white"
                )}
              >
                Jugador
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setRoleFilter(roleFilter === 'Coach' ? 'all' : 'Coach')}
                className={cn(
                  "h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  roleFilter === 'Coach' ? "bg-primary text-background" : "text-muted-foreground hover:text-white"
                )}
              >
                Entrenador
              </Button>
            </div>

            {/* Selectores de Posición y Zona */}
            <div className="flex flex-wrap items-center gap-3">
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="h-12 w-48 rounded-2xl bg-[#030712] border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                  <SelectValue placeholder="POSICIÓN" />
                </SelectTrigger>
                <SelectContent className="bg-[#111827] border-white/10 text-white">
                  <SelectItem value="all">TODAS LAS POSICIONES</SelectItem>
                  {positions.map(pos => (
                    <SelectItem key={pos} value={pos}>{pos.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger className="h-12 w-40 rounded-2xl bg-[#030712] border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                  <SelectValue placeholder="ZONA" />
                </SelectTrigger>
                <SelectContent className="bg-[#111827] border-white/10 text-white">
                  <SelectItem value="all">TODAS LAS ZONAS</SelectItem>
                  {zones.map(zone => (
                    <SelectItem key={zone} value={zone}>{zone.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">RESULTADOS: {filteredAndSortedUsers.length}</span>
               <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-primary w-1/3 animate-pulse" />
               </div>
            </div>
            <p className="text-[9px] text-muted-foreground font-medium italic">Scouting en tiempo real activo</p>
          </div>
        </div>
      </section>

      {/* Lista de Resultados */}
      <section className="max-w-5xl mx-auto w-full px-6 space-y-2">
        {filteredAndSortedUsers.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No se han encontrado talentos con estos criterios.</p>
          </div>
        ) : (
          filteredAndSortedUsers.map((userItem, idx) => {
            const isFavorite = favorites.includes(userItem.id);
            
            return (
              <div key={userItem.id} className="group">
                <Link href={`/profile/${userItem.id}`}>
                  <Card className="rounded-2xl transition-all duration-300 overflow-hidden border-white/5 bg-[#111827]/40 hover:bg-[#111827] hover:border-primary/20 h-24">
                    <CardContent className="p-4 flex items-center justify-between h-full">
                      
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative">
                          <Avatar className="w-14 h-14 rounded-xl border-2 border-white/5 group-hover:border-primary/20 transition-colors">
                            <AvatarImage src={userItem.avatarUrl} className="object-cover" />
                            <AvatarFallback className="bg-[#1F2937] text-sm font-bold">{userItem.name[0]}</AvatarFallback>
                          </Avatar>
                          {userItem.verificationStatus === 'verified' && (
                            <div className="absolute -bottom-1 -right-1 bg-primary rounded-lg p-0.5 border-2 border-[#030712]">
                              <ShieldCheck className="w-3 h-3 text-background" />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 items-center">
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold font-headline tracking-tight text-white group-hover:text-primary transition-colors truncate">
                              {userItem.name}
                            </h3>
                            <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest truncate">
                              {userItem.discipline} • {userItem.level}
                            </p>
                          </div>
                          
                          <div className="hidden md:flex flex-col justify-center">
                            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5 text-primary" /> Posición
                            </span>
                            <span className="text-[10px] font-bold text-white truncate">{userItem.position}</span>
                          </div>

                          <div className="hidden md:flex flex-col justify-center">
                            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" /> Edad
                            </span>
                            <span className="text-[10px] font-bold text-white">{userItem.age} años</span>
                          </div>

                          <div className="hidden md:flex flex-col justify-center">
                            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" /> Zona
                            </span>
                            <span className="text-[10px] font-bold text-white truncate">{userItem.province}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Button
                          onClick={(e) => toggleFavorite(e, userItem.id)}
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-10 w-10 rounded-xl transition-all",
                            isFavorite ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                          )}
                        >
                          <Star className={cn("w-5 h-5", isFavorite && "fill-current")} />
                        </Button>

                        <div className="bg-primary rounded-xl px-3 py-1.5 flex items-center gap-2 min-w-[60px] justify-center">
                          <Star className="w-3 h-3 fill-background text-background" />
                          <span className="text-background font-black text-xs">{userItem.score}</span>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                </Link>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}