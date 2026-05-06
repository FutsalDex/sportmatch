
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Discipline = 'Football' | 'Futsal' | null;

interface DisciplineContextType {
  discipline: Discipline;
  setDiscipline: (d: Discipline) => void;
}

const DisciplineContext = createContext<DisciplineContextType | undefined>(undefined);

export function DisciplineProvider({ children }: { children: React.ReactNode }) {
  const [discipline, setDisciplineState] = useState<Discipline>(null);

  useEffect(() => {
    const saved = localStorage.getItem('selected_discipline') as Discipline;
    if (saved) setDisciplineState(saved);
  }, []);

  const setDiscipline = (d: Discipline) => {
    setDisciplineState(d);
    if (d) {
      localStorage.setItem('selected_discipline', d);
    } else {
      localStorage.removeItem('selected_discipline');
    }
  };

  return (
    <DisciplineContext.Provider value={{ discipline, setDiscipline }}>
      {children}
    </DisciplineContext.Provider>
  );
}

export function useDiscipline() {
  const context = useContext(DisciplineContext);
  if (context === undefined) {
    throw new Error('useDiscipline must be used within a DisciplineProvider');
  }
  return context;
}
