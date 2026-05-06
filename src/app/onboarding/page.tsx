"use client";

import { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, Trophy, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    discipline: '',
    province: '',
    bio: '',
  });

  const handleNext = () => setStep(prev => prev + 1);

  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto w-full pt-12 space-y-8">
        <div className="space-y-2">
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-primary' : 'bg-secondary'}`} 
              />
            ))}
          </div>
          <p className="text-xs font-bold text-primary uppercase tracking-wider">Paso {step} de 3</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Crea tu Identidad</h1>
              <p className="text-muted-foreground text-sm">Cuéntanos quién eres en el mundo del deporte.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre Completo</Label>
                <Input className="h-12 rounded-xl" placeholder="Ej: Juan Pérez" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>¿Cuál es tu rol?</Label>
                <Select onValueChange={v => setFormData({...formData, role: v})}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Player">Jugador</SelectItem>
                    <SelectItem value="Coach">Entrenador</SelectItem>
                    <SelectItem value="Club">Club / Institución</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button className="w-full h-14 rounded-2xl text-lg font-bold" onClick={handleNext} disabled={!formData.name || !formData.role}>
              Continuar <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Tu Especialidad</h1>
              <p className="text-muted-foreground text-sm">Define tu disciplina y ubicación principal.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Disciplina</Label>
                <Select onValueChange={v => setFormData({...formData, discipline: v})}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Selecciona disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Football">Fútbol</SelectItem>
                    <SelectItem value="Futsal">Fútbol Sala</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Provincia</Label>
                <Input className="h-12 rounded-xl" placeholder="Ej: Madrid, Barcelona..." value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} />
              </div>
            </div>
            
            <Button className="w-full h-14 rounded-2xl text-lg font-bold" onClick={handleNext} disabled={!formData.discipline || !formData.province}>
              Casi listo <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Perfil Detallado</h1>
              <p className="text-muted-foreground text-sm">Tu biografía será analizada por nuestra IA para destacar lo mejor de ti.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Biografía / Resumen de Carrera</Label>
                <Textarea 
                  className="min-h-[150px] rounded-xl resize-none" 
                  placeholder="Describe tus habilidades, trayectoria y lo que buscas..." 
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            </div>
            
            <Button asChild className="w-full h-14 rounded-2xl text-lg font-bold">
              <Link href="/search">
                Finalizar Perfil <CheckCircle2 className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}