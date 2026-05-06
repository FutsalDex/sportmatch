"use client";

import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, MapPin, ShieldCheck, Star } from 'lucide-react';
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
import { MOCK_USERS, User } from '@/lib/db-mock';
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
    <div className="flex flex-col min-h-screen">
      {/* Search Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border px-4 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            className="pl-10 h-12 bg-secondary/50 border-none rounded-xl"
            placeholder="Buscar jugadores, entrenadores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-9 w-auto min-w-[100px] rounded-full bg-white border-border">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Roles</SelectItem>
              <SelectItem value="Player">Jugadores</SelectItem>
              <SelectItem value="Coach">Entrenadores</SelectItem>
              <SelectItem value="Club">Clubes</SelectItem>
            </SelectContent>
          </Select>

          <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
            <SelectTrigger className="h-9 w-auto min-w-[110px] rounded-full bg-white border-border">
              <SelectValue placeholder="Disciplina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Disciplinas</SelectItem>
              <SelectItem value="Football">Fútbol</SelectItem>
              <SelectItem value="Futsal">Fútbol Sala</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="h-9 rounded-full shrink-0">
            <MapPin className="w-4 h-4 mr-1" /> Provincia
          </Button>
          <Button variant="outline" size="sm" className="h-9 rounded-full shrink-0">
            <Filter className="w-4 h-4 mr-1" /> Filtros
          </Button>
        </div>
      </header>

      {/* Results List */}
      <div className="px-4 py-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {filteredUsers.length} Talentos encontrados
          </h2>
          <div className="flex items-center text-xs text-primary font-medium">
            <SlidersHorizontal className="w-3 h-3 mr-1" /> Ordenar por Score
          </div>
        </div>

        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Link key={user.id} href={`/profile/${user.id}`}>
              <Card className="overflow-hidden border-border hover:border-primary/50 transition-all active:scale-[0.98]">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16 rounded-xl">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      {user.verificationStatus === 'verified' && (
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                          <ShieldCheck className="w-5 h-5 text-primary fill-primary/10" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg leading-none">{user.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 font-medium">{user.role} • {user.discipline}</p>
                        </div>
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                          <Star className="w-3 h-3 mr-1 fill-primary" /> {user.score}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                        <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {user.province}</span>
                        <span className="flex items-center font-semibold text-primary/80">{user.level}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}