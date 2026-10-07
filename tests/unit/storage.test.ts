import { describe, it, expect, beforeEach } from 'vitest'
import { borrarTodo, guardarProyecto, obtenerProyectos } from '@/shared/storage/db'
import { construirRespaldo, importarRespaldo } from '@/shared/storage/backup'
import { nuevoConcepto, nuevoInsumo, nuevoMuro, nuevoProyecto } from '@/shared/domain/factories'

beforeEach(async () => {
  await borrarTodo()
})

describe('persistencia de proyectos', () => {
  it('conserva conceptos y muros dentro del proyecto al volver a leerlo', async () => {
    const concepto = nuevoConcepto('Pintura muro', 'm2')
    concepto.materiales.push({ ...nuevoInsumo('L'), descripcion: 'Pintura', cantidad: 0.15, costo_unitario: 400 })
    const muro = { ...nuevoMuro('Sala'), rendimiento: 0.15, unidad_compra: 'L', presentacion_cantidad: 4 }

    await guardarProyecto({ ...nuevoProyecto('Casa García'), conceptos: [concepto], superficies: [muro] })

    const [leido] = await obtenerProyectos()
    expect(leido.nombre).toBe('Casa García')
    expect(leido.conceptos).toHaveLength(1)
    expect(leido.conceptos[0].materiales[0].costo_unitario).toBe(400)
    expect(leido.superficies[0].presentacion_cantidad).toBe(4)
  })

  it('exporta y reimporta un respaldo como proyectos nuevos', async () => {
    await guardarProyecto({ ...nuevoProyecto('Original'), conceptos: [nuevoConcepto('Aplanado', 'm2')] })
    const json = await construirRespaldo()

    await borrarTodo()
    expect(await importarRespaldo(json)).toBe(1)

    const [p] = await obtenerProyectos()
    expect(p.nombre).toBe('Original')
    expect(p.conceptos[0].nombre).toBe('Aplanado')
  })

  it('rechaza archivos que no son respaldos', async () => {
    await expect(importarRespaldo('no es json')).rejects.toThrow(/JSON/)
    await expect(importarRespaldo('{"x":1}')).rejects.toThrow(/estructura/)
  })
})
