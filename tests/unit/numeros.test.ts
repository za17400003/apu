import { describe, it, expect } from 'vitest'
import { validarNumero } from '@/shared/validation/numeros'

describe('validarNumero', () => {
  it('acepta punto o coma decimal', () => {
    expect(validarNumero('0.15')).toEqual({ ok: true, valor: 0.15 })
    expect(validarNumero('1,5')).toEqual({ ok: true, valor: 1.5 })
    expect(validarNumero('5.')).toEqual({ ok: true, valor: 5 })
  })

  it('rechaza vacío, texto y separadores sueltos', () => {
    expect(validarNumero('')).toMatchObject({ ok: false })
    expect(validarNumero('abc')).toMatchObject({ ok: false })
    expect(validarNumero('1,2,3')).toMatchObject({ ok: false })
    expect(validarNumero('.')).toMatchObject({ ok: false })
  })

  it('rechaza negativos con mensaje explícito', () => {
    expect(validarNumero('-2')).toEqual({ ok: false, error: 'No puede ser negativo.' })
  })

  it('aplica máximo, mínimo, positivo y entero', () => {
    expect(validarNumero('150', { min: 0, max: 100 })).toEqual({ ok: false, error: 'Debe ser 100 o menor.' })
    expect(validarNumero('0', { positivo: true })).toEqual({ ok: false, error: 'Debe ser mayor que cero.' })
    expect(validarNumero('2.5', { entero: true })).toEqual({ ok: false, error: 'Debe ser un número entero.' })
    expect(validarNumero('100', { min: 0, max: 100 })).toEqual({ ok: true, valor: 100 })
  })
})
