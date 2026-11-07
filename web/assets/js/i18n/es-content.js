// Contenido traducido al español (cartas, signos, animales del zodiaco, textos de ejemplo…).
// Se carga solo al elegir español. Mismas claves que los datos vietnamitas.

const MAJOR = [
  ['El Loco', 'comienzos, libertad, confiar en el camino', 'imprudencia, miedo a empezar', 'Hay un paso que sigues posponiendo solo por miedo a parecer ingenuo.', 'Si nadie te mirara, ¿qué probarías primero?'],
  ['El Mago', 'habilidad, iniciativa, convertir ideas en realidad', 'dispersión, dudar de tus capacidades', 'Tienes en tus manos más de lo que crees.', 'Nombra tres cosas que tienes y que aún no has usado.'],
  ['La Sacerdotisa', 'intuición, quietud, lo oculto', 'ignorar tu voz interior', 'A veces la respuesta ya espera en el silencio.', 'Si todo el ruido se apagara, ¿qué te oirías desear?'],
  ['La Emperatriz', 'cuidado, abundancia, creatividad', 'dar demasiado, olvidarte de ti', 'Cuidas muy bien de los demás. ¿Y de ti?', '¿Qué pequeña cosa podría nutrirte hoy?'],
  ['El Emperador', 'estructura, límites, estabilidad', 'rigidez, exceso de control', 'La firmeza nace de límites claros.', '¿A qué necesitas decir «no» para protegerte?'],
  ['El Hierofante', 'tradición, guía, creencias', 'romper convenciones, tu propio camino', 'Algunas lecciones de quienes vinieron antes merecen ser escuchadas.', '¿Qué consejo que recibiste entiendes de verdad solo ahora?'],
  ['Los Enamorados', 'elecciones del corazón, conexión, valores', 'desequilibrio, elegir desde el miedo', 'Cada elección es un momento de honestidad contigo.', '¿Eliges desde el amor o desde el miedo?'],
  ['El Carro', 'voluntad, determinación, avanzar', 'perder el rumbo, tirar en muchas direcciones', 'Te están tirando hacia muchas direcciones a la vez.', 'Si este mes conservaras una sola dirección, ¿cuál sería?'],
  ['La Fuerza', 'dulzura, valor, paciencia', 'culparte, poca confianza', 'La verdadera fuerza es la dulzura ante lo difícil.', '¿Qué parte de ti necesita consuelo en lugar de crítica?'],
  ['El Ermitaño', 'reflexión, soledad, búsqueda interior', 'aislamiento, evasión', 'Estar a solas no es soledad: es volver a encontrarte.', '¿Cuándo disfrutaste por última vez de estar contigo?'],
  ['La Rueda de la Fortuna', 'ciclos, cambio, el momento oportuno', 'resistirse al cambio', 'Todo gira, lo difícil y lo bueno por igual.', '¿Qué parecía eterno y, sin embargo, ya pasó?'],
  ['La Justicia', 'equidad, verdad, responsabilidad', 'ser demasiado duro contigo', '¿Eres más exigente contigo que con los demás?', 'Si tu mejor amigo estuviera en tu lugar, ¿qué le dirías?'],
  ['El Colgado', 'pausa, entrega, una nueva perspectiva', 'demora, sentirse atascado', 'Detenerse no es perder.', 'Si miraras esto desde el lado opuesto, ¿qué verías?'],
  ['Transformación', 'finales que abren comienzos, renovación', 'aferrarse a lo viejo', 'Algo está listo para cerrarse. No es un mal augurio: es una puerta.', '¿Qué estás listo para dejar ir?'],
  ['La Templanza', 'equilibrio, armonía, la medida justa', 'exceso, desequilibrio', 'Ni demasiado, ni demasiado poco.', '¿De qué tienes demasiado y de qué muy poco?'],
  ['El Diablo', 'apegos, hábitos, tentación', 'liberarse, ver las cadenas', 'Algunas cadenas nos las ponemos nosotros mismos.', '¿Qué hábito está agotando tu energía?'],
  ['La Torre', 'sacudida repentina, despertar', 'miedo al derrumbe, evitar la verdad', 'Algunas cosas caen para que se abra el cielo.', '¿Qué aprendiste de un derrumbe pasado?'],
  ['La Estrella', 'esperanza, sanación, paz', 'pérdida de fe, cansancio', 'Después de la tormenta siempre hay una estrella.', '¿Qué pequeña cosa te da esperanza hoy?'],
  ['La Luna', 'incertidumbre, intuición, miedos ocultos', 'la claridad que regresa, ver a través de la ilusión', 'No toda oscuridad es real.', '¿Cuáles de tus preocupaciones son reales y cuáles imaginadas?'],
  ['El Sol', 'alegría, claridad, vitalidad', 'alegría nublada por un momento', 'Tienes permiso para estar feliz sin motivo.', '¿Qué hace sonreír a la niña o al niño que llevas dentro?'],
  ['El Juicio', 'despertar, un llamado, perdón', 'juzgarte, dudar', 'Hay un llamado que escuchas desde hace tiempo.', '¿En quién estás posponiendo convertirte?'],
  ['El Mundo', 'plenitud, culminación, integración', 'algo sin cerrar, una pieza que falta', 'Has recorrido un largo camino.', 'Nombra un logro tuyo que poca gente conoce.'],
];

