import { useState } from 'react'
import { Proyecto } from '@/shared/domain/types'
import { borrarTodo } from '@/shared/storage/db'
import { descargarRespaldo, importarRespaldo } from '@/shared/storage/backup'
import { PerfilContratista } from './PerfilContratista'

interface Props {
  proyectos: Proyecto[]
  onRecargar: () => Promise<void>
}

export default function AjustesView({ proyectos, onRecargar }: Props) {
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  const conceptos = proyectos.reduce((n, p) => n + p.conceptos.length, 0)
  const muros = proyectos.reduce((n, p) => n + p.superficies.length, 0)

  const importar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return
    try {
      const n = await importarRespaldo(await archivo.text())
      await onRecargar()
      setMensaje({ tipo: 'ok', texto: `Se importaron ${n} proyecto(s) como nuevos.` })
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err instanceof Error ? err.message : 'No se pudo importar.' })
    }
  }

  const borrar = async () => {
    if (!window.confirm('¿Borrar TODOS los proyectos de este navegador? No se puede deshacer.')) return
    await borrarTodo()
    await onRecargar()
    setMensaje({ tipo: 'ok', texto: 'Todos los datos locales se borraron.' })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      <h2 className="text-lg font-semibold">Ajustes y datos</h2>

      {mensaje && (
        <p
          role="status"
          className={`rounded-md p-3 text-sm ${mensaje.tipo === 'ok' ? 'bg-successGreen/20' : 'bg-red-50 text-red-800'}`}
        >
          {mensaje.texto}
        </p>
      )}

      <PerfilContratista />

      <section className="card space-y-2 text-sm">
        <h3 className="font-semibold">Almacenamiento local</h3>
        <p>
          {proyectos.length} proyecto(s), {conceptos} concepto(s), {muros} muro(s).
        </p>
        <p className="text-gray-600">
          Los datos viven en este navegador. Si borras los datos del navegador, se pierden. Exporta un respaldo con regularidad.
        </p>
      </section>

      <section className="card space-y-3">
        <h3 className="font-semibold">Respaldo</h3>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" onClick={() => descargarRespaldo()}>
            Descargar respaldo (JSON)
          </button>
          <label className="btn-secondary cursor-pointer">
            Importar respaldo
            <input type="file" accept="application/json,.json" onChange={importar} className="sr-only" />
          </label>
        </div>
        <p className="text-xs text-gray-600">Importar agrega los proyectos del archivo como proyectos nuevos; no reemplaza los actuales.</p>
      </section>

      <section className="card space-y-3">
        <h3 className="font-semibold">Borrar datos</h3>
        <button className="btn-danger" onClick={borrar}>
          Borrar todo el almacenamiento local
        </button>
      </section>
    </div>
  )
}
