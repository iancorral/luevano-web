// Abierto/cerrado con la hora de Chihuahua, y el día de hoy en la tabla de horario.
import { getOpenStatus } from '@/lib/hours';

try {
  const status = getOpenStatus();
  document.querySelectorAll<HTMLElement>('[data-open-status]').forEach((el) => {
    el.dataset.state = status.isOpen ? 'open' : 'closed';
    const label = el.querySelector('[data-open-status-label]');
    if (label) label.textContent = status.label;
  });
  document.querySelector(`[data-hours-table] [data-day="${status.day}"]`)?.classList.add('is-today');
} catch {
  // Sin Intl con zonas horarias: se queda el horario fijo.
}
