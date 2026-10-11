// Interacción: horario, servicios, armador de WhatsApp, ubicación, firma.
import { NEGOCIO, enlaces } from './negocio.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
export const estado = { servicio: 'alinea' };

// ---------- Horario (hora de Chihuahua) ----------
function f12(m) { let h = Math.floor(m / 60); const mm = m % 60, ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return `${h}:${mm < 10 ? '0' : ''}${mm} ${ap}`; }
export function horaChihuahua() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chihuahua', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const g = (t) => (parts.find((x) => x.type === t) || {}).value || '';
  const dia = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[g('weekday')];
  const min = (parseInt(g('hour'), 10) % 24) * 60 + parseInt(g('minute'), 10);
  return { dia, min };
}
export function estadoHorario() {
  const { dia, min } = horaChihuahua();
  const hoy = NEGOCIO.horario[dia];
  if (hoy && min >= hoy[0] && min < hoy[1]) return { abierto: true, texto: `Abierto ahora · cierra a las ${f12(hoy[1])}`, dia, min };
  let n = dia, i = 0, sig;
  do { n = (n + 1) % 7; i++; sig = NEGOCIO.horario[n]; } while (!sig && i < 7);
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const cuando = hoy && min < hoy[0] ? `hoy a las ${f12(hoy[0])}` : `${i === 1 ? 'mañana' : 'el ' + dias[n]} a las ${f12(sig[0])}`;
  return { abierto: false, texto: `Cerrado · abre ${cuando}`, dia, min };
}
function pintarHorario() {
  try {
    const e = estadoHorario();
    const txt = $('#estado-txt'), foco = $('#foco');
    if (txt) txt.textContent = e.texto;
    if (foco) foco.className = 'foco ' + (e.abierto ? 'on' : 'off');
    const fila = $(`#horario tr[data-d="${e.dia}"]`); if (fila) fila.classList.add('hoy');
  } catch (err) { /* se queda el horario fijo */ }
}

// ---------- Enlaces desde la configuración ----------
function aplicarConfig() {
  $$('a[href*="wa.me/"]').forEach((a) => { a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + NEGOCIO.whatsapp); });
  $$('a[href^="tel:"]').forEach((a) => { a.href = 'tel:' + NEGOCIO.telefono; });
  $$('[data-enlace="ruta"]').forEach((a) => { a.href = enlaces.ruta(); });
  $$('[data-enlace="waze"]').forEach((a) => { a.href = enlaces.waze(); });
  $$('[data-enlace="resena"]').forEach((a) => { a.href = enlaces.resena(); });
  if (NEGOCIO.contacto) $$('[data-contacto]').forEach((el) => { el.hidden = false; el.querySelector('b').textContent = NEGOCIO.contacto; });
  const firma = $('#firma');
  if (firma && NEGOCIO.portafolio) { firma.href = NEGOCIO.portafolio; firma.target = '_blank'; firma.rel = 'noopener'; }
  else if (firma) { firma.removeAttribute('href'); }
}

// ---------- Header y botón flotante ----------
function header() {
  const h = $('#header'), flot = $('#wa-flotante'), hero = $('.hero');
  const tick = () => {
    const y = window.scrollY;
    h.classList.toggle('solido', y > 60);
    if (flot && hero) flot.classList.toggle('visible', y > hero.offsetHeight * 0.7);
  };
  window.addEventListener('scroll', tick, { passive: true }); tick();
}

