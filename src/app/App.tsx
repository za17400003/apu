import { useEffect, useState } from 'react'
import { Proyecto } from '@/shared/domain/types'
import { initializeDatabase, obtenerProyectos, crearProyecto } from '@/shared/storage/db'
import Sidebar from '@/shared/ui/Sidebar'
import ProyectosView from '@/features/projects/ProyectosView'
import ApuView from '@/features/unit-prices/ApuView'
import SuperficiesView from '@/features/surfaces/SuperficiesView'
import AjustesView from '@/features/catalog/AjustesView'

type Seccion = 'proyectos' | 'apu' | 'superficies' | 'ajustes'

export default function App() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [proyectoActivo, setProyectoActivo] = useState<Proyecto | null>(null)
  const [seccion, setSeccion] = useState<Seccion>('proyectos')
  const [cargando, setCargando] = useState(true)
  const [esMobil, setEsMobil] = useState(window.innerWidth < 768)

  useEffect(() => {
    initializeDatabase().then(async () => {
      const p = await obtenerProyectos()
      setProyectos(p)
      if (p.length > 0) {
        setProyectoActivo(p[0])
      }
      setCargando(false)
    })

    const handleResize = () => setEsMobil(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const crearNuevoProyecto = async () => {
    const nombre = prompt('Nombre del proyecto:')
    if (!nombre) return

    const id = await crearProyecto({
      nombre,
      fecha_creacion: new Date().toISOString(),
      moneda: 'MXN',
      conceptos: [],
      superficies: [],
    })

    const p = await obtenerProyectos()
    setProyectos(p)
    const nuevoProyecto = p.find((pr) => pr.id === id)
    if (nuevoProyecto) {
      setProyectoActivo(nuevoProyecto)
      setSeccion('apu')
    }
  }

  const actualizarProyectos = async () => {
    const p = await obtenerProyectos()
    setProyectos(p)
  }

  if (cargando) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-warmWhite">
        <div className="text-center">
          <p className="text-charcoal text-lg">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-warmWhite">
      {/* Sidebar - solo desktop */}
      {!esMobil && (
        <Sidebar
          proyectos={proyectos}
          proyectoActivo={proyectoActivo}
          seccion={seccion}
          onProyectoSelect={setProyectoActivo}
          onSeccionSelect={setSeccion}
          onNuevoProyecto={crearNuevoProyecto}
        />
      )}

      {/* Área principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-charcoal text-warmWhite px-4 py-3 flex justify-between items-center border-b border-gray-400">
          <div>
            <h1 className="text-xl font-bold">Calculadora APU</h1>
            {proyectoActivo && <p className="text-sm text-gray-300">{proyectoActivo.nombre}</p>}
          </div>
          <div className="text-xs text-gray-400">Guardado en este dispositivo</div>
        </header>

        {/* Contenido */}
        <div className="flex-1 overflow-auto">
          {!proyectoActivo ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">Sin proyectos</p>
              <button onClick={crearNuevoProyecto} className="btn-primary">
                Crear proyecto
              </button>
            </div>
          ) : (
            <>
              {seccion === 'proyectos' && (
                <ProyectosView
                  proyecto={proyectoActivo}
                  onActualizar={actualizarProyectos}
                />
              )}
              {seccion === 'apu' && (
                <ApuView
                  proyecto={proyectoActivo}
                  onActualizar={actualizarProyectos}
                />
              )}
              {seccion === 'superficies' && (
                <SuperficiesView
                  proyecto={proyectoActivo}
                  onActualizar={actualizarProyectos}
                />
              )}
              {seccion === 'ajustes' && (
                <AjustesView
                  proyectos={proyectos}
                  onActualizar={actualizarProyectos}
                  onNuevoProyecto={crearNuevoProyecto}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer móvil */}
      {esMobil && (
        <nav className="bg-charcoal text-warmWhite flex justify-around border-t border-gray-400">
          {(['proyectos', 'apu', 'superficies', 'ajustes'] as const).map((sec) => (
            <button
              key={sec}
              onClick={() => setSeccion(sec)}
              className={`flex-1 py-3 text-xs font-semibold ${
                seccion === sec ? 'bg-safetyYellow text-charcoal' : 'hover:bg-gray-700'
              }`}
            >
              {sec === 'proyectos' && '📋'}
              {sec === 'apu' && '💰'}
              {sec === 'superficies' && '🎯'}
              {sec === 'ajustes' && '⚙️'}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
