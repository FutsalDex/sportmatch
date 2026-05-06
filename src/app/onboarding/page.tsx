
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, CheckCircle2, UserCircle, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore, initiateEmailSignUp, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function OnboardingPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user } = useUser();
  
  const [step, setStep] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    discipline: '',
    province: '',
    bio: '',
  });

  useEffect(() => {
    if (user && isRegistering && step === 1) {
      const userRef = doc(db, 'users', user.uid);
      setDocumentNonBlocking(userRef, {
        id: user.uid,
        email: formData.email,
        name: formData.name,
        role: formData.role,
        discipline: 'Football',
        status: 'available',
        score: 65,
        verificationStatus: 'none',
        province: '',
        level: 'Amateur',
      }, { merge: true });

      setIsRegistering(false);
      setStep(2);
    }
  }, [user, isRegistering, step, db, formData]);

  const handleStep1Submit = () => {
    if (!formData.email || !formData.password || !formData.name || !formData.role) return;
    setIsRegistering(true);
    initiateEmailSignUp(auth, formData.email, formData.password);
  };

  const handleFinalize = () => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      setDocumentNonBlocking(userRef, {
        discipline: formData.discipline,
        province: formData.province,
      }, { merge: true });

      const profileRef = doc(db, 'userProfiles', user.uid);
      setDocumentNonBlocking(profileRef, {
        id: user.uid,
        userId: user.uid,
        bio: formData.bio,
        teamHistory: [],
        videoUrls: [],
      }, { merge: true });

      router.push('/dashboard');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black p-6">
      <div className="max-w-md mx-auto w-full pt-12 space-y-8">
        <div className="space-y-2">
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-primary' : 'bg-white/10'}`} 
              />
            ))}
          </div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Paso {step} de 3</p>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold font-headline tracking-tighter">Crea tu Identidad</h1>
              <p className="text-muted-foreground text-sm">Regístrate en la terminal de scouting para comenzar.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Nombre Completo</Label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    className="h-14 rounded-2xl bg-white/5 border-white/10 pl-12 focus:ring-primary/50" 
                    placeholder="Ej: Juan Pérez" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="email"
                    className="h-14 rounded-2xl bg-white/5 border-white/10 pl-12 focus:ring-primary/50" 
                    placeholder="tu@email.com" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="password"
                    className="h-14 rounded-2xl bg-white/5 border-white/10 pl-12 focus:ring-primary/50" 
                    placeholder="Mínimo 6 caracteres" 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">¿Cuál es tu rol?</Label>
                <Select onValueChange={v => setFormData({...formData, role: v})}>
                  <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111827] border-white/10 text-white">
                    <SelectItem value="Player">Jugador</SelectItem>
                    <SelectItem value="Coach">Entrenador</SelectItem>
                    <SelectItem value="Club">Club / Institución</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              className="w-full h-16 rounded-3xl text-lg font-black uppercase tracking-widest bg-primary text-background hover:bg-primary/90 shadow-[0_0_30px_rgba(234,179,8,0.2)]" 
              onClick={handleStep1Submit} 
              disabled={!formData.name || !formData.role || !formData.email || formData.password.length < 6 || isRegistering}
            >
              {isRegistering ? "Procesando..." : "Continuar"} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold font-headline tracking-tighter">Tu Especialidad</h1>
              <p className="text-muted-foreground text-sm">Define tu disciplina y ubicación principal para el scouting.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Disciplina</Label>
                <Select onValueChange={v => setFormData({...formData, discipline: v})}>
                  <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10">
                    <SelectValue placeholder="Selecciona disciplina" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111827] border-white/10 text-white">
                    <SelectItem value="Football">Fútbol</SelectItem>
                    <SelectItem value="Futsal">Fútbol Sala</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Provincia</Label>
                <Input 
                  className="h-14 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/50" 
                  placeholder="Ej: Madrid, Barcelona..." 
                  value={formData.province} 
                  onChange={e => setFormData({...formData, province: e.target.value})} 
                />
              </div>
            </div>
            
            <Button 
              className="w-full h-16 rounded-3xl text-lg font-black uppercase tracking-widest bg-primary text-background hover:bg-primary/90" 
              onClick={() => setStep(3)} 
              disabled={!formData.discipline || !formData.province}
            >
              Casi listo <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold font-headline tracking-tighter">Perfil Detallado</h1>
              <p className="text-muted-foreground text-sm">Tu biografía será analizada por nuestra IA para destacar lo mejor de ti.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Biografía / Resumen de Carrera</Label>
                <Textarea 
                  className="min-h-[180px] rounded-3xl bg-white/5 border-white/10 p-6 resize-none focus:ring-primary/50 text-lg" 
                  placeholder="Describe tus habilidades, trayectoria y lo que buscas..." 
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleFinalize}
              className="w-full h-16 rounded-3xl text-lg font-black uppercase tracking-widest bg-primary text-background hover:bg-primary/90"
            >
              Finalizar Perfil <CheckCircle2 className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
