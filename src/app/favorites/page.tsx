
"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  Star,
  MapPin,
  ShieldCheck,
  Zap,
  Calendar,
  ChevronRight,
  Loader2,
  Map
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { TopNav } from '@/components/navigation/top-nav';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function FavoritesPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Sincronización con la base de datos real
  const usersRef = useMemoFirebase(() => collection(db, 'users'), [db]);
  const { data: allUsers, isLoading: isUsersLoading } = useCollection(usersRef);
  
  useEffect(() => {
    const saved = localStorage.getItem('sm_favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (e: React.MouseEvent, userId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newFavs = favorites.filter(id => id !== userId);
    setFavorites(newFavs);
    localStorage.setItem('sm_favorites', JSON.stringify(newFavs));
    toast({ title: "Eliminado", description: "Perfil quitado de tus favoritos." });
  };

  // Filtrar solo los usuarios que están en favoritos
  const favoriteUsers = useMemo(() => {
    if (!allUsers) return [];
    return allUsers.filter(u => favorites.includes(u.id));
  }, [allUsers, favorites]);

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white pb-20">
      <TopNav />

      <header className="pt-10 pb-8 space-y-4 text-center px-6">
        <div className="flex justify-center">
          <div className="border border-primary/40 rounded-full px-6 py-1 bg-primary/5">
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">SCUTING PERSONALIZADO</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter uppercase italic text-white leading-none">
          MIS FAVORITOS
        </h1>
        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
          {isUsersLoading ? "Sincronizando..." : `${favoriteUsers.length} perfiles en seguimiento prioritario`}
        </p>
      </header>

      <main className="max-w-5xl mx-auto w-full px-6 space-y-2">
        {isUsersLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recuperando terminal de favoritos...</p>
          </div>
        ) : favoriteUsers.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Tu lista de favoritos está vacía.</p>
            <Button asChild variant="link" className="mt-4 text-primary font-black uppercase text-[10px] tracking-widest">
              <Link href="/rankings">Ir al Ranking Global</Link>
            </Button>
          </div>
        ) : (
          favoriteUsers.map((userItem) => (
            <div key={userItem.id} className="group">
              <Link href={`/profile/${userItem.id}`}>
                <Card className="rounded-2xl transition-all duration-300 overflow-hidden border-white/5 bg-[#111827]/40 hover:bg-[#111827] hover:border-primary/20 h-24">
                  <CardContent className="p-4 flex items-center justify-between h-full">
                    
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <Avatar className="w-14 h-14 rounded-xl border-2 border-white/5 group-hover:border-primary/20 transition-colors">
                          <AvatarImage src={userItem.profileImageUrl} className="object-cover" />
                          <AvatarFallback className="bg-[#1F2937] text-sm font-bold">{userItem.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        {userItem.verificationStatus === 'verified' && (
                          <div className="absolute -bottom-1 -right-1 bg-primary rounded-lg p-0.5 border-2 border-[#030712]">
                            <ShieldCheck className="w-3 h-3 text-background" />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1 items-center">
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold font-headline tracking-tight text-white group-hover:text-primary transition-colors truncate">
                            {userItem.name}
                          </h3>
                          <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest truncate">
                            {userItem.role} • {userItem.level || 'Amateur'}
                          </p>
                        </div>
                        
                        <div className="hidden md:flex flex-col">
                          <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1">Posición</span>
                          <span className="text-[10px] font-bold text-white truncate">{userItem.position || '--'}</span>
                        </div>

                        <div className="hidden md:flex flex-col">
                          <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1">Edad</span>
                          <span className="text-[10px] font-bold text-white">{userItem.age || '--'} años</span>
                        </div>

                        <div className="hidden md:flex flex-col">
                          <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                            <MapPin className="w-2 h-2 text-primary" /> Zona
                          </span>
                          <span className="text-[10px] font-bold text-white truncate">{userItem.province || '--'}</span>
                        </div>

                        <div className="hidden md:flex flex-col">
                          <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Map className="w-2 h-2" /> Movilidad
                          </span>
                          <span className="text-[10px] font-bold text-primary truncate">{userItem.mobility || 'Local'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        onClick={(e) => toggleFavorite(e, userItem.id)}
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-primary bg-primary/10 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </Button>
                      <div className="bg-primary rounded-xl px-3 py-1.5 flex items-center gap-2 min-w-[60px] justify-center">
                         <Star className="w-3 h-3 fill-background text-background" />
                         <span className="text-background font-black text-xs">{userItem.score || 0}</span>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </Link>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
