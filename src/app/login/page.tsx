"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsProcessing(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Acceso Concedido", description: "Iniciando terminal..." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error de Acceso",
        description: "Credenciales incorrectas o terminal no operativa.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-white p-6 items-center justify-center">
      <div className="max-w-md mx-auto w-full space-y-10">
        <div className="text-center space-y-4">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold font-headline tracking-tighter uppercase">Acceso a SportMatch</h1>
            <p className="text-muted-foreground text-sm font-medium tracking-wide">Introduce tus credenciales</p>
          </div>
        </div>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type="email"
                className="h-14 rounded-2xl bg-[#030712] border-white/10 pl-12 focus:ring-primary/50 text-white placeholder:text-muted-foreground/30" 
                placeholder="tu@email.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type={showPassword ? "text" : "password"}
                className="h-14 rounded-2xl bg-[#030712] border-white/10 pl-12 pr-12 focus:ring-primary/50 text-white placeholder:text-muted-foreground/30" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none z-10"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full h-16 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] bg-primary text-background hover:bg-primary/90 shadow-[0_0_30px_rgba(234,179,8,0.2)]" 
            onClick={handleLogin} 
            disabled={isProcessing}
          >
            {isProcessing ? "Validando..." : "Entrar en la Red"} <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <p className="text-center text-xs text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/onboarding" className="text-primary font-bold hover:underline">
              Crear Identidad
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
