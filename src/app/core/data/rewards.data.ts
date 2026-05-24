// Tipos de estado de recompensa
export type RewardStatus = 'locked' | 'available' | 'pending' | 'used';

// Modelo de recompensa
export interface RewardItem {
  id: string;
  title: string;
  description: string;
  status: RewardStatus;
}

// Solicitud para reclamar una recompensa
export interface RewardClaimRequest {
  id: string;
  rewardId: string;
  title: string;
  status: 'pending' | 'accepted';
  createdAt: string;
}

// Recompensas base del pasaporte
export const REWARDS: RewardItem[] = [
  {
    id: 'drink',
    title: 'Vale para elegir bebida',
    description: 'La próxima ronda no se decide. Se elige.',
    status: 'locked'
  },
  {
    id: 'dessert',
    title: 'Vale para parada dulce',
    description: 'Hay momentos que merecen algo más que continuar.',
    status: 'locked'
  },
  {
    id: 'place',
    title: 'Vale para elegir el próximo sitio',
    description: 'Durante un rato, el rumbo cambia de manos.',
    status: 'locked'
  }
];
