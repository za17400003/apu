// Nombre sugerido para "Guardar como PDF": los navegadores usan document.title
// como nombre de archivo por defecto en el diálogo de impresión.

function limpiar(texto: string): string {
  return texto
    .replace(/[\\/:*?"<>|]+/g, ' ') // caracteres no válidos en nombres de archivo
    .replace(/\s+/g, ' ')
    .trim()
}

export function nombreArchivoCotizacion(nombre: string, folio: string): string {
  const partes = [limpiar(nombre) || 'Proyecto', limpiar(folio)].filter(Boolean)
  return partes.join(' - ')
}
