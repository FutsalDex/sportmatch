
"use client";

import { Trophy, Target, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDiscipline } from '@/context/discipline-context';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const { setDiscipline } = useDiscipline();

  const handleSelect = (discipline: 'Football' | 'Futsal') => {
    setDiscipline(discipline);
    router.push('/search');
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white items-center justify-center p-6">
      {/* Header section */}
      <div className="text-center space-y-4 mb-16">
        <div className="flex justify-center mb-2">
          <Trophy className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-6xl font-black font-headline tracking-tighter">SportMatch</h1>
        <p className="text-muted-foreground text-sm font-medium">Selecciona tu disciplina para entrar en la plataforma</p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Football Card */}
        <button 
          onClick={() => handleSelect('Football')}
          className="group relative h-[450px] rounded-[3rem] overflow-hidden border-none transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Image 
            src="https://picsum.photos/seed/football-landing/800/600" 
            alt="Football"
            fill
            className="object-cover opacity-40 group-hover:opacity-50 transition-opacity"
            data-ai-hint="football stadium"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-12 flex flex-col justify-end text-left">
            <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-4xl font-bold font-headline mb-3">Fútbol</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-[280px]">
              Scouting, fichajes y rankings profesionales.
            </p>
          </div>
        </button>

        {/* Futsal Card */}
        <button 
          onClick={() => handleSelect('Futsal')}
          className="group relative h-[450px] rounded-[3rem] overflow-hidden border-none transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Image 
            src="https://picsum.photos/seed/futsal-landing/800/600" 
            alt="Futsal Sala"
            fill
            className="object-cover opacity-40 group-hover:opacity-50 transition-opacity"
            data-ai-hint="futsal player"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-12 flex flex-col justify-end text-left">
            <div className="bg-primary w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-4xl font-bold font-headline mb-3">Fútbol Sala</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-[280px]">
              La élite del 40x20. Perfiles y scouting futsal.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
