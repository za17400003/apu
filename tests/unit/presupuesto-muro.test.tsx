import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '@/app/App'
import { borrarTodo, obtenerProyectos } from '@/shared/storage/db'
import { nuevoProyectoEnHistorial } from './ayudas'

beforeEach(async () => {
  await borrarTodo()
})

describe('muros fusionados en Cotización', () => {
  it('ya no existe una sección "Muros" aparte', async () => {
    render(<App />)
    await nuevoProyectoEnHistorial()
    expect(screen.queryByRole('button', { name: 'Muros' })).toBeNull()
  })

  it('elegir "Área neta de un muro" crea el muro, lo expande y el importe se actualiza al medirlo', async () => {
    render(<App />)
    await nuevoProyectoEnHistorial()
    fireEvent.click((await screen.findAllByRole('button', { name: 'APU' }))[0])
    fireEvent.change(await screen.findByLabelText('Nombre'), { target: { value: 'Pintura' } })
    fireEvent.click(screen.getByRole('button', { name: 'Crear' }))
    fireEvent.click(await screen.findByRole('button', { name: '+ Agregar material' }))
    fireEvent.change(screen.getByLabelText('Cantidad', { exact: true }), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText('Costo unitario'), { target: { value: '100' } })

    fireEvent.click((await screen.findAllByRole('button', { name: 'Cotización' }))[0])
    fireEvent.click(await screen.findByRole('button', { name: '+ Agregar partida' }))
    fireEvent.click(screen.getByRole('radio', { name: 'Área neta de un muro' }))

    // Sin muros previos, se crea uno y su editor aparece expandido de una vez.
    const anchoMuro = await screen.findByLabelText('Ancho en metros')
    fireEvent.change(anchoMuro, { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText('Alto en metros'), { target: { value: '2' } })

    // Importe = precio unitario (100) × área neta (4×2 = 8) = 800
    // (aparece dos veces: en la partida y en el documento de impresión, oculto pero no retirado del DOM)
    expect((await screen.findAllByText('$800.00')).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Medido en: Muro 1: 8\.00 m² netos/).length).toBeGreaterThan(0)

    await waitFor(async () => {
      const [p] = await obtenerProyectos()
      expect(p.superficies).toHaveLength(1)
      expect(p.superficies[0].ancho_m).toBe(4)
    })
  })

  it('eliminar el muro desde el editor deja la partida sin cantidad', async () => {
    window.confirm = () => true
    render(<App />)
    await nuevoProyectoEnHistorial()
    fireEvent.click((await screen.findAllByRole('button', { name: 'APU' }))[0])
    fireEvent.change(await screen.findByLabelText('Nombre'), { target: { value: 'Pintura' } })
    fireEvent.click(screen.getByRole('button', { name: 'Crear' }))

    fireEvent.click((await screen.findAllByRole('button', { name: 'Cotización' }))[0])
    fireEvent.click(await screen.findByRole('button', { name: '+ Agregar partida' }))
    fireEvent.click(screen.getByRole('radio', { name: 'Área neta de un muro' }))
    await screen.findByLabelText('Ancho en metros')

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar este muro' }))

    await waitFor(async () => {
      const [p] = await obtenerProyectos()
      expect(p.superficies).toHaveLength(0)
      expect(p.partidas[0].muro_id).toBeUndefined()
    })
  })
})
