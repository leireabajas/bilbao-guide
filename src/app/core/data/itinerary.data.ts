import { ItineraryDayItem } from '../models/itinerary.model';

export const ITINERARY_DAYS: ItineraryDayItem[] = [
  {
    id: 'day-1',
    day: 'Día 1',
    title: 'Llegada y Casco Viejo 🍢',
    description: 'Primer paseo por el corazón histórico de Bilbao y ruta tranquila para empezar el viaje.',
    icon: 'flight_land',
    places: [
      'casco-viejo',
      'plaza-nueva',
      'mercado-ribera',
      'catedral-santiago',
      'teatro-arriaga'
    ]
  },
  {
    id: 'day-2',
    day: 'Día 2',
    title: 'Arte y ría 🎨',
    description: 'Museo, paseo por la ría y algunos de los símbolos más reconocibles de la ciudad.',
    icon: 'museum',
    places: [
      'museo-guggenheim',
      'puente-zubizuri',
      'parque-dona-casilda',
      'azkuna-zentroa',
      'plaza-moyua'
    ]
  },
  {
    id: 'day-3',
    day: 'Día 3',
    title: 'Vistas y Athletic ⚽',
    description: 'Bilbao desde arriba y tarde en uno de los lugares con más identidad de la ciudad.',
    icon: 'landscape',
    places: [
      'mirador-artxanda',
      'san-mames'
    ]
  },
  {
    id: 'day-4',
    day: 'Día 4',
    title: 'Getxo y costa 🌊',
    description: 'Puente colgante, mar y paseo por algunos de los rincones más bonitos de la costa cercana.',
    icon: 'waves',
    places: [
      'puente-vizcaya',
      'puerto-viejo-algorta',
      'playa-ereaga',
      'paseo-galea',
      'playa-gorrondatxe'
    ]
  },
  {
    id: 'day-5',
    day: 'Día 5',
    title: 'Sopelana y acantilados 🌬️',
    description: 'Un día más abierto, de paisaje, playa y vistas al Cantábrico.',
    icon: 'terrain',
    places: [
      'playa-sopelana',
      'acantilados-sopelana'
    ]
  },
  {
    id: 'day-6',
    day: 'Día 6',
    title: 'Bermeo, Bakio y Gaztelugatxe ⛵',
    description: 'Excursión de costa con pueblo marinero, playa y uno de los lugares más espectaculares del viaje.',
    icon: 'explore',
    places: [
      'puerto-bermeo',
      'casco-viejo-bermeo',
      'playa-bakio',
      'san-juan-gaztelugatxe'
    ]
  }
];
