import { useEffect, useState } from 'react'
import { Proyecto } from '@/shared/domain/types'
import { nuevoProyecto } from '@/shared/domain/factories'
import { duplicarProyecto } from '@/shared/domain/duplicar'
import { eliminarProyecto, guardarProyecto, limpiarBaseAnterior, obtenerProyectos } from '@/shared/storage/db'
import { ProyectoTabs } from '@/shared/ui/ProyectoTabs'
import { NavSecciones, Seccion } from '@/shared/ui/NavSecciones'
import { ListaProyectos } from '@/features/proyectos/ListaProyectos'
import ProyectoView from '@/features/projects/ProyectoView'
import ApuView from '@/features/unit-prices/ApuView'
import SuperficiesView from '@/features/surfaces/SuperficiesView'
import PresupuestoView from '@/features/presupuesto/PresupuestoView'
import AjustesView from '@/features/ajustes/AjustesView'

/** Cuántos proyectos caben como pestañas de trabajo. El resto se busca en el historial. */
const MAX_ABIERTOS = 5

export default function App() {
  // null = cargando. Es la única copia en memoria; cada cambio se guarda y se refleja aquí.
  const [proyectos, setProyectos] = useState<Proyecto[] | null>(null)
  const [abiertosIds, setAbiertosIds] = useState<string[]>([]) // más reciente primero
  const [activoId, setActivoId] = useState<string | null>(null)
  const [vista, setVista] = useState<'historial' | 'proyecto' | 'ajustes'>('historial')
  const [seccion, setSeccion] = useState<Seccion>('proyecto')

  useEffect(() => {
    limpiarBaseAnterior().then(async () => {
      setProyectos(await obtenerProyectos())
    })
  }, [])

  const abrir = (id: string) => {
    setActivoId(id)
    setVista('proyecto')
    setSeccion('proyecto')
    setAbiertosIds((previos) => [id, ...previos.filter((x) => x !== id)].slice(0, MAX_ABIERTOS))
  }

  const cerrarPestana = (id: string) => {
    setAbiertosIds((previos) => previos.filter((x) => x !== id))
    if (activoId === id) setVista('historial')
  }

  // Primero se actualiza la pantalla (sin latencia al teclear) y después se persiste.
  const guardar = async (cambiado: Proyecto) => {
    setProyectos((previos) => (previos ?? []).map((p) => (p.id === cambiado.id ? cambiado : p)))
    await guardarProyecto(cambiado)
  }

  const crear = async (nombre: string, desdeId?: string) => {
    const origen = desdeId ? proyectos?.find((p) => p.id === desdeId) : undefined
    const nuevo = origen ? duplicarProyecto(origen, nombre) : nuevoProyecto(nombre)
    setProyectos((previos) => [...(previos ?? []), nuevo])
    abrir(nuevo.id)
    await guardarProyecto(nuevo)
  }

  const duplicar = async (id: string) => {
    const origen = proyectos?.find((p) => p.id === id)
    if (!origen) return
    await crear(`Copia de ${origen.nombre || 'proyecto sin nombre'}`, id)
  }

  const archivar = async (id: string, archivar: boolean) => {
    const p = proyectos?.find((x) => x.id === id)
    if (!p) return
    const cambiado: Proyecto = { ...p, archivado: archivar || undefined }
    await guardar(cambiado)
    if (archivar) cerrarPestana(id)
  }

  const eliminar = async (id: string) => {
    const p = proyectos?.find((x) => x.id === id)
    const nombre = p?.nombre || 'sin nombre'
    if (!window.confirm(`¿Eliminar el proyecto "${nombre}" con todos sus conceptos, muros y partidas?`)) return
    await eliminarProyecto(id)
    setProyectos((previos) => (previos ?? []).filter((x) => x.id !== id))
    setAbiertosIds((previos) => previos.filter((x) => x !== id))
    setVista('historial')
  }

  if (!proyectos) {
    return <div className="flex min-h-screen items-center justify-center bg-warmWhite text-charcoal">Cargando…</div>
  }

  const proyecto = vista === 'proyecto' ? (proyectos.find((p) => p.id === activoId) ?? null) : null
  const abiertos = abiertosIds
    .map((id) => proyectos.find((p) => p.id === id))
    .filter((p): p is Proyecto => !!p && !p.archivado)

  return (
    <div className="flex min-h-screen flex-col bg-warmWhite text-charcoal">
      <header className="bg-charcoal text-warmWhite">
        <div className="flex items-center justify-between px-4 pt-3">
          <h1 className="text-base font-semibold">Calculadora APU</h1>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-gray-300 sm:inline">Guardado en este dispositivo</span>
            <button
              onClick={() => setVista('ajustes')}
              aria-current={vista === 'ajustes' ? 'page' : undefined}
              className="rounded-md px-2 py-1 text-sm font-semibold hover:bg-gray-700"
            >
              Ajustes
            </button>
          </div>
        </div>
        <ProyectoTabs
          abiertos={abiertos}
          activoId={proyecto?.id ?? null}
          onSeleccionar={abrir}
          onVerTodos={() => setVista('historial')}
          onRenombrar={(id, nombre) => {
            const p = proyectos.find((x) => x.id === id)
            if (p) void guardar({ ...p, nombre })
          }}
          onCerrar={cerrarPestana}
        />
      </header>

      {vista === 'ajustes' ? (
        <main className="flex-1 pb-6">
          <AjustesView proyectos={proyectos} onRecargar={async () => setProyectos(await obtenerProyectos())} />
        </main>
      ) : vista === 'historial' || !proyecto ? (
        <main className="flex-1 pb-6">
          <ListaProyectos
            proyectos={proyectos}
            onAbrir={abrir}
            onNuevo={crear}
            onDuplicar={duplicar}
            onArchivar={archivar}
          />
        </main>
      ) : (
        <div className="flex flex-1">
          <NavSecciones seccion={seccion} onCambiar={setSeccion} />
          <main className="min-w-0 flex-1 pb-24 md:pb-6">
            {seccion === 'proyecto' && (
              <ProyectoView
                proyecto={proyecto}
                onCambiar={guardar}
                onEliminar={() => eliminar(proyecto.id)}
                onArchivar={(a) => archivar(proyecto.id, a)}
              />
            )}
            {seccion === 'apu' && <ApuView proyecto={proyecto} onCambiar={guardar} />}
            {seccion === 'superficies' && <SuperficiesView proyecto={proyecto} onCambiar={guardar} />}
            {seccion === 'cotizacion' && <PresupuestoView proyecto={proyecto} onCambiar={guardar} />}
            {seccion === 'ajustes' && (
              <AjustesView proyectos={proyectos} onRecargar={async () => setProyectos(await obtenerProyectos())} />
            )}
          </main>
        </div>
      )}
    </div>
  )
}
