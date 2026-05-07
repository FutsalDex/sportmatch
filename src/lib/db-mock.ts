export type Role = 'Player' | 'Coach' | 'Club';
export type Discipline = 'Football' | 'Futsal';
export type VerificationStatus = 'none' | 'pending' | 'verified';
export type MatchStatus = 'pending' | 'accepted' | 'rejected';

export interface User {
  id: string;
  name: string;
  role: Role;
  discipline: Discipline;
  province: string;
  status: 'available' | 'busy';
  score: number;
  level: string;
  avatarUrl: string;
  verificationStatus: VerificationStatus;
  position: string;
  age: number;
}

export interface UserProfile {
  id: string;
  bio: string;
  teamHistory: string[];
  achievements: string[];
  videos: string[];
  summary?: string;
  analysis?: {
    strengths: string[];
    weaknesses: string[];
    potential: string;
    summary: string;
  };
}

export const MOCK_USERS: User[] = [
  // --- JUGADORES FÚTBOL (10) ---
  { id: 'p1', name: 'Carlos Rodríguez', role: 'Player', discipline: 'Football', province: 'Madrid', status: 'available', score: 85, level: 'Semi-Pro', avatarUrl: 'https://picsum.photos/seed/p1/100/100', verificationStatus: 'verified', position: 'Delantero Centro', age: 23 },
  { id: 'p2', name: 'Lucas Pérez', role: 'Player', discipline: 'Football', province: 'Valencia', status: 'available', score: 65, level: 'Amateur', avatarUrl: 'https://picsum.photos/seed/p2/100/100', verificationStatus: 'none', position: 'Extremo Izquierdo', age: 19 },
  { id: 'p3', name: 'Marc Soler', role: 'Player', discipline: 'Football', province: 'Barcelona', status: 'available', score: 88, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/p3/100/100', verificationStatus: 'verified', position: 'Mediocentro', age: 24 },
  { id: 'p4', name: 'Diego Torres', role: 'Player', discipline: 'Football', province: 'Sevilla', status: 'available', score: 72, level: 'Semi-Pro', avatarUrl: 'https://picsum.photos/seed/p4/100/100', verificationStatus: 'pending', position: 'Defensa Central', age: 27 },
  { id: 'p6', name: 'Iker Casillas Jr', role: 'Player', discipline: 'Football', province: 'Madrid', status: 'available', score: 79, level: 'Amateur', avatarUrl: 'https://picsum.photos/seed/p6/100/100', verificationStatus: 'none', position: 'Portero', age: 18 },
  { id: 'p7', name: 'Sergio Ramos V2', role: 'Player', discipline: 'Football', province: 'Sevilla', status: 'available', score: 84, level: 'Semi-Pro', avatarUrl: 'https://picsum.photos/seed/p7/100/100', verificationStatus: 'verified', position: 'Lateral Derecho', age: 22 },
  { id: 'p9', name: 'Dani Olmo S.', role: 'Player', discipline: 'Football', province: 'Zaragoza', status: 'available', score: 82, level: 'Semi-Pro', avatarUrl: 'https://picsum.photos/seed/p9/100/100', verificationStatus: 'verified', position: 'Mediapunta', age: 21 },
  { id: 'p10', name: 'Gavi Junior', role: 'Player', discipline: 'Football', province: 'Barcelona', status: 'available', score: 89, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/p10/100/100', verificationStatus: 'verified', position: 'Interior', age: 17 },
  { id: 'p11', name: 'Brahim Diaz II', role: 'Player', discipline: 'Football', province: 'Málaga', status: 'available', score: 81, level: 'Semi-Pro', avatarUrl: 'https://picsum.photos/seed/p11/100/100', verificationStatus: 'verified', position: 'Extremo Derecho', age: 22 },
  { id: 'p12', name: 'Koke Resu', role: 'Player', discipline: 'Football', province: 'Madrid', status: 'available', score: 87, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/p12/100/100', verificationStatus: 'verified', position: 'Pivote', age: 31 },

  // --- ENTRENADORES FÚTBOL (10) ---
  { id: 'c2', name: 'Roberto M.', role: 'Coach', discipline: 'Football', province: 'Madrid', status: 'available', score: 86, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/c2/100/100', verificationStatus: 'verified', position: 'Preparador Físico', age: 41 },
  { id: 'c3', name: 'Luis Enrique B.', role: 'Coach', discipline: 'Football', province: 'Madrid', status: 'available', score: 94, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/c3/100/100', verificationStatus: 'verified', position: 'Director Técnico', age: 45 },
  { id: 'c5', name: 'Jorge Valdano V2', role: 'Coach', discipline: 'Football', province: 'Madrid', status: 'available', score: 78, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/c5/100/100', verificationStatus: 'verified', position: 'Analista Táctico', age: 52 },
  { id: 'c6', name: 'Santi Denia B.', role: 'Coach', discipline: 'Football', province: 'Albacete', status: 'available', score: 83, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/c6/100/100', verificationStatus: 'verified', position: 'Scout Jefe', age: 48 },
  { id: 'c7', name: 'Raúl González P.', role: 'Coach', discipline: 'Football', province: 'Madrid', status: 'available', score: 88, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/c7/100/100', verificationStatus: 'verified', position: 'Entrenador Filial', age: 44 },
  { id: 'c9', name: 'Míchel Sánchez V.', role: 'Coach', discipline: 'Football', province: 'Girona', status: 'available', score: 90, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/c9/100/100', verificationStatus: 'verified', position: 'Entrenador Primer Equipo', age: 47 },
  { id: 'c11', name: 'Xabi Alonso II', role: 'Coach', discipline: 'Football', province: 'Donostia', status: 'available', score: 96, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/c11/100/100', verificationStatus: 'verified', position: 'Estratega Táctico', age: 42 },
  { id: 'c12', name: 'Unai Emery B.', role: 'Coach', discipline: 'Football', province: 'Hondarribia', status: 'available', score: 93, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/c12/100/100', verificationStatus: 'verified', position: 'Especialista Copas', age: 51 },
  { id: 'c13', name: 'Rubén Baraja', role: 'Coach', discipline: 'Football', province: 'Valencia', status: 'available', score: 84, level: 'Semi-Pro', avatarUrl: 'https://picsum.photos/seed/c13/100/100', verificationStatus: 'pending', position: 'Gestor Cantera', age: 48 },
  { id: 'c14', name: 'Paco López', role: 'Coach', discipline: 'Football', province: 'Silla', status: 'available', score: 82, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/c14/100/100', verificationStatus: 'verified', position: 'Motivador Jefe', age: 55 },

  // --- CLUBES FÚTBOL (10) ---
  { id: 'cl1', name: 'Rayo Majadahonda', role: 'Club', discipline: 'Football', province: 'Madrid', status: 'available', score: 78, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/cl1/100/100', verificationStatus: 'verified', position: 'Institución', age: 45 },
  { id: 'cl3', name: 'CE Sabadell', role: 'Club', discipline: 'Football', province: 'Barcelona', status: 'available', score: 71, level: 'Semi-Pro', avatarUrl: 'https://picsum.photos/seed/cl3/100/100', verificationStatus: 'verified', position: 'Club Histórico', age: 120 },
  { id: 'cl6', name: 'Getafe CF B', role: 'Club', discipline: 'Football', province: 'Madrid', status: 'available', score: 68, level: 'Semi-Pro', avatarUrl: 'https://picsum.photos/seed/cl6/100/100', verificationStatus: 'none', position: 'Equipo Filial', age: 30 },
  { id: 'cl7', name: 'Unión Adarve', role: 'Club', discipline: 'Football', province: 'Madrid', status: 'available', score: 65, level: 'Amateur', avatarUrl: 'https://picsum.photos/seed/cl7/100/100', verificationStatus: 'pending', position: 'Barrio Pro', age: 50 },
  { id: 'cl9', name: 'Córdoba CF', role: 'Club', discipline: 'Football', province: 'Córdoba', status: 'available', score: 74, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/cl9/100/100', verificationStatus: 'verified', position: 'Club de Ciudad', age: 70 },
  { id: 'cl11', name: 'RCD Espanyol B', role: 'Club', discipline: 'Football', province: 'Barcelona', status: 'available', score: 76, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/cl11/100/100', verificationStatus: 'verified', position: 'Cantera Élite', age: 80 },
  { id: 'cl12', name: 'Albacete Balompié', role: 'Club', discipline: 'Football', province: 'Albacete', status: 'available', score: 79, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/cl12/100/100', verificationStatus: 'verified', position: 'Entidad Regional', age: 83 },
  { id: 'cl13', name: 'Real Murcia CF', role: 'Club', discipline: 'Football', province: 'Murcia', status: 'available', score: 73, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/cl13/100/100', verificationStatus: 'verified', position: 'Gigante Dormido', age: 104 },
  { id: 'cl14', name: 'Hércules CF', role: 'Club', discipline: 'Football', province: 'Alicante', status: 'available', score: 72, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/cl14/100/100', verificationStatus: 'verified', position: 'Club Proyectos', age: 101 },
  { id: 'cl15', name: 'SD Huesca', role: 'Club', discipline: 'Football', province: 'Huesca', status: 'available', score: 81, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/cl15/100/100', verificationStatus: 'verified', position: 'Organización Élite', age: 64 },

  // --- FUTSAL (10 por rol aprox) ---
  { id: 'p5', name: 'Álvaro Ruiz', role: 'Player', discipline: 'Futsal', province: 'Murcia', status: 'available', score: 91, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/p5/100/100', verificationStatus: 'verified', position: 'Ala-Pívot', age: 26 },
  { id: 'p8', name: 'Miki Fernández', role: 'Player', discipline: 'Futsal', province: 'Málaga', status: 'available', score: 77, level: 'Semi-Pro', avatarUrl: 'https://picsum.photos/seed/p8/100/100', verificationStatus: 'pending', position: 'Cierre', age: 25 },
  { id: 'c1', name: 'Ana García', role: 'Coach', discipline: 'Futsal', province: 'Barcelona', status: 'available', score: 92, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/c1/100/100', verificationStatus: 'verified', position: 'Entrenador Principal', age: 34 },
  { id: 'c4', name: 'Elena Martínez', role: 'Coach', discipline: 'Futsal', province: 'Alicante', status: 'available', score: 81, level: 'Semi-Pro', avatarUrl: 'https://picsum.photos/seed/c4/100/100', verificationStatus: 'pending', position: 'Segundo Entrenador', age: 30 },
  { id: 'cl2', name: 'Levante UD Futsal', role: 'Club', discipline: 'Futsal', province: 'Valencia', status: 'available', score: 84, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/cl2/100/100', verificationStatus: 'verified', position: 'Club de Élite', age: 25 },
  { id: 'cl4', name: 'Inter Movistar', role: 'Club', discipline: 'Futsal', province: 'Madrid', status: 'available', score: 96, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/cl4/100/100', verificationStatus: 'verified', position: 'Referente Mundial', age: 40 },
  { id: 'cl5', name: 'Real Betis Futsal', role: 'Club', discipline: 'Futsal', province: 'Sevilla', status: 'available', score: 82, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/cl5/100/100', verificationStatus: 'verified', position: 'Sección Profesional', age: 10 },
  { id: 'cl8', name: 'ElPozo Murcia', role: 'Club', discipline: 'Futsal', province: 'Murcia', status: 'available', score: 93, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/cl8/100/100', verificationStatus: 'verified', position: 'Academia de Élite', age: 35 },
  { id: 'cl10', name: 'Palma Futsal', role: 'Club', discipline: 'Futsal', province: 'Palma', status: 'available', score: 97, level: 'Professional', avatarUrl: 'https://picsum.photos/seed/cl10/100/100', verificationStatus: 'verified', position: 'Campeón Europa', age: 22 },
];

export const MOCK_PROFILES: Record<string, UserProfile> = {
  p1: {
    id: 'p1', bio: 'Delantero centro con gran capacidad de remate y juego aéreo. 5 años de experiencia en Tercera RFEF.', teamHistory: ['Real Madrid C', 'Getafe B', 'Leganés C'], achievements: ['Pichichi Tercera RFEF 2022', 'Ascenso a 2ª RFEF'], videos: ['https://example.com/video1'], summary: 'Delantero letal con experiencia en ligas nacionales, especialista en juego aéreo.',
  },
  p3: {
    id: 'p3', bio: 'Mediocentro organizador con excelente visión de juego y precisión en el pase largo.', teamHistory: ['FC Barcelona B', 'Girona FC'], achievements: ['Mejor Mediocentro Joven 2023'], videos: [], summary: 'Arquitecto del juego con formación en La Masía.',
  },
  c1: {
    id: 'c1', bio: 'Especialista en táctica de alta presión y transiciones rápidas en Fútbol Sala.', teamHistory: ['Barça Futsal', 'Movistar Inter'], achievements: ['Campeón de Liga 2021'], videos: [], summary: 'Mente táctica privilegiada para el 40x20.',
  },
  cl10: {
    id: 'cl10', bio: 'Club referente en el scouting de talento internacional y desarrollo de cantera.', teamHistory: ['UEFA Futsal Champions League'], achievements: ['Campeón Champions 2023', 'Copa de España'], videos: [], summary: 'La élite del fútbol sala europeo con sede en Palma.',
  }
};
