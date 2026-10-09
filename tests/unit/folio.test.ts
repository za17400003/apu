import { describe, it, expect } from 'vitest'
import { folioEnUso, siguienteFolio } from '@/shared/domain/folio'
import { duplicarProyecto } from '@/shared/domain/duplicar'
import { nuevoProyecto } from '@/shared/domain/factories'

describe('folio de cotización', () => {
  it('sugiere COT-AAAA-01 cuando no hay folios de ese año', () => {
    expect(siguienteFolio([], 2026)).toBe('COT-2026-01')
  })

  it('continúa desde el mayor número del año, ignorando otros años y formatos ajenos', () => {
    const proyectos = [
      { ...nuevoProyecto('A'), folio: 'COT-2026-01' },
      { ...nuevoProyecto('B'), folio: 'COT-2026-05' },
      { ...nuevoProyecto('C'), folio: 'COT-2025-40' },
      { ...nuevoProyecto('D'), folio: 'MI-SISTEMA-7' },
    ]
    expect(siguienteFolio(proyectos, 2026)).toBe('COT-2026-06')
  })

  it('es dinámico: crear otro proyecto con folio avanza la sugerencia', () => {
    const antes = [{ ...nuevoProyecto('A'), folio: 'COT-2026-01' }]
    const despues = [...antes, { ...nuevoProyecto('B'), folio: 'COT-2026-02' }]
    expect(siguienteFolio(antes, 2026)).toBe('COT-2026-02')
    expect(siguienteFolio(despues, 2026)).toBe('COT-2026-03')
  })

  it('detecta folios repetidos sin distinguir mayúsculas ni espacios', () => {
    expect(folioEnUso(' cot-2026-01 ', ['COT-2026-01'])).toBe(true)
    expect(folioEnUso('COT-2026-02', ['COT-2026-01'])).toBe(false)
    expect(folioEnUso('', [''])).toBe(false)
  })

  it('una copia de proyecto no hereda el folio del original', () => {
    const origen = { ...nuevoProyecto('Original'), folio: 'COT-2026-01' }
    expect(duplicarProyecto(origen, 'Copia').folio).toBeUndefined()
  })
})
