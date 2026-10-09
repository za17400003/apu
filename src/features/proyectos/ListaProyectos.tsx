import { useMemo, useState } from 'react'
import { Proyecto } from '@/shared/domain/types'
import { cotizar } from '@/shared/domain/cotizacion'
import { formatearMoneda } from '@/shared/domain/rounding'
import { Campo } from '@/shared/ui/Campo'
import { GrupoRadio } from '@/shared/ui/GrupoRadio'
import { EspacioPublicitario } from '@/shared/ui/EspacioPublicitario'

type Filtro = 'activos' | 'archivados'
type Orden = 'reciente' | 'nombre'

interface Props {
  proyectos: Proyecto[]
  onAbrir: (id: string) => void
  onNuevo: (nombre: string, desdeId?: string) => void
  onDuplicar: (id: string) => void
  onArchivar: (id: string, archivar: boolean) => void
}

/** Historial de proyectos: buscar, filtrar, ordenar y abrir. Es la entrada principal de la app. */
export function ListaProyectos({ proyectos, onAbrir, onNuevo, onDuplicar, onArchivar }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('activos')
  const [orden, setOrden] = useState<Orden>('reciente')
  const [creando, setCreando] = useState(false)
  const [nombreNuevo, setNombreNuevo] = useState('')
  const [desdeId, setDesdeId] = useState('')
  const [errorNombre, setErrorNombre] = useState('')

  const activos = proyectos.filter((p) => !p.archivado).length
  const archivados = proyectos.length - activos

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    const lista = proyectos.filter((p) => (filtro === 'archivados') === !!p.archivado)
    const coincide = (p: Proyecto) =>
      !q || [p.nombre, p.cliente, p.folio].some((t) => (t ?? '').toLowerCase().includes(q))
    const filtrada = lista.filter(coincide)
    return orden === 'nombre'
      ? filtrada.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || '', 'es'))
      : filtrada.sort((a, b) => b.fecha_creacion.localeCompare(a.fecha_creacion))
  }, [proyectos, busqueda, filtro, orden])

  const enviarAlta = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombreNuevo.trim()) {
      setErrorNombre('Escribe un nombre para el proyecto.')
      return
    }
    onNuevo(nombreNuevo.trim(), desdeId || undefined)
    setNombreNuevo('')
    setDesdeId('')
    setErrorNombre('')
    setCreando(false)
  }

  const sinProyectos = proyectos.length === 0

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Proyectos</h2>
        <button className="btn-primary" onClick={() => setCreando((v) => !v)}>
          + Nuevo proyecto
        </button>
      </div>

      {creando && (
        <form className="card grid gap-3 md:grid-cols-[1fr_16rem_auto] md:items-end" onSubmit={enviarAlta}>
          <Campo label="Nombre del proyecto">
            <input
              autoFocus
              className="input-base"
              value={nombreNuevo}
              placeholder="Ej. Remodelación casa García"
              aria-invalid={!!errorNombre}
              onChange={(e) => {
                setNombreNuevo(e.target.value)
                setErrorNombre('')
              }}
            />
          </Campo>
          <Campo label="Empezar desde">
            <select className="input-base" value={desdeId} onChange={(e) => setDesdeId(e.target.value)}>
              <option value="">Proyecto vacío</option>
              {proyectos
                .filter((p) => !p.archivado)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    Copia de: {p.nombre || 'Sin nombre'}
                  </option>
                ))}
            </select>
          </Campo>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              Crear
            </button>
            <button type="button" className="btn-secondary" onClick={() => setCreando(false)}>
              Cancelar
            </button>
          </div>
          {errorNombre && (
            <p role="alert" className="text-sm text-red-700 md:col-span-3">
              {errorNombre}
            </p>
          )}
        </form>
      )}

      {sinProyectos ? (
        <div className="card space-y-3 p-8 text-center">
          <p className="text-lg">Aún no tienes proyectos.</p>
          <p className="text-sm text-gray-700">Crea el primero para empezar con conceptos, muros y la cotización.</p>
          <button className="btn-primary" onClick={() => setCreando(true)}>
            + Crear el primer proyecto
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-end">
            <Campo label="Buscar por nombre, cliente o folio">
              <input
                type="search"
                className="input-base"
                value={busqueda}
                placeholder="Ej. García, COT-2026"
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </Campo>
            <Campo label="Ordenar por">
              <select className="input-base" value={orden} onChange={(e) => setOrden(e.target.value as Orden)}>
                <option value="reciente">Más recientes</option>
                <option value="nombre">Nombre (A–Z)</option>
              </select>
            </Campo>
            <GrupoRadio<Filtro>
              legend="Mostrar"
              nombre="filtro-proyectos"
              valor={filtro}
              onCambio={setFiltro}
              opciones={[
                { valor: 'activos', etiqueta: `Activos (${activos})` },
                { valor: 'archivados', etiqueta: `Archivados (${archivados})` },
              ]}
            />
          </div>

          {visibles.length === 0 ? (
            <p className="card text-sm text-gray-700">
              {busqueda
                ? `Ningún proyecto coincide con «${busqueda}».`
                : filtro === 'archivados'
                  ? 'No tienes proyectos archivados.'
                  : 'No hay proyectos activos.'}
            </p>
          ) : (
            <ul className="space-y-2">
              {visibles.map((p) => {
                const total = cotizar(p).total
                return (
                  <li key={p.id} className="card grid gap-3 md:grid-cols-[minmax(0,1fr)_9rem_auto] md:items-center">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{p.nombre || 'Sin nombre'}</p>
                      <p className="truncate text-sm text-gray-700">
                        {[p.cliente, p.folio, new Date(p.fecha_creacion).toLocaleDateString('es-MX')]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                    <p className="font-mono text-sm md:text-right">{formatearMoneda(total, p.moneda)}</p>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {!p.archivado && (
                        <button className="btn-primary btn-small" onClick={() => onAbrir(p.id)}>
                          Abrir
                        </button>
                      )}
                      <button className="btn-secondary btn-small" onClick={() => onDuplicar(p.id)}>
                        Duplicar
                      </button>
                      <button className="btn-secondary btn-small" onClick={() => onArchivar(p.id, !p.archivado)}>
                        {p.archivado ? 'Restaurar' : 'Archivar'}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}

      {/* Lugar apartado para publicidad: al pie del historial, lejos de la navegación. Desactivado. */}
      <EspacioPublicitario nombre="historial-pie" />
    </div>
  )
}
