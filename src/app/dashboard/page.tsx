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
  Send
} from 'lucide-react';
import { doc, collection, query, where } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useUser();
  const db = useFirestore();
  const isAdmin = user?.email === 'admin01@gmail.com';

  const userDocRef = useMemoFirebase(() => {
    return user ? doc(db, 'users', user.uid) : null;
  }, [db, user?.uid]);

  const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

  // Consulta de Matches (Para todos los usuarios)
  const matchesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'matches'), where(`members.${user.uid}`, '==', true));
  }, [db, user?.uid]);

  const { data: matchesData, isLoading: isMatchesLoading } = useCollection(matchesQuery);

  // Consulta de Ofertas Enviadas (Solo para Clubes)
  const sentOffersQuery = useMemoFirebase(() => {
    if (!user || userData?.role !== 'Club') return null;
    return query(collection(db, 'offers'), where('clubId', '==', user.uid));
  }, [db, user?.uid, userData?.role]);

  const { data: sentOffers } = useCollection(sentOffersQuery);

  // Consulta global para el Admin
  const allUsersQuery = useMemoFirebase(() => {
    if (!isAdmin) return null;
    return collection(db, 'users');
  }, [db, isAdmin]);
  const { data: allUsers } = useCollection(allUsersQuery);

  if (isUserLoading || isMatchesLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-primary font-bold animate-pulse uppercase tracking-[0.3em] text-xs p-10 text-center">Cargando Terminal...</div>;

  const planLabel = isAdmin ? 'Super Administrador' : (userData?.plan === 'pro' ? 'Elite Pro' : userData?.plan === 'verified' ? 'Elite Verificado' : 'Elite Free');
  
  const activeMatches = matchesData?.filter(m => m.status === 'accepted') || [];
  const pendingMatches = matchesData?.filter(m => m.status === 'pending') || [];

  const isClub = userData?.role === 'Club';

  // Métricas Admin
  const topUsersCount = allUsers?.filter(u => u.plan === 'top').length || 0;
  const proUsersCount = allUsers?.filter(u => u.plan === 'pro').length || 0;
  const verifiedUsersCount = allUsers?.filter(u => u.plan === 'verified' || u.verificationStatus === 'verified').length || 0;
  const freeUsersCount = (allUsers?.length || 0) - (topUsersCount + proUsersCount + verifiedUsersCount);

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
              {isAdmin ? 'Modo Dios:' : 'Hola,'} {userData?.name?.split(' ')[0] || 'Usuario'}
            </h1>
            <p className="text-[10px] md:text-base text-muted-foreground font-medium">
              {isAdmin ? 'Supervisión total de la red y gestión de identidades.' : 'Gestiona tu carrera y analiza tu impacto.'}
            </p>
          </div>
          <div className="flex gap-4">
            <div className={cn(
              "border p-3 md:p-4 rounded-2xl md:rounded-3xl flex items-center gap-4",
              isAdmin ? "bg-red-500/5 border-red-500/10" : "bg-[#111827] border-white/5"
            )}>
              <div className={cn("p-2 rounded-xl", isAdmin ? "bg-red-500/10" : "bg-green-500/10")}>
                {isAdmin ? <ShieldAlert className="w-5 h-5 text-red-500" /> : <Crown className="w-5 h-5 text-green-500" />}
              </div>
              <div>
                <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Estado Rol</p>
                <p className="font-bold text-xs md:text-sm uppercase tracking-tighter">{planLabel}</p>
              </div>
            </div>
          </div>
        </header>

        {isAdmin ? (
          /* DASHBOARD ADMIN */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="card-elite rounded-[2.5rem] border-red-500/20 bg-red-500/5 hover:border-red-500/40 transition-all cursor-pointer group">
              <Link href="/admin/users" className="block p-6 md:p-8 space-y-4">
                <div className="bg-red-500/10 p-3 rounded-2xl w-fit group-hover:bg-red-500/20 transition-colors">
                  <Users className="w-6 h-6 text-red-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-black font-headline tracking-tighter">{allUsers?.length || 0}</p>
                  <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Usuarios</p>
                </div>
                <div className="flex items-center text-red-500 text-[8px] font-black uppercase tracking-widest">
                  ABRIR BASE DE DATOS <ChevronRight className="ml-1 w-3 h-3" />
                </div>
              </Link>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="card-elite rounded-[2.5rem] border-yellow-500/20 bg-yellow-500/5">
                <CardContent className="p-5 md:p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <Badge className="bg-yellow-500/20 text-yellow-500 border-none text-[6px] font-black">TOP</Badge>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xl md:text-2xl font-black font-headline">{topUsersCount}</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Elite Top</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elite rounded-[2.5rem] border-primary/20 bg-primary/5">
                <CardContent className="p-5 md:p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <Star className="w-4 h-4 text-primary" />
                    <Badge className="bg-primary/20 text-primary border-none text-[6px] font-black">PRO</Badge>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xl md:text-2xl font-black font-headline">{proUsersCount}</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Elite Pro</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elite rounded-[2.5rem] border-blue-500/20 bg-blue-500/5">
                <CardContent className="p-5 md:p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <Badge className="bg-blue-500/20 text-blue-400 border-none text-[6px] font-black">VERIF</Badge>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xl md:text-2xl font-black font-headline">{verifiedUsersCount}</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Verificados</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elite rounded-[2.5rem] border-white/5">
                <CardContent className="p-5 md:p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <UserCheck className="w-4 h-4 text-muted-foreground" />
                    <Badge className="bg-white/5 text-muted-foreground border-none text-[6px] font-black">FREE</Badge>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xl md:text-2xl font-black font-headline">{freeUsersCount}</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Cuentas Free</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-elite rounded-[2.5rem] border-purple-500/20">
              <CardContent className="p-6 md:p-8 space-y-4 flex flex-col justify-center">
                <div className="bg-purple-500/10 p-3 rounded-2xl w-fit">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-black font-headline tracking-tighter">98.2%</p>
                  <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Salud de la Red</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elite rounded-[2.5rem] bg-gradient-to-br from-red-500/20 to-transparent border-red-500/20">
              <CardContent className="p-6 md:p-8 space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-1">
                  <p className="font-bold text-base md:text-lg font-headline">Auditoría</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium">Revisa logs de seguridad.</p>
                </div>
                <Link 
                  href="/admin/logs" 
                  className="w-full h-10 md:h-12 bg-red-500 text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl md:rounded-2xl hover:bg-red-600 flex items-center justify-center"
                >
                  VER LOGS <ArrowUpRight className="ml-2 w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* DASHBOARD USER ESTÁNDAR / CLUB */
          <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto no-scrollbar snap-x-mandatory pb-4">
            <Card className="min-w-[85vw] md:min-w-0 card-elite rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group snap-center">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-2xl group-hover:bg-primary/20 transition-colors">
                    <Star className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <Badge className="bg-primary/10 text-primary border-none text-[9px] md:text-[10px]">Puntuación Real</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-black font-headline tracking-tighter">{userData?.score || 0}</p>
                  <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Score IA Global</p>
                </div>
                <Progress value={userData?.score || 0} className="h-1 bg-white/5" />
              </CardContent>
            </Card>

            <Card className="min-w-[85vw] md:min-w-0 card-elite rounded-[2rem] md:rounded-[2.5rem] snap-center">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="bg-blue-500/10 p-2 md:p-3 rounded-2xl w-fit">
                  <Eye className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-black font-headline tracking-tighter">{userData?.views || 0}</p>
                  <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Vistas de Perfil</p>
                </div>
                <p className="text-[9px] md:text-[10px] text-green-400 font-bold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> Análisis Activo
                </p>
              </CardContent>
            </Card>

            <Card className="min-w-[85vw] md:min-w-0 card-elite rounded-[2rem] md:rounded-[2.5rem] snap-center">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="bg-purple-500/10 p-2 md:p-3 rounded-2xl w-fit">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-black font-headline tracking-tighter">{activeMatches.length}</p>
                  <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Matches Activos</p>
                </div>
                <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold">{pendingMatches.length} pendientes</p>
              </CardContent>
            </Card>

            <Card className="min-w-[85vw] md:min-w-0 card-elite rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-transparent border-primary/20 snap-center">
              <CardContent className="p-6 md:p-8 space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-1">
                  <p className="font-bold text-base md:text-lg font-headline">{isClub ? 'Panel Club' : 'Hazte Pro'}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium">
                    {isClub ? 'Gestiona tus ofertas y scouting.' : 'Análisis avanzado e insignias élite.'}
                  </p>
                </div>
                <Link 
                  href={isClub ? "/search" : "/pricing"} 
                  className="w-full h-10 md:h-12 bg-primary text-background font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl md:rounded-2xl hover:bg-primary/90 flex items-center justify-center"
                >
                  {isClub ? 'BUSCAR TALENTO' : 'MEJORAR AHORA'} <ArrowUpRight className="ml-2 w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground flex items-center">
              <LayoutDashboard className="w-4 h-4 mr-2" /> {isAdmin ? 'Gestión de Sistema' : (isClub ? 'Pipeline de Reclutamiento' : 'Pipeline de Scouting')}
            </h2>
            <Link href={isAdmin ? "/admin/users" : (isClub ? "/search" : "/matches")} className="text-primary text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:underline flex items-center">
              Ver todos <ChevronRight className="ml-1 w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isAdmin ? (
              /* SECCIÓN ADMIN: GESTIÓN DE SISTEMA */
              <div className="col-span-full space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <Card className="bg-[#111827] border-white/5 rounded-3xl p-6 hover:border-primary/20 transition-all group">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" /> Informes PDF Clubes
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">Genera dossieres técnicos de talentos para clubes en seguimiento.</p>
                      <Button variant="outline" className="w-full border-white/10 rounded-2xl h-12 uppercase font-black text-[10px] tracking-widest gap-2">
                        PENDIENTES (0) <Download className="w-3 h-3" />
                      </Button>
                   </Card>

                   <Card className="bg-[#111827] border-white/5 rounded-3xl p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Crown className="w-5 h-5 text-primary" /> Verificaciones
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">Valida la identidad de los nuevos talentos verificados.</p>
                      <Button variant="outline" className="w-full border-white/10 rounded-2xl h-12 uppercase font-black text-[10px] tracking-widest">
                        REVISAR COLA (0)
                      </Button>
                   </Card>

                   <Card className="bg-[#111827] border-red-500/10 rounded-3xl p-6 group">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-500" /> Protocolos Root
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">Mantenimiento de bases de datos y purga de logs obsoletos.</p>
                      <Button variant="ghost" className="w-full bg-red-500/5 text-red-500 hover:bg-red-500/10 rounded-2xl h-12 uppercase font-black text-[10px] tracking-widest">
                        ACCESO RESTRINGIDO
                      </Button>
                   </Card>
                </div>
              </div>
            ) : (
              /* SECCIÓN USER/CLUB: PIPELINE */
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {isClub ? `Ofertas Enviadas (${sentOffers?.length || 0})` : `Interesados (${activeMatches.length})`}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </div>
                  <div className="space-y-3">
                    {isClub ? (
                      sentOffers && sentOffers.length > 0 ? (
                        sentOffers.slice(0, 3).map((offer, i) => (
                          <Card key={i} className="bg-[#111827] border-white/5 rounded-2xl md:rounded-3xl hover:border-primary/20 transition-all">
                            <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
                              <div className="bg-primary/10 p-2 rounded-xl">
                                <Send className="w-4 h-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-xs md:text-sm truncate">{offer.position}</p>
                                <p className="text-[8px] md:text-[10px] text-muted-foreground font-medium uppercase">{offer.status}</p>
                              </div>
                              <Badge variant="outline" className="border-primary/20 text-primary text-[7px] md:text-[8px] font-black">INFO</Badge>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="h-20 border border-dashed border-white/5 rounded-2xl flex items-center justify-center opacity-30">
                          <p className="text-[8px] font-bold uppercase tracking-widest">Sin ofertas enviadas</p>
                        </div>
                      )
                    ) : (
                      activeMatches.length === 0 ? (
                        <div className="h-20 border border-dashed border-white/5 rounded-2xl flex items-center justify-center opacity-30">
                          <p className="text-[8px] font-bold uppercase tracking-widest">Sin contactos</p>
                        </div>
                      ) : (
                        activeMatches.slice(0, 3).map((match, i) => (
                          <Card key={i} className="bg-[#111827] border-white/5 rounded-2xl md:rounded-3xl hover:border-primary/20 transition-all cursor-pointer">
                            <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
                              <Avatar className="w-10 h-10 rounded-xl">
                                <AvatarFallback className="text-xs">ID</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-xs md:text-sm truncate">Match #{match.id.substring(0,4)}</p>
                                <p className="text-[8px] md:text-[10px] text-muted-foreground font-medium">Conexión Activa</p>
                              </div>
                              <Badge variant="outline" className="border-primary/20 text-primary text-[7px] md:text-[8px] font-black">OK</Badge>
                            </CardContent>
                          </Card>
                        ))
                      )
                    )}
                  </div>
                  {isClub && (
                    <p className="text-[8px] text-muted-foreground italic px-2">
                      * El Generador de Ofertas se encuentra dentro del perfil de cada talento.
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">En Revisión ({pendingMatches.length})</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  </div>
                  <div className="space-y-3">
                    {pendingMatches.length === 0 ? (
                      <div className="h-20 border border-dashed border-white/5 rounded-2xl flex items-center justify-center opacity-30">
                        <p className="text-[8px] font-bold uppercase tracking-widest">Sin revisiones</p>
                      </div>
                    ) : (
                      pendingMatches.slice(0, 3).map((match, i) => (
                        <Card key={i} className="bg-[#111827] border-white/5 rounded-2xl md:rounded-3xl border-l-2 border-l-yellow-500">
                          <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
                            <Avatar className="w-10 h-10 rounded-xl">
                              <AvatarFallback className="text-xs">RE</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-xs md:text-sm truncate">Pendiente #{match.id.substring(0,4)}</p>
                              <p className="text-[8px] md:text-[10px] text-muted-foreground font-medium">Análisis IA</p>
                            </div>
                            <div className="bg-yellow-500/10 p-1.5 rounded-lg">
                              <Zap className="w-3 h-3 text-yellow-500" />
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Finalistas (0)</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </div>
                  <div className="h-20 md:h-24 border-2 border-dashed border-white/5 rounded-2xl md:rounded-[2rem] flex items-center justify-center">
                    <p className="text-[8px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic text-center">Área vacía</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {!isAdmin && (
          <section className="bg-primary rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-background flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-[0_0_60px_rgba(234,179,8,0.2)]">
            <div className="bg-background p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-2xl">
              <Zap className="w-8 h-8 md:w-12 md:h-12 text-primary fill-primary" />
            </div>
            <div className="space-y-2 md:space-y-4 flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-3xl font-bold font-headline tracking-tighter uppercase italic">Predicción IA de Mercado</h2>
              <p className="font-bold text-sm md:text-lg leading-tight text-background">
                {userData?.score && userData.score > 70 
                  ? (isClub ? "Tu entidad tiene una alta capacidad de atracción. El sistema detecta perfiles compatibles con tu ADN deportivo." : "Tu perfil tiene un alto impacto. Los clubes buscan perfiles con tu versatilidad técnica ahora mismo.")
                  : "Optimiza tu biografía y sube fotos de calidad para aumentar tu Score y visibilidad en la red."}
              </p>
            </div>
            <Link 
              href={isClub ? "/search" : "/profile/me"} 
              className="w-full md:w-auto h-12 md:h-16 rounded-2xl md:rounded-3xl bg-[#030712] text-white hover:bg-black border border-white/10 flex items-center justify-center font-black px-8 text-[10px] md:text-sm uppercase tracking-widest shadow-xl transition-all"
            >
              {isClub ? 'ENCONTRAR TALENTO' : 'ACTUALIZAR MI PERFIL'}
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