const SUITS = {
  gay: { name: 'Bastos', element: 'Fuego', domain: 'la pasión, la acción y la inspiración' },
  coc: { name: 'Copas', element: 'Agua', domain: 'los sentimientos, el amor y las relaciones' },
  kiem: { name: 'Espadas', element: 'Aire', domain: 'los pensamientos, las palabras y la verdad' },
  tien: { name: 'Pentáculos', element: 'Tierra', domain: 'el trabajo, el dinero y el cuerpo' },
};

// [nombre del rango, etapa, pregunta] — {d} = primer ámbito del palo
const RANKS = [
  ['As', 'la semilla', '¿Qué semilla de {d} espera que la plantes?'],
  ['Dos', 'elección y equilibrio', '¿Qué dos cosas sobre {d} estás sopesando?'],
  ['Tres', 'crecimiento', '¿Qué está creciendo en ti en cuanto a {d}?'],
  ['Cuatro', 'estabilidad', 'En cuanto a {d}, ¿qué necesitas sostener y qué soltar?'],
  ['Cinco', 'desafío', '¿Qué desafío en torno a {d} te está enseñando algo?'],
  ['Seis', 'recuperación y armonía', '¿Qué aspecto de {d} está sanando poco a poco?'],
  ['Siete', 'reflexión y evaluación', 'Mirando atrás en {d}, ¿de qué te sientes orgulloso?'],
  ['Ocho', 'movimiento', '¿Hacia dónde vas con {d}?'],
  ['Nueve', 'casi en la meta', '¿Qué más necesitas para recorrer el último tramo de {d}?'],
  ['Diez', 'el cierre de un ciclo', '¿Qué ciclo de {d} se está cerrando?'],
  ['Paje', 'el aprendiz', '¿Qué te gustaría aprender sobre {d}?'],
  ['Caballero', 'quien actúa', '¿Cómo estás dispuesto a actuar por {d}?'],
  ['Reina', 'quien nutre', '¿Cómo podrías nutrir {d}?'],
  ['Rey', 'quien domina', '¿Cómo sería para ti dominar {d}?'],
];

