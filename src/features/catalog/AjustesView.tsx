import { Proyecto } from '@/shared/domain/types'
import { borrarTodo, descargarRespaldo } from '@/shared/storage/backup'
import { manejarArchivoImportacion } from '@/shared/storage/backup'
import { useState } from 'react'

interface AjustesViewProps {
  proyectos: Proyecto[]
  onActualizar: () => void
  onNuevoProyecto: () => void
}

export default function AjustesView({ proyectos, onActualizar, onNuevoProyecto }: AjustesViewProps) {
  const [mensaje, setMensaje] = useState('')
  const [importando, setImportando] = useState(false)

  const handleExportar = async () => {
    try {
      await descargarRespaldo()
      setMensaje('✓ Respaldo descargado exitosamente')
      setTimeout(() => setMensaje(''), 3000)
    } catch (e) {
      setMensaje('✗ Error al descargar: ' + String(e))
    }
  }

  const handleImportar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportando(true)
    try {
      await manejarArchivoImportacion(event, (result) => {
        if (result.errores.length === 0) {
          setMensaje(`✓ ${result.proyectos_importados} proyecto(s) importado(s)`)
          onActualizar()
        } else {
          setMensaje(`⚠ ${result.proyectos_importados} importado(s), ${result.errores.length} error(es)`)
        }
        setTimeout(() => setMensaje(''), 3000)
        setImportando(false)
      })
    } catch (e) {
      setMensaje('✗ Error al importar: ' + String(e))
      setImportando(false)
    }
  }

  const handleBorrarTodo = async () => {
    if (!window.confirm('¿Borrar TODOS los datos? Esta acción no se puede deshacer.')) return

    try {
      await borrarTodo()
      setMensaje('✓ Todos los datos han sido borrados')
      onActualizar()
      setTimeout(() => onNuevoProyecto(), 1000)
    } catch (e) {
      setMensaje('✗ Error al borrar: ' + String(e))
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Ajustes</h2>

      {mensaje && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded text-sm">
          {mensaje}
        </div>
      )}

      {/* Estado del almacenamiento */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Almacenamiento local</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Proyectos guardados: <strong>{proyectos.length}</strong></p>
          <p>Total de conceptos: <strong>{proyectos.reduce((sum, p) => sum + p.conceptos.length, 0)}</strong></p>
          <p>Total de superficies: <strong>{proyectos.reduce((sum, p) => sum + p.superficies.length, 0)}</strong></p>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Los datos se guardan en tu navegador. Si limpias los datos del navegador, se perderán todos los proyectos.
        </p>
      </div>

      {/* Respaldo y restauración */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Respaldo y restauración</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Descarga un respaldo de todos tus proyectos en formato JSON
            </p>
            <button onClick={handleExportar} className="btn-primary">
              📥 Descargar respaldo
            </button>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Restaura proyectos desde un respaldo anterior
            </p>
            <label className="btn-secondary inline-block cursor-pointer">
              📤 Importar respaldo
              <input
                type="file"
                accept=".json"
                onChange={handleImportar}
                disabled={importando}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Datos */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Datos</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Borra todos los proyectos, conceptos y superficies. No se puede deshacer.
            </p>
            <button onClick={handleBorrarTodo} className="btn-danger">
              🗑️ Borrar todo
            </button>
          </div>
        </div>
      </div>

      {/* Información */}
      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-700">
        <h3 className="font-semibold mb-2">Privacidad</h3>
        <p className="text-xs mb-3">
          Todos tus datos se guardan localmente en tu navegador. No se envía información a servidores.
        </p>
        <p className="text-xs">
          Versión: 0.1.0 | Documento de privacidad: Consulta docs/05-datos-locales-y-privacidad.md
        </p>
      </div>
    </div>
  )
}
