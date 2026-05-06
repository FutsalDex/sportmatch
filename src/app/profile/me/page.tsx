"use client";

import { useState } from 'react';
import { 
  Globe, 
  FileText, 
  Sparkles, 
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TopNav } from '@/components/navigation/top-nav';

export default function MyProfilePage() {
  const [formData, setFormData] = useState({
    name: 'FutsalDex',
    province: '',
    bio: ''
  });

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <TopNav />
      
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-5xl font-bold font-headline tracking-tighter">Mi Perfil</h1>
          <Button variant="outline" className="rounded-xl border-primary/50 text-primary hover:bg-primary/10 px-6 font-bold h-12">
            Ver Público
          </Button>
        </div>

        <div className="space-y-8 pb-24">
          {/* Datos Básicos Card */}
          <Card className="bg-[#111827] border-[#1F2937] border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <Globe className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-headline tracking-tight">Datos Básicos</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Nombre</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Provincia</Label>
                  <Select onValueChange={(v) => setFormData({...formData, province: v})}>
                    <SelectTrigger className="h-14 bg-[#1F2937]/50 border-none rounded-2xl text-lg px-6 focus-visible:ring-1 focus-visible:ring-primary/50">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111827] border-[#1F2937] text-white">
                      <SelectItem value="madrid">Madrid</SelectItem>
                      <SelectItem value="barcelona">Barcelona</SelectItem>
                      <SelectItem value="valencia">Valencia</SelectItem>
                      <SelectItem value="sevilla">Sevilla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio Profesional Card */}
          <Card className="bg-[#111827] border-[#1F2937] border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center space-x-3 text-primary">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-headline tracking-tight">Bio Profesional</h2>
              </div>
              
              <div className="space-y-3">
                <Textarea 
                  placeholder="Describe tu trayectoria..."
                  className="min-h-[200px] bg-[#1F2937]/50 border-none rounded-3xl text-lg p-8 resize-none focus-visible:ring-1 focus-visible:ring-primary/50 placeholder:text-muted-foreground/30"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions Bar Card */}
          <Card className="bg-[#111827] border-[#1F2937] border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10 flex items-center justify-between">
              <Button variant="link" className="text-[#EF4444] font-bold text-lg hover:no-underline p-0">
                Cerrar Sesión
              </Button>
              
              <Button className="bg-primary hover:bg-primary/90 text-background h-16 px-10 rounded-3xl text-lg font-black uppercase tracking-widest flex gap-3 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                <Sparkles className="w-6 h-6 fill-current" />
                Guardar Perfil
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
