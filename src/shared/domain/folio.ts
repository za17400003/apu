// Folios de cotización: COT-AAAA-NN, con NN consecutivo dentro de cada año.
// Se cuentan todos los proyectos, archivados incluidos, para no repetir números.

import { Proyecto } from './types'

const PATRON = /^COT-(\d{4})-(\d+)$/

/** Siguiente folio sugerido para el año dado: COT-2026-01, COT-2026-02, … */
export function siguienteFolio(proyectos: Proyecto[], anio = new Date().getFullYear()): string {
  let mayor = 0
  for (const p of proyectos) {
    const m = PATRON.exec((p.folio ?? '').trim())
    if (m && Number(m[1]) === anio) mayor = Math.max(mayor, Number(m[2]))
  }
  const siguiente = mayor + 1
  return `COT-${anio}-${String(siguiente).padStart(2, '0')}`
}

/** true si el folio ya lo usa otro proyecto (sin distinguir mayúsculas ni espacios). */
export function folioEnUso(folio: string, otrosFolios: string[]): boolean {
  const normal = (s: string) => s.trim().toUpperCase()
  return folio.trim() !== '' && otrosFolios.some((f) => normal(f) === normal(folio))
}
