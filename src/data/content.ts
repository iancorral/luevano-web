import type { ImageMetadata } from 'astro';
import type { FaqItem } from './services';
import { getDayRange } from '@/lib/hours';
import wheelService from '@/assets/images/wheel-service.jpg';
import truckUnderside from '@/assets/images/truck-underside.jpg';
import tireShop from '@/assets/images/tire-shop.jpg';

const saturday = getDayRange(6);

export const SUSPENSION_PARTS = [
  'Rótula superior',
  'Rótula inferior',
  'Terminal interior',
  'Terminal exterior',
  'Buje de horquilla superior',
  'Buje de horquilla inferior',
  'Buje de barra estabilizadora',
  'Tornillo estabilizador',
  'Amortiguador',
  'Base de amortiguador',
  'Resortes',
  'Maza de rueda',
] as const;

export const HIGHLIGHTS = [
  { title: 'Sin cita', detail: 'Llega en el horario' },
  { title: 'Abrimos sábado', detail: `De ${saturday}` },
  { title: 'Precio antes', detail: 'No movemos nada sin tu sí' },
  { title: 'Todo tipo de carro', detail: 'Nacionales, americanos y camionetas' },
] as const;

export const TICKER_ITEMS = [
  'Alineación',
  'Balanceo',
  'Rótulas',
  'Terminales',
  'Bujes',
  'Amortiguadores',
  'Resortes',
  'Mazas',
  'Dirección',
  'Frenos',
  'Enderezado de chasis',
  'Soldadura',
] as const;

export const SYMPTOM_OPTIONS = [
  { label: 'Se jala', value: 'se jala hacia un lado' },
  { label: 'Volante chueco', value: 'el volante quedó chueco' },
  { label: 'Vibra', value: 'vibra en carretera' },
  { label: 'Truena en baches', value: 'truena en los baches' },
  { label: 'Rechina al frenar', value: 'rechina al frenar' },
  { label: 'Llantas gastadas', value: 'las llantas se gastan de una orilla' },
  { label: 'Cotizar una pieza', value: 'necesito cotizar una pieza de suspensión' },
] as const;

export const VISIT_OPTIONS = [
  { label: 'Hoy', value: 'hoy' },
  { label: 'Mañana', value: 'mañana' },
  { label: 'Sábado', value: 'el sábado' },
  { label: 'Cuando tengan lugar', value: 'cuando tengan lugar' },
] as const;

export interface Audience {
  title: string;
  points: string[];
  cta: { label: string; message: string };
  image: { src: ImageMetadata; alt: string };
}

export const AUDIENCES: Audience[] = [
  {
    title: '¿Entre semana no te da tiempo?',
    points: [
      `Abrimos sábado de ${saturday}`,
      'No necesitas cita: llegas y esperas aquí',
      'Si quieres asegurar lugar, avísanos por WhatsApp',
    ],
    cta: { label: 'Preguntar por el sábado', message: 'Hola, ¿tienen lugar este sábado?' },
    image: { src: wheelService, alt: 'Mecánico ajustando la llanta de un auto' },
  },
  {
    title: 'Flotillas y empresas',
    points: ['Camionetas, vans y reparto', 'Transporte de personal', 'Revisión periódica de suspensión'],
    cta: {
      label: 'Cotizar mi flotilla',
      message: 'Hola, tengo una flotilla y quiero cotizar alineación y suspensión.',
    },
    image: { src: truckUnderside, alt: 'Mecánico revisando la suspensión debajo de una camioneta' },
  },
  {
    title: 'Talleres y mecánicos',
    points: [
      '¿Sin alineadora? Mándanos el carro',
      'Te lo regresamos listo',
      'Precio especial si nos mandas seguido',
    ],
    cta: {
      label: 'Hablar de taller a taller',
      message: 'Hola, tengo un taller y quiero mandarles carros para alineación.',
    },
    image: { src: tireShop, alt: 'Taller de llantas con rines acomodados en la pared' },
  },
];

// Descripción de cada foto de src/assets/images/work/ (nombre de archivo → texto alternativo).
export const WORK_CAPTIONS: Record<string, string> = {
  // 'alineacion-f150.jpg': 'Ford F-150 en la rampa de alineación',
};

export const PART_QUOTE_MESSAGE = 'Hola, quiero cotizar una pieza de suspensión. Mi carro es: ';

export const GENERAL_FAQ: FaqItem[] = [
  {
    question: '¿Necesito hacer cita?',
    answer:
      'No. Llega en el horario. Si quieres asegurar lugar, sobre todo en sábado, mándanos WhatsApp antes.',
  },
  {
    question: '¿Qué diferencia hay entre alineación y balanceo?',
    answer:
      'La alineación corrige hacia dónde apuntan las llantas, para que el carro vaya derecho y no se coma las llantas. El balanceo corrige el peso de cada llanta, para que no vibre. Son dos trabajos distintos y muchas veces conviene hacer los dos.',
  },
  {
    question: '¿Cuánto tarda una alineación?',
    answer:
      'Entre 30 y 60 minutos en la mayoría de los carros. Si encontramos una pieza dañada, te avisamos antes de hacer cualquier cosa.',
  },
  {
    question: '¿Ustedes consiguen las piezas de suspensión?',
    answer:
      'Sí. Mándanos marca, modelo y año de tu carro por WhatsApp y te cotizamos la pieza con la instalación.',
  },
  {
    question: '¿Atienden autos americanos?',
    answer: 'Sí. Autos nacionales, americanos y regularizados, camionetas y camiones ligeros.',
  },
];
