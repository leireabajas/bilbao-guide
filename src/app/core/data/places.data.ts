// Datos base de los lugares del mapa
export const PLACES = [
  {
    id: 'museo-guggenheim',
    name: 'Museo Guggenheim',
    description: 'El símbolo de la transformación de Bilbao.',
    image: 'assets/images/guggenheim.jpg',
    location: { lat: 43.268663, lng: -2.933943 },
    locked: true,
    story: 'Hace no mucho, esta zona era un puerto industrial gris y lleno de contenedores oxidados. La decisión de traer el museo aquí fue muy criticada, decían que "nadie vendría a Bilbao". Hoy, el edificio de Frank Gehry, con sus placas de titanio que imitan las escamas de un pez, es el símbolo del "Efecto Bilbao". Dicen que no hay ninguna línea recta en todo el edificio.'
  },
  {
    id: 'san-mames',
    name: 'San Mamés',
    description: 'La Catedral del fútbol.',
    image: 'assets/images/sanmames.jpg',
    location: { lat: 43.264337, lng: -2.949512 },
    locked: true,
    story: 'No es solo un estadio, es un templo. Se llama así porque se construyó al lado de un asilo dedicado a San Mamés, un santo al que arrojaron a los leones (y los leones no se lo comieron, por eso a los jugadores del Athletic se les llama "los leones"). La afición del Athletic es única en el mundo: su filosofía de jugar solo con gente de la tierra hace que la conexión con la grada sea mágica.'
  },
  {
    id: 'casco-viejo',
    name: 'Casco Viejo',
    description: 'Las Siete Calles (Zazpi Kaleak).',
    image: 'assets/images/cascoviejo.jpg',
    location: { lat: 43.2590, lng: -2.9240 },
    locked: true,
    story: 'Aquí nació Bilbao hace más de 700 años. Originalmente eran solo tres calles, luego siete. Si te fijas en las fachadas, verás marcas de hasta dónde llegó el agua en las terribles inundaciones de 1983. Es el lugar perfecto para ir de "txikiteo" (ir de bar en bar tomando vinos pequeños) y probar las famosas rabas los domingos.'
  },
  {
    id: 'puente-zubizuri',
    name: 'Puente Zubizuri',
    description: 'El polémico puente de Calatrava.',
    image: 'assets/images/zubizuri.jpg',
    location: { lat: 43.265875, lng: -2.926745 } ,
    locked: true,
    story: 'Zubizuri significa "Puente Blanco" en euskera. Diseñado por Santiago Calatrava, simula un barco de vela inflado por el viento. Es precioso, pero tuvo una gran polémica: el suelo era de cristal y... ¡la gente se resbalaba muchísimo cuando llovía (que en Bilbao es casi siempre)! Al final tuvieron que ponerle la alfombra antideslizante que ves ahora.'
  },
  {
    id: 'mirador-artxanda',
    name: 'Mirador de Artxanda',
    description: 'Las vistas que explican Bilbao de un vistazo.',
    image: 'assets/images/artxanda.jpg',
    location: { lat: 43.273953, lng: -2.917559 },
    locked: true,
    story: 'Subir a Artxanda es entender Bilbao desde arriba. Desde aquí, la ría deja de ser solo un paseo y se convierte en el eje que ordena todo. Durante años fue un lugar de ocio para la gente local, y hoy sigue siendo uno de esos puntos donde el tiempo se detiene un poco. Hay algo especial en mirar una ciudad desde arriba cuando ya has caminado por ella.'
  },
  {
    id: 'plaza-nueva',
    name: 'Plaza Nueva',
    description: 'Soportales, terrazas y vida en el corazón del Casco Viejo.',
    image: 'assets/images/plaza-nueva.jpg',
    location: { lat: 43.259094, lng: -2.922480 },
    locked: true,
    story: 'Ordenada, elegante y siempre viva. La Plaza Nueva parece diseñada para quedarse un rato más del previsto. Aquí se mezclan conversaciones, vermús y ese ruido suave de ciudad que no molesta. Es uno de los puntos clásicos del Casco Viejo, y casi siempre acaba formando parte de cualquier recorrido, aunque no estuviera planeado.'
  },
  {
    id: 'mercado-ribera',
    name: 'Mercado de la Ribera',
    description: 'Producto local y vida diaria junto a la ría.',
    image: 'assets/images/mercado-ribera.jpg',
    location: { lat: 43.255496, lng: -2.923408 },
    locked: true,
    story: 'Más que un mercado, es un lugar donde Bilbao se mueve sin filtros. Durante décadas fue uno de los mercados cubiertos más grandes de Europa. Aquí conviven puestos tradicionales con barras modernas, y todo ocurre con naturalidad. Es uno de los mejores sitios para ver la ciudad tal y como es.'
  },
  {
    id: 'parque-dona-casilda',
    name: 'Parque de Doña Casilda',
    description: 'Un respiro verde en medio de la ciudad.',
    image: 'assets/images/dona-casilda.jpg',
    location: { lat: 43.2669, lng: -2.9431 },
    locked: true,
    story: 'Entre estanques, árboles y pavos reales, este parque ha sido durante generaciones un refugio tranquilo. Lleva el nombre de una de las grandes benefactoras de Bilbao y sigue siendo uno de los lugares más queridos para pasear sin prisa. Aquí la ciudad baja el ritmo.'
  },
  {
    id: 'teatro-arriaga',
    name: 'Teatro Arriaga',
    description: 'Uno de los edificios más elegantes de Bilbao.',
    image: 'assets/images/arriaga.jpg',
    location: { lat: 43.259694, lng: -2.924450 },
    locked: true,
    story: 'Inspirado en la Ópera de París, el Teatro Arriaga es uno de los edificios más reconocibles de Bilbao. Ha sobrevivido a inundaciones, reconstrucciones y cambios de época, pero siempre ha mantenido su carácter. De día impone; de noche, iluminado, tiene algo casi cinematográfico.'
  },
  {
    id: 'catedral-santiago',
    name: 'Catedral de Santiago',
    description: 'El origen silencioso del Bilbao histórico.',
    image: 'assets/images/catedral.jpg',
    location: { lat: 43.256961, lng: -2.923442 },
    locked: true,
    story: 'En pleno Casco Viejo, esta catedral lleva siglos viendo pasar la historia. Es uno de los puntos clave del Camino de Santiago en el norte, y su interior guarda esa mezcla de calma y peso histórico que no hace falta explicar demasiado. Es fácil pasar por delante sin darse cuenta… pero merece la pena parar.'
  },
  {
    id: 'azkuna-zentroa',
    name: 'Azkuna Zentroa',
    description: 'Un antiguo almacén de vino convertido en espacio cultural.',
    image: 'assets/images/azkuna.jpg',
    location: { lat: 43.259778, lng: -2.937190 },
    locked: true,
    story: 'Antes fue un almacén de vino. Hoy es uno de los centros culturales más activos de Bilbao. Su interior, con columnas todas distintas, sorprende incluso a quien no esperaba nada. Es uno de esos lugares donde lo antiguo y lo nuevo conviven sin forzar.'
  },
  {
    id: 'plaza-moyua',
    name: 'Plaza Moyúa',
    description: 'El corazón elegante del Bilbao moderno.',
    image: 'assets/images/moyua.jpg',
    location: { lat: 43.262937, lng: -2.934138 },
    locked: true,
    story: 'Rodeada de edificios señoriales y conectada con la Gran Vía, la Plaza Moyúa es uno de los centros neurálgicos de la ciudad. Siempre hay movimiento, pero mantiene una sensación de orden y equilibrio. Es uno de esos puntos donde todo parece pasar.'
  },

// --- GETXO / COSTA ---
  {
    id: 'puente-vizcaya',
    name: 'Puente de Vizcaya',
    description: 'El puente colgante que cruza la ría.',
    image: 'assets/images/puente-vizcaya.jpg',
    location: { lat: 43.323100, lng: -3.016900 },
    locked: true,
    story: 'Más que un puente, es una pieza de ingeniería única. Inaugurado en 1893, fue el primer puente transbordador del mundo y hoy es Patrimonio de la Humanidad. Sigue funcionando como el primer día, cruzando la ría sin interrumpir el paso de barcos.'
  },
  {
    id: 'puerto-viejo-algorta',
    name: 'Puerto Viejo de Algorta',
    description: 'Casas blancas y esencia marinera.',
    image: 'assets/images/algorta.jpg',
    location: { lat: 43.349274, lng: -3.014513 },
    locked: true,
    story: 'Calles estrechas, casas blancas y escaleras que bajan hacia el mar. El Puerto Viejo de Algorta conserva la esencia de un antiguo pueblo de pescadores. Aquí todo parece más cercano, más tranquilo, como si el tiempo avanzara a otro ritmo.'
  },
  {
    id: 'playa-ereaga',
    name: 'Playa de Ereaga',
    description: 'Una de las playas más accesibles cerca de Bilbao.',
    image: 'assets/images/ereaga.jpg',
    location: { lat: 43.346500, lng: -3.014500 },
    locked: true,
    story: 'A pocos minutos de Bilbao, Ereaga es una de las playas más populares. Tiene ese equilibrio entre ciudad y mar que la hace fácil de disfrutar sin esfuerzo. Aquí empieza a sentirse el cambio de paisaje.'
  },
  {
    id: 'paseo-galea',
    name: 'Paseo de la Galea',
    description: 'Acantilados y vistas abiertas al Cantábrico.',
    image: 'assets/images/galea.jpg',
    location: { lat: 43.365000, lng: -3.022000 },
    locked: true,
    story: 'El Paseo de la Galea es uno de los mejores lugares para ver el mar abierto. Acantilados, viento y horizonte. Es un sitio sencillo, pero con una sensación muy clara: aquí el paisaje manda.'
  },

// --- SOPELANA ---
  {
    id: 'playa-gorrondatxe',
    name: 'Playa de Gorrondatxe',
    description: 'Una playa salvaje entre acantilados.',
    image: 'assets/images/gorrondatxe.jpg',
    location: { lat: 43.371589, lng: -3.018713 },
    locked: true,
    story: 'También conocida como Azkorri, esta playa es una de las más salvajes y menos urbanizadas de la zona. Sus acantilados rojizos y su ambiente más tranquilo la convierten en un lugar especial. Durante años fue frecuentada por quienes buscaban desconectar del bullicio, y hoy sigue manteniendo ese aire más libre y natural. Aquí el mar y la tierra parecen ir por su cuenta.'
  },
  {
    id: 'acantilados-sopelana',
    name: 'Acantilados de Sopelana',
    description: 'Uno de los paisajes más espectaculares de la costa.',
    image: 'assets/images/acantilados.jpg',
    location: { lat: 43.390180, lng: -2.990300 },
    locked: true,
    story: 'Desde arriba, los acantilados de Sopelana muestran una de las vistas más potentes de la costa. Capas de tierra, mar abierto y silencio. Es uno de esos lugares que no necesitan mucho más.'
  },

// --- BERMEO / GAZTELUGATXE ---
  {
    id: 'puerto-bermeo',
    name: 'Puerto de Bermeo',
    description: 'Tradición pesquera en estado puro.',
    image: 'assets/images/bermeo.jpg',
    location: { lat: 43.420233, lng: -2.718931 },
    locked: true,
    story: 'Bermeo sigue siendo un pueblo profundamente ligado al mar. Su puerto refleja esa relación constante con la pesca y con el Cantábrico. Aquí todo se siente más directo, más auténtico.'
  },
  {
    id: 'casco-viejo-bermeo',
    name: 'Casco Viejo de Bermeo',
    description: 'Calles estrechas con historia marinera.',
    image: 'assets/images/bermeo-casco.jpg',
    location: { lat: 43.419900, lng: -2.722000 },
    locked: true,
    story: 'El casco antiguo de Bermeo es un laberinto de calles con historia. Pasear por aquí es entender cómo vivía un pueblo volcado al mar. No es turístico en exceso, y eso se nota.'
  },
  {
    id: 'playa-bakio',
    name: 'Playa de Bakio',
    description: 'Una de las playas más largas de la costa.',
    image: 'assets/images/bakio.jpg',
    location: { lat: 43.433392, lng: -2.799344 },
    locked: true,
    story: 'Bakio es amplitud. Arena, mar y espacio. Es uno de esos sitios donde todo parece más abierto y más sencillo, ideal para parar antes o después de Gaztelugatxe.'
  },
  {
    id: 'san-juan-gaztelugatxe',
    name: 'San Juan de Gaztelugatxe',
    description: 'El lugar más espectacular del recorrido.',
    image: 'assets/images/gaztelugatxe.jpg',
    location: { lat: 43.447000, lng: -2.785000 },
    locked: true,
    story: 'Un islote, un puente y más de 200 escalones. Gaztelugatxe no necesita presentación. Ha sido escenario de historias, leyendas y series, pero cuando estás allí todo eso desaparece. Solo queda el camino y el mar golpeando alrededor.'
  }
  ];
