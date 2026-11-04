export interface Propellant {
  id: number;
  name: string;
  description: string;
  molarMass: number;
  specificHeatRatio: number;
  imageUrl?: string;
  videoUrl?: string;
  likesCount: number;
  createdAt: string;
  author: string;
}

export interface FilterState {
  maxMolarMass: number;
}

export type AppTab = 'feed' | 'create' | 'catalog' | 'login';
