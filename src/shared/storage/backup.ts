import { BackupDataSchema } from '@/shared/validation/schemas'
import { nuevoId } from '@/shared/domain/ids'
import { guardarProyecto, obtenerProyectos } from './db'

const VERSION_ESQUEMA = 2
const VERSION_FORMULA = 1

export async function construirRespaldo(): Promise<string> {
  const proyectos = await obtenerProyectos()
  return JSON.stringify(
    {
      app: 'calculadora-apu',
      schema_version: VERSION_ESQUEMA,
      formula_version: VERSION_FORMULA,
      fecha_backup: new Date().toISOString(),
      proyectos,
    },
    null,
    2
  )
}

export async function descargarRespaldo(): Promise<void> {
  const json = await construirRespaldo()
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = `respaldo-apu-${new Date().toISOString().slice(0, 10)}.json`
  enlace.click()
  URL.revokeObjectURL(url)
}

/**
 * Valida y agrega los proyectos de un respaldo como proyectos nuevos.
 * Devuelve cuántos se importaron; lanza Error con mensaje legible si no es válido.
 */
export async function importarRespaldo(texto: string): Promise<number> {
  let json: unknown
  try {
    json = JSON.parse(texto)
  } catch {
    throw new Error('El archivo no es JSON válido.')
  }

  const resultado = BackupDataSchema.safeParse(json)
  if (!resultado.success) {
    const ruta = resultado.error.issues[0]?.path.join('.') || 'raíz'
    throw new Error(`El respaldo no tiene la estructura esperada (campo: ${ruta}).`)
  }
  if (resultado.data.schema_version > VERSION_ESQUEMA) {
    throw new Error('El respaldo es de una versión más nueva de la aplicación.')
  }

  for (const proyecto of resultado.data.proyectos) {
    await guardarProyecto({ ...proyecto, id: nuevoId() })
  }
  return resultado.data.proyectos.length
}
