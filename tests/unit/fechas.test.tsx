import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '@/app/App'
import { borrarTodo, obtenerProyectos } from '@/shared/storage/db'
import { esFutura, hoyISO } from '@/shared/domain/fechas'
import { nuevoInsumo } from '@/shared/domain/factories'
import { importarRespaldo } from '@/shared/storage/backup'
import { nuevoProyectoEnHistorial } from './ayudas'

beforeEach(async () => {
  await borrarTodo()
})

function manana(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

describe('fecha del precio', () => {
  it('formato AAAA-MM-DD y comparación de futuro', () => {
    expect(hoyISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(esFutura(manana())).toBe(true)
    expect(esFutura(hoyISO())).toBe(false)
    expect(esFutura('2000-01-01')).toBe(false)
  })

  it('un renglón nuevo arranca con la fecha de hoy', () => {
    expect(nuevoInsumo('pza').fecha_precio).toBe(hoyISO())
  })

  it('el calendario no permite días posteriores a hoy y no guarda una fecha futura', async () => {
    render(<App />)
    await nuevoProyectoEnHistorial()
    fireEvent.click((await screen.findAllByRole('button', { name: 'APU' }))[0])
    fireEvent.change(await screen.findByLabelText('Nombre'), { target: { value: 'Aplanado' } })
    fireEvent.click(screen.getByRole('button', { name: 'Crear' }))
    fireEvent.click(await screen.findByRole('button', { name: '+ Agregar material' }))

    const campo = (await screen.findByLabelText('Fecha del precio')) as HTMLInputElement
    expect(campo.value).toBe(hoyISO())
    expect(campo.max).toBe(hoyISO())

    fireEvent.change(campo, { target: { value: manana() } })
    await new Promise((r) => setTimeout(r, 50))
    const [p] = await obtenerProyectos()
    expect(p.conceptos[0].materiales[0].fecha_precio).toBe(hoyISO())
  })

  it('la importación rechaza un respaldo con fecha de precio futura', async () => {
    const respaldo = JSON.stringify({
      schema_version: 2,
      formula_version: 1,
      fecha_backup: new Date().toISOString(),
      proyectos: [
        {
          id: 'p1',
          nombre: 'X',
          fecha_creacion: new Date().toISOString(),
          moneda: 'MXN',
          conceptos: [
            {
              id: 'c1',
              nombre: 'C',
              unidad_obra: 'm2',
              materiales: [
                { id: 'i1', descripcion: '', unidad: 'pza', cantidad: 1, costo_unitario: 0, desperdicio_pct: 0, fecha_precio: manana() },
              ],
              mano_obra: [],
              equipo: [],
              tasa_indirectos_pct: 0,
              base_indirectos: 'directo',
              tasa_utilidad_pct: 0,
              base_utilidad: 'directo+indirectos',
            },
          ],
          superficies: [],
        },
      ],
    })
    await expect(importarRespaldo(respaldo)).rejects.toThrow(/estructura/)
  })
})
