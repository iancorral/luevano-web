// Contenido de cada servicio: alimenta el explorador de la portada y su página propia.
// Pendiente: revisar con la dueña qué servicios ofrece realmente y en qué términos.

export type ServicePiece = 'alignment' | 'suspension' | 'balancing' | 'steering' | 'brakes' | 'repairs';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  piece: ServicePiece;
  name: string;
  topic: string; // cómo se nombra dentro de una frase: "informes de {topic}"
  symptoms: string; // lo que nota el cliente, para la lista de la portada
  summary: string;
  stageCaption: string;
  seoTitle: string;
  seoDescription: string;
  headline: string;
  intro: string;
  signs: string[];
  steps: string[];
  faq: FaqItem[];
}

export const SERVICES: Service[] = [
  {
    slug: 'alineacion',
    piece: 'alignment',
    name: 'Alineación',
    topic: 'alineación',
    symptoms: 'Se jala, volante chueco, llantas gastadas de una orilla',
    summary:
      'Corrige hacia dónde apuntan las llantas. Las dejamos derechas como pide el fabricante: el carro deja de jalarse y las llantas duran más.',
    stageCaption: 'Las llantas llegan abiertas y salen derechas',
    seoTitle: 'Alineación en Chihuahua · Col. Campesina',
    seoDescription:
      'Alineación para autos, camionetas y autos americanos en la Col. Campesina, Chihuahua. Sin cita, abrimos sábado. Escríbenos por WhatsApp.',
    headline: 'Que tu carro vuelva a ir derecho',
    intro:
      'La alineación corrige hacia dónde apuntan las llantas. Cuando están chuecas, el carro se jala, el volante queda torcido y las llantas se gastan de una orilla mucho antes de tiempo.',
    signs: [
      'El carro se jala hacia un lado.',
      'El volante queda chueco aunque vayas derecho.',
      'Las llantas se gastan más de una orilla.',
      'Pegaste fuerte en un bache o una banqueta.',
      'Cambiaste llantas o piezas de suspensión o dirección.',
    ],
    steps: [
      'Revisamos primero suspensión y dirección: si hay una pieza floja, la alineación no dura.',
      'Medimos hacia dónde apunta cada llanta y la ajustamos a lo que pide el fabricante.',
      'Dejamos el volante centrado.',
      'Si encontramos algo más, te avisamos antes de hacer cualquier cosa.',
    ],
    faq: [
      {
        question: '¿Cuánto tarda una alineación?',
        answer: 'Entre 30 y 60 minutos en la mayoría de los carros. Puedes esperar aquí mientras la hacemos.',
      },
      {
        question: '¿Qué diferencia hay entre alineación y balanceo?',
        answer:
          'La alineación corrige hacia dónde apuntan las llantas, para que el carro vaya derecho. El balanceo corrige el peso de cada llanta, para que no vibre. Son trabajos distintos y muchas veces conviene hacer los dos.',
      },
      {
        question: '¿Necesito hacer cita?',
        answer:
          'No. Llega en el horario. Si quieres asegurar lugar, sobre todo en sábado, mándanos WhatsApp antes.',
      },
    ],
  },
  {
    slug: 'suspension',
    piece: 'suspension',
    name: 'Suspensión',
    topic: 'suspensión',
    symptoms: 'Truena en los baches, rebota o se siente flojo',
    summary:
      'Rótulas, terminales, bujes, amortiguadores, resortes y mazas. Te enseñamos la pieza gastada antes de cambiarla.',
    stageCaption: 'El amortiguador y el resorte trabajan juntos',
    seoTitle: 'Suspensión en Chihuahua · Rótulas, bujes y amortiguadores',
    seoDescription:
      'Cambio de rótulas, terminales, bujes, amortiguadores, resortes y mazas en la Col. Campesina, Chihuahua. Te enseñamos la pieza gastada antes de cambiarla.',
    headline: 'Suspensión pieza por pieza',
    intro:
      'La suspensión es la que absorbe los baches y mantiene las llantas pegadas al piso. Cuando una pieza se gasta, el carro truena, rebota o se siente flojo, y con el tiempo daña otras piezas.',
    signs: [
      'Truena o golpea al pasar baches o topes.',
      'Rebota varias veces después de un tope.',
      'Se siente flojo o se mueve de más en las curvas.',
      'Un lado se ve más bajo que el otro.',
      'Las llantas se gastan disparejo.',
    ],
    steps: [
      'Revisamos la suspensión pieza por pieza.',
      'Te enseñamos la pieza gastada antes de cambiarla.',
      'Te decimos cuánto cuesta antes de empezar. No movemos nada sin tu sí.',
      'Al terminar te decimos si conviene alinear.',
    ],
    faq: [
      {
        question: '¿Ustedes consiguen las piezas?',
        answer:
          'Sí. Mándanos marca, modelo y año de tu carro por WhatsApp y te cotizamos la pieza con la instalación.',
      },
      {
        question: '¿Por qué me recomiendan alinear después de cambiar piezas?',
        answer:
          'Al cambiar rótulas, terminales o bujes puede moverse hacia dónde apuntan las llantas. Alinear al final evita que se gasten antes de tiempo.',
      },
      {
        question: '¿Atienden autos americanos?',
        answer: 'Sí. Autos nacionales, americanos y regularizados, camionetas y camiones ligeros.',
      },
    ],
  },
  {
    slug: 'balanceo',
    piece: 'balancing',
    name: 'Balanceo',
    topic: 'balanceo',
    symptoms: 'Vibra el volante o el asiento en carretera',
    summary:
      'Corrige el peso de cada llanta. En la balanceadora le ponemos la pesa que le falta y se quita la vibración del volante y el asiento.',
    stageCaption: 'La llanta tiembla hasta que le ponemos la pesa',
    seoTitle: 'Balanceo de llantas en Chihuahua · Col. Campesina',
    seoDescription:
      'Balanceo de llantas en la Col. Campesina, Chihuahua. Quita la vibración del volante y el asiento. Sin cita, abrimos sábado.',
    headline: 'Adiós a la vibración',
    intro:
      'Una llanta nunca pesa igual en todo su contorno. Esa diferencia, a velocidad, se siente como vibración en el volante o en el asiento. El balanceo la corrige con pequeñas pesas.',
    signs: [
      'El volante vibra a cierta velocidad.',
      'El asiento vibra en carretera.',
      'Cambiaste llantas o rines.',
      'Se le cayó una pesa a un rin.',
    ],
    steps: [
      'Montamos cada llanta en la balanceadora.',
      'La máquina marca dónde le falta peso.',
      'Le ponemos la pesa justa y volvemos a medir.',
    ],
    faq: [
      {
        question: '¿Qué diferencia hay entre alineación y balanceo?',
        answer:
          'La alineación corrige hacia dónde apuntan las llantas, para que el carro vaya derecho. El balanceo corrige el peso de cada llanta, para que no vibre. Muchas veces conviene hacer los dos.',
      },
      {
        question: '¿Necesito hacer cita?',
        answer: 'No. Llega en el horario. En sábado conviene mandarnos WhatsApp antes.',
      },
    ],
  },
  {
    slug: 'direccion',
    piece: 'steering',
    name: 'Dirección',
    topic: 'dirección',
    symptoms: 'El volante pesa, tiene juego o hace ruido al girar',
    summary: 'Cremallera, terminales y bomba de dirección. Para que el volante responda firme y sin juego.',
    stageCaption: 'Volante firme y sin juego',
    seoTitle: 'Reparación de dirección en Chihuahua · Cremallera y terminales',
    seoDescription:
      'Reparación de cremallera, terminales y bomba de dirección en la Col. Campesina, Chihuahua. Para que el volante responda firme y sin juego.',
    headline: 'Un volante que responde',
    intro:
      'La dirección conecta el volante con las llantas. Si una pieza se desgasta, el volante pesa, tiene juego o hace ruido, y el carro deja de responder como debe.',
    signs: [
      'El volante se siente pesado.',
      'Tiene juego: mueves el volante y las llantas tardan en responder.',
      'Hace ruido al girar.',
      'Gotea líquido de la dirección.',
    ],
    steps: [
      'Revisamos cremallera, terminales y bomba.',
      'Te decimos qué pieza falla y cuánto cuesta antes de empezar.',
      'Al terminar, alineamos si hace falta.',
    ],
    faq: [
      {
        question: '¿Es peligroso manejar con juego en el volante?',
        answer:
          'Sí puede serlo, porque el carro no responde como esperas. Si lo notas, tráelo para revisarlo lo antes posible.',
      },
    ],
  },
  {
    slug: 'frenos',
    piece: 'brakes',
    name: 'Frenos',
    topic: 'frenos',
    symptoms: 'Rechina, vibra al frenar o el pedal se va hasta abajo',
    summary: 'Balatas, discos y tambores. Si el pedal se va hasta abajo, no manejes: llámanos.',
    stageCaption: 'Disco y caliper',
    seoTitle: 'Frenos en Chihuahua · Balatas, discos y tambores',
    seoDescription:
      'Cambio de balatas, discos y tambores en la Col. Campesina, Chihuahua. Si rechina o vibra al frenar, escríbenos por WhatsApp.',
    headline: 'Frenar sin sustos',
    intro:
      'Los frenos se gastan con el uso. Revisarlos a tiempo es más barato y mucho más seguro que esperar a que fallen.',
    signs: [
      'Rechina al frenar.',
      'Vibra el pedal o el volante al frenar.',
      'El carro se jala al frenar.',
      'El pedal se va hasta abajo. En ese caso no manejes: llámanos.',
    ],
    steps: [
      'Revisamos balatas, discos y tambores.',
      'Te decimos qué hay que cambiar y cuánto cuesta antes de empezar.',
    ],
    faq: [
      {
        question: '¿Cada cuándo se cambian las balatas?',
        answer:
          'Depende de cómo y por dónde manejes. Lo mejor es revisarlas cuando notes ruido o en cada servicio.',
      },
    ],
  },
  {
    slug: 'reparaciones',
    piece: 'repairs',
    name: 'Reparaciones',
    topic: 'una reparación',
    symptoms: 'Esas que en otros lados no hacen',
    summary:
      'Hacemos reparaciones que en otros lugares no hacen. Cuéntanos la falla y te decimos si la podemos resolver.',
    stageCaption: 'Lo que otros no hacen',
    seoTitle: 'Reparaciones de suspensión y dirección en Chihuahua',
    seoDescription:
      'Reparaciones de suspensión y dirección que en otros talleres no hacen. Col. Campesina, Chihuahua. Cuéntanos la falla por WhatsApp.',
    headline: 'Las que otros no hacen',
    intro:
      'Hay fallas que en otros talleres no quieren tomar. Cuéntanos qué tiene tu carro y te decimos con honestidad si lo podemos resolver.',
    signs: [
      'Ya fuiste a otro taller y no te lo resolvieron.',
      'Te dijeron que había que cambiar todo el conjunto.',
      'Es un carro americano o difícil de conseguir piezas.',
    ],
    steps: [
      'Nos cuentas la falla por WhatsApp o en el taller.',
      'Lo revisamos y te decimos si lo podemos reparar y cuánto cuesta.',
      'No movemos nada sin tu sí.',
    ],
    faq: [
      {
        question: '¿Cómo sé si lo pueden reparar?',
        answer:
          'Mándanos por WhatsApp marca, modelo, año y qué le notas. Si hace falta, te pedimos que lo traigas para revisarlo.',
      },
    ],
  },
];

export const getService = (slug: string): Service | undefined => SERVICES.find((s) => s.slug === slug);
