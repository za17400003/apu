// Fechas en formato AAAA-MM-DD según la hora local del equipo.
// Usar toISOString() daría la fecha en UTC, que puede ser un día distinto en México por la noche.

export function hoyISO(): string {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

/** true si la fecha (AAAA-MM-DD) es posterior a hoy. El formato ordena bien como texto. */
export function esFutura(fecha: string): boolean {
  return fecha > hoyISO()
}