const MINOR_KEYS = {
  gay: [
    ['inspiración, nuevo comienzo, potencial', 'retraso, poca motivación'],
    ['planificación, visión, decisiones', 'miedo al cambio, vacilación'],
    ['expansión, mirar a lo lejos, esperar resultados', 'retrasos, obstáculos'],
    ['celebración, hogar, armonía', 'inestabilidad, una etapa de transición'],
    ['competencia, pequeños choques', 'evitar el conflicto, tensión interna'],
    ['victoria, reconocimiento', 'dudar de ti, anhelo de ser visto'],
    ['mantenerse firme, defender tus convicciones', 'agotamiento, ganas de rendirse'],
    ['rapidez, noticias, todo en movimiento', 'frenar, una prisa mal dirigida'],
    ['resiliencia, un último esfuerzo', 'cansancio, estar a la defensiva'],
    ['carga, llevar demasiado', 'soltar algo, pedir ayuda'],
    ['curiosidad, exploración, ideas nuevas', 'falta de rumbo, inquietud'],
    ['entusiasmo, aventura, audacia', 'impulsividad, prisa'],
    ['confianza, calidez, determinación', 'poca confianza, compararse'],
    ['liderazgo, visión, inspirar a otros', 'autoritarismo, expectativas demasiado altas'],
  ],
  coc: [
    ['sentimientos nuevos, emoción desbordante', 'contener los sentimientos'],
    ['conexión, sintonía, pareja', 'desequilibrio en una relación'],
    ['amistad, celebración, comunidad', 'distancia de las amistades, exceso'],
    ['apatía, contemplación, aburrimiento', 'notar una nueva oportunidad'],
    ['pérdida, arrepentimiento', 'aceptación, seguir adelante'],
    ['nostalgia, infancia, inocencia', 'quedarse en el pasado'],
    ['muchas opciones, ensoñaciones', 'ver con claridad, atreverse a elegir'],
    ['partir en busca de un sentido más hondo', 'miedo a partir, vacilación'],
    ['satisfacción, un deseo cumplido', 'satisfacción superficial'],
    ['felicidad familiar, plenitud', 'distanciamientos, expectativas que no encajan'],
    ['sensibilidad, creatividad, un mensaje de cariño', 'inmadurez emocional'],
    ['romanticismo, seguir los ideales', 'ilusión, cambios de humor'],
    ['empatía, intuición, escucha', 'perderte por los demás'],
    ['equilibrio emocional, generosidad', 'represión, dificultad para abrirse'],
  ],
  kiem: [
    ['claridad, verdad, avance', 'confusión, malentendido'],
    ['estancamiento, una elección difícil', 'exceso de información'],
    ['dolor del corazón, herida', 'recuperación, perdón'],
    ['descanso, recuperación', 'agotamiento, necesidad de parar ya'],
    ['conflicto, ganar y perder', 'reconciliación, dejar el ego a un lado'],
    ['transición, dejar atrás aguas revueltas', 'seguir enredado'],
    ['estrategia, guardar secretos', 'confesión, escuchar la conciencia'],
    ['autolimitación, sentirse atrapado', 'liberación, ver la salida'],
    ['ansiedad, insomnio, pensar de más', 'atravesar el miedo'],
    ['tocar fondo, un final doloroso', 'renacer, desde aquí solo se sube'],
    ['curiosidad, observación, ganas de aprender', 'hablar antes de pensar'],
    ['decidido, de mente rápida', 'precipitación, palabras que hieren'],
    ['clara, independiente, honesta', 'frialdad, cerrarse'],
    ['razón, equidad, transparencia', 'imposición, rigidez'],
  ],
  tien: [
    ['nueva oportunidad, un comienzo sólido', 'oportunidad perdida, preparación insuficiente'],
    ['hacer malabares, equilibrar muchas cosas', 'sobrecarga, desorden'],
    ['colaboración, oficio, trabajo en equipo', 'falta de coordinación'],
    ['conservar, seguridad, ahorro', 'aferrarse, miedo a perder'],
    ['dificultad, carencia, sentirse excluido', 'recuperación, encontrar ayuda'],
    ['dar y recibir, generosidad', 'dependencia, un dar desigual'],
    ['paciencia, esperar la cosecha', 'impaciencia, dudar de tu esfuerzo'],
    ['práctica, constancia, atención al detalle', 'perfeccionismo, monotonía'],
    ['autonomía, abundancia, darte un premio', 'dependencia, trabajar en exceso'],
    ['familia, legado, lo que perdura', 'inestabilidad económica'],
    ['aprendizaje, metas nuevas', 'falta de concentración'],
    ['constante, fiable, perseverante', 'estancamiento, rutina rígida'],
    ['cuidadosa, práctica, acogedora', 'preocuparse en exceso'],
    ['prosperidad, estabilidad, consideración', 'perseguir lo material'],
  ],
};

const card = {};
MAJOR.forEach(([name, up, rev, msg, q], i) => (card[`major-${String(i).padStart(2, '0')}`] = { name, up, rev, msg, q }));
for (const [suitId, s] of Object.entries(SUITS)) {
  RANKS.forEach(([rank, stage, qTpl], r) => {
    const [up, rev] = MINOR_KEYS[suitId][r];
    card[`${suitId}-${String(r + 1).padStart(2, '0')}`] = {
      name: `${rank} de ${s.name}`,
      up,
      rev,
      msg: `Esta carta habla de ${s.domain}, en la etapa de «${stage}». Elemento: ${s.element}.`,
      q: qTpl.replace('{d}', s.domain.split(',')[0]),
    };
  });
}

