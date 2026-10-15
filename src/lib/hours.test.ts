import { describe, expect, it } from 'vitest';
import {
  formatTime,
  getDayRange,
  getHoursSummary,
  getHoursTable,
  getLocalNow,
  getOpenStatus,
  getSchemaOpeningHours,
  toMinutes,
} from './hours';

describe('formatTime', () => {
  it('converts 24 h to 12 h', () => {
    expect(formatTime('08:30')).toBe('8:30 am');
    expect(formatTime('18:30')).toBe('6:30 pm');
    expect(formatTime('12:00')).toBe('12:00 pm');
    expect(formatTime('00:15')).toBe('12:15 am');
  });

  it('omits the period when asked', () => {
    expect(formatTime('14:00', false)).toBe('2:00');
  });
});

describe('schedule text', () => {
  it('groups consecutive days with the same hours', () => {
    expect(getHoursSummary()).toBe('Lun a Vie 8:00–5:30 · Sáb 8:00–1:30');
  });

  it('builds the table starting on Monday', () => {
    const table = getHoursTable();
    expect(table.map((row) => row.day)).toEqual([1, 2, 3, 4, 5, 6, 0]);
    expect(table.at(-1)?.text).toBe('Cerrado');
  });

  it('describes a single day range', () => {
    expect(getDayRange(6)).toBe('8:00 a 1:30');
    expect(getDayRange(0)).toBe('Cerrado');
  });

  it('builds schema.org opening hours', () => {
    expect(getSchemaOpeningHours()).toEqual([
      expect.objectContaining({
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:30',
      }),
      expect.objectContaining({ dayOfWeek: ['Saturday'], opens: '08:00', closes: '13:30' }),
    ]);
  });
});

describe('getLocalNow', () => {
  it('uses Chihuahua time (UTC-6)', () => {
    // Lunes 12 de octubre de 2026, 15:00 UTC = 9:00 en Chihuahua
    expect(getLocalNow(new Date('2026-10-12T15:00:00Z'))).toEqual({ day: 1, minutes: 540 });
  });
});

describe('getOpenStatus', () => {
  it('is open during business hours', () => {
    const status = getOpenStatus({ day: 2, minutes: toMinutes('10:00') });
    expect(status.isOpen).toBe(true);
    expect(status.label).toBe('Abierto ahora · cierra a las 5:30 pm');
  });

  it('says it opens later today before opening time', () => {
    expect(getOpenStatus({ day: 3, minutes: toMinutes('07:00') }).label).toBe(
      'Cerrado · abre hoy a las 8:00 am',
    );
  });

  it('says it opens tomorrow after closing time', () => {
    expect(getOpenStatus({ day: 5, minutes: toMinutes('19:00') }).label).toBe(
      'Cerrado · abre mañana a las 8:00 am',
    );
  });

  it('skips Sunday after Saturday closing', () => {
    expect(getOpenStatus({ day: 6, minutes: toMinutes('15:00') }).label).toBe(
      'Cerrado · abre el lunes a las 8:00 am',
    );
  });

  it('closes exactly at closing time', () => {
    expect(getOpenStatus({ day: 6, minutes: toMinutes('13:30') }).isOpen).toBe(false);
  });
});
