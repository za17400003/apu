// Validación de entradas numéricas. Un valor inválido no se guarda: se explica en el campo.

export interface ReglaNumero {
  min?: number // inclusivo
  max?: number // inclusivo
  positivo?: boolean // estrictamente mayor que cero
  entero?: boolean
}

export type Validado = { ok: true; valor: number } | { ok: false; error: string }

// Dígitos con como máximo un separador decimal (punto o coma). Vacío y separador suelto se tratan aparte.
const FORMATO = /^\d*([.,]\d*)?$/

export function validarNumero(texto: string, regla: ReglaNumero = {}): Validado {
  const t = texto.trim()
  if (t === '') return { ok: false, error: 'Escribe un número.' }
  if (t.startsWith('-')) return { ok: false, error: 'No puede ser negativo.' }
  if (!FORMATO.test(t) || t === '.' || t === ',') {
    return { ok: false, error: 'Usa solo dígitos y un punto o coma decimal.' }
  }

  const valor = Number(t.replace(',', '.'))
  if (!Number.isFinite(valor)) return { ok: false, error: 'Número no válido.' }
  if (regla.entero && !Number.isInteger(valor)) return { ok: false, error: 'Debe ser un número entero.' }
  if (regla.positivo && valor <= 0) return { ok: false, error: 'Debe ser mayor que cero.' }
  if (regla.min !== undefined && valor < regla.min) return { ok: false, error: `Debe ser ${regla.min} o mayor.` }
  if (regla.max !== undefined && valor > regla.max) return { ok: false, error: `Debe ser ${regla.max} o menor.` }
  return { ok: true, valor }
}