const sign = {
  'bach-duong': { name: 'Aries', keywords: 'valiente, directo, apasionado', light: 'Te atreves a empezar mientras los demás todavía lo piensan. Tu energía levanta a todo el grupo.', shadow: 'Impaciente, se enciende y se enfría rápido, le cuesta esperar.', heal: 'Cuando algo le duele, Aries suele lanzarse a la acción para olvidar. Permítete una pausa. Quedarse quieto no es perder.', element: 'Fuego', modality: 'Cardinal', ruler: 'Marte' },
  'kim-nguu': { name: 'Tauro', keywords: 'estable, fiable, amante de la belleza', light: 'Eres un ancla firme. Disfrutas de las cosas sencillas: buena comida, una manta cálida, la música.', shadow: 'Testarudo, reacio al cambio, aferrado a la seguridad.', heal: 'Tauro sana a través del cuerpo: comer despacio, dormir lo suficiente, tocar la naturaleza. El cambio puede llegar despacio, con tal de que llegue.', element: 'Tierra', modality: 'Fija', ruler: 'Venus' },
  'song-tu': { name: 'Géminis', keywords: 'curioso, flexible, gran comunicador', light: 'Una mente ágil que quiere saberlo todo y se lleva bien con todo el mundo.', shadow: 'Disperso, se aburre con facilidad, piensa más de lo que siente.', heal: 'Géminis necesita escribir. Cuando tu cabeza haga ruido, vuélcalo en el papel. No tienes que responder hoy todas las preguntas.', element: 'Aire', modality: 'Mutable', ruler: 'Mercurio' },
  'cu-giai': { name: 'Cáncer', keywords: 'protector, emotivo, entregado', light: 'Eres «hogar» para mucha gente. Intuición fuerte, memoria larga, amor profundo.', shadow: 'Sensible, se refugia pronto en su caparazón, se aferra al pasado.', heal: 'Cáncer cuida primero de los demás. Hoy, sé un hogar para ti: cocina algo, llama a casa.', element: 'Agua', modality: 'Cardinal', ruler: 'Luna' },
  'su-tu': { name: 'Leo', keywords: 'radiante, generoso, creativo', light: 'Brillas con naturalidad. Un corazón grande y leal que hace que los demás se sientan vistos.', shadow: 'Necesita reconocimiento, orgulloso, le cuesta mostrarse vulnerable.', heal: 'El valor de Leo no está en los aplausos. Eres valioso incluso los días en que nadie lo nota.', element: 'Fuego', modality: 'Fija', ruler: 'Sol' },
  'xu-nu': { name: 'Virgo', keywords: 'meticuloso, atento, servicial', light: 'Notas detalles que otros pasan por alto y, en silencio, mejoras todo lo que tocas.', shadow: 'Perfeccionista, autocrítico, se preocupa por pequeñeces.', heal: 'Querido Virgo, «suficientemente bien» está bien. Anota tres cosas que hiciste hoy antes de pensar en lo que falta.', element: 'Tierra', modality: 'Mutable', ruler: 'Mercurio' },
  'thien-binh': { name: 'Libra', keywords: 'armonioso, elegante, justo', light: 'Tienes ojo para la belleza, escuchas a ambas partes y unes a las personas.', shadow: 'Indeciso, complaciente, teme el conflicto.', heal: 'Libra, ponte tú también en la balanza. Decir «no» una vez no hará que el mundo se vuelque.', element: 'Aire', modality: 'Cardinal', ruler: 'Venus' },
  'bo-cap': { name: 'Escorpio', keywords: 'profundo, intenso, leal', light: 'Ves bajo la superficie. Cuando confías, confías del todo y llegas hasta el final.', shadow: 'Desconfiado, reservado, tarda en soltar las viejas heridas.', heal: 'Escorpio es más fuerte cuando se atreve a ablandarse. Perdonar no es olvidar: es dejar de tener que cargarlo.', element: 'Agua', modality: 'Fija', ruler: 'Plutón · Marte' },
  'nhan-ma': { name: 'Sagitario', keywords: 'libre, optimista, aventurero', light: 'Traes risa y una mirada amplia. Te encanta aprender, viajar y hacerte grandes preguntas.', shadow: 'Huye del compromiso, demasiado directo, le cuesta terminar lo que empieza.', heal: 'No toda tristeza se deja atrás con un viaje. A veces el viaje más largo es quedarte quieto contigo.', element: 'Fuego', modality: 'Mutable', ruler: 'Júpiter' },
  'ma-ket': { name: 'Capricornio', keywords: 'disciplinado, responsable, perseverante', light: 'Subes paso a paso y rara vez te rindes. La gente te confía las cosas difíciles.', shadow: 'Exigente, trabaja de más, confunde descanso con pereza.', heal: 'Capricornio, el descanso es parte de la subida. No tienes que ganarte el derecho a descansar.', element: 'Tierra', modality: 'Cardinal', ruler: 'Saturno' },
  'bao-binh': { name: 'Acuario', keywords: 'independiente, original, humanitario', light: 'Piensas adelantado a tu tiempo, te importa la comunidad y no te molesta ser diferente.', shadow: 'Emocionalmente distante, obstinado, difícil de acercar.', heal: 'Acuario ama al mundo entero pero se olvida de quererse. Deja que una persona se acerque un poco más.', element: 'Aire', modality: 'Fija', ruler: 'Urano · Saturno' },
  'song-ngu': { name: 'Piscis', keywords: 'soñador, empático, imaginativo', light: 'Sientes el dolor ajeno y conviertes la emoción en arte.', shadow: 'Se evade en los sueños, límites débiles, carga con la tristeza de otros.', heal: 'Piscis necesita límites como los peces necesitan agua limpia. No toda la tristeza que sientes es tuya.', element: 'Agua', modality: 'Mutable', ruler: 'Neptuno · Júpiter' },
};