// ---------- Servicios ----------
const SERV = {
  alinea:     ['Alineación', 'Corrige hacia dónde apuntan las llantas. Las dejamos derechas como pide el fabricante: el carro deja de jalarse y las llantas duran más.', 'alineación', 'Las llantas llegan abiertas y salen derechas'],
  suspension: ['Suspensión', 'Rótulas, terminales, bujes, amortiguadores, resortes y mazas. Te enseñamos la pieza gastada antes de cambiarla.', 'suspensión', 'El amortiguador y el resorte trabajan juntos'],
  balanceo:   ['Balanceo', 'Corrige el peso de cada llanta. En la balanceadora le ponemos la pesa que le falta y se quita la vibración del volante y el asiento.', 'balanceo', 'La llanta tiembla hasta que le ponemos la pesa'],
  direccion:  ['Dirección', 'Cremallera, terminales y bomba de dirección. Para que el volante responda firme y sin juego.', 'dirección', 'Volante firme y sin juego'],
  frenos:     ['Frenos', 'Balatas, discos y tambores. Si el pedal se va hasta abajo, no manejes: llámanos.', 'frenos', 'Disco y caliper'],
  mecanica:   ['Reparaciones', 'Hacemos reparaciones que en otros lugares no hacen. Cuéntanos la falla y te decimos si la podemos resolver.', 'una reparación', 'Lo que otros no hacen']
};
function servicios(onCambio) {
  const botones = $$('#lista button');
  let espera;
  const elegir = (k, foco) => {
    if (!SERV[k]) return;
    estado.servicio = k;
    const s = SERV[k];
    botones.forEach((b) => { const on = b.dataset.s === k; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && foco) b.focus(); });
    $('#esc-etq').textContent = s[3];
    $('#esc-t').textContent = s[0];
    $('#esc-p').textContent = s[1];
    $('#esc-a').href = enlaces.wa(`Hola, quiero informes de ${s[2]}.`);
    $('#esc-a span').textContent = `Preguntar por ${s[2]}`;
    onCambio && onCambio(k);
  };
  botones.forEach((b, i) => {
    b.addEventListener('click', () => { clearTimeout(espera); elegir(b.dataset.s); });
    b.addEventListener('mouseenter', () => {
      if (!window.matchMedia('(hover: hover)').matches) return;
      clearTimeout(espera); espera = setTimeout(() => elegir(b.dataset.s), 140); // evita cambios al pasar rápido
    });
    b.addEventListener('keydown', (e) => {
      let t = null;
      if (e.key === 'ArrowDown') t = (i + 1) % botones.length;
      if (e.key === 'ArrowUp') t = (i + botones.length - 1) % botones.length;
      if (t !== null) { e.preventDefault(); elegir(botones[t].dataset.s, true); }
    });
  });
}

// ---------- Armador de WhatsApp ----------
function armador() {
  const form = $('#form-msg'); if (!form) return;
  const armar = () => {
    const sint = $$('input[type=checkbox]:checked', form).map((x) => x.value);
    const veh = $('#vehiculo').value.trim();
    const dia = ($('#chips-dia input:checked') || {}).value || 'cuando tengan lugar';
    let t = 'Hola, quiero cotizar en su taller.';
    if (veh) t += `\nMi carro es ${veh}.`;
    if (sint.length) t += `\nLe noto que ${sint.length > 1 ? sint.slice(0, -1).join(', ') + ' y ' + sint[sint.length - 1] : sint[0]}.`;
    t += `\n¿Puedo ir ${dia}?`;
    $('#burbuja').textContent = t;
    $('#enviar').href = enlaces.wa(t);
  };
  form.addEventListener('input', armar);
  form.addEventListener('change', armar);
  form.addEventListener('submit', (e) => e.preventDefault());
  armar();
}

// ---------- Ubicación ----------
function ubicacion() {
  const comp = $('#compartir');
  if (comp) comp.href = enlaces.wa(`Aquí está el taller: ${NEGOCIO.nombre}, ${NEGOCIO.direccion} ${enlaces.mapa()}`);
  const btn = $('#copiar-dir');
  if (btn) btn.addEventListener('click', () => {
    const aviso = $('#aviso');
    try {
      navigator.clipboard.writeText(`${NEGOCIO.nombre}, ${NEGOCIO.direccion}`).then(() => { aviso.hidden = false; setTimeout(() => { aviso.hidden = true; }, 2200); }, () => {});
    } catch (e) { /* sin portapapeles */ }
  });
}

export function iniciarUI({ onServicio } = {}) {
  const anio = $('#anio'); if (anio) anio.textContent = new Date().getFullYear();
  aplicarConfig();
  pintarHorario();
  header();
  servicios(onServicio);
  armador();
  ubicacion();
}
