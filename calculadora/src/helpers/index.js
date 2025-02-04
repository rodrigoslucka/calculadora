export const getDaysInMonth = (year, month) => {
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  return lastDayOfMonth;
}

export const formatFecha = fecha => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }

  const startDateParts = fecha.startDate.split('-').map(Number);
  const endDateParts = fecha.endDate.split('-').map(Number);

  // Crear nuevas instancias de Date con el año, mes y día
  const startDate = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2]);
  const endDate = new Date(endDateParts[0], endDateParts[1] - 1, endDateParts[2]);

  const formatPart = (value, singular, plural) => {
    return value > 0 ? `${value} ${value === 1 ? singular : plural}` : null;
  };

  const result = [
    formatPart(fecha.years, 'año', 'años'),
    fecha.years > 0 && (fecha.months > 0 || fecha.days > 0) ? ',' : '',
    formatPart(fecha.months, 'mes', 'meses'),
    fecha.months > 0 && fecha.days > 0 ? ',' : '',
    formatPart(fecha.days, 'día', 'días'),
  ].filter(Boolean).join(' ');

  return `${result} desde el ${startDate.toLocaleDateString('es-ES', options)} al ${endDate.toLocaleDateString('es-ES', options)}`;
}