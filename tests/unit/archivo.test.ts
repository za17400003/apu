import { describe, it, expect } from 'vitest'
import { nombreArchivoCotizacion } from '@/shared/domain/archivo'

describe('nombre de archivo de la cotización', () => {
  it('combina nombre y folio', () => {
    expect(nombreArchivoCotizacion('Casa García', 'COT-2026-01')).toBe('Casa García - COT-2026-01')
  })

  it('quita caracteres no válidos en nombres de archivo', () => {
    expect(nombreArchivoCotizacion('Casa/García: remodelación', 'COT-2026-01')).toBe(
      'Casa García remodelación - COT-2026-01'
    )
  })

  it('usa "Proyecto" si no hay nombre', () => {
    expect(nombreArchivoCotizacion('', 'COT-2026-01')).toBe('Proyecto - COT-2026-01')
  })

  it('funciona sin folio', () => {
    expect(nombreArchivoCotizacion('Casa García', '')).toBe('Casa García')
  })
})
