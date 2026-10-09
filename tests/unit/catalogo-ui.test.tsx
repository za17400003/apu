import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '@/app/App'
import { borrarTodo as borrarProyectos } from '@/shared/storage/db'
import { db, guardarEnCatalogo, obtenerCatalogo } from '@/shared/storage/db'
import { nuevoProyectoEnHistorial } from './ayudas'

beforeEach(async () => {
  await borrarProyectos()
  await db.catalogo.clear()
})

async function conCreadoYMaterial() {
  render(<App />)
  await nuevoProyectoEnHistorial()
  fireEvent.click((await screen.findAllByRole('button', { name: 'APU' }))[0])
  fireEvent.change(await screen.findByLabelText('Nombre'), { target: { value: 'Aplanado' } })
  fireEvent.click(screen.getByRole('button', { name: 'Crear' }))
  fireEvent.click(await screen.findByRole('button', { name: '+ Agregar material' }))
}

describe('catálogo desde el APU', () => {
  it('al escribir un insumo ya conocido, autocompleta unidad, costo, proveedor y fecha', async () => {
    await guardarEnCatalogo({
      grupo: 'materiales',
      descripcion: 'Pintura látex',
      unidad: 'L',
      costo_unitario: 400,
      fuente: 'Ferretería Centro',
      fecha_precio: '2026-09-01',
    })

    await conCreadoYMaterial()
    fireEvent.change(await screen.findByLabelText('Descripción'), { target: { value: 'Pintura látex' } })

    expect((screen.getByLabelText('Unidad del renglón') as HTMLSelectElement).value).toBe('L')
    expect((screen.getByLabelText('Costo unitario') as HTMLInputElement).value).toBe('400')
    expect((screen.getByLabelText('Proveedor o fuente del precio') as HTMLInputElement).value).toBe(
      'Ferretería Centro'
    )
    expect((screen.getByLabelText('Fecha del precio') as HTMLInputElement).value).toBe('2026-09-01')
  })

  it('un renglón nuevo con nombre y costo queda guardado en el catálogo al salir del renglón', async () => {
    await conCreadoYMaterial()
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Cemento gris' } })
    const costo = screen.getByLabelText('Costo unitario')
    fireEvent.change(costo, { target: { value: '250' } })
    fireEvent.blur(costo)

    await waitFor(async () => {
      const lista = await obtenerCatalogo('materiales')
      expect(lista.map((i) => i.descripcion)).toContain('Cemento gris')
    })
  })

  it('un segundo renglón sugiere lo guardado por el primero sin tener que esperar', async () => {
    await conCreadoYMaterial()
    fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: 'Arena' } })
    const costo = screen.getByLabelText('Costo unitario')
    fireEvent.change(costo, { target: { value: '80' } })
    // Salir del renglón (blur) justo antes de agregar el siguiente, sin esperar nada: así fallaba antes.
    fireEvent.blur(costo)
    fireEvent.click(screen.getByRole('button', { name: '+ Agregar material' }))

    await waitFor(async () => {
      const lista = await obtenerCatalogo('materiales')
      expect(lista.map((i) => i.descripcion)).toContain('Arena')
    })
  })
})
