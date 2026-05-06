
"use client";

import { useState } from 'react';
import { Trophy, Star, Filter, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_USERS } from '@/lib/db-mock';
import { TopNav } from '@/components/navigation/top-nav';
import Link from 'next/link';

export default function RankingsPage() {
  const sortedUsers = [...MOCK_USERS].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white">
      <TopNav />

      {/* Hero Header */}
      <header className="pt-16 pb-8 space-y-4 text-center">
        <div className="flex justify-center">
          <Badge className="bg-primary/20 text-primary border-primary/30 rounded-full px-6 py-1.5 text-xs font-black uppercase tracking-widest">
            Hall of Fame
          </Badge>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-tighter">Líderes del Talento</h1>
        <p className="text-muted-foreground max-w-sm mx-auto text-sm font-medium">
          Clasificación global basada en nuestro Score de Relevancia IA.
        </p>
      </header>

      {/* Podium Section */}
      <div className="max-w-4xl mx-auto w-full px-6 grid grid-cols-3 gap-4 items-end pb-20 pt-10">
        {/* Silver - Rank 2 */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="absolute -top-3 -right-3 bg-[#1F2937] w-10 h-10 rounded-full flex items-center justify-center font-black text-muted-foreground border-4 border-[#030712] text-sm z-10">2</div>
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-2 border-white/5 ring-4 ring-white/5 rounded-[2rem] overflow-hidden group-hover:border-primary/30 transition-all">
              <AvatarImage src={sortedUsers[1]?.avatarUrl} className="object-cover" />
              <AvatarFallback>2</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-bold truncate w-24 md:w-32">{sortedUsers[1]?.name}</p>
            <Badge className="bg-[#111827] text-muted-foreground border-none px-4 py-1 text-xs font-black">
              {sortedUsers[1]?.score}
            </Badge>
          </div>
        </div>

        {/* Gold - Rank 1 */}
        <div className="flex flex-col items-center space-y-6 -translate-y-8">
          <div className="relative group">
            <Trophy className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 text-primary animate-pulse" />
            <div className="absolute -top-3 -right-3 bg-primary w-12 h-12 rounded-full flex items-center justify-center font-black text-background border-4 border-[#030712] text-lg z-10">1</div>
            <Avatar className="w-32 h-32 md:w-44 md:h-44 border-4 border-primary/50 ring-8 ring-primary/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_60px_rgba(234,179,8,0.2)]">
              <AvatarImage src={sortedUsers[0]?.avatarUrl} className="object-cover" />
              <AvatarFallback>1</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-black truncate w-32 md:w-44 font-headline">{sortedUsers[0]?.name}</p>
            <Badge className="bg-primary text-background border-none px-6 py-1.5 text-sm font-black shadow-[0_0_20px_rgba(234,179,8,0.4)]">
              {sortedUsers[0]?.score}
            </Badge>
          </div>
        </div>

        {/* Bronze - Rank 3 */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="absolute -top-3 -right-3 bg-[#451a03] w-10 h-10 rounded-full flex items-center justify-center font-black text-primary border-4 border-[#030712] text-sm z-10">3</div>
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-2 border-white/5 ring-4 ring-white/5 rounded-[2rem] overflow-hidden group-hover:border-primary/30 transition-all">
              <AvatarImage src={sortedUsers[2]?.avatarUrl} className="object-cover" />
              <AvatarFallback>3</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-bold truncate w-24 md:w-32">{sortedUsers[2]?.name}</p>
            <Badge className="bg-[#111827] text-muted-foreground border-none px-4 py-1 text-xs font-black">
              {sortedUsers[2]?.score}
            </Badge>
          </div>
        </div>
      </div>

      {/* Global Ranking Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12 space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
            Ranking Global
          </h2>
          <Button variant="ghost" className="text-primary hover:bg-primary/10 font-black text-xs uppercase tracking-widest gap-2">
            <Filter className="w-4 h-4" /> Filtrar
          </Button>
        </div>

        <div className="grid gap-4">
          {sortedUsers.slice(3).map((user, idx) => (
            <Link key={user.id} href={`/profile/${user.id}`}>
              <Card className="card-elite rounded-[2rem] hover:border-primary/30 transition-all group overflow-hidden">
                <CardContent className="p-6 flex items-center gap-8">
                  {/* Rank Number */}
                  <div className="text-muted-foreground font-mono text-sm w-12 flex-shrink-0">
                    {(idx + 4).toString().padStart(2, '0')}
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-16 h-16 rounded-2xl border-2 border-white/5 group-hover:border-primary/20 transition-colors">
                    <AvatarImage src={user.avatarUrl} className="object-cover" />
                    <AvatarFallback className="bg-[#1F2937] text-lg font-bold">{user.name[0]}</AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold font-headline group-hover:text-primary transition-colors">{user.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{user.role} • {user.discipline}</p>
                  </div>

                  {/* Score */}
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="flex items-center text-primary font-black text-xl">
                      <Star className="w-4 h-4 mr-1.5 fill-primary" /> {user.score}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">IA Score</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
