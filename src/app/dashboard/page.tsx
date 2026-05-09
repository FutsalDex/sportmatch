"use client";

import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { TopNav } from '@/components/navigation/top-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Eye, 
  Star, 
  ChevronRight, 
  ShieldAlert, 
  Activity, 
  CreditCard, 
  Briefcase, 
  Plus, 
  Loader2, 
  Target,
  UserCheck,
  ClipboardCheck,
  ArrowUpRight,
  Send,
  Clock,
  CheckCircle2,
  Timer,
  Zap
} from 'lucide-react';
import { doc, collection, query, where, orderBy, limit } from 'firebase/firestore';
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

  // --- CONSULTAS ADMIN ---
  const pendingVerificationsQuery = useMemoFirebase(() => {
    if (!isAdmin) return null;
    return query(collection(db, 'users'), where('verificationStatus', '==', 'pending'), limit(5));
  }, [db, isAdmin]);

  const allApplicationsQuery = useMemoFirebase(() => {
    if (!isAdmin) return null;
    return query(collection(db, 'applications'), orderBy('createdAt', 'desc'), limit(5));
  }, [db, isAdmin]);

  const allOffersQuery = useMemoFirebase(() => {
    if (!db || isUserLoading || !isAdmin) return null;
    return collection(db, 'offers');
  }, [db, isAdmin, isUserLoading]);

  const { data: pendingUsers } = useCollection(pendingVerificationsQuery);
  const { data: recentApplications } = useCollection(allApplicationsQuery);
  const { data: allOffersAdmin } = useCollection(allOffersQuery);

  const adminOfferStats = useMemo(() => {
    if (!allOffersAdmin) return { total: 0, active: 0, accepted: 0, pending: 0 };
    return allOffersAdmin.reduce((acc, offer) => {
      acc.total++;
      if (offer.status === 'active') acc.active++;
      if (offer.status === 'accepted') acc.accepted++;
      if (offer.status === 'pending' || offer.status === 'withdrawn') acc.pending++;
      return acc;
    }, { total: 0, active: 0, accepted: 0, pending: 0 });
  }, [allOffersAdmin]);

  // --- CONSULTAS CLUB ---
  const myOffersQuery = useMemoFirebase(() => {
    if (!db || isUserLoading || !user || !userData || userData.role !== 'Club') return null;
    return query(collection(db, 'offers'), where('clubId', '==', user.uid));
  }, [db, user?.uid, userData?.role, isUserLoading]);
  
  const { data: rawMyOffers, isLoading: isOffersLoading } = useCollection(myOffersQuery);

  const myOfferStats = useMemo(() => {
    if (!rawMyOffers) return { total: 0, active: 0, accepted: 0, pending: 0 };
    return rawMyOffers.reduce((acc, offer) => {
      acc.total++;
      if (offer.status === 'active') acc.active++;
      if (offer.status === 'accepted') acc.accepted++;
      if (offer.status === 'pending' || offer.status === 'withdrawn') acc.pending++;
      return acc;
    }, { total: 0, active: 0, accepted: 0, pending: 0 });
  }, [rawMyOffers]);

  const myOffers = useMemo(() => {
    if (!rawMyOffers) return [];
    return [...rawMyOffers].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [rawMyOffers]);

  // Consulta global para el Admin (Métricas Usuarios)
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
    <div className="min-h-screen bg-[#030712] text-white pb-20">
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
              {isAdmin ? 'Supervisión total de la red operativa.' : (isClub ? 'Gestión de reclutamiento institucional.' : 'Gestiona tu carrera deportiva.')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {isClub && (
              <>
                {isOfferLimitReached ? (
                  <Button asChild variant="outline" className="h-12 px-6 rounded-2xl border-red-500/30 bg-red-500/5 text-red-500 font-black uppercase text-[10px] tracking-widest">
                    <Link href="/pricing">LÍMITE DE OFERTAS ALCANZADO</Link>
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
          <div className="space-y-8">
            {/* MÉTRICAS ADMIN - USUARIOS */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Censo de Red</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="card-elite rounded-[2.5rem] border-red-500/20 bg-red-500/5 p-8 space-y-4">
                  <Users className="w-6 h-6 text-red-500" />
                  <p className="text-4xl font-black font-headline">{allUsers?.length || 0}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Usuarios</p>
                </Card>
                
                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                   <AdminStatMini label="Elite Top" count={allUsers?.filter(u => u.plan === 'top').length || 0} color="text-yellow-500" icon={Star} />
                   <AdminStatMini label="Elite Pro" count={allUsers?.filter(u => u.plan === 'pro').length || 0} color="text-primary" icon={Zap} />
                   <AdminStatMini label="Verificados" count={allUsers?.filter(u => u.verificationStatus === 'verified').length || 0} color="text-blue-500" icon={UserCheck} />
                   <AdminStatMini label="Elite Free" count={allUsers?.filter(u => !u.plan || u.plan === 'free').length || 0} color="text-muted-foreground" icon={Users} />
                </div>
              </div>
            </div>

            {/* MÉTRICAS ADMIN - MERCADO */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Terminal de Mercado</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="card-elite rounded-[2.5rem] border-primary/20 bg-primary/5 p-8 space-y-4">
                  <Briefcase className="w-6 h-6 text-primary" />
                  <p className="text-4xl font-black font-headline">{adminOfferStats.total}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Vacantes Globales</p>
                </Card>
                
                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                   <AdminStatMini label="Activas" count={adminOfferStats.active} color="text-green-500" icon={Activity} />
                   <AdminStatMini label="Cubiertas" count={adminOfferStats.accepted} color="text-blue-400" icon={CheckCircle2} />
                   <AdminStatMini label="En Pausa" count={adminOfferStats.pending} color="text-yellow-500" icon={Timer} />
                   <AdminStatMini label="Postulaciones" count={recentApplications?.length || 0} color="text-purple-500" icon={Send} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* VERIFICACIONES PENDIENTES */}
              <Card className="card-elite rounded-[2.5rem] border-white/5 bg-[#111827]/40">
                <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-blue-500" />
                    <CardTitle className="text-sm font-black uppercase tracking-widest italic">Verificaciones Pendientes</CardTitle>
                  </div>
                  <Button variant="ghost" asChild className="text-[9px] font-black uppercase text-muted-foreground hover:text-white">
                    <Link href="/admin/users">Ver todos</Link>
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  {pendingUsers && pendingUsers.length > 0 ? (
                    <div className="divide-y divide-white/5">
                      {pendingUsers.map((u) => (
                        <div key={u.id} className="p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-10 h-10 rounded-xl border border-white/10">
                              <AvatarImage src={u.profileImageUrl} />
                              <AvatarFallback className="bg-white/5">{u.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-xs">{u.name}</p>
                              <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight">{u.role} • {u.email}</p>
                            </div>
                          </div>
                          <Button size="sm" asChild variant="outline" className="rounded-xl h-8 border-blue-500/20 text-blue-500 text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white">
                            <Link href={`/profile/me?edit=${u.id}`}>REVISAR</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-muted-foreground">
                      <ClipboardCheck className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Sin solicitudes pendientes</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* POSTULACIONES RECIENTES */}
              <Card className="card-elite rounded-[2.5rem] border-white/5 bg-[#111827]/40">
                <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <Send className="w-5 h-5 text-primary" />
                    <CardTitle className="text-sm font-black uppercase tracking-widest italic">Actividad de Mercado</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {recentApplications && recentApplications.length > 0 ? (
                    <div className="divide-y divide-white/5">
                      {recentApplications.map((app) => (
                        <div key={app.id} className="p-6 space-y-3 group hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-white">{app.userName}</span>
                              <Badge className="bg-primary/10 text-primary border-none text-[7px] font-black uppercase">{app.userRole}</Badge>
                            </div>
                            <span className="text-[8px] text-muted-foreground font-black uppercase flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[9px] text-muted-foreground italic">
                            <Target className="w-3 h-3 text-primary" /> Aplicó a: <b className="text-white not-italic">{app.offerTitle}</b> de {app.clubName}
                          </div>
                          <div className="flex gap-2">
                             <Button asChild size="sm" variant="ghost" className="h-7 text-[8px] font-black uppercase tracking-widest bg-white/5 rounded-lg hover:bg-primary hover:text-background">
                               <Link href={`/profile/${app.userId}`}>VER PERFIL</Link>
                             </Button>
                             <Button asChild size="sm" variant="ghost" className="h-7 text-[8px] font-black uppercase tracking-widest bg-white/5 rounded-lg">
                               <Link href={`/offers/${app.offerId}`}>VER VACANTE</Link>
                             </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-muted-foreground">
                      <Activity className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Sin postulaciones recientes</p>
                    </div>
                  )}
                </CardContent>
              </Card>
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
                <div className="flex gap-8 items-end">
                   <div>
                      <p className="text-4xl font-black font-headline">{myOfferStats.total}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Mis Ofertas</p>
                   </div>
                   <div className="h-10 w-px bg-white/10 mb-1" />
                   <div className="flex gap-4">
                      <div className="text-center">
                         <p className="text-lg font-black text-green-500">{myOfferStats.active}</p>
                         <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Activas</p>
                      </div>
                      <div className="text-center">
                         <p className="text-lg font-black text-blue-400">{myOfferStats.accepted}</p>
                         <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Cubiertas</p>
                      </div>
                      <div className="text-center">
                         <p className="text-lg font-black text-yellow-500">{myOfferStats.pending}</p>
                         <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Pausa</p>
                      </div>
                   </div>
                </div>
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
                             offer.status === 'active' ? "text-green-500" : 
                             offer.status === 'accepted' ? "text-blue-400" : "text-muted-foreground"
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

function AdminStatMini({ label, count, color, icon: Icon }: { label: string, count: number, color: string, icon?: any }) {
  return (
    <Card className="card-elite rounded-2xl bg-white/[0.02] border-white/5 p-4 flex flex-col justify-center relative overflow-hidden group">
      <div className="relative z-10">
        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
        <p className={cn("text-xl font-black font-headline", color)}>{count}</p>
      </div>
      {Icon && <Icon className={cn("absolute -right-2 -bottom-2 w-12 h-12 opacity-[0.03] transition-transform group-hover:scale-110", color)} />}
    </Card>
  );
}
