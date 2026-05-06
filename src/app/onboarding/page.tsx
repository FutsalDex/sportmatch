
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
import { ArrowRight, CheckCircle2, UserCircle, Lock, Mail, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
    // Si el usuario ya está autenticado y no está en proceso de registro/login, saltar a paso 2
    if (user && step === 1 && !isProcessing) {
      setStep(2);
    }
  }, [user, step, isProcessing]);

  const handleAuthAction = async () => {
    if (!formData.email || !formData.password) return;
    setIsProcessing(true);
    
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast({ title: "Bienvenido de nuevo", description: "Accediendo a tu terminal..." });
      } else {
        if (!formData.name || !formData.role) {
          toast({ variant: "destructive", title: "Datos incompletos", description: "Por favor, completa todos los campos." });
          setIsProcessing(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Crear documento inicial de usuario
        const userRef = doc(db, 'users', userCredential.user.uid);
        setDocumentNonBlocking(userRef, {
          id: userCredential.user.uid,
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
      }
      setStep(2);
    } catch (error: any) {
      let message = "Ha ocurrido un error inesperado.";
      if (error.code === 'auth/email-already-in-use') {
        message = "Este correo ya está registrado. Prueba a iniciar sesión.";
      } else if (error.code === 'auth/invalid-credential') {
        message = "Credenciales incorrectas. Revisa tu email y contraseña.";
      } else if (error.code === 'auth/weak-password') {
        message = "La contraseña es muy débil. Usa al menos 6 caracteres.";
      }
      
      toast({
        variant: "destructive",
        title: isLoginMode ? "Error de Inicio de Sesión" : "Error de Registro",
        description: message,
      });
    } finally {
      setIsProcessing(false);
    }
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

      toast({ title: "Perfil Completado", description: "Tu terminal de scouting ya está operativa." });
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white p-6">
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
              <h1 className="text-4xl font-bold font-headline tracking-tighter">
                {isLoginMode ? "Acceso Terminal" : "Crea tu Identidad"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isLoginMode ? "Introduce tus credenciales de scout." : "Regístrate en la terminal de scouting para comenzar."}
              </p>
            </div>
            
            <div className="space-y-4">
              {!isLoginMode && (
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
              )}

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

              {!isLoginMode && (
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
              )}
            </div>
            
            <div className="space-y-4">
              <Button 
                className="w-full h-16 rounded-3xl text-lg font-black uppercase tracking-widest bg-primary text-background hover:bg-primary/90 shadow-[0_0_30px_rgba(234,179,8,0.2)]" 
                onClick={handleAuthAction} 
                disabled={isProcessing}
              >
                {isProcessing ? "Procesando..." : (isLoginMode ? "Entrar" : "Continuar")} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full text-muted-foreground hover:text-white"
                onClick={() => setIsLoginMode(!isLoginMode)}
              >
                {isLoginMode ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </Button>
            </div>
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