// Zodiaco vietnamita: Sửu es el Búfalo de agua y Mão es el Gato (no el Conejo, como en China).
const chi = {
  'ty-chuot': { animal: 'Rata', traits: 'rápida, ingeniosa, ahorradora, perspicaz', shadow: 'se preocupa por adelantado, a veces calcula de más', heal: 'La Rata piensa diez pasos por delante. Hoy, piensa solo uno: el siguiente paso, con suavidad.' },
  'suu-trau': { animal: 'Búfalo', traits: 'trabajador, paciente, fiable, constante', shadow: 'lo carga todo a solas, rara vez admite su cansancio', heal: 'Hasta el búfalo necesita que le quiten el yugo. Tienes permiso para cansarte, y para decirlo.' },
  'dan-ho': { animal: 'Tigre', traits: 'valiente, fuerte, de principios, protege a los débiles', shadow: 'temperamento fuerte, no soporta que lo controlen', heal: 'Un tigre no es más fuerte cuando ruge, sino cuando descansa para recuperarse. Permítete un rato de quietud.' },
  'mao-meo': { animal: 'Gato', traits: 'refinado, dulce, diplomático, amante de la paz', shadow: 'evita el conflicto, se hiere con facilidad', heal: 'Los gatos saben encontrar un rincón tibio de sol. Tú también: busca hoy un rincón seguro.' },
  'thin-rong': { animal: 'Dragón', traits: 'seguro, enérgico, ambicioso', shadow: 'se exige demasiado', heal: 'Los dragones no tienen que volar todos los días. Algunos días basta con acurrucarse bajo las nubes y respirar.' },
  'ty-ran': { animal: 'Serpiente', traits: 'profunda, sabia, intuitiva, discreta', shadow: 'oculta sus sentimientos, tarda en confiar', heal: 'Las serpientes mudan la piel para crecer. ¿Qué piel vieja estás lista para dejar atrás?' },
  'ngo-ngua': { animal: 'Caballo', traits: 'espíritu libre, entusiasta, independiente, vivaz', shadow: 'impaciente, se aburre con facilidad', heal: 'Los caballos corren mejor después de beber y descansar. No olvides detenerte en la posta.' },
  'mui-de': { animal: 'Cabra', traits: 'bondadosa, artística, compasiva', shadow: 'ansiosa, depende de la aprobación', heal: 'Tu dulzura es un don, no una debilidad. Guarda un poco para ti.' },
  'than-khi': { animal: 'Mono', traits: 'listo, divertido, creativo, adaptable', shadow: 'esconde la tristeza tras la risa', heal: 'No siempre tienes que ser quien hace reír a todos. Tienes permiso para estar triste delante de alguien.' },
  'dau-ga': { animal: 'Gallo', traits: 'diligente, franco, ordenado, puntual', shadow: 'perfeccionista, su franqueza puede herir', heal: 'El gallo canta puntual cada mañana. Pero hoy puedes dormir un poco más.' },
  'tuat-cho': { animal: 'Perro', traits: 'leal, recto, entregado, protector', shadow: 'se preocupa por los demás hasta olvidarse de sí', heal: 'Siempre vigilas por los demás. Hoy, deja que alguien vigile por ti.' },
  'hoi-lon': { animal: 'Cerdo', traits: 'dulce, generoso, sincero, disfruta la vida', shadow: 'confiado, le cuesta decir que no', heal: 'Tu bondad necesita una cerca. Rechazar un favor no te hace menos bondadoso.' },
};

const napAm = {
  'Hải Trung Kim': { meaning: 'Oro en el mar' }, 'Lư Trung Hỏa': { meaning: 'Fuego en el horno' }, 'Đại Lâm Mộc': { meaning: 'Madera del gran bosque' },
  'Lộ Bàng Thổ': { meaning: 'Tierra junto al camino' }, 'Kiếm Phong Kim': { meaning: 'Oro del filo de la espada' }, 'Sơn Đầu Hỏa': { meaning: 'Fuego en la cima del monte' },
  'Giản Hạ Thủy': { meaning: 'Agua en el barranco' }, 'Thành Đầu Thổ': { meaning: 'Tierra sobre la muralla' }, 'Bạch Lạp Kim': { meaning: 'Oro del candelero' },
  'Dương Liễu Mộc': { meaning: 'Madera de sauce' }, 'Tuyền Trung Thủy': { meaning: 'Agua del manantial' }, 'Ốc Thượng Thổ': { meaning: 'Tierra del tejado' },
  'Tích Lịch Hỏa': { meaning: 'Fuego del rayo' }, 'Tùng Bách Mộc': { meaning: 'Madera de pino y ciprés' }, 'Trường Lưu Thủy': { meaning: 'Agua que fluye larga' },
  'Sa Trung Kim': { meaning: 'Oro en la arena' }, 'Sơn Hạ Hỏa': { meaning: 'Fuego al pie del monte' }, 'Bình Địa Mộc': { meaning: 'Madera de la llanura' },
  'Bích Thượng Thổ': { meaning: 'Tierra sobre el muro' }, 'Kim Bạch Kim': { meaning: 'Oro mezclado con plata' }, 'Phú Đăng Hỏa': { meaning: 'Llama de la lámpara' },
  'Thiên Hà Thủy': { meaning: 'Agua del cielo' }, 'Đại Trạch Thổ': { meaning: 'Tierra del gran pantano' }, 'Thoa Xuyến Kim': { meaning: 'Oro de las joyas' },
  'Tang Đố Mộc': { meaning: 'Madera de morera' }, 'Đại Khê Thủy': { meaning: 'Agua del gran arroyo' }, 'Sa Trung Thổ': { meaning: 'Tierra arenosa' },
  'Thiên Thượng Hỏa': { meaning: 'Fuego en el cielo' }, 'Thạch Lựu Mộc': { meaning: 'Madera de granado' }, 'Đại Hải Thủy': { meaning: 'Agua del gran océano' },
};

