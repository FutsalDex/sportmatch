"use client";

import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { TopNav } from '@/components/navigation/top-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  TrendingUp, 
  Users, 
  Eye, 
  Star, 
  ChevronRight, 
  Crown,
  LayoutDashboard,
  ArrowUpRight,
  ShieldAlert,
  Database,
  Search,
  Activity,
  CreditCard,
  FileText,
  UserCheck,
  Download,
  ShieldCheck,
  Trophy,
  Briefcase,
  Send,
  Plus,
  AlertCircle,
  Loader2,
  Target
} from 'lucide-react';
import { doc, collection, query, where } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const isAdmin = user?.email === 'admin01@gmail.com';

  const userDocRef = useMemoFirebase(() => {
    return user ? doc(db, 'users', user.uid) : null;
  }, [db, user?.uid]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  // Consulta de Ofertas Propias (Solo para Clubes)
  const myOffersQuery = useMemoFirebase(() => {
    if (!db || isUserLoading || !user || !userData || userData.role !== 'Club') return null;
    // Eliminamos orderBy para evitar errores de índices ausentes y ordenamos en memoria
    return query(collection(db, 'offers'), where('clubId', '==', user.uid));
  }, [db, user?.uid, userData?.role, isUserLoading]);
  
  const { data: rawMyOffers, isLoading: isOffersLoading } = useCollection(myOffersQuery);

  // Ordenación manual por fecha de creación descendente
  const myOffers = useMemo(() => {
    if (!rawMyOffers) return [];
    return [...rawMyOffers].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [rawMyOffers]);

  // Consulta global para el Admin
  const allUsersQuery = useMemoFirebase(() => {
    if (!db || isUserLoading || !isAdmin) return null;
    return collection(db, 'users');
  }, [db, isAdmin, isUserLoading]);
  const { data: allUsers } = useCollection(allUsersQuery);

  if (isUserLoading || isUserDataLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary font-bold animate-pulse uppercase tracking-[0.3em] text-xs">Cargando Terminal...</div>;

  const isClub = userData?.role === 'Club';
  const offersCount = myOffers?.length || 0;
  const isFreeClub = isClub && (!userData?.plan || userData?.plan === 'free');
  const isOfferLimitReached = isFreeClub && offersCount >= 3;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6 md:space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="outline" className={cn(
              "px-4 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]",
              isAdmin ? "border-red-500/30 text-red-500 bg-red-500/5" : "border-primary/30 text-primary bg-primary/5"
            )}>
              {isAdmin ? 'Terminal de Control Maestro' : 'Mi Panel'}
            </Badge>
            <h1 className="text-2xl md:text-4xl font-bold font-headline tracking-tighter">
              Hola, {userData?.name?.split(' ')[0] || 'Usuario'}
            </h1>
            <p className="text-[10px] md:text-base text-muted-foreground font-medium">
              {isAdmin ? 'Supervisión total de la red.' : (isClub ? 'Gestión de reclutamiento institucional.' : 'Gestiona tu carrera deportiva.')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {isClub && (
              <>
                {isOfferLimitReached ? (
                  <Button asChild variant="outline" className="h-12 px-6 rounded-2xl border-red-500/30 bg-red-500/5 text-red-500 font-black uppercase text-[10px] tracking-widest">
                    <Link href="/pricing"><AlertCircle className="w-4 h-4 mr-2" /> LÍMITE DE OFERTAS ALCANZADO</Link>
                  </Button>
                ) : (
                  <Button asChild className="h-12 px-6 rounded-2xl bg-primary text-background font-black uppercase text-[10px] tracking-widest shadow-xl">
                    <Link href="/offers/new"><Plus className="w-4 h-4 mr-2" /> PUBLICAR OFERTA</Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </header>

        {isAdmin ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="card-elite rounded-[2.5rem] border-red-500/20 bg-red-500/5 p-8 space-y-4">
              <Users className="w-6 h-6 text-red-500" />
              <p className="text-4xl font-black font-headline">{allUsers?.length || 0}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Usuarios</p>
            </Card>
            
            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
               <AdminStatMini label="Elite Top" count={allUsers?.filter(u => u.plan === 'top').length || 0} color="text-yellow-500" />
               <AdminStatMini label="Elite Pro" count={allUsers?.filter(u => u.plan === 'pro').length || 0} color="text-primary" />
               <AdminStatMini label="Verificados" count={allUsers?.filter(u => u.verificationStatus === 'verified').length || 0} color="text-blue-500" />
               <AdminStatMini label="Elite Free" count={allUsers?.filter(u => !u.plan || u.plan === 'free').length || 0} color="text-muted-foreground" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="card-elite rounded-[2rem] p-8 space-y-4">
              <Star className="w-6 h-6 text-primary" />
              <p className="text-4xl font-black font-headline">{userData?.score || 0}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Score IA Global</p>
            </Card>

            <Card className="card-elite rounded-[2rem] p-8 space-y-4">
              <Eye className="w-6 h-6 text-blue-400" />
              <p className="text-4xl font-black font-headline">{userData?.views || 0}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Impacto de Perfil</p>
            </Card>

            {isClub && (
              <Card className="card-elite rounded-[2rem] p-8 space-y-4 col-span-1 md:col-span-2 bg-gradient-to-br from-primary/10 to-transparent">
                <div className="flex justify-between items-start">
                  <Briefcase className="w-6 h-6 text-primary" />
                  {isFreeClub && (
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20">
                      {offersCount}/3 OFERTAS FREE
                    </Badge>
                  )}
                </div>
                <p className="text-4xl font-black font-headline">{offersCount}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Mis Ofertas Activas</p>
              </Card>
            )}
          </div>
        )}

        {isClub && !isAdmin && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center">
                <Briefcase className="w-4 h-4 mr-2" /> Mis Vacantes Publicadas
              </h2>
              <Link href="/offers" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Ver todas en el mercado</Link>
            </div>
            
            {isOffersLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                 <Loader2 className="w-8 h-8 text-primary animate-spin" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sincronizando vacantes...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {myOffers.length > 0 ? (
                  myOffers.slice(0, 6).map((offer) => (
                    <Card key={offer.id} className="bg-[#111827] border-white/5 rounded-3xl p-6 group hover:border-primary/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <p className="font-bold text-lg leading-tight mb-1">{offer.position}</p>
                              <Badge className="bg-primary/10 text-primary border-none text-[7px] font-black uppercase px-2">{offer.role}</Badge>
                           </div>
                           <Badge variant="outline" className={cn(
                             "text-[7px] font-black uppercase border-white/10",
                             offer.status === 'active' ? "text-green-500" : "text-muted-foreground"
                           )}>
                             {offer.status}
                           </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-6">
                           <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-bold">
                              <Target className="w-3 h-3 text-primary" /> {offer.teamRole || 'Sin determinar'}
                           </div>
                           <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-bold">
                              <Send className="w-3 h-3 text-primary" /> {offer.onboardingDate || 'Inmediata'}
                           </div>
                        </div>

                        <div className="flex gap-2">
                           <Button asChild size="sm" variant="ghost" className="flex-1 rounded-xl bg-white/5 text-[8px] font-black uppercase tracking-widest hover:bg-primary hover:text-background">
                              <Link href={`/offers/edit/${offer.id}`}>EDITAR</Link>
                           </Button>
                           <Button asChild size="sm" variant="ghost" className="rounded-xl bg-white/5 px-3">
                              <Link href={`/offers/${offer.id}`}><ArrowUpRight className="w-4 h-4" /></Link>
                           </Button>
                        </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                      <Briefcase className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase text-muted-foreground">No has publicado ninguna oferta institucional aún.</p>
                      <Button asChild variant="link" className="mt-2 text-primary font-black uppercase text-[10px] tracking-widest">
                         <Link href="/offers/new">Publicar mi primera vacante</Link>
                      </Button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function AdminStatMini({ label, count, color }: { label: string, count: number, color: string }) {
  return (
    <Card className="card-elite rounded-2xl bg-white/[0.02] border-white/5 p-4 flex flex-col justify-center">
      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className={cn("text-xl font-black font-headline", color)}>{count}</p>
    </Card>
  );
}
