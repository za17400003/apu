import { Proyecto } from '@/shared/domain/types'

interface SidebarProps {
  proyectos: Proyecto[]
  proyectoActivo: Proyecto | null
  seccion: string
  onProyectoSelect: (proyecto: Proyecto) => void
  onSeccionSelect: (seccion: any) => void
  onNuevoProyecto: () => void
}

export default function Sidebar({
  proyectos,
  proyectoActivo,
  seccion,
  onProyectoSelect,
  onSeccionSelect,
  onNuevoProyecto,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-charcoal text-warmWhite flex flex-col border-r border-gray-600 hidden-mobile">
      <div className="p-4 border-b border-gray-600">
        <button onClick={onNuevoProyecto} className="btn-primary w-full">
          Nuevo proyecto
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-xs font-bold uppercase text-gray-400 mb-3">Proyectos</h3>
          <div className="space-y-2">
            {proyectos.map((p) => (
              <button
                key={p.id}
                onClick={() => onProyectoSelect(p)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  proyectoActivo?.id === p.id
                    ? 'bg-safetyYellow text-charcoal font-semibold'
                    : 'hover:bg-gray-700'
                }`}
              >
                {p.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-600 space-y-2">
        <h3 className="text-xs font-bold uppercase text-gray-400 mb-3">Navegación</h3>
        {(['proyectos', 'apu', 'superficies', 'ajustes'] as const).map((sec) => (
          <button
            key={sec}
            onClick={() => onSeccionSelect(sec)}
            className={`w-full text-left px-3 py-2 rounded text-sm ${
              seccion === sec ? 'bg-safetyYellow text-charcoal font-semibold' : 'hover:bg-gray-700'
            }`}
          >
            {sec === 'proyectos' && '📋 Proyecto'}
            {sec === 'apu' && '💰 APU'}
            {sec === 'superficies' && '🎯 Superficies'}
            {sec === 'ajustes' && '⚙️ Ajustes'}
          </button>
        ))}
      </div>
    </aside>
  )
}
