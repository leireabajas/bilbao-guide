export interface UserProfile {
  uid: string;           // El ID único de Firebase
  email: string;
  displayName: string;
  role: 'admin' | 'visitor'; // Tú eres admin, ella visitor
  avatarId: string;      // 'harry', 'hermione', 'ron'...
  wallet: string[];      // IDs de los vales conseguidos
}

export interface Place {
  id: string;            // ej: 'san-mames'
  name: string;
  description: string;   // Descripción breve
  fullDescription?: string; // Historia completa (opcional)
  category: 'historia' | 'gastro' | 'vistas' | 'excursion';
  imageUrl: string;
  location?: { lat: number; lng: number }; // Para el mapa (opcional)
  hostTip?: string;      // "Aquí hacen las mejores rabas"
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'location' | 'euskera' | 'optional';
  status: 'locked' | 'active' | 'completed';

  // Solo para retos de Euskera
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number; // 0, 1 o 2
    successMsg: string;   // "¡Zorionak!"
    failMsg: string;      // "Casi..."
  };

  // El premio (Vale)
  reward?: {
    hasReward: boolean;
    title: string;       // "Vale por un Zurito"
    isRedeemed: boolean; // true = ya se lo has pagado
  };
}

export interface ItineraryDay {
  id: string;       // 'dia-1'
  dayNumber: number;
  title: string;    // "Día 1: El Casco Viejo"
  date: string;     // "2024-05-20"
  places: string[]; // IDs de los sitios a visitar ese día
}
