"use client";

import { useState, useEffect } from 'react';
import { 
  Filter, 
  MapPin, 
  ShieldCheck, 
  Star,
  Zap,
  User as UserIcon,
  Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MOCK_USERS, User } from '@/lib/db-mock';
import { TopNav } from '@/components/navigation/top-nav';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function RankingsPage() {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  
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

  const sortedUsers = [...MOCK_USERS].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white pb-20">
      <TopNav />

      <header className="pt-10 pb-8 space-y-4 text-center px-6">
        <div className="flex justify-center">
          <div className="border border-primary/40 rounded-full px-6 py-1 bg-primary/5">
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">TERMINAL DE RANKING GLOBAL</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter uppercase italic text-white">
          LÍDERES DEL TALENTO
        </h1>
      </header>

      <section className="max-w-5xl mx-auto w-full px-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-white">TALENTO DINÁMICO</h2>
            <p className="text-[10px] text-muted-foreground font-medium italic">847 perfiles analizados</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10 rounded-xl bg-white/5 border-white/10 text-white text-[10px] font-bold px-4 gap-2 hover:bg-white/10">
              <Filter className="w-3.5 h-3.5" /> FILTRAR
            </Button>
            <Button className="h-10 rounded-xl bg-primary text-background text-[10px] font-black uppercase tracking-widest px-6 hover:bg-primary/90">
              EXPORTAR
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-6 space-y-2">
        {sortedUsers.map((userItem, idx) => {
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

                      <div className="bg-primary rounded-xl px-3 py-1.5 flex items-center gap-2">
                        <Star className="w-3 h-3 fill-background text-background" />
                        <span className="text-background font-black text-xs">{userItem.score}</span>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </Link>
            </div>
          );
        })}
      </section>
    </div>
  );
}
