import { Proyecto } from '@/shared/domain/types'
import { obtenerProyectos, db, initializeDatabase } from './db'

export interface BackupData {
  version: string
  schema_version: number
  formula_version: number
  fecha_backup: string
  proyectos: Proyecto[]
}

const CURRENT_SCHEMA_VERSION = 1
const CURRENT_FORMULA_VERSION = 1

/**
 * Exporta todos los proyectos a JSON
 */
export async function exportarRespaldo(): Promise<BackupData> {
  const proyectos = await obtenerProyectos()

  return {
    version: '1.0.0',
    schema_version: CURRENT_SCHEMA_VERSION,
    formula_version: CURRENT_FORMULA_VERSION,
    fecha_backup: new Date().toISOString(),
    proyectos,
  }
}

/**
 * Exporta datos como archivo JSON descargable
 */
export async function descargarRespaldo(): Promise<void> {
  const backup = await exportarRespaldo()
  const json = JSON.stringify(backup, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `calculadora-respaldo-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Importa proyectos desde un archivo JSON
 */
export async function importarRespaldo(archivo: File): Promise<{
  proyectos_importados: number
  errores: string[]
}> {
  const text = await archivo.text()
  let data: BackupData

  try {
    data = JSON.parse(text)
  } catch (e) {
    throw new Error('Archivo JSON inválido')
  }

  // Validaciones
  if (!data.proyectos || !Array.isArray(data.proyectos)) {
    throw new Error('Estructura de respaldo inválida: no contiene proyectos')
  }

  if (data.schema_version > CURRENT_SCHEMA_VERSION) {
    throw new Error('Versión de esquema más nueva que la aplicación. Actualiza la app.')
  }

  const errores: string[] = []

  // Importar proyectos
  for (const proyecto of data.proyectos) {
    try {
      // Generar nuevo ID
      const nuevoId = crypto.randomUUID()
      const proyectoNuevo = {
        ...proyecto,
        id: nuevoId,
        fecha_creacion: new Date().toISOString(),
      }

      await db.projects.add(proyectoNuevo)

      // Importar conceptos y superficies relacionados
      if (proyecto.conceptos && proyecto.conceptos.length > 0) {
        for (const concepto of proyecto.conceptos) {
          const conceptoNuevo = {
            ...concepto,
            id: crypto.randomUUID(),
            project_id: nuevoId,
          }
          await db.concepts.add(conceptoNuevo)
        }
      }

      if (proyecto.superficies && proyecto.superficies.length > 0) {
        for (const superficie of proyecto.superficies) {
          const superficiNueva = {
            ...superficie,
            id: crypto.randomUUID(),
            project_id: nuevoId,
          }
          await db.surfaces.add(superficiNueva)
        }
      }
    } catch (e) {
      errores.push(`Error al importar proyecto "${proyecto.nombre}": ${String(e)}`)
    }
  }

  return {
    proyectos_importados: data.proyectos.length - errores.length,
    errores,
  }
}

/**
 * Importa desde input file element
 */
export async function manejarArchivoImportacion(
  event: React.ChangeEvent<HTMLInputElement>,
  callback: (result: { proyectos_importados: number; errores: string[] }) => void
): Promise<void> {
  const archivo = event.target.files?.[0]
  if (!archivo) return

  try {
    const result = await importarRespaldo(archivo)
    callback(result)
  } catch (e) {
    callback({
      proyectos_importados: 0,
      errores: [String(e)],
    })
  }

  // Limpiar input
  event.target.value = ''
}

/**
 * Borra toda la base de datos y reinicializa
 */
export async function borrarTodo(): Promise<void> {
  await db.delete()
  await db.open()
  await initializeDatabase()
}
