import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '@/app/App'
import { borrarTodo, obtenerProyectos } from '@/shared/storage/db'
import { nuevoProyectoEnHistorial } from './ayudas'

beforeEach(async () => {
  await borrarTodo()
})

/** Crea un proyecto y un concepto, y deja abierto un renglón de material. */
async function conRenglonDeMaterial() {
  render(<App />)
  await nuevoProyectoEnHistorial()
  fireEvent.click((await screen.findAllByRole('button', { name: 'APU' }))[0])
  fireEvent.change(await screen.findByLabelText('Nombre'), { target: { value: 'Aplanado' } })
  fireEvent.click(screen.getByRole('button', { name: 'Crear' }))
  fireEvent.click(await screen.findByRole('button', { name: '+ Agregar material' }))
  await screen.findByLabelText('Desperdicio')
}

async function primerRenglon() {
  const [p] = await obtenerProyectos()
  return p.conceptos[0].materiales[0]
}

describe('entradas: tipos y controles', () => {
  it('rechaza desperdicio mayor que 100 y no lo guarda', async () => {
    await conRenglonDeMaterial()
    fireEvent.change(screen.getByLabelText('Desperdicio'), { target: { value: '150' } })

    expect(await screen.findByText('Debe ser 100 o menor.')).toBeTruthy()
    expect((await primerRenglon()).desperdicio_pct).toBe(0)
  })

  it('rechaza texto en cantidad y mantiene el último valor válido', async () => {
    await conRenglonDeMaterial()
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '2' } })
    await waitFor(async () => expect((await primerRenglon()).cantidad).toBe(2))

    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: 'dos' } })
    expect(await screen.findByText('Usa solo dígitos y un punto o coma decimal.')).toBeTruthy()
    expect((await primerRenglon()).cantidad).toBe(2)
  })

  it('las bases de indirectos son radios y guardan la elección', async () => {
    await conRenglonDeMaterial()
    fireEvent.click(screen.getByRole('radio', { name: 'Solo materiales' }))

    expect((screen.getByRole('radio', { name: 'Solo materiales' }) as HTMLInputElement).checked).toBe(true)
    await waitFor(async () => {
      const [p] = await obtenerProyectos()
      expect(p.conceptos[0].base_indirectos).toBe('materiales')
    })
  })

  it('guarda proveedor y fecha del precio en el mismo renglón', async () => {
    await conRenglonDeMaterial()
    fireEvent.change(screen.getByLabelText('Proveedor o fuente del precio'), {
      target: { value: 'Ferretería Centro' },
    })
    fireEvent.change(screen.getByLabelText('Fecha del precio'), { target: { value: '2026-10-01' } })

    await waitFor(async () => {
      const r = await primerRenglon()
      expect(r.fuente).toBe('Ferretería Centro')
      expect(r.fecha_precio).toBe('2026-10-01')
    })
  })

  it('avisa cuando el precio no tiene fecha', async () => {
    await conRenglonDeMaterial()
    // Un renglón nuevo ya trae la fecha de hoy; el aviso aparece si el usuario la borra.
    fireEvent.change(screen.getByLabelText('Fecha del precio'), { target: { value: '' } })
    expect(await screen.findByText(/Falta la fecha del precio/)).toBeTruthy()
  })
})
