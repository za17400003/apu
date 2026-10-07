import { fireEvent, screen } from '@testing-library/react'

/** Crea un proyecto desde el historial (botón + formulario) y espera a que esté abierto. */
export async function nuevoProyectoEnHistorial(nombre = 'Proyecto de prueba') {
  fireEvent.click((await screen.findAllByRole('button', { name: '+ Nuevo proyecto' }))[0])
  fireEvent.change(await screen.findByLabelText('Nombre del proyecto'), { target: { value: nombre } })
  fireEvent.click(screen.getByRole('button', { name: 'Crear' }))
  await screen.findAllByRole('button', { name: 'APU' })
}
