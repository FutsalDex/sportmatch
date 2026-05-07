
"use client";

import { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, MapPin, ShieldCheck, Star, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { MOCK_USERS } from '@/lib/db-mock';
import { TopNav } from '@/components/navigation/top-nav';
import Link from 'next/link';
import { useDiscipline } from '@/context/discipline-context';
import { COUNTRIES, GET_LOCATION_LIST, GET_LOCATION_LABEL } from '@/lib/constants';

export default function SearchPage() {
  const { discipline } = useDiscipline();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('España');
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(user => {
      const matchesDiscipline = user.discipline === discipline;
      const matchesQuery = user.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const userCountry = (user as any).country || 'España';
      const matchesCountry = countryFilter === 'all' || userCountry === countryFilter;
      const matchesZone = zoneFilter === 'all' || user.province === zoneFilter;
      return matchesDiscipline && matchesQuery && matchesRole && matchesCountry && matchesZone;
    }).sort((a, b) => b.score - a.score);
  }, [discipline, searchQuery, roleFilter, countryFilter, zoneFilter]);

  const locationLabel = GET_LOCATION_LABEL(countryFilter);
  const locationList = GET_LOCATION_LIST(countryFilter);

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <div className="w-full bg-[#030712] pt-8 px-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 rounded-full px-4 py-1 gap-2 uppercase font-black text-[10px] tracking-widest">
            BUSCADOR {discipline === 'Football' ? 'FÚTBOL' : 'FÚTBOL SALA'}
          </Badge>

          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <Input 
              className="w-full h-16 pl-14 bg-[#374151]/50 border-none rounded-full text-lg placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary/50"
              placeholder={`Buscar en ${discipline === 'Football' ? 'Fútbol' : 'Futsal'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3 pb-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-10 w-40 rounded-full bg-white text-black border-none font-bold">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black border-none">
                <SelectItem value="all">Todos los Roles</SelectItem>
                <SelectItem value="Player">Jugadores</SelectItem>
                <SelectItem value="Coach">Entrenadores</SelectItem>
                <SelectItem value="Club">Clubes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={(v) => { setCountryFilter(v); setZoneFilter('all'); }}>
              <SelectTrigger className="h-10 w-40 rounded-full bg-black border border-white/20 text-white font-bold px-6">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
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
              <SelectTrigger className="h-10 w-48 rounded-full bg-black border border-white/20 text-white font-bold px-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
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
            
            <Button variant="outline" className="h-10 rounded-full bg-black border-white/20 text-white font-bold px-6 gap-2">
              <Filter className="w-4 h-4" /> Más Filtros
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">
            {filteredUsers.length} TALENTOS DE {discipline === 'Football' ? 'FÚTBOL' : 'FUTSAL'}
          </h2>
          <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 text-xs font-black uppercase tracking-widest gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Score IA
          </Button>
        </div>

        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Link key={user.id} href={`/profile/${user.id}`}>
              <Card className="card-elite rounded-[2.5rem] hover:border-primary/40 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-20 h-20 rounded-2xl border-2 border-white/5 group-hover:border-primary/20 transition-colors">
                        <AvatarImage src={user.avatarUrl} className="object-cover" />
                        <AvatarFallback className="bg-[#1F2937] text-xl font-bold">{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      {user.verificationStatus === 'verified' && (
                        <div className="absolute -bottom-1 -right-1 bg-[#030712] rounded-full p-1 shadow-xl">
                          <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-xl font-bold font-headline group-hover:text-primary transition-colors">{user.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                        {user.role} • {user.position}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs pt-1">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 mr-1.5" /> {user.province}
                        </div>
                        <div className="font-bold text-primary uppercase tracking-tighter">
                          {user.level}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <Badge className="h-10 px-4 rounded-full bg-primary text-background font-black text-sm flex gap-1.5 border-none">
                        <Star className="w-4 h-4 fill-current" /> {user.score}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
