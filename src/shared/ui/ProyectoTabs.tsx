import { Proyecto } from '@/shared/domain/types'

/**
 * Pestañas de trabajo: solo los proyectos abiertos recientemente.
 * La pestaña activa es un campo editable para el nombre. Cerrar una pestaña
 * no borra el proyecto; sigue en el historial.
 */
export function ProyectoTabs({
  abiertos,
  activoId,
  onSeleccionar,
  onVerTodos,
  onRenombrar,
  onCerrar,
}: {
  abiertos: Proyecto[]
  activoId: string | null
  onSeleccionar: (id: string) => void
  onVerTodos: () => void
  onRenombrar: (id: string, nombre: string) => void
  onCerrar: (id: string) => void
}) {
  return (
    <div className="flex items-end gap-1 overflow-x-auto px-3 pt-2">
      {abiertos.map((p) =>
        p.id === activoId ? (
          <div
            key={p.id}
            className="flex shrink-0 items-center gap-1 rounded-t-md bg-warmWhite px-3 py-1.5 text-charcoal"
          >
            <NombreProyecto nombre={p.nombre} onGuardar={(nombre) => onRenombrar(p.id, nombre)} />
            <button
              aria-label={`Cerrar pestaña de ${p.nombre || 'proyecto sin nombre'}`}
              onClick={() => onCerrar(p.id)}
              className="rounded px-1.5 text-lg leading-none hover:bg-gray-200"
            >
              ×
            </button>
          </div>
        ) : (
          <button
            key={p.id}
            onClick={() => onSeleccionar(p.id)}
            className="shrink-0 whitespace-nowrap rounded-t-md bg-gray-700 px-3 py-1.5 text-sm text-warmWhite hover:bg-gray-600"
          >
            {p.nombre || 'Sin nombre'}
          </button>
        )
      )}
      <button
        onClick={onVerTodos}
        className="shrink-0 whitespace-nowrap rounded-t-md px-3 py-1.5 text-sm font-semibold text-safetyYellow hover:bg-gray-700"
      >
        Todos los proyectos
      </button>
    </div>
  )
}

// Guarda en cada cambio: no depende de que el campo pierda el foco.
function NombreProyecto({ nombre, onGuardar }: { nombre: string; onGuardar: (n: string) => void }) {
  return (
    <input
      aria-label="Nombre del proyecto"
      placeholder="Nombre del proyecto"
      value={nombre}
      autoFocus={nombre === ''}
      onChange={(e) => onGuardar(e.target.value)}
      className="w-44 rounded bg-transparent px-1 font-semibold outline-none focus:ring-2 focus:ring-safetyYellow"
    />
  )
}
