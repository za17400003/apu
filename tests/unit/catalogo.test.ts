import { describe, it, expect, beforeEach } from 'vitest'
import { db, guardarEnCatalogo, obtenerCatalogo } from '@/shared/storage/db'

beforeEach(async () => {
  await db.catalogo.clear()
})

describe('catálogo de insumos', () => {
  it('guarda un insumo nuevo y se puede recuperar por grupo', async () => {
    await guardarEnCatalogo({ grupo: 'materiales', descripcion: 'Pintura látex', unidad: 'L', costo_unitario: 400 })

    const lista = await obtenerCatalogo('materiales')
    expect(lista).toHaveLength(1)
    expect(lista[0].descripcion).toBe('Pintura látex')
    expect(lista[0].costo_unitario).toBe(400)
  })

  it('no duplica por mayúsculas o espacios distintos: actualiza el mismo registro', async () => {
    await guardarEnCatalogo({ grupo: 'materiales', descripcion: 'Pintura látex', unidad: 'L', costo_unitario: 400 })
    await guardarEnCatalogo({ grupo: 'materiales', descripcion: '  PINTURA LÁTEX  ', unidad: 'L', costo_unitario: 420 })

    const lista = await obtenerCatalogo('materiales')
    expect(lista).toHaveLength(1)
    expect(lista[0].costo_unitario).toBe(420)
  })

  it('el mismo nombre en grupos distintos no se mezcla', async () => {
    await guardarEnCatalogo({ grupo: 'materiales', descripcion: 'Andamio', unidad: 'pza', costo_unitario: 50 })
    await guardarEnCatalogo({ grupo: 'equipo', descripcion: 'Andamio', unidad: 'dia', costo_unitario: 120 })

    expect(await obtenerCatalogo('materiales')).toHaveLength(1)
    expect(await obtenerCatalogo('equipo')).toHaveLength(1)
    expect((await obtenerCatalogo('mano_obra'))).toHaveLength(0)
  })

  it('ignora una descripción vacía: no guarda nada', async () => {
    await guardarEnCatalogo({ grupo: 'materiales', descripcion: '   ', unidad: 'pza', costo_unitario: 10 })
    expect(await obtenerCatalogo('materiales')).toHaveLength(0)
  })
})
