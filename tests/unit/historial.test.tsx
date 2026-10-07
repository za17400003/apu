import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import App from '@/app/App'
import { borrarTodo, guardarProyecto, obtenerProyectos } from '@/shared/storage/db'
import { duplicarProyecto } from '@/shared/domain/duplicar'
import { nuevoConcepto, nuevaPartida, nuevoMuro, nuevoProyecto } from '@/shared/domain/factories'

beforeEach(async () => {
  await borrarTodo()
})

describe('duplicar proyecto', () => {
  it('la copia no comparte identificadores y las partidas apuntan a sus propios conceptos', () => {
    const c = nuevoConcepto('Pintura', 'm2')
    const m = nuevoMuro('Sala')
    const origen = {
      ...nuevoProyecto('Original'),
      conceptos: [c],
      superficies: [m],
      partidas: [{ ...nuevaPartida(c.id), muro_id: m.id }],
      archivado: true,
    }

    const copia = duplicarProyecto(origen, 'Copia')

    expect(copia.id).not.toBe(origen.id)
    expect(copia.nombre).toBe('Copia')
    expect(copia.archivado).toBeUndefined()
    expect(copia.conceptos[0].id).not.toBe(c.id)
    expect(copia.superficies[0].id).not.toBe(m.id)
    expect(copia.partidas[0].concepto_id).toBe(copia.conceptos[0].id)
    expect(copia.partidas[0].muro_id).toBe(copia.superficies[0].id)
    // El original no cambia
    expect(origen.conceptos[0].id).toBe(c.id)
  })
})

describe('historial de proyectos', () => {
  it('crea un proyecto desde el historial y lo abre', async () => {
    render(<App />)
    fireEvent.click((await screen.findAllByRole('button', { name: '+ Nuevo proyecto' }))[0])
    fireEvent.change(await screen.findByLabelText('Nombre del proyecto'), { target: { value: 'Casa García' } })
    fireEvent.click(screen.getByRole('button', { name: 'Crear' }))

    await waitFor(async () => {
      const [p] = await obtenerProyectos()
      expect(p.nombre).toBe('Casa García')
    })
  })

  it('archivar saca el proyecto de Activos y restaurar lo devuelve', async () => {
    await guardarProyecto({ ...nuevoProyecto('Obra vieja') })
    render(<App />)

    fireEvent.click(await screen.findByRole('button', { name: 'Archivar' }))
    await waitFor(async () => {
      const [p] = await obtenerProyectos()
      expect(p.archivado).toBe(true)
    })

    fireEvent.click(screen.getByLabelText(/Archivados/))
    expect(await screen.findByText('Obra vieja')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Restaurar' }))

    await waitFor(async () => {
      const [p] = await obtenerProyectos()
      expect(p.archivado).toBeUndefined()
    })
  })

  it('el buscador filtra por nombre, cliente o folio', async () => {
    await guardarProyecto({ ...nuevoProyecto('Casa García'), cliente: 'Ana' })
    await guardarProyecto({ ...nuevoProyecto('Oficina Centro'), folio: 'COT-9' })
    render(<App />)

    const buscar = await screen.findByLabelText('Buscar por nombre, cliente o folio')
    fireEvent.change(buscar, { target: { value: 'cot-9' } })
    const lista = await screen.findByRole('list')
    expect(within(lista).getByText('Oficina Centro')).toBeTruthy()
    expect(within(lista).queryByText('Casa García')).toBeNull()
  })
})
