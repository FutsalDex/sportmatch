
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { TopNav } from '@/components/navigation/top-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Download,
  MoreVertical,
  Settings
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminUsersPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'Player' | 'Coach' | 'Club'>('all');

  const isAdmin = user?.email === 'admin01@gmail.com';

  useEffect(() => {
    if (!isUserLoading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, isAdmin, router]);

  const usersQuery = useMemoFirebase(() => {
    return query(collection(db, 'users'));
  }, [db]);

  const { data: allUsers, isLoading: isUsersLoading } = useCollection(usersQuery);

  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];
    return allUsers.filter(u => {
      const matchesSearch = 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [allUsers, searchTerm, roleFilter]);

  if (isUserLoading || isUsersLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-red-500 font-black animate-pulse uppercase tracking-[0.3em] text-xs">Sincronizando Base de Datos Maestra...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <Link href="/dashboard" className="flex items-center text-red-500 hover:text-red-400 text-[10px] font-black uppercase tracking-[0.2em] gap-2 mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> VOLVER AL PANEL
            </Link>
            <div className="flex items-center gap-4">
              <div className="bg-red-500/10 p-3 rounded-2xl border border-red-500/20">
                <Users className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter uppercase italic leading-none">Gestión de Red</h1>
                <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> Central de Inteligencia de Identidades
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
             <Button variant="outline" className="border-white/10 rounded-xl h-12 gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/5">
                <Download className="w-4 h-4" /> EXPORTAR CSV
             </Button>
          </div>
        </header>

        {/* MÉTRICAS RÁPIDAS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-elite rounded-[2rem] border-red-500/10 bg-red-500/5">
            <CardContent className="p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Total Usuarios</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-black font-headline">{allUsers?.length || 0}</p>
                <Badge className="bg-red-500/20 text-red-500 border-none text-[8px] font-black">SISTEMA ACTIVO</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elite rounded-[2rem]">
            <CardContent className="p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Elite Pro</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-black font-headline">{allUsers?.filter(u => u.plan === 'pro').length || 0}</p>
                <div className="bg-primary/10 p-1.5 rounded-lg"><CreditCard className="w-4 h-4 text-primary" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elite rounded-[2rem]">
            <CardContent className="p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Verificados</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-black font-headline">{allUsers?.filter(u => u.plan === 'verified' || u.verificationStatus === 'verified').length || 0}</p>
                <div className="bg-blue-500/10 p-1.5 rounded-lg"><ShieldCheck className="w-4 h-4 text-blue-500" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elite rounded-[2rem]">
            <CardContent className="p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Score Medio</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-black font-headline">
                  {allUsers?.length ? Math.round(allUsers.reduce((acc, u) => acc + (u.score || 0), 0) / allUsers.length) : 0}
                </p>
                <div className="bg-green-500/10 p-1.5 rounded-lg"><TrendingUp className="w-4 h-4 text-green-500" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FILTROS Y TABLA */}
        <Card className="card-elite rounded-[2.5rem] border-white/5 bg-[#111827]/40 overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nombre, email o UID..." 
                  className="h-12 bg-black/40 border-white/10 rounded-xl pl-12 text-xs font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                <Button 
                  variant="ghost" 
                  onClick={() => setRoleFilter('all')}
                  className={cn("h-10 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest", roleFilter === 'all' && "bg-primary text-background")}
                >TODOS</Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setRoleFilter('Player')}
                  className={cn("h-10 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest", roleFilter === 'Player' && "bg-primary text-background")}
                >JUGADORES</Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setRoleFilter('Coach')}
                  className={cn("h-10 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest", roleFilter === 'Coach' && "bg-primary text-background")}
                >ENTRENADORES</Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setRoleFilter('Club')}
                  className={cn("h-10 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest", roleFilter === 'Club' && "bg-primary text-background")}
                >CLUBES</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[9px] font-black uppercase tracking-widest py-6 px-8">Identidad / Rol</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest">Plan Actual</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest">Validación</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest">IA Score</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest">Ubicación</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest text-right px-8">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <TableCell className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10 rounded-xl border border-white/10">
                          <AvatarImage src={u.profileImageUrl} />
                          <AvatarFallback className="text-xs bg-white/5">{u.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <p className="font-bold text-sm leading-none">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{u.email}</p>
                          <Badge variant="outline" className="border-white/10 text-[8px] font-black bg-black/20 text-muted-foreground">
                            {u.role?.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[9px] font-black border-none px-3 py-1",
                        u.plan === 'pro' ? "bg-primary text-background" : 
                        u.plan === 'verified' ? "bg-blue-500 text-white" : "bg-white/10 text-muted-foreground"
                      )}>
                        {u.plan ? u.plan.toUpperCase() : 'FREE'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          u.verificationStatus === 'verified' ? "bg-green-500" : 
                          u.verificationStatus === 'pending' ? "bg-yellow-500 animate-pulse" : "bg-white/10"
                        )} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                          {u.verificationStatus === 'verified' ? 'VALIDADO' : u.verificationStatus === 'pending' ? 'EN REVISIÓN' : 'SIN VALIDAR'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <span className="font-bold text-sm">{u.score || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[10px] font-medium uppercase">{u.province || '--'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-white/5">
                          <Link href={`/profile/${u.id}`}>
                            <ExternalLink className="w-4 h-4 text-primary" />
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-white/5">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1a212e] border-[#2d3748] rounded-xl p-1">
                            <DropdownMenuItem asChild className="focus:bg-white/5 rounded-lg cursor-pointer">
                              <Link href={`/profile/me?edit=${u.id}`} className="flex items-center gap-2 p-2">
                                <Settings className="w-4 h-4" />
                                <span className="text-xs font-bold">Editar Sujeto</span>
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredUsers.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <Users className="w-10 h-10 text-muted-foreground/20 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No se han encontrado identidades con estos parámetros</p>
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="text-center py-6">
          <p className="text-[8px] md:text-[9px] text-muted-foreground font-black uppercase tracking-[0.4em] opacity-40">
            Base de Datos Maestra SportMatch AI · Nivel de Acceso: Super Admin
          </p>
        </footer>
      </main>
    </div>
  );
}
