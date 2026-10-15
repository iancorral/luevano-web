import { BUSINESS, type DailyHours, type Weekday } from '@/config/business';

const WEEKDAYS: readonly Weekday[] = [0, 1, 2, 3, 4, 5, 6];
const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'] as const;
const DAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const;
const SCHEMA_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const toMinutes = (time: string): number => {
  const [h = 0, m = 0] = time.split(':').map(Number);
  return h * 60 + m;
};

export function formatTime(time: string, withPeriod = true): string {
  const total = toMinutes(time);
  const h24 = Math.floor(total / 60);
  const minutes = String(total % 60).padStart(2, '0');
  const h12 = h24 % 12 || 12;
  return withPeriod ? `${h12}:${minutes} ${h24 >= 12 ? 'pm' : 'am'}` : `${h12}:${minutes}`;
}

export const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

export interface HoursRow {
  day: Weekday;
  label: string;
  hours: DailyHours | null;
  text: string;
}

// Lunes primero, como se lee un horario en México.
export function getHoursTable(): HoursRow[] {
  return [1, 2, 3, 4, 5, 6, 0].map((day) => {
    const hours = BUSINESS.hours[day as Weekday];
    return {
      day: day as Weekday,
      label: capitalize(DAY_NAMES[day]!),
      hours,
      text: hours ? `${formatTime(hours.open)} – ${formatTime(hours.close)}` : 'Cerrado',
    };
  });
}

interface HoursGroup {
  days: Weekday[];
  hours: DailyHours;
}

function groupHours(): HoursGroup[] {
  const groups: HoursGroup[] = [];
  for (const day of [1, 2, 3, 4, 5, 6, 0] as Weekday[]) {
    const hours = BUSINESS.hours[day];
    if (!hours) continue;
    const last = groups.at(-1);
    const prevDay = last?.days.at(-1);
    const isNext = prevDay !== undefined && (prevDay + 1) % 7 === day;
    if (last && isNext && last.hours.open === hours.open && last.hours.close === hours.close) {
      last.days.push(day);
    } else {
      groups.push({ days: [day], hours });
    }
  }
  return groups;
}

// "Lun a Vie 8:30–6:30 · Sáb 8:30–2:00"
export function getHoursSummary(): string {
  return groupHours()
    .map(({ days, hours }) => {
      const first = DAY_SHORT[days[0]!];
      const range = days.length > 1 ? `${first} a ${DAY_SHORT[days.at(-1)!]}` : first;
      return `${range} ${formatTime(hours.open, false)}–${formatTime(hours.close, false)}`;
    })
    .join(' · ');
}

export function getSchemaOpeningHours() {
  return groupHours().map(({ days, hours }) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: days.map((d) => SCHEMA_DAYS[d]),
    opens: hours.open,
    closes: hours.close,
  }));
}

// "8:30 a 2:00"
export function getDayRange(day: Weekday): string {
  const hours = BUSINESS.hours[day];
  return hours ? `${formatTime(hours.open, false)} a ${formatTime(hours.close, false)}` : 'Cerrado';
}

export interface LocalNow {
  day: Weekday;
  minutes: number;
}

export function getLocalNow(date = new Date()): LocalNow {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS.timeZone,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')) as Weekday;
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export interface OpenStatus {
  isOpen: boolean;
  label: string;
  day: Weekday;
  minutes: number;
}

export function getOpenStatus(now: LocalNow = getLocalNow()): OpenStatus {
  const { day, minutes } = now;
  const today = BUSINESS.hours[day];
  if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { isOpen: true, label: `Abierto ahora · cierra a las ${formatTime(today.close)}`, day, minutes };
  }
  if (today && minutes < toMinutes(today.open)) {
    return { isOpen: false, label: `Cerrado · abre hoy a las ${formatTime(today.open)}`, day, minutes };
  }
  for (let offset = 1; offset <= 7; offset++) {
    const next = WEEKDAYS[(day + offset) % 7]!;
    const hours = BUSINESS.hours[next];
    if (!hours) continue;
    const when = offset === 1 ? 'mañana' : `el ${DAY_NAMES[next]}`;
    return { isOpen: false, label: `Cerrado · abre ${when} a las ${formatTime(hours.open)}`, day, minutes };
  }
  return { isOpen: false, label: 'Cerrado', day, minutes };
}

export function getGreeting(now: LocalNow = getLocalNow()): string {
  const hour = now.minutes / 60;
  return hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
}
