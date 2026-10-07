import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '@/app/App'
import { borrarTodo, obtenerProyectos } from '@/shared/storage/db'
import { nuevoProyectoEnHistorial } from './ayudas'

// Regresión del fallo reportado: el concepto se guardaba pero nunca aparecía.
beforeEach(async () => {
  await borrarTodo()
})

describe('flujo del contratista', () => {
  it('el nombre del proyecto se sincroniza entre la pestaña y Datos del proyecto', async () => {
    render(<App />)
    await nuevoProyectoEnHistorial('Casa García')

    // Desde la pestaña hacia Datos del proyecto
    fireEvent.click((await screen.findAllByRole('button', { name: 'Proyecto' }))[0])
    const enDatos = (await screen.findAllByLabelText('Nombre del proyecto')).find(
      (el) => el.closest('main') !== null
    ) as HTMLInputElement
    expect(enDatos.value).toBe('Casa García')

    // Y desde Datos del proyecto hacia la pestaña
    fireEvent.change(enDatos, { target: { value: 'Casa Ramírez' } })
    const enPestana = (await screen.findAllByLabelText('Nombre del proyecto')).find(
      (el) => el.closest('header') !== null
    ) as HTMLInputElement
    expect(enPestana.value).toBe('Casa Ramírez')
  })

  it('crea un concepto con unidad seleccionable y lo guarda dentro del proyecto', async () => {
    render(<App />)
    await nuevoProyectoEnHistorial('Casa García')
    fireEvent.click((await screen.findAllByRole('button', { name: 'APU' }))[0])
    fireEvent.change(await screen.findByLabelText('Nombre'), { target: { value: 'Pintura muro interior' } })
    fireEvent.click(screen.getByRole('button', { name: 'Crear' }))

    // El concepto aparece en la pantalla, con su unidad en símbolo legible.
    expect(await screen.findByRole('option', { name: /Pintura muro interior · por m²/ })).toBeTruthy()

    await waitFor(async () => {
      const [p] = await obtenerProyectos()
      expect(p.nombre).toBe('Casa García')
      expect(p.conceptos.map((c) => [c.nombre, c.unidad_obra])).toEqual([['Pintura muro interior', 'm2']])
    })
  })

  it('calcula el precio unitario al capturar un renglón con unidad seleccionable', async () => {
    render(<App />)
    await nuevoProyectoEnHistorial()
    fireEvent.click((await screen.findAllByRole('button', { name: 'APU' }))[0])
    fireEvent.change(await screen.findByLabelText('Nombre'), { target: { value: 'Aplanado' } })
    fireEvent.click(screen.getByRole('button', { name: 'Crear' }))

    fireEvent.click(await screen.findByRole('button', { name: '+ Agregar material' }))
    fireEvent.change(await screen.findByLabelText('Cantidad'), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText('Costo unitario'), { target: { value: '150' } })

    // 2 × 150 = 300 de costo directo; sin tasas el precio coincide.
    expect((await screen.findAllByText('$300.00')).length).toBeGreaterThan(0)
    expect((screen.getByLabelText('Unidad del renglón') as HTMLSelectElement).value).toBe('pza')
  })
})
