
"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  Star,
  Zap,
  Calendar,
  Search,
  Trophy,
  Globe,
  Loader2,
  Map
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
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { TopNav } from '@/components/navigation/top-nav';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useDiscipline } from '@/context/discipline-context';
import { COUNTRIES, GET_LOCATION_LIST, GET_LOCATION_LABEL } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export default function RankingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const db = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { discipline } = useDiscipline();
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Estados de filtrado
  const [roleFilter, setRoleFilter] = useState<'Player' | 'Coach' | 'all'>('Player');
  const [countryFilter, setCountryFilter] = useState<string>('España');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  
  // Redirección si no hay usuario
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    const saved = localStorage.getItem('sm_favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Referencia memorizada a la colección de usuarios (solo si hay usuario)
  const usersRef = useMemoFirebase(() => {
    if (!user) return null;
    return collection(db, 'users');
  }, [db, user]);

  const { data: realUsers, isLoading: isUsersLoading } = useCollection(usersRef);

  const toggleFavorite = (e: React.MouseEvent, userId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    let newFavs;
    if (favorites.includes(userId)) {
      newFavs = favorites.filter(id => id !== userId);
      toast({ title: "Eliminado", description: "Quitado de favoritos." });
    } else {
      newFavs = [...favorites, userId];
      toast({ title: "Guardado", description: "Añadido a tus favoritos." });
    }
    
    setFavorites(newFavs);
    localStorage.setItem('sm_favorites', JSON.stringify(newFavs));
  };

  const filteredAndSortedUsers = useMemo(() => {
    if (!realUsers) return [];
    
    return realUsers
      .filter(user => {
        const matchesDiscipline = user.discipline === discipline;
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const userCountry = user.country || 'España';
        const matchesCountry = countryFilter === 'all' || userCountry === countryFilter;
        const matchesZone = zoneFilter === 'all' || user.province === zoneFilter;
        return matchesDiscipline && matchesRole && matchesCountry && matchesZone;
      })
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [realUsers, discipline, roleFilter, countryFilter, zoneFilter]);

  const locationLabel = GET_LOCATION_LABEL(countryFilter);
  const locationList = GET_LOCATION_LIST(countryFilter);

  if (isAuthLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-primary font-black animate-pulse uppercase tracking-[0.3em] text-xs">Validando Credenciales...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white pb-20">
      <TopNav />

      <header className="pt-10 pb-6 space-y-4 text-center px-6">
        <div className="flex justify-center">
          <div className="border border-primary/40 rounded-full px-6 py-1 bg-primary/5">
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">
               RANKING GLOBAL {discipline === 'Football' ? 'FÚTBOL' : 'FÚTBOL SALA'}
             </span>
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-tighter uppercase italic text-white leading-[0.8]">
          LÍDERES DEL TALENTO
        </h1>
      </header>

      <section className="max-w-5xl mx-auto w-full px-6 mb-8">
        <div className="bg-[#111827]/50 border border-white/5 p-4 rounded-[2rem] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex bg-[#030712] p-1 rounded-2xl border border-white/5">
              <Button 
                variant="ghost" 
                onClick={() => setRoleFilter('Player')}
                className={cn(
                  "h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  roleFilter === 'Player' ? "bg-primary text-background" : "text-muted-foreground hover:text-white"
                )}
              >
                Jugador
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setRoleFilter('Coach')}
                className={cn(
                  "h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  roleFilter === 'Coach' ? "bg-primary text-background" : "text-muted-foreground hover:text-white"
                )}
              >
                Entrenador
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select value={countryFilter} onValueChange={(v) => { setCountryFilter(v); setZoneFilter('all'); }}>
                <SelectTrigger className="h-12 w-40 rounded-2xl bg-[#030712] border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-primary" />
                    <SelectValue placeholder="PAÍS" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#111827] border-white/10 text-white">
                  <SelectItem value="all">TODOS LOS PAÍSES</SelectItem>
                  {COUNTRIES.map(country => (
                    <SelectItem key={country} value={country}>{country.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger className="h-12 w-48 rounded-2xl bg-[#030712] border-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-primary" />
                    <SelectValue placeholder={locationLabel} />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#111827] border-white/10 text-white max-h-[300px]">
                  <SelectItem value="all">TODAS LAS ZONAS</SelectItem>
                  {locationList.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-6 space-y-2">
        {isUsersLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sincronizando terminal de red...</p>
          </div>
        ) : filteredAndSortedUsers.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No hay perfiles activos en esta zona.</p>
          </div>
        ) : (
          filteredAndSortedUsers.map((userItem, idx) => {
            const isFavorite = favorites.includes(userItem.id);
            const isTop3 = idx < 3;
            const isCoach = userItem.role === 'Coach';
            
            return (
              <div key={userItem.id} className="group">
                <Link href={`/profile/${userItem.id}`}>
                  <Card className={cn(
                    "rounded-2xl transition-all duration-300 overflow-hidden border-white/5 bg-[#111827]/40 hover:bg-[#111827] hover:border-primary/20 h-24",
                    isTop3 && "border-primary/10 bg-primary/[0.02]"
                  )}>
                    <CardContent className="p-4 flex items-center justify-between h-full">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative">
                          <Avatar className="w-14 h-14 rounded-xl border-2 border-white/5 group-hover:border-primary/20 transition-colors">
                            <AvatarImage src={userItem.profileImageUrl} className="object-cover" />
                            <AvatarFallback className="bg-[#1F2937] text-sm font-bold">{userItem.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          {isTop3 && (
                            <div className="absolute -top-2 -left-2 bg-primary rounded-full p-1 shadow-lg">
                              <Trophy className="w-3 h-3 text-background" />
                            </div>
                          )}
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
                              {userItem.level || 'Amateur'}
                            </p>
                          </div>
                          
                          <div className="hidden md:flex flex-col justify-center">
                            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                              {isCoach ? 'Titulación' : 'Posición'}
                            </span>
                            <span className="text-[10px] font-bold text-white truncate">{userItem.position || '--'}</span>
                          </div>

                          <div className="hidden md:flex flex-col justify-center">
                            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                              Edad
                            </span>
                            <span className="text-[10px] font-bold text-white">{userItem.age || '--'} años</span>
                          </div>

                          <div className="hidden md:flex flex-col justify-center">
                            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                              Zona
                            </span>
                            <span className="text-[10px] font-bold text-white truncate">{userItem.province || '--'}</span>
                          </div>

                          <div className="hidden md:flex flex-col justify-center">
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
                          className={cn(
                            "h-10 w-10 rounded-xl transition-all",
                            isFavorite ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                          )}
                        >
                          <Star className={cn("w-5 h-5", isFavorite && "fill-current")} />
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
            );
          })
        )}
      </section>
    </div>
  );
}
