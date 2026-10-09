import { describe, it, expect } from 'vitest'
import { geometriaMuro } from '@/shared/domain/croquis'
import { nuevoMuro, nuevaAbertura } from '@/shared/domain/factories'

describe('geometría del croquis', () => {
  it('sin aberturas: solo el rectángulo del muro', () => {
    const muro = { ...nuevoMuro('M'), ancho_m: 5, alto_m: 3 }
    const g = geometriaMuro(muro)
    expect(g.ancho).toBe(5)
    expect(g.alto).toBe(3)
    expect(g.aberturas).toHaveLength(0)
    expect(g.avisos).toHaveLength(0)
  })

  it('una puerta (altura 0) queda centrada y toca el piso', () => {
    const muro = { ...nuevoMuro('M'), ancho_m: 5, alto_m: 3, aberturas: [{ ...nuevaAbertura(), ancho_m: 1, alto_m: 2.1 }] }
    const g = geometriaMuro(muro)
    expect(g.aberturas[0].y).toBe(0)
    expect(g.aberturas[0].x).toBeCloseTo(2, 10) // (5 - 1) / 2 de margen a cada lado
    expect(g.aberturas[0].ajustada).toBe(false)
    expect(g.avisos).toHaveLength(0)
  })

  it('una ventana con altura de antepecho que sí cabe no se ajusta', () => {
    const muro = {
      ...nuevoMuro('M'),
      ancho_m: 4,
      alto_m: 3,
      aberturas: [{ ...nuevaAbertura(), ancho_m: 1.2, alto_m: 1.2, altura_piso_m: 1 }],
    }
    const g = geometriaMuro(muro)
    expect(g.aberturas[0].y).toBe(1)
    expect(g.aberturas[0].alto).toBe(1.2)
    expect(g.aberturas[0].ajustada).toBe(false)
  })

  it('recorta una abertura más alta que el muro y avisa', () => {
    const muro = {
      ...nuevoMuro('M'),
      ancho_m: 4,
      alto_m: 2,
      aberturas: [{ ...nuevaAbertura(), ancho_m: 1, alto_m: 2.5, altura_piso_m: 0 }],
    }
    const g = geometriaMuro(muro)
    expect(g.aberturas[0].alto).toBe(2)
    expect(g.aberturas[0].ajustada).toBe(true)
    expect(g.avisos[0]).toMatch(/recortó/)
  })

  it('una abertura por arriba del muro no se dibuja y avisa', () => {
    const muro = {
      ...nuevoMuro('M'),
      ancho_m: 4,
      alto_m: 2,
      aberturas: [{ ...nuevaAbertura(), ancho_m: 1, alto_m: 0.5, altura_piso_m: 2.2 }],
    }
    const g = geometriaMuro(muro)
    expect(g.aberturas).toHaveLength(0)
    expect(g.avisos[0]).toMatch(/por arriba/)
  })

  it('avisa cuando las aberturas no caben a lo ancho', () => {
    const muro = {
      ...nuevoMuro('M'),
      ancho_m: 2,
      alto_m: 3,
      aberturas: [
        { ...nuevaAbertura(), ancho_m: 1.5, alto_m: 1 },
        { ...nuevaAbertura(), ancho_m: 1.5, alto_m: 1 },
      ],
    }
    const g = geometriaMuro(muro)
    expect(g.avisos.some((a) => a.includes('no caben'))).toBe(true)
  })
})
