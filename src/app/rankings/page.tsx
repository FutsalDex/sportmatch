"use client";

import { useState } from 'react';
import { Trophy, Star, TrendingUp, MapPin, Filter, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_USERS } from '@/lib/db-mock';
import Link from 'next/link';

export default function RankingsPage() {
  const sortedUsers = [...MOCK_USERS].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 space-y-8">
      <header className="pt-10 pb-4 space-y-4 text-center">
        <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1">
          Hall of Fame
        </Badge>
        <h1 className="text-4xl font-bold font-headline tracking-tighter">Líderes del Talento</h1>
        <p className="text-muted-foreground max-w-xs mx-auto text-sm">
          Clasificación global basada en nuestro Score de Relevancia IA.
        </p>
      </header>

      {/* Top 3 Showcase */}
      <div className="grid grid-cols-3 gap-3 items-end pb-8">
        {/* Silver */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute -top-2 -right-2 bg-[#94a3b8] w-8 h-8 rounded-full flex items-center justify-center font-bold text-background border-4 border-background">2</div>
            <Avatar className="w-16 h-16 border-2 border-white/10 ring-4 ring-[#94a3b8]/20 rounded-2xl">
              <AvatarImage src={sortedUsers[1]?.avatarUrl} />
              <AvatarFallback>2</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold truncate w-20">{sortedUsers[1]?.name}</p>
            <Badge className="bg-white/5 border-none text-[10px]">{sortedUsers[1]?.score}</Badge>
          </div>
        </div>

        {/* Gold */}
        <div className="flex flex-col items-center space-y-4 scale-110 -translate-y-4">
          <div className="relative">
            <Trophy className="absolute -top-10 left-1/2 -translate-x-1/2 w-8 h-8 text-primary animate-bounce" />
            <div className="absolute -top-2 -right-2 bg-primary w-10 h-10 rounded-full flex items-center justify-center font-bold text-background border-4 border-background text-lg">1</div>
            <Avatar className="w-24 h-24 border-2 border-primary/50 ring-8 ring-primary/20 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.2)]">
              <AvatarImage src={sortedUsers[0]?.avatarUrl} />
              <AvatarFallback>1</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold truncate w-24">{sortedUsers[0]?.name}</p>
            <Badge className="bg-primary text-primary-foreground border-none font-bold">{sortedUsers[0]?.score}</Badge>
          </div>
        </div>

        {/* Bronze */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute -top-2 -right-2 bg-[#cd7f32] w-8 h-8 rounded-full flex items-center justify-center font-bold text-background border-4 border-background">3</div>
            <Avatar className="w-16 h-16 border-2 border-white/10 ring-4 ring-[#cd7f32]/20 rounded-2xl">
              <AvatarImage src={sortedUsers[2]?.avatarUrl} />
              <AvatarFallback>3</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold truncate w-20">{sortedUsers[2]?.name}</p>
            <Badge className="bg-white/5 border-none text-[10px]">{sortedUsers[2]?.score}</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Ranking Global</h2>
          <Button variant="ghost" size="sm" className="text-primary h-8 px-2">
            <Filter className="w-4 h-4 mr-2" /> Filtrar
          </Button>
        </div>

        <div className="grid gap-3">
          {sortedUsers.slice(3).map((user, idx) => (
            <Link key={user.id} href={`/profile/${user.id}`}>
              <Card className="card-elite rounded-2xl overflow-hidden group hover:bg-white/5">
                <CardContent className="p-4 flex items-center gap-4">
                  <span className="text-muted-foreground font-mono text-xs w-4">{(idx + 4).toString().padStart(2, '0')}</span>
                  <Avatar className="w-12 h-12 rounded-xl">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate text-sm">{user.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{user.role} • {user.discipline}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-primary font-bold text-sm">
                      <Star className="w-3 h-3 mr-1 fill-primary" /> {user.score}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">IA Score</p>
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
