import Dexie, { Table } from 'dexie'
import { Perfil, Proyecto } from '@/shared/domain/types'

// Nueva base de datos: la v0.1 usaba tablas separadas que la UI no leía.
const NOMBRE_BD = 'CalculadoraAPU-v2'

export class CalculadoraDB extends Dexie {
  projects!: Table<Proyecto, string>
  perfil!: Table<Perfil, string>

  constructor() {
    super(NOMBRE_BD)
    this.version(1).stores({ projects: 'id, fecha_creacion' })
    // v2: perfil del contratista. Los proyectos guardan sus propias partidas.
    this.version(2).stores({ projects: 'id, fecha_creacion', perfil: 'key' })
  }
}

export const db = new CalculadoraDB()

/** Elimina la base de la v0.1 si quedó en este navegador. */
export function limpiarBaseAnterior(): Promise<void> {
  return Dexie.delete('CalculadoraAPU')
}

/** Completa campos que no existían en versiones anteriores del proyecto. */
function normalizar(p: Proyecto): Proyecto {
  return {
    ...p,
    partidas: p.partidas ?? [],
    iva_pct: p.iva_pct ?? 0,
    anticipo_pct: p.anticipo_pct ?? 0,
    vigencia_dias: p.vigencia_dias ?? 15,
  }
}

export async function obtenerProyectos(): Promise<Proyecto[]> {
  const lista = await db.projects.orderBy('fecha_creacion').toArray()
  return lista.map(normalizar)
}

export async function guardarProyecto(proyecto: Proyecto): Promise<void> {
  await db.projects.put(proyecto)
}

export async function eliminarProyecto(id: string): Promise<void> {
  await db.projects.delete(id)
}

export async function borrarTodo(): Promise<void> {
  await db.projects.clear()
}

const PERFIL_VACIO: Perfil = {
  key: 'perfil',
  nombre_comercial: '',
  responsable: '',
  telefono: '',
  direccion: '',
}

export async function obtenerPerfil(): Promise<Perfil> {
  return (await db.perfil.get('perfil')) ?? PERFIL_VACIO
}

export async function guardarPerfil(perfil: Perfil): Promise<void> {
  await db.perfil.put(perfil)
}
