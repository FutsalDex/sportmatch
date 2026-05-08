
"use client";

import { useEffect, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { TopNav } from '@/components/navigation/top-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldAlert, 
  Terminal as TerminalIcon, 
  Activity, 
  Lock, 
  UserPlus, 
  Database,
  ArrowLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// Mock de logs para la terminal de auditoría
const MOCK_LOGS = [
  { id: 'L1', timestamp: '2024-05-20 14:32:11', event: 'AUTH_LOGIN_SUCCESS', user: 'admin01@gmail.com', impact: 'low', detail: 'Acceso a Terminal de Mando' },
  { id: 'L2', timestamp: '2024-05-20 14:35:05', event: 'DB_WRITE_PROFILE', user: 'user_882', impact: 'medium', detail: 'Actualización de biografía técnica' },
  { id: 'L3', timestamp: '2024-05-20 14:38:22', event: 'SECURITY_RULE_DENIED', user: 'anonymous_99', impact: 'high', detail: 'Intento de escritura en /matches/all' },
  { id: 'L4', timestamp: '2024-05-20 14:40:15', event: 'ADMIN_FORCE_EDIT', user: 'admin01@gmail.com', impact: 'critical', detail: 'Edición remota de perfil: Marc Soler' },
  { id: 'L5', timestamp: '2024-05-20 14:42:01', event: 'AUTH_SIGNUP_NEW', user: 'new_pro_player@sport.com', impact: 'low', detail: 'Nuevo registro: Elite Pro' },
  { id: 'L6', timestamp: '2024-05-20 14:45:30', event: 'DB_DELETE_DOC', user: 'admin01@gmail.com', impact: 'high', detail: 'Eliminación de documento en /userProfiles/p2' },
];

export default function AdminLogsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const isAdmin = user?.email === 'admin01@gmail.com';

  useEffect(() => {
    if (!isUserLoading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, isAdmin, router]);

  if (isUserLoading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-red-500 font-black animate-pulse uppercase tracking-[0.3em] text-xs">Sincronizando Auditoría...</div>;
  if (!isAdmin) return null;

  const filteredLogs = MOCK_LOGS.filter(log => 
    log.event.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.detail.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter uppercase italic">Logs de Auditoría</h1>
                <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-widest flex items-center gap-2">
                  <TerminalIcon className="w-3 h-3" /> Monitorización de Red SportMatch v2.4
                </p>
              </div>
            </div>
          </div>

          <div className="flex bg-[#111827] p-4 rounded-[2rem] border border-white/5 items-center gap-4">
             <div className="text-right">
               <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Estado Auditoría</p>
               <p className="text-xs font-bold text-green-500 uppercase">SISTEMA NOMINAL</p>
             </div>
             <Activity className="w-8 h-8 text-green-500 animate-pulse" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-elite rounded-[2rem] bg-red-500/5 border-red-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-500" /> Eventos de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black font-headline tracking-tighter">14</p>
              <p className="text-[8px] font-medium text-muted-foreground mt-1">Últimas 24 horas</p>
            </CardContent>
          </Card>

          <Card className="card-elite rounded-[2rem] bg-blue-500/5 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-500" /> Escrituras DB
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black font-headline tracking-tighter">1,204</p>
              <p className="text-[8px] font-medium text-muted-foreground mt-1">Sincronización activa</p>
            </CardContent>
          </Card>

          <Card className="card-elite rounded-[2rem] bg-purple-500/5 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-500" /> Nuevos Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black font-headline tracking-tighter">+12</p>
              <p className="text-[8px] font-medium text-muted-foreground mt-1">Crecimiento orgánico</p>
            </CardContent>
          </Card>
        </div>

        <Card className="card-elite rounded-[2.5rem] border-white/5 bg-[#111827]/40 overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-xl font-bold font-headline uppercase italic">Historial de Operaciones</CardTitle>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Filtrar por evento o usuario..." 
                  className="h-12 bg-black/40 border-white/10 rounded-xl pl-12 text-xs font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[9px] font-black uppercase tracking-widest py-6 px-8">Marca Temporal</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest">Evento de Sistema</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest">Origen (UID/Email)</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest">Impacto</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest px-8">Descripción Detallada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <TableCell className="py-5 px-8 text-[10px] font-mono text-muted-foreground">{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-white/10 text-[9px] font-black bg-black/20 text-white group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {log.event}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-bold text-white/80">{log.user}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[8px] font-black border-none px-2",
                        log.impact === 'critical' ? "bg-red-500 text-white animate-pulse" : 
                        log.impact === 'high' ? "bg-orange-500 text-white" :
                        log.impact === 'medium' ? "bg-yellow-500 text-black" : "bg-blue-500 text-white"
                      )}>
                        {log.impact.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 text-xs text-muted-foreground font-medium italic">
                      {log.detail}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredLogs.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <TerminalIcon className="w-10 h-10 text-muted-foreground/20 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No se han encontrado registros para esta consulta</p>
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="text-center py-6">
          <p className="text-[8px] md:text-[9px] text-muted-foreground font-black uppercase tracking-[0.4em] opacity-40">
            Protocolo de Seguridad SportMatch AI · Nivel de Acceso: Super Admin
          </p>
        </footer>
      </main>
    </div>
  );
}
