export function getDiff(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const [start, end] = d1 <= d2 ? [d1, d2] : [d2, d1];
  const isPast = d1 > d2;

  let years  = end.getFullYear() - start.getFullYear();
  let months = end.getMonth()    - start.getMonth();
  let days   = end.getDate()     - start.getDate();

  if (days < 0) {
    months--;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  if (months < 0) { years--; months += 12; }

  const totalMs      = end - start;
  const totalDays    = Math.floor(totalMs / 86400000);
  const totalWeeks   = Math.floor(totalDays / 7);
  const totalHours   = Math.floor(totalMs / 3600000);
  const totalMinutes = Math.floor(totalMs / 60000);
  const totalSeconds = Math.floor(totalMs / 1000);

  return { years, months, days, totalDays, totalWeeks, totalHours, totalMinutes, totalSeconds, isPast };
}

export function offsetDate(dateStr, amount, unit, dir) {
  const d = new Date(dateStr + 'T00:00:00');
  const n = dir === '-' ? -Math.abs(amount) : Math.abs(amount);
  switch (unit) {
    case 'days':    d.setDate(d.getDate() + n);           break;
    case 'weeks':   d.setDate(d.getDate() + n * 7);       break;
    case 'months':  d.setMonth(d.getMonth() + n);         break;
    case 'years':   d.setFullYear(d.getFullYear() + n);   break;
    case 'hours':   d.setHours(d.getHours() + n);         break;
    case 'minutes': d.setMinutes(d.getMinutes() + n);     break;
  }
  return d;
}

export function getCountdown(targetStr) {
  const diff = new Date(targetStr) - new Date();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  };
}

export function fmt(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function toInput(date) {
  return date.toISOString().split('T')[0];
}

export function today() {
  return toInput(new Date());
}

export function n(num) {
  return num.toLocaleString();
}
