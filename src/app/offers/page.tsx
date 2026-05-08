
"use client";

import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { TopNav } from '@/components/navigation/top-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Wallet, 
  Search, 
  Plus,
  ArrowUpRight,
  Loader2,
  Filter,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function OffersPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [roleFilter, setRoleFilter] = useState<'all' | 'Player' | 'Coach'>('all');

  // Redirección si no hay usuario una vez terminada la carga de sesión
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const offersQuery = useMemoFirebase(() => {
    // Es crítico no ejecutar la consulta hasta que el usuario esté identificado
    // para evitar errores de permisos "Missing or insufficient permissions" al inicio.
    if (!user) return null;
    return query(collection(db, 'offers'), orderBy('createdAt', 'desc'));
  }, [db, user?.uid]);

  const { data: offers, isLoading } = useCollection(offersQuery);

  const filteredOffers = useMemo(() => {
    if (!offers) return [];
    if (roleFilter === 'all') return offers;
    return offers.filter(o => o.role === roleFilter);
  }, [offers, roleFilter]);

  if (isUserLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-primary font-black animate-pulse uppercase tracking-[0.3em] text-xs">Sincronizando Mercado...</div>;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 rounded-full px-4 py-1 uppercase font-black text-[10px] tracking-widest">
              Tablero de Reclutamiento
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter uppercase italic leading-none">
              Oportunidades <span className="text-primary">Elite</span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium max-w-xl">
              Explora las vacantes publicadas por clubes profesionales de la red SportMatch AI.
            </p>
          </div>

          <div className="flex gap-4">
            <Button asChild className="h-14 px-8 rounded-2xl bg-primary text-background font-black uppercase text-xs tracking-widest shadow-xl hover:bg-primary/90">
              <Link href="/offers/new" className="flex items-center gap-2">
                <Plus className="w-5 h-5" /> PUBLICAR OFERTA
              </Link>
            </Button>
          </div>
        </header>

        <section className="space-y-6">
          <div className="flex items-center gap-3 bg-[#111827] p-1.5 rounded-2xl border border-white/5 w-fit">
            <Button 
              variant="ghost" 
              onClick={() => setRoleFilter('all')}
              className={cn("h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest", roleFilter === 'all' && "bg-primary text-background")}
            >TODAS</Button>
            <Button 
              variant="ghost" 
              onClick={() => setRoleFilter('Player')}
              className={cn("h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest", roleFilter === 'Player' && "bg-primary text-background")}
            >JUGADORES</Button>
            <Button 
              variant="ghost" 
              onClick={() => setRoleFilter('Coach')}
              className={cn("h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest", roleFilter === 'Coach' && "bg-primary text-background")}
            >ENTRENADORES</Button>
          </div>

          <div className="grid gap-6">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sincronizando mercado...</p>
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] space-y-4">
                <Search className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No hay ofertas activas para este rol.</p>
              </div>
            ) : (
              filteredOffers.map((offer) => (
                <Card key={offer.id} className="card-elite rounded-[2.5rem] bg-[#111827]/40 border-white/5 hover:border-primary/20 transition-all overflow-hidden group">
                  <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="bg-primary/10 p-4 rounded-3xl group-hover:bg-primary/20 transition-colors">
                        <Briefcase className="w-8 h-8 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-bold font-headline tracking-tight">{offer.position}</h3>
                          <Badge className="bg-white/5 text-white border-white/10 text-[8px] font-black uppercase px-2">{offer.role}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          <span className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-primary" /> {offer.clubName}</span>
                          <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" /> {offer.location || 'Consultar'}</span>
                          <span className="flex items-center gap-2"><Wallet className="w-3.5 h-3.5 text-green-400" /> {offer.salaryRange || 'A convenir'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="flex-1 md:text-right space-y-1">
                         <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Publicado hace</p>
                         <p className="text-[10px] font-bold">RECIENTEMENTE</p>
                      </div>
                      <Button className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-background hover:border-primary transition-all gap-2">
                        VER DETALLES <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
