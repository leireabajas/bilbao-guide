import { ChallengeItem } from '../services/challenge.service';

// Retos base del pasaporte
export const CHALLENGES: ChallengeItem[] = [
  // ===== OBLIGATORIOS =====
  {
    id: 'bridge-sunset',
    title: 'Cruzar el puente al atardecer',
    description: 'Dejar que la ría cierre el día desde uno de sus pasos más bonitos.',
    type: 'mandatory',
    status: 'available'
  },
  {
    id: 'casco-viejo-stop',
    title: 'Detenerse en el Casco Viejo',
    description: 'Encontrar un momento tranquilo entre calles que siempre guardan algo.',
    type: 'mandatory',
    status: 'available'
  },
  {
    id: 'eat-pintxo',
    title: 'Comer un pintxo',
    description: 'Hay sabores que también merecen quedar registrados.',
    type: 'mandatory',
    status: 'available'
  },
  {
    id: 'drink-kalimotxo',
    title: 'Tomar un kalimotxo',
    description: 'Algunas costumbres se entienden mejor cuando se prueban.',
    type: 'mandatory',
    status: 'available'
  },
  {
    id: 'bilbao-from-above',
    title: 'Mirar Bilbao desde arriba',
    description: 'Subir lo suficiente como para entender la ciudad de otra manera.',
    type: 'mandatory',
    status: 'available'
  },

  // ===== OPCIONALES =====
  {
    id: 'best-viewpoint',
    title: 'Encontrar el rincón con mejores vistas',
    description: 'No siempre hace falta llegar primero, solo detenerse en el sitio correcto.',
    type: 'optional',
    status: 'available'
  },
  {
    id: 'surprise-stop',
    title: 'Elegir una parada sorpresa',
    description: 'Apartarse un momento del plan también forma parte del viaje.',
    type: 'optional',
    status: 'available'
  },
  {
    id: 'photo-worth-keeping',
    title: 'Hacerse una foto que merezca quedarse',
    description: 'No por hacerla, sino por querer volver a ese instante después.',
    type: 'optional',
    status: 'available'
  },

  // ===== QUIZ BILBAO =====
  // ===== QUIZ BILBAO =====
  {
    id: 'bilbao-quiz-01',
    title: 'Bilbao · Nivel 1 · Puppy',
    description: 'Curiosidades fáciles para empezar.',
    type: 'quiz',
    level: 1,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    quiz: {
      question: '¿Cuántas flores tiene Puppy aproximadamente?',
      options: ['20.000', '38.000', '60.000'],
      correctIndex: 1,
      successMsg: 'Exacto. Puppy es casi un jardín entero.',
      failMsg: 'Casi. Tiene muchas más de lo que parece.'
    }
  },
  {
    id: 'bilbao-quiz-02',
    title: 'Bilbao · Nivel 1 · Guggenheim',
    description: 'Preguntas fáciles sobre los símbolos de la ciudad.',
    type: 'quiz',
    level: 1,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    quiz: {
      question: '¿De qué material está cubierto el Guggenheim?',
      options: ['Acero', 'Titanio', 'Aluminio'],
      correctIndex: 1,
      successMsg: 'Bien visto. El titanio es parte de su identidad.',
      failMsg: 'Casi. El brillo del museo viene de otro material.'
    }
  },
  {
    id: 'bilbao-quiz-03',
    title: 'Bilbao · Nivel 1 · Zubizuri',
    description: 'Pequeñas historias curiosas del centro.',
    type: 'quiz',
    level: 1,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    quiz: {
      question: '¿Qué problema tuvo el puente Zubizuri al principio?',
      options: ['La gente se resbalaba', 'Se cerraba por el viento', 'Tenía goteras'],
      correctIndex: 0,
      successMsg: 'Exacto. El suelo fue el gran problema.',
      failMsg: 'Casi. El problema real estaba en la superficie del puente.'
    }
  },
  {
    id: 'bilbao-quiz-04',
    title: 'Bilbao · Nivel 2 · Casco Viejo',
    description: 'Curiosidades algo más concretas de la ciudad.',
    type: 'quiz',
    level: 2,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    quiz: {
      question: '¿Cómo se conoce también al Casco Viejo de Bilbao?',
      options: ['Las Siete Calles', 'El Barrio Viejo', 'La Plaza Mayor'],
      correctIndex: 0,
      successMsg: 'Sí. También se le llama Zazpi Kaleak.',
      failMsg: 'Casi. Tiene un nombre muy ligado a su trazado histórico.'
    }
  },
  {
    id: 'bilbao-quiz-05',
    title: 'Bilbao · Nivel 2 · Athletic',
    description: 'Historias de identidad local.',
    type: 'quiz',
    level: 2,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    quiz: {
      question: '¿Por qué a los jugadores del Athletic se les llama “los leones”?',
      options: [
        'Por el escudo del club',
        'Por la historia de San Mamés',
        'Por un apodo inventado por la prensa'
      ],
      correctIndex: 1,
      successMsg: 'Exacto. Todo viene de la leyenda de San Mamés.',
      failMsg: 'Casi. El origen está en la historia del santo.'
    }
  },
  {
    id: 'bilbao-quiz-06',
    title: 'Bilbao · Nivel 2 · Ría',
    description: 'Preguntas sobre la transformación de la ciudad.',
    type: 'quiz',
    level: 2,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    quiz: {
      question: '¿Qué representaba antes la zona del Guggenheim?',
      options: ['Un puerto industrial', 'Un parque urbano', 'Un barrio residencial'],
      correctIndex: 0,
      successMsg: 'Sí. Fue una zona industrial antes de transformarse.',
      failMsg: 'Casi. Antes de ser símbolo cultural, era una zona muy distinta.'
    }
  },
  {
    id: 'bilbao-quiz-07',
    title: 'Bilbao · Nivel 3 · Gehry',
    description: 'Curiosidades más específicas sobre Bilbao.',
    type: 'quiz',
    level: 3,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    quiz: {
      question: '¿Qué se dice del diseño del Guggenheim por dentro y por fuera?',
      options: [
        'Que tiene pocas ventanas',
        'Que no hay ninguna línea recta',
        'Que es completamente simétrico'
      ],
      correctIndex: 1,
      successMsg: 'Exacto. Esa idea forma parte de su fama.',
      failMsg: 'Casi. La clave está en la geometría del edificio.'
    }
  },
  {
    id: 'bilbao-quiz-08',
    title: 'Bilbao · Nivel 3 · Inundaciones',
    description: 'Detalles históricos menos obvios.',
    type: 'quiz',
    level: 3,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    quiz: {
      question: '¿Qué recuerdan algunas fachadas del Casco Viejo?',
      options: [
        'Antiguos escudos familiares',
        'Marcas de las inundaciones de 1983',
        'La altura original de las casas'
      ],
      correctIndex: 1,
      successMsg: 'Sí. Aún quedan huellas de aquellas inundaciones.',
      failMsg: 'Casi. Las fachadas conservan una memoria mucho más reciente.'
    }
  },
  {
    id: 'bilbao-quiz-09',
    title: 'Bilbao · Nivel 3 · Filosofía Athletic',
    description: 'Curiosidades más de identidad local.',
    type: 'quiz',
    level: 3,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    quiz: {
      question: '¿Qué hace especial la filosofía del Athletic Club?',
      options: [
        'Solo juega en un estadio histórico',
        'Solo ficha entrenadores locales',
        'Juega con futbolistas de la tierra'
      ],
      correctIndex: 2,
      successMsg: 'Exacto. Esa filosofía lo hace único.',
      failMsg: 'Casi. La clave está en el origen de sus jugadores.'
    }
  },

  // ===== EUSKERA =====
  {
    id: 'euskera-01',
    title: 'Duolingo Euskera · Saludos básicos',
    description: 'Empieza por las palabras que más se repiten.',
    type: 'euskera',
    status: 'available',
    level: 1,
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “Kaixo”?',
        options: ['Hola', 'Gracias', 'Agua'],
        correctIndex: 0
      },
      {
        question: '¿Qué significa “Agur”?',
        options: ['Buenas noches', 'Adiós', 'Casa'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “Eskerrik asko”?',
        options: ['Gracias', 'Lo siento', 'Vamos'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'euskera-02',
    title: 'Duolingo Euskera · Comida y calle',
    description: 'Palabras pequeñas para empezar a orientarse mejor.',
    type: 'euskera',
    level: 1,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “ura”?',
        options: ['Pan', 'Agua', 'Puerta'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “ogia”?',
        options: ['Pan', 'Coche', 'Calle'],
        correctIndex: 0
      },
      {
        question: '¿Qué significa “kalea”?',
        options: ['Río', 'Calle', 'Mesa'],
        correctIndex: 1
      }
    ]
  }
  ,
  {
    id: 'euskera-03',
    title: 'Duolingo Euskera · Colores básicos',
    description: 'Palabras sencillas para empezar a describir lo que ves.',
    type: 'euskera',
    level: 1,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “zuri”?',
        options: ['Blanco', 'Rojo', 'Negro'],
        correctIndex: 0
      },
      {
        question: '¿Qué significa “beltz”?',
        options: ['Verde', 'Negro', 'Azul'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “gorri”?',
        options: ['Rojo', 'Amarillo', 'Gris'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'euskera-04',
    title: 'Duolingo Euskera · Familia',
    description: 'Palabras cercanas que se usan mucho desde el principio.',
    type: 'euskera',
    level: 1,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “ama”?',
        options: ['Madre', 'Hermana', 'Tía'],
        correctIndex: 0
      },
      {
        question: '¿Qué significa “aita”?',
        options: ['Abuelo', 'Padre', 'Hijo'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “laguna”?',
        options: ['Profesor', 'Amigo', 'Vecino'],
        correctIndex: 1
      }
    ]
  },
  {
    id: 'euskera-05',
    title: 'Duolingo Euskera · Lugares cotidianos',
    description: 'Palabras útiles para orientarte un poco mejor.',
    type: 'euskera',
    level: 2,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “etxea”?',
        options: ['Casa', 'Calle', 'Puerta'],
        correctIndex: 0
      },
      {
        question: '¿Qué significa “taberna”?',
        options: ['Escuela', 'Bar', 'Parque'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “denda”?',
        options: ['Tienda', 'Ventana', 'Plaza'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'euskera-06',
    title: 'Duolingo Euskera · Números básicos',
    description: 'Los primeros números siempre vienen bien.',
    type: 'euskera',
    level: 1,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “bat”?',
        options: ['Uno', 'Dos', 'Tres'],
        correctIndex: 0
      },
      {
        question: '¿Qué significa “milla”?',
        options: ['100', '1000', '100.000'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “333”?',
        options: ['Lau ehun eta hogeita hiru ', 'hirurehun eta berrogeita hiru', 'Hirurehun eta hogeita hamahiru'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'euskera-07',
    title: 'Duolingo Euskera · Expresiones útiles',
    description: 'Pequeñas palabras que ayudan muchísimo al viajar.',
    type: 'euskera',
    level: 1,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “mesedez”?',
        options: ['Perdón', 'Por favor', 'Gracias'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “bai”?',
        options: ['No', 'puede', 'Sí'],
        correctIndex: 2
      },
      {
        question: '¿Qué significa “ez”?',
        options: ['No', 'Sí', 'no se'],
        correctIndex: 0
      }
    ]
  }
  ,
  {
    id: 'euskera-08',
    title: 'Duolingo Euskera · En el bar',
    description: 'Lo justo para pedir algo sin dudar.',
    type: 'euskera',
    level: 2,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “garagardoa”?',
        options: ['Agua', 'Cerveza', 'Vino'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “ardoa”?',
        options: ['Refresco', 'Vino', 'Café'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “kafea”?',
        options: ['Café', 'Té', 'Leche'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'euskera-09',
    title: 'Duolingo Euskera · Tiempo y clima',
    description: 'Bilbao cambia mucho según el cielo.',
    type: 'euskera',
    level: 2,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “euria”?',
        options: ['Sol', 'Viento', 'Lluvia'],
        correctIndex: 2
      },
      {
        question: '¿Qué significa “eguzkia”?',
        options: ['Sol', 'Nube', 'Noche'],
        correctIndex: 0
      },
      {
        question: '¿Qué significa “haizea”?',
        options: ['Frío', 'Viento', 'Calor'],
        correctIndex: 1
      }
    ]
  },
  {
    id: 'euskera-10',
    title: 'Duolingo Euskera · Direcciones',
    description: 'Para no perderse del todo.',
    type: 'euskera',
    level: 2,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “ezkerra”?',
        options: ['Derecha', 'Izquierda', 'Arriba'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “eskuina”?',
        options: ['Derecha', 'Izquierda', 'Centro'],
        correctIndex: 0
      },
      {
        question: '¿Qué significa “zuzen”?',
        options: ['Recto', 'Atrás', 'Rápido'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'euskera-11',
    title: 'Duolingo Euskera · Transporte',
    description: 'Moverse también tiene su vocabulario.',
    type: 'euskera',
    level: 2,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “autobusa”?',
        options: ['Taxi', 'Autobús', 'Tren'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “metroa”?',
        options: ['Metro', 'Tranvía', 'Coche'],
        correctIndex: 0
      },
      {
        question: '¿Qué significa “trena”?',
        options: ['Barco', 'Tren', 'Avión'],
        correctIndex: 1
      }
    ]
  },
  {
    id: 'euskera-12',
    title: 'Duolingo Euskera · Compras',
    description: 'Pequeñas palabras para moverte por tiendas.',
    type: 'euskera',
    level: 3,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “dirua”?',
        options: ['Dinero', 'Ropa', 'Bolsa'],
        correctIndex: 0
      },
      {
        question: '¿Qué significa “merkea”?',
        options: ['Caro', 'Barato', 'Grande'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “garestia”?',
        options: ['Pequeño', 'Barato', 'Caro'],
        correctIndex: 2
      }
    ]
  },
  {
    id: 'euskera-13',
    title: 'Duolingo Euskera · Restaurante',
    description: 'Para entender lo que te traen a la mesa.',
    type: 'euskera',
    level: 3,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “janaria”?',
        options: ['Bebida', 'Comida', 'Postre'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “ura”?',
        options: ['Agua', 'Pan', 'Sal'],
        correctIndex: 0
      },
      {
        question: '¿Qué significa “postrea”?',
        options: ['Entrada', 'Postre', 'Cuenta'],
        correctIndex: 1
      }
    ]
  },
  {
    id: 'euskera-14',
    title: 'Duolingo Euskera · Sentimientos',
    description: 'Palabras para describir cómo te sientes.',
    type: 'euskera',
    level: 3,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “pozik”?',
        options: ['Triste', 'Cansado', 'Contento'],
        correctIndex: 2
      },
      {
        question: '¿Qué significa “nekatuta”?',
        options: ['Enfadado', 'Cansado', 'Feliz'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “haserre”?',
        options: ['Enfadado', 'Tranquilo', 'Contento'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'euskera-15',
    title: 'Duolingo Euskera · Tiempo (día)',
    description: 'Pequeñas referencias para situarte.',
    type: 'euskera',
    level: 3,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “gaur”?',
        options: ['Ayer', 'Hoy', 'Mañana'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “bihar”?',
        options: ['Hoy', 'Mañana', 'Nunca'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “atzo”?',
        options: ['Ayer', 'Mañana', 'Siempre'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'euskera-16',
    title: 'Duolingo Euskera · Partes de la ciudad',
    description: 'Palabras que empiezan a sonar familiares.',
    type: 'euskera',
    level: 2,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “zubi”?',
        options: ['Puente', 'Calle', 'Casa'],
        correctIndex: 0
      },
      {
        question: '¿Qué significa “plaza”?',
        options: ['Parque', 'Plaza', 'Museo'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “parkea”?',
        options: ['Parque', 'Plaza', 'Río'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'euskera-17',
    title: 'Duolingo Euskera · Movimiento',
    description: 'Pequeñas acciones del día a día.',
    type: 'euskera',
    level: 3,
    status: 'available',
    rewardLabel: 'Incluye recompensa',
    euskeraQuiz: [
      {
        question: '¿Qué significa “etorri”?',
        options: ['Ir', 'Venir', 'Parar'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “joan”?',
        options: ['Venir', 'Ir', 'Correr'],
        correctIndex: 1
      },
      {
        question: '¿Qué significa “gelditu”?',
        options: ['Parar', 'Seguir', 'Entrar'],
        correctIndex: 0
      }
    ]
  }
];