const hanh = {
  'Kim': { name: 'Metal', tone: 'Blanco, gris, plateado', trait: 'Decidido, de principios, claro' },
  'Mộc': { name: 'Madera', tone: 'Verde', trait: 'En crecimiento, bondadoso, expansivo' },
  'Thủy': { name: 'Agua', tone: 'Negro, azul', trait: 'Flexible, profundo, sabio' },
  'Hỏa': { name: 'Fuego', tone: 'Rojo, rosa, morado', trait: 'Apasionado, creativo, radiante' },
  'Thổ': { name: 'Tierra', tone: 'Amarillo, marrón tierra', trait: 'Arraigado, tolerante, fiable' },
};

const element = {
  'Lửa': { name: 'Fuego', desc: 'Acción, pasión, entusiasmo' },
  'Đất': { name: 'Tierra', desc: 'Práctico, perseverante, estable' },
  'Khí': { name: 'Aire', desc: 'Pensamiento, comunicación, conexión' },
  'Nước': { name: 'Agua', desc: 'Emoción, intuición, empatía' },
};

const post = {
  'hd-001': { title: 'Saqué La Estrella después del peor mes de mi año', body: 'El mes pasado perdí el trabajo, terminé una relación y me enfermé. Anoche saqué una carta por jugar y me salió La Estrella.\nNo creo que una carta pueda cambiar nada. Pero al mirar a la mujer que vierte agua bajo un cielo estrellado, sentí que tenía permiso para descansar un momento, permiso para creer que todo está sanando, aunque sea despacio.', author: 'Alguien en Hanói' },
  'hd-002': { title: 'La carta de la «Muerte» no es un mal augurio', body: 'Mucha gente entra en pánico al sacar el arcano XIII. En realidad habla de transformación: algo termina para que otra cosa pueda empezar. Como el otoño, que deja caer las hojas para que el árbol vuelva a brotar.\nSi te sale, pregúntate: «¿Qué en mi vida ya caducó y sigo sosteniendo?».', author: 'Lectora de cartas desde hace 6 años' },
  'hd-003': { title: 'Soy Capricornio y estoy aprendiendo a descansar', body: 'Toda mi vida pensé que el descanso era un premio que se gana después de terminarlo todo. Pero la lista de tareas nunca se acaba.\nEste año empecé a agendar el descanso como agendo las reuniones. Curiosamente, trabajo mejor. A cualquier Capricornio que lea esto: no tienes que ganarte el derecho a descansar.', author: 'Capricornio, 31 años' },
  'hd-004': { title: 'El año del Búfalo y no decir nunca «estoy cansada»', body: 'Mi madre dice que la gente del año del Búfalo está destinada a trabajar duro. Yo no creo en el destino, pero reconozco que cargo con demasiado.\nHace poco probé algo: pedir ayuda con al menos una cosa por semana. La primera vez me dio vergüenza. A la tercera me sentí muchísimo más ligera. Resulta que el «trabajar duro» era en parte porque nunca dejaba que nadie me ayudara.', author: 'Alguien nacida en un año del Búfalo' },
  'hd-005': { title: '', body: 'Para ti que te sientes solo: El Ermitaño del tarot sube la montaña a solas, con una lámpara en la mano. No está solo. Está encontrando el camino de vuelta hacia sí mismo.\nSi hoy estás a solas, piensa que es un viaje montaña arriba.', author: 'Alguien desconocido' },
  'hd-006': { title: 'Mercurio retrógrado no es una excusa', body: 'Cada vez que Mercurio retrograda, las redes le echan la culpa de todo: discusiones, cosas perdidas, citas olvidadas.\nA mí me gusta otra mirada: es un recordatorio para ir más despacio, releer los mensajes antes de enviarlos y revisar los planes. La astrología da lo mejor de sí cuando nos ayuda a vivir con calma, no cuando nos asusta.', author: 'Un Acuario que ama las cartas astrales' },
  'hd-007': { title: '¿Qué es el elemento nạp âm? Una guía para principiantes', body: 'Cada año lunar tiene un Tronco Celeste y una Rama Terrestre, como Bính Ngọ. Las 60 combinaciones forman 30 pares, y cada par tiene un elemento «nạp âm», como Agua del Cielo o Fuego en el Horno.\nEs la forma en que los antiguos usaban imágenes de la naturaleza para describir el carácter. Leído como un poema, es mucho más bello que leído como una sentencia.', author: 'Quien escribe el calendario' },
  'hd-008': { title: 'Saqué el Tres de Espadas tres veces seguidas, ¿qué significa?', body: 'Pregunté por el amor y esta semana me salió tres veces el Tres de Espadas (un corazón atravesado por tres espadas). ¿A alguien le ha pasado?\nSé que estoy triste. Quizá la carta solo está diciendo en voz alta lo que no me he atrevido a admitir.', author: 'Alguien que está triste' },
  'hd-009': { title: '', body: 'Para quien sacó tres veces el Tres de Espadas: la carta no dice que vayas a sufrir para siempre. Dice que el dolor es real y necesita llorarse.\nCuando estés lista, saca una carta más y pregunta: «¿Qué necesito para sanar?». Cambia la pregunta, y la carta también cambia.', author: 'Alguien que también sacó el Tres de Espadas' },
  'hd-010': { title: 'Un Cáncer lejos de casa', body: 'En mi cuarto año viviendo en Saigón, todavía extraño mi casa en cada comida. Al leer sobre Cáncer entendí por qué: para un signo de Agua regido por la Luna, el «hogar» no es una dirección, sino la sensación de pertenecer.\nAhora me hago un «hogar» en mi cuarto de alquiler: una olla de sopa agria cada domingo, una maceta de albahaca junto a la ventana.', author: 'Un Cáncer en Saigón' },
  'hd-011': { title: '¿De verdad es de mala suerte el año de tu propio animal?', body: 'El año que viene es el de mi animal y toda la familia me dice que tenga cuidado. Estoy un poco preocupada. ¿Cómo fue para ustedes el año de su animal?', author: 'Alguien a punto de vivir el año de su animal' },
  'hd-012': { title: '', body: 'En el año de mi animal cambié de trabajo, me mudé y conocí a mi pareja actual. Hubo grandes cambios, pero los cambios no siempre son malos.\nCreo que cuando los mayores dicen «ten cuidado», quieren decir que vivas con más atención, no con miedo.', author: 'Alguien que ya lo vivió' },
  'hd-013': { title: 'Cuatro de Copas: cuando todo parece plano', body: 'El Cuatro de Copas muestra a una persona sentada bajo un árbol, de brazos cruzados, mirando tres copas, sin notar la mano que le ofrece una cuarta.\nEs la carta de los días en que todo sabe a poco. No te culpa. Solo te recuerda: cuando estés listo para levantar la vista, algo nuevo te espera.', author: 'Lectora de cartas desde hace 6 años' },
  'hd-014': { title: '', body: 'A mis compañeros de Piscis: no toda la tristeza que sienten es suya. Absorben las emociones de los demás como una esponja.\nEsta noche, date una ducha tibia e imagina que el agua se lleva los sentimientos que no te pertenecen.', author: 'Otro Piscis' },
  'hd-015': { title: 'Una tirada de «dos caminos» cuando dudaba en renunciar', body: 'Tendí tres cartas: quedarme dio El Colgado, irme dio el Siete de Pentáculos, y lo que sabe mi corazón dio El Sol.\nLo leí así: quedarme es seguir en suspenso, irme pide paciencia hasta la cosecha, y mi corazón quiere vivir con alegría. Las cartas no decidieron por mí, pero me ayudaron a decir lo que ya sabía.', author: 'Oficinista, 28 años' },
  'hd-016': { title: 'Sol, Luna, Ascendente: ¿en qué se diferencian?', body: 'Tu signo solar (el que sueles mencionar) es tu naturaleza esencial. Tu signo lunar es tu mundo emocional interior, la forma en que necesitas ser querido. Tu Ascendente es la primera impresión que los demás tienen de ti.\nSi sientes que «no te pareces mucho a tu signo», quizá estén hablando tu Luna o tu Ascendente.', author: 'Un Acuario que ama las cartas astrales' },
  'hd-017': { title: 'Vietnam tiene el Gato; China, el Conejo', body: 'Algo que me encanta: en el zodiaco vietnamita, Mão es el Gato y no el Conejo.\nA la gente del año del Gato se la describe como refinada, amante de la paz, capaz de encontrar un rincón tibio de sol. Hoy hice exactamente eso: encontré un rincón soleado y leí un libro.', author: 'Nacida en un año Quý Mão' },
  'hd-018': { title: '', body: 'La carta de La Fuerza no muestra a un guerrero. Muestra a una mujer que cierra con suavidad la boca de un león.\nSi hoy estás peleando contigo, prueba con la dulzura. La verdadera fuerza es una dulzura que no se rinde.', author: 'Alguien desconocido en Huế' },
  'hd-019': { title: '¿De verdad a Escorpio le cuesta perdonar?', body: 'Soy Escorpio y esto me toca de cerca. Cuando alguien me hiere, lo recuerdo durante mucho tiempo. ¿Algún Escorpio aprendió a soltar? Por favor, compártanlo.', author: 'Un Escorpio de noviembre' },
  'hd-020': { title: '', body: 'Para el Escorpio que preguntó: me llevó tres años entender que perdonar no significa volver, ni olvidar.\nPerdonar es dejar el peso en el suelo, porque mereces caminar más liviano. Puedes perdonar y aun así cerrar la puerta.', author: 'Un Escorpio que pasó por ahí' },
  'hd-021': { title: 'A los 30 saqué El Loco', body: 'Planeaba volver a la universidad a los 30 y todos decían que era tarde. Ese día saqué El Loco: alguien que camina despreocupado junto al borde de un precipicio, con un perrito trotando detrás.\nDecidí leerlo como «ve, está bien ser un poco loco». Ahora estoy en segundo año, soy la mayor de la clase y la más feliz.', author: 'Una estudiante de casi 30' },
  'hd-022': { title: 'Tríos armónicos y cuatro opuestos: no son para dividir a las personas', body: 'Los tríos armónicos (como Mono, Rata, Dragón) y los cuatro opuestos (como Rata, Caballo, Gato, Gallo) son la forma en que los antiguos agrupaban a los 12 animales en conjuntos afines y «en tensión».\nVeo a mucha gente usarlos para prohibir el amor. Yo prefiero esta mirada: «en tensión» significa dos perspectivas distintas que necesitan escucharse más. Ninguna pareja nace para fracasar.', author: 'Quien escribe el calendario' },
  'hd-023': { title: 'Cuatro de Espadas: la carta que te deja descansar', body: 'Un caballero yace inmóvil en una capilla, con tres espadas en la pared y una debajo de él. Es la carta de la recuperación.\nSi te sale, el universo (o tú mismo) te está diciendo: hoy no hace falta pelear. Duerme.', author: 'Lectora de cartas desde hace 6 años' },
  'hd-024': { title: 'Virgo y la lista de «hecho»', body: 'Siempre escribo listas de tareas y luego me culpo por no terminarlas. Una amiga Piscis me sugirió escribir también una lista de «lo que hice hoy».\nAl releerla después de una semana casi lloro: había hecho muchísimo.', author: 'Una Virgo perfeccionista' },
};

