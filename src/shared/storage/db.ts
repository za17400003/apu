import Dexie, { Table } from 'dexie'
import { Proyecto, Concepto, Superficie, Preferencias } from '@/shared/domain/types'

export class CalculadoraDB extends Dexie {
  projects!: Table<Proyecto>
  concepts!: Table<Concepto>
  surfaces!: Table<Superficie>
  preferences!: Table<Preferencias>

  constructor() {
    super('CalculadoraAPU')
    this.version(1).stores({
      projects: '++id, fecha_creacion',
      concepts: '++id, project_id',
      surfaces: '++id, project_id',
      preferences: 'key',
    })
  }
}

export const db = new CalculadoraDB()

// Inicializar preferencias por defecto
export async function initializeDatabase() {
  const prefs = await db.preferences.get('singleton')
  if (!prefs) {
    await db.preferences.put({
      key: 'singleton',
      moneda: 'MXN',
      indirectos_default_pct: 15,
      utilidad_default_pct: 25,
      idioma: 'es',
    })
  }
}

// Operaciones CRUD para Proyectos
export async function crearProyecto(proyecto: Omit<Proyecto, 'id'>): Promise<string> {
  const id = crypto.randomUUID()
  await db.projects.add({ ...proyecto, id })
  return id
}

export async function obtenerProyectos(): Promise<Proyecto[]> {
  return db.projects.toArray()
}

export async function obtenerProyecto(id: string): Promise<Proyecto | undefined> {
  return db.projects.get(id)
}

export async function actualizarProyecto(proyecto: Proyecto): Promise<void> {
  await db.projects.put(proyecto)
}

export async function eliminarProyecto(id: string): Promise<void> {
  await db.projects.delete(id)
  // Eliminar conceptos y superficies relacionados
  const conceptos = await db.concepts.where('project_id').equals(id).toArray()
  for (const c of conceptos) {
    await db.concepts.delete(c.id)
  }
  const superficies = await db.surfaces.where('project_id').equals(id).toArray()
  for (const s of superficies) {
    await db.surfaces.delete(s.id)
  }
}

// Operaciones para Conceptos
export async function crearConcepto(concepto: Omit<Concepto, 'id'>): Promise<string> {
  const id = crypto.randomUUID()
  await db.concepts.add({ ...concepto, id })
  return id
}

export async function obtenerConceptosPorProyecto(project_id: string): Promise<Concepto[]> {
  return db.concepts.where('project_id').equals(project_id).toArray()
}

export async function obtenerConcepto(id: string): Promise<Concepto | undefined> {
  return db.concepts.get(id)
}

export async function actualizarConcepto(concepto: Concepto): Promise<void> {
  await db.concepts.put(concepto)
}

export async function eliminarConcepto(id: string): Promise<void> {
  await db.concepts.delete(id)
}

// Operaciones para Superficies
export async function crearSuperficie(superficie: Omit<Superficie, 'id'>): Promise<string> {
  const id = crypto.randomUUID()
  await db.surfaces.add({ ...superficie, id })
  return id
}

export async function obtenerSuperficiesPorProyecto(project_id: string): Promise<Superficie[]> {
  return db.surfaces.where('project_id').equals(project_id).toArray()
}

export async function obtenerSuperficie(id: string): Promise<Superficie | undefined> {
  return db.surfaces.get(id)
}

export async function actualizarSuperficie(superficie: Superficie): Promise<void> {
  await db.surfaces.put(superficie)
}

export async function eliminarSuperficie(id: string): Promise<void> {
  await db.surfaces.delete(id)
}

// Operaciones para Preferencias
export async function obtenerPreferencias(): Promise<Preferencias | undefined> {
  return db.preferences.get('singleton')
}

export async function actualizarPreferencias(prefs: Preferencias): Promise<void> {
  await db.preferences.put(prefs)
}

// Borrar toda la base de datos
export async function borrarTodo(): Promise<void> {
  await db.delete()
  await db.open()
  await initializeDatabase()
}
