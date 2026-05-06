"use client";

import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, MapPin, ShieldCheck, Star, Users } from 'lucide-react';
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

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [disciplineFilter, setDisciplineFilter] = useState<string>('all');

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesQuery = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesDiscipline = disciplineFilter === 'all' || user.discipline === disciplineFilter;
    return matchesQuery && matchesRole && matchesDiscipline;
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      {/* Search Header Section */}
      <div className="w-full bg-[#030712] pt-8 px-6 space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Main Search Bar */}
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <Input 
              className="w-full h-16 pl-14 bg-[#374151]/50 border-none rounded-full text-lg placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary/50"
              placeholder="Buscar jugadores, entrenadores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Quick Filters - Pill Style */}
          <div className="flex flex-wrap gap-3 pb-2">
            <div className="flex items-center gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-10 w-32 rounded-full bg-white text-black border-none font-bold">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black border-none">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Player">Jugadores</SelectItem>
                  <SelectItem value="Coach">Entrenadores</SelectItem>
                  <SelectItem value="Club">Clubes</SelectItem>
                </SelectContent>
              </Select>

              <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
                <SelectTrigger className="h-10 w-32 rounded-full bg-white text-black border-none font-bold">
                  <SelectValue placeholder="Disciplina" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black border-none">
                  <SelectItem value="all">Disciplinas</SelectItem>
                  <SelectItem value="Football">Fútbol</SelectItem>
                  <SelectItem value="Futsal">Futsal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="h-10 rounded-full bg-black border-white/20 text-white font-bold px-6 gap-2">
              <MapPin className="w-4 h-4" /> Provincia
            </Button>
            
            <Button variant="outline" className="h-10 rounded-full bg-black border-white/20 text-white font-bold px-6 gap-2">
              <Filter className="w-4 h-4" /> Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">
            {filteredUsers.length} TALENTOS ENCONTRADOS
          </h2>
          <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 text-xs font-black uppercase tracking-widest gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Ordenar por Score
          </Button>
        </div>

        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Link key={user.id} href={`/profile/${user.id}`}>
              <Card className="card-elite rounded-[2.5rem] hover:border-primary/40 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Avatar with Verification */}
                    <div className="relative">
                      <Avatar className="w-20 h-20 rounded-2xl border-2 border-white/5 group-hover:border-primary/20 transition-colors">
                        <AvatarImage src={user.avatarUrl} className="object-cover" />
                        <AvatarFallback className="bg-[#1F2937] text-xl font-bold">{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      {user.verificationStatus === 'verified' && (
                        <div className="absolute -bottom-1 -right-1 bg-[#030712] rounded-full p-1 shadow-xl">
                          <ShieldCheck className="w-6 h-6 text-primary fill-primary/10" />
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-xl font-bold font-headline group-hover:text-primary transition-colors">{user.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{user.role} • {user.discipline}</p>
                      
                      <div className="flex items-center gap-4 text-xs pt-1">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 mr-1.5" /> {user.province}
                        </div>
                        <div className="font-bold text-primary uppercase tracking-tighter">
                          {user.level}
                        </div>
                      </div>
                    </div>

                    {/* Score Badge */}
                    <div className="flex flex-col items-end">
                      <Badge className="h-10 px-4 rounded-full bg-primary text-background font-black text-sm flex gap-1.5 border-none shadow-[0_0_20px_rgba(234,179,8,0.2)]">
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