const topic = { 'tarot': { label: 'Tarot' }, 'chiem-tinh': { label: 'Astrología' }, 'tu-vi': { label: 'Tử Vi' } };
const type = {
  'trai-bai': { label: 'Tirada' }, 'giai-nghia': { label: 'Significado' }, 'chia-se': { label: 'Historia' }, 'hoi-dap': { label: 'Pregunta' }, 'loi-nhan': { label: 'Nota' },
};
const spread = {
  'mot-la': { name: 'Una carta para hoy', positions: ['Un mensaje para ti'] },
  'ba-la': { name: 'Pasado · Presente · Futuro', positions: ['Lo que pasó', 'Lo que es', 'Lo que puede venir'] },
  'chua-lanh': { name: 'Tirada para sanar', positions: ['Lo que te duele', 'Lo que puedes soltar', 'Lo que te nutre'] },
  'lua-chon': { name: 'Dos caminos', positions: ['Si eliges A', 'Si eliges B', 'Lo que sabe tu corazón'] },
  'celtic-cross': {
    name: 'Cruz Celta (10 cartas)',
    positions: ['Tu presente', 'Lo que te desafía', 'La base profunda', 'Lo que se está yendo', 'Lo que buscas', 'Lo que se acerca', 'Cómo te ves', 'Tu entorno', 'Esperanzas y temores', 'Hacia dónde se abre la energía'],
  },
};
const hotline = {
  '115': { name: 'Emergencias médicas (Vietnam)', note: 'Cuando hay peligro inmediato para la vida' },
  '096 306 1414': { name: 'Línea Ngày Mai (Vietnam)', note: 'Apoyo emocional para personas en crisis' },
  '111': { name: 'Línea nacional de protección infantil (Vietnam)', note: 'Para menores de 18 años' },
  'findahelpline': { name: 'Find A Helpline', note: 'Líneas de ayuda gratuitas en más de 130 países (España, Argentina, Chile, México…)' },
};

export default { card, suit: SUITS, sign, chi, napAm, hanh, element, post, topic, type, spread, hotline };
