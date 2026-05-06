
"use client";

import { useState } from 'react';
import { Trophy, Star, Filter, MapPin, ShieldCheck, Zap, Award } from 'lucide-react';
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
          <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-6 py-1.5 text-[10px] font-black uppercase tracking-[0.3em]">
            HALL OF FAME
          </Badge>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold font-headline tracking-tighter">Líderes del Talento</h1>
        <p className="text-muted-foreground max-w-md mx-auto text-sm font-medium opacity-80 leading-relaxed">
          Clasificación global basada en nuestro Score de <br /> Relevancia IA.
        </p>
      </header>

      {/* Podium Section - EXACT MATCH TO IMAGE */}
      <div className="max-w-6xl mx-auto w-full px-6 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8 py-16">
        
        {/* Rank 2 (Silver) */}
        <div className="flex flex-col items-center space-y-6 order-2 md:order-1">
          <div className="relative group">
            <div className="absolute -top-3 -right-3 bg-[#1F2937] w-10 h-10 rounded-full flex items-center justify-center font-black text-white border-4 border-[#030712] text-sm z-10">2</div>
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border-2 border-white/5 ring-4 ring-white/5 bg-[#111827]">
              <Avatar className="w-full h-full rounded-none">
                <AvatarImage src={sortedUsers[1]?.avatarUrl} className="object-cover" />
                <AvatarFallback>2</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="text-center space-y-4">
            <p className="text-xl font-bold font-headline">{sortedUsers[1]?.name}</p>
            <div className="flex justify-center">
              <Badge className="bg-[#111827] text-muted-foreground border-none px-6 py-1.5 text-xs font-black rounded-full min-w-[60px] justify-center">
                {sortedUsers[1]?.score}
              </Badge>
            </div>
          </div>
        </div>

        {/* Rank 1 (Gold) - CENTRAL FOCUS */}
        <div className="flex flex-col items-center space-y-6 order-1 md:order-2">
          <div className="relative group">
            <Trophy className="absolute -top-14 left-1/2 -translate-x-1/2 w-12 h-12 text-primary animate-pulse" />
            <div className="absolute -top-3 -right-3 bg-primary w-12 h-12 rounded-full flex items-center justify-center font-black text-background border-4 border-[#030712] text-lg z-10">1</div>
            <div className="w-56 h-56 md:w-64 md:h-64 rounded-[3rem] overflow-hidden border-4 border-primary/40 ring-8 ring-primary/5 bg-[#111827] shadow-[0_0_80px_rgba(234,179,8,0.15)]">
              <Avatar className="w-full h-full rounded-none">
                <AvatarImage src={sortedUsers[0]?.avatarUrl} className="object-cover" />
                <AvatarFallback>1</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="text-center space-y-4">
            <p className="text-2xl font-black font-headline tracking-tight">{sortedUsers[0]?.name}</p>
            <div className="flex justify-center">
              <Badge className="bg-primary text-background border-none px-8 py-2 text-sm font-black rounded-full shadow-[0_0_30px_rgba(234,179,8,0.4)] min-w-[80px] justify-center">
                {sortedUsers[0]?.score}
              </Badge>
            </div>
          </div>
        </div>

        {/* Rank 3 (Bronze) */}
        <div className="flex flex-col items-center space-y-6 order-3">
          <div className="relative group">
            <div className="absolute -top-3 -right-3 bg-[#451a03] w-10 h-10 rounded-full flex items-center justify-center font-black text-primary border-4 border-[#030712] text-sm z-10">3</div>
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border-2 border-white/5 ring-4 ring-white/5 bg-[#111827]">
              <Avatar className="w-full h-full rounded-none">
                <AvatarImage src={sortedUsers[2]?.avatarUrl} className="object-cover" />
                <AvatarFallback>3</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="text-center space-y-4">
            <p className="text-xl font-bold font-headline">{sortedUsers[2]?.name}</p>
            <div className="flex justify-center">
              <Badge className="bg-[#111827] text-muted-foreground border-none px-6 py-1.5 text-xs font-black rounded-full min-w-[60px] justify-center">
                {sortedUsers[2]?.score}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Global Ranking List - MORE DATA AS REQUESTED */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12 space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
          <div className="space-y-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center">
              <Zap className="w-3 h-3 mr-2 text-primary fill-primary" /> Índice de Talento Global
            </h2>
            <p className="text-xs text-muted-foreground font-medium italic">Análisis exhaustivo de 847 perfiles activos.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="h-10 rounded-2xl bg-white/5 border-white/10 text-white font-bold px-6 gap-2 hover:bg-white/10 transition-colors">
              <Filter className="w-4 h-4" /> Filtros Avanzados
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {sortedUsers.slice(3).map((user, idx) => (
            <Link key={user.id} href={`/profile/${user.id}`}>
              <Card className="card-elite rounded-[2.5rem] hover:border-primary/40 transition-all group overflow-hidden bg-[#0a0f1c]/50">
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-10">
                  {/* Rank & Profile */}
                  <div className="flex items-center gap-8 min-w-[300px]">
                    <div className="text-muted-foreground font-mono text-sm w-8 opacity-40">
                      {(idx + 4).toString().padStart(2, '0')}
                    </div>
                    <div className="relative">
                      <Avatar className="w-20 h-20 rounded-[1.5rem] border-2 border-white/5 group-hover:border-primary/30 transition-all shadow-2xl">
                        <AvatarImage src={user.avatarUrl} className="object-cover" />
                        <AvatarFallback className="bg-[#1F2937] text-xl font-bold">{user.name[0]}</AvatarFallback>
                      </Avatar>
                      {user.verificationStatus === 'verified' && (
                        <div className="absolute -bottom-1 -right-1 bg-primary rounded-lg p-1">
                          <ShieldCheck className="w-4 h-4 text-background" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold font-headline group-hover:text-primary transition-colors tracking-tight">{user.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{user.role} • {user.discipline}</p>
                    </div>
                  </div>

                  {/* Player Technical Data */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="space-y-1 text-center md:text-left">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Ubicación</p>
                      <p className="text-sm font-bold flex items-center justify-center md:justify-start">
                        <MapPin className="w-3 h-3 mr-2 text-primary" /> {user.province}
                      </p>
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Categoría</p>
                      <p className="text-sm font-bold flex items-center justify-center md:justify-start">
                        <Award className="w-3 h-3 mr-2 text-primary" /> {user.level}
                      </p>
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Estado Mercado</p>
                      <p className="text-sm font-bold flex items-center justify-center md:justify-start text-green-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" /> Disponible
                      </p>
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Valoración IA</p>
                      <div className="flex items-center justify-center md:justify-start gap-1">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <Star className="w-3 h-3 text-primary/30 fill-primary/30" />
                        <Star className="w-3 h-3 text-primary/30 fill-primary/30" />
                      </div>
                    </div>
                  </div>

                  {/* Score Button */}
                  <div className="flex flex-col items-center md:items-end gap-2">
                    <div className="h-16 w-24 rounded-3xl bg-primary/10 flex flex-col items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-all">
                      <span className="text-2xl font-black font-headline text-primary">{user.score}</span>
                      <span className="text-[8px] font-black text-primary/60 uppercase tracking-widest">IA SCORE</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Hall of Fame Footer Info */}
      <footer className="py-20 text-center opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">SportMatch AI Intelligence Unit • 2024</p>
      </footer>
    </div>
  );
}

