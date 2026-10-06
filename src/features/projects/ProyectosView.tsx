import { Proyecto } from '@/shared/domain/types'
import { actualizarProyecto } from '@/shared/storage/db'
import { useState } from 'react'

interface ProyectosViewProps {
  proyecto: Proyecto
  onActualizar: () => void
}

export default function ProyectosView({ proyecto, onActualizar }: ProyectosViewProps) {
  const [editando, setEditando] = useState(false)
  const [nombre, setNombre] = useState(proyecto.nombre)
  const [ubicacion, setUbicacion] = useState(proyecto.ubicacion || '')
  const [moneda, setMoneda] = useState(proyecto.moneda)
  const [notas, setNotas] = useState(proyecto.notas || '')

  const guardar = async () => {
    await actualizarProyecto({
      ...proyecto,
      nombre,
      ubicacion: ubicacion || undefined,
      moneda,
      notas: notas || undefined,
    })
    setEditando(false)
    onActualizar()
  }

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Proyecto</h2>

      {!editando ? (
        <div className="card space-y-4">
          <div>
            <label className="label-base">Nombre</label>
            <p className="text-lg font-semibold">{proyecto.nombre}</p>
          </div>
          {proyecto.ubicacion && (
            <div>
              <label className="label-base">Ubicación</label>
              <p>{proyecto.ubicacion}</p>
            </div>
          )}
          <div>
            <label className="label-base">Moneda</label>
            <p>{proyecto.moneda}</p>
          </div>
          {proyecto.notas && (
            <div>
              <label className="label-base">Notas</label>
              <p className="text-sm text-gray-600">{proyecto.notas}</p>
            </div>
          )}
          <div className="text-xs text-gray-500">
            Creado: {new Date(proyecto.fecha_creacion).toLocaleString('es-MX')}
          </div>
          <button onClick={() => setEditando(true)} className="btn-secondary">
            Editar
          </button>
        </div>
      ) : (
        <div className="card space-y-4">
          <div>
            <label className="label-base">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input-base"
            />
          </div>
          <div>
            <label className="label-base">Ubicación (opcional)</label>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="input-base"
            />
          </div>
          <div>
            <label className="label-base">Moneda</label>
            <select value={moneda} onChange={(e) => setMoneda(e.target.value)} className="input-base">
              <option>MXN</option>
              <option>USD</option>
              <option>COP</option>
            </select>
          </div>
          <div>
            <label className="label-base">Notas (opcional)</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="input-base h-24"
              placeholder="Anotaciones del proyecto..."
            />
          </div>
          <div className="flex gap-2">
            <button onClick={guardar} className="btn-primary">
              Guardar
            </button>
            <button onClick={() => setEditando(false)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Conceptos: {proyecto.conceptos.length}
        </h3>
        {proyecto.conceptos.length === 0 ? (
          <p className="text-gray-600">Crea tu primer concepto en la sección APU</p>
        ) : (
          <div className="space-y-2">
            {proyecto.conceptos.map((c) => (
              <div key={c.id} className="card flex justify-between items-center">
                <div>
                  <p className="font-semibold">{c.nombre}</p>
                  <p className="text-sm text-gray-600">{c.unidad_obra} - ${c.precio_unitario.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
