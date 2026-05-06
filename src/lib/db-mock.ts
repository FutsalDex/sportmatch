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

export interface PrivateProfile {
  id: string;
  phone: string;
  email: string;
  whatsapp?: string;
}

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Carlos Rodríguez',
    role: 'Player',
    discipline: 'Football',
    province: 'Madrid',
    status: 'available',
    score: 85,
    level: 'Semi-Pro',
    avatarUrl: 'https://picsum.photos/seed/u1/100/100',
    verificationStatus: 'verified',
  },
  {
    id: 'u2',
    name: 'Ana García',
    role: 'Coach',
    discipline: 'Futsal',
    province: 'Barcelona',
    status: 'available',
    score: 92,
    level: 'Professional',
    avatarUrl: 'https://picsum.photos/seed/u2/100/100',
    verificationStatus: 'verified',
  },
  {
    id: 'u3',
    name: 'Rayo Majadahonda',
    role: 'Club',
    discipline: 'Football',
    province: 'Madrid',
    status: 'available',
    score: 78,
    level: 'Professional',
    avatarUrl: 'https://picsum.photos/seed/u3/100/100',
    verificationStatus: 'verified',
  },
  {
    id: 'u4',
    name: 'Lucas Pérez',
    role: 'Player',
    discipline: 'Football',
    province: 'Valencia',
    status: 'available',
    score: 65,
    level: 'Amateur',
    avatarUrl: 'https://picsum.photos/seed/u4/100/100',
    verificationStatus: 'none',
  }
];

export const MOCK_PROFILES: Record<string, UserProfile> = {
  u1: {
    id: 'u1',
    bio: 'Delantero centro con gran capacidad de remate y juego aéreo. 5 años de experiencia en Tercera RFEF.',
    teamHistory: ['Real Madrid C', 'Getafe B', 'Leganés C'],
    achievements: ['Pichichi Tercera RFEF 2022', 'Ascenso a 2ª RFEF'],
    videos: ['https://example.com/video1'],
    summary: 'Delantero letal con experiencia en ligas nacionales, especialista en juego aéreo.',
  }
};