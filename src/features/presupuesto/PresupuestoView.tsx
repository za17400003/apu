import { useEffect, useState } from 'react'
import { Partida, Perfil, Proyecto, Superficie } from '@/shared/domain/types'
import { cotizar } from '@/shared/domain/cotizacion'
import { nombreArchivoCotizacion } from '@/shared/domain/archivo'
import { nuevaPartida, nuevoMuro } from '@/shared/domain/factories'
import { formatearMoneda } from '@/shared/domain/rounding'
import { simboloUnidad } from '@/shared/domain/units'
import { obtenerPerfil } from '@/shared/storage/db'
import { Campo } from '@/shared/ui/Campo'
import { CampoNumero } from '@/shared/ui/CampoNumero'
import { GrupoRadio } from '@/shared/ui/GrupoRadio'
import { EditorMuro } from './EditorMuro'
import { CroquisMuro } from './CroquisMuro'
import { EspacioPublicitario } from '@/shared/ui/EspacioPublicitario'
import { CotizacionImpresa } from './CotizacionImpresa'

// Reglas por tipo de dato (ver shared/validation/numeros.ts)
const REGLA_PORCENTAJE = { min: 0, max: 100 }
const REGLA_CANTIDAD = { positivo: true }
const REGLA_DIAS = { min: 0, max: 365, entero: true }

interface Props {
  proyecto: Proyecto
  /** Folio sugerido dinámico; se fija en el proyecto la primera vez que se imprime. */
  folioSugerido: string
  onCambiar: (p: Proyecto) => void
}

export default function PresupuestoView({ proyecto, folioSugerido, onCambiar }: Props) {
  // Una sola partida con su muro expandido a la vez, para no saturar la pantalla.
  const [expandidoId, setExpandidoId] = useState<string | null>(null)
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [anexo, setAnexo] = useState(false)

  useEffect(() => {
    obtenerPerfil().then(setPerfil)
  }, [])

  // Un documento impreso conserva su número: si aún no hay folio fijo, se fija ahora.
  const folio = proyecto.folio || folioSugerido
  const imprimir = () => {
    if (!proyecto.folio) onCambiar({ ...proyecto, folio })

    // El navegador usa el título de la página como nombre sugerido al guardar el PDF.
    const tituloPrevio = document.title
    document.title = nombreArchivoCotizacion(proyecto.nombre, folio)
    const restaurarTitulo = () => {
      document.title = tituloPrevio
      window.removeEventListener('afterprint', restaurarTitulo)
    }
    window.addEventListener('afterprint', restaurarTitulo)

    window.print()
  }

  const cotizacion = cotizar(proyecto)
  const moneda = proyecto.moneda
  const m = (v: number) => formatearMoneda(v, moneda)

  const reemplazarPartida = (p: Partida) =>
    onCambiar({ ...proyecto, partidas: proyecto.partidas.map((x) => (x.id === p.id ? p : x)) })

  const agregar = () => {
    const primero = proyecto.conceptos[0]
    if (!primero) return
    onCambiar({ ...proyecto, partidas: [...proyecto.partidas, nuevaPartida(primero.id)] })
  }

  const quitar = (id: string) => onCambiar({ ...proyecto, partidas: proyecto.partidas.filter((x) => x.id !== id) })

  // Crea un muro y lo asigna a la partida en un solo cambio: si fueran dos llamadas
  // separadas, la segunda pisaría a la primera (ambas parten del mismo `proyecto`).
  const nuevoMuroYAsignar = (partida: Partida) => {
    const muro = nuevoMuro(`Muro ${proyecto.superficies.length + 1}`)
    onCambiar({
      ...proyecto,
      superficies: [...proyecto.superficies, muro],
      partidas: proyecto.partidas.map((p) => (p.id === partida.id ? { ...p, muro_id: muro.id } : p)),
    })
    setExpandidoId(partida.id)
  }

  const cambiarMuro = (muro: Superficie) =>
    onCambiar({ ...proyecto, superficies: proyecto.superficies.map((s) => (s.id === muro.id ? muro : s)) })

  const eliminarMuro = (id: string) => {
    if (!window.confirm('¿Eliminar este muro? Las partidas que lo usan quedarán sin cantidad.')) return
    onCambiar({
      ...proyecto,
      superficies: proyecto.superficies.filter((s) => s.id !== id),
      partidas: proyecto.partidas.map((p) => (p.muro_id === id ? { ...p, muro_id: undefined } : p)),
    })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Cotización</h2>
          <p className="text-sm text-gray-700">
            Cada partida toma un concepto del APU y una cantidad. La cantidad puede escribirse o venir del área neta
            de un muro, que se mide aquí mismo.
          </p>
        </div>
        <button className="btn-primary" onClick={imprimir} disabled={proyecto.partidas.length === 0}>
          Imprimir o guardar PDF
        </button>
      </div>

      {proyecto.conceptos.length === 0 && (
        <p className="card text-sm">Primero crea al menos un concepto en la sección APU.</p>
      )}

      {proyecto.partidas.length === 0 && proyecto.conceptos.length > 0 && (
        <p className="card text-sm text-gray-700">Aún no hay partidas. Agrega la primera.</p>
      )}

      {proyecto.partidas.map((p, i) => (
        <PartidaFila
          key={p.id}
          numero={i + 1}
          partida={p}
          proyecto={proyecto}
          moneda={moneda}
          expandido={expandidoId === p.id}
          onExpandirToggle={() => setExpandidoId((actual) => (actual === p.id ? null : p.id))}
          onCambio={reemplazarPartida}
          onQuitar={() => quitar(p.id)}
          onNuevoMuroYAsignar={() => nuevoMuroYAsignar(p)}
          onCambiarMuro={cambiarMuro}
          onEliminarMuro={eliminarMuro}
          resultado={cotizacion.lineas.find((l) => l.partida_id === p.id) ?? null}
        />
      ))}

      <button className="btn-secondary" onClick={agregar} disabled={proyecto.conceptos.length === 0}>
        + Agregar partida
      </button>

      {cotizacion.partidas_huerfanas > 0 && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {cotizacion.partidas_huerfanas} partida(s) apuntan a un concepto que ya no existe y no se cotizan.
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card space-y-4">
          <h3 className="font-semibold">Condiciones comerciales</h3>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="IVA %">
              <CampoNumero
                etiqueta="IVA en porcentaje"
                valor={proyecto.iva_pct}
                regla={REGLA_PORCENTAJE}
                onCambio={(iva_pct) => onCambiar({ ...proyecto, iva_pct })}
              />
            </Campo>
            <Campo label="Anticipo %">
              <CampoNumero
                etiqueta="Anticipo en porcentaje"
                valor={proyecto.anticipo_pct}
                regla={REGLA_PORCENTAJE}
                onCambio={(anticipo_pct) => onCambiar({ ...proyecto, anticipo_pct })}
              />
            </Campo>
            <Campo label="Vigencia (días)" className="col-span-2">
              <CampoNumero
                etiqueta="Vigencia en días"
                valor={proyecto.vigencia_dias}
                regla={REGLA_DIAS}
                onCambio={(vigencia_dias) => onCambiar({ ...proyecto, vigencia_dias })}
              />
            </Campo>
          </div>
          <p className="text-xs text-gray-600">
            IVA en 0 significa que la cotización no agrega impuestos; el documento lo indica.
          </p>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={anexo} onChange={(e) => setAnexo(e.target.checked)} />
            Incluir anexo con el análisis de precio unitario
          </label>
        </section>

        <section className="card space-y-2">
          <h3 className="font-semibold">Resumen</h3>
          <dl className="space-y-1 text-sm">
            <Linea etiqueta="Subtotal" valor={m(cotizacion.subtotal)} />
            {proyecto.iva_pct > 0 && <Linea etiqueta={`IVA (${proyecto.iva_pct} %)`} valor={m(cotizacion.iva)} />}
            <Linea etiqueta="Total" valor={m(cotizacion.total)} negrita />
            {cotizacion.anticipo > 0 && (
              <Linea etiqueta={`Anticipo (${proyecto.anticipo_pct} %)`} valor={m(cotizacion.anticipo)} />
            )}
          </dl>
          {!perfil?.nombre_comercial && (
            <p className="text-xs text-amber-900">
              Falta el nombre del contratista: el documento saldrá sin él. Complétalo en Ajustes.
            </p>
          )}
        </section>
      </div>

      {/* Lugar apartado para publicidad: lejos de la navegación, fuera del documento impreso. Desactivado. */}
      <EspacioPublicitario nombre="cotizacion-bajo-resumen" />

      {perfil && (
        <div className="area-impresion">
          <CotizacionImpresa proyecto={proyecto} folio={folio} perfil={perfil} cotizacion={cotizacion} anexo={anexo} />
        </div>
      )}
    </div>
  )
}

function PartidaFila({
  numero,
  partida,
  proyecto,
  moneda,
  expandido,
  onExpandirToggle,
  onCambio,
  onQuitar,
  onNuevoMuroYAsignar,
  onCambiarMuro,
  onEliminarMuro,
  resultado,
}: {
  numero: number
  partida: Partida
  proyecto: Proyecto
  moneda: string
  expandido: boolean
  onExpandirToggle: () => void
  onCambio: (p: Partida) => void
  onQuitar: () => void
  onNuevoMuroYAsignar: () => void
  onCambiarMuro: (s: Superficie) => void
  onEliminarMuro: (id: string) => void
  resultado: ReturnType<typeof cotizar>['lineas'][number] | null
}) {
  const concepto = proyecto.conceptos.find((c) => c.id === partida.concepto_id)
  // Con muro_id presente (aunque vacío, si no hay muros) el modo es "muro".
  const modo = partida.muro_id !== undefined ? 'muro' : 'manual'
  const muroActual = proyecto.superficies.find((s) => s.id === partida.muro_id)

  return (
    <section className="card space-y-4">
      <div className="grid gap-3 md:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)_auto]">
        <p className="pt-2 font-mono text-sm text-gray-600">{numero}</p>

        <div className="space-y-3">
          <Campo label="Concepto">
            <select
              className="input-base"
              value={partida.concepto_id}
              onChange={(e) => onCambio({ ...partida, concepto_id: e.target.value })}
            >
              {!concepto && <option value={partida.concepto_id}>Concepto eliminado</option>}
              {proyecto.conceptos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre || 'Sin nombre'} · por {simboloUnidad(c.unidad_obra)}
                </option>
              ))}
            </select>
          </Campo>
          <GrupoRadio<'manual' | 'muro'>
            legend="Cantidad"
            nombre={`modo-${partida.id}`}
            opciones={[
              { valor: 'manual', etiqueta: 'Escribirla' },
              { valor: 'muro', etiqueta: 'Área neta de un muro' },
            ]}
            valor={modo}
            onCambio={(v) => {
              if (v === 'manual') onCambio({ ...partida, muro_id: undefined })
              else if (proyecto.superficies[0]) onCambio({ ...partida, muro_id: proyecto.superficies[0].id })
              else onNuevoMuroYAsignar() // sin muros todavía: crea el primero de una vez
            }}
          />
        </div>

        <div className="space-y-3">
          {modo === 'manual' ? (
            <Campo label={`Cantidad (${simboloUnidad(concepto?.unidad_obra ?? '')})`}>
              <CampoNumero
                etiqueta="Cantidad de obra"
                valor={partida.cantidad}
                regla={REGLA_CANTIDAD}
                onCambio={(cantidad) => onCambio({ ...partida, cantidad })}
              />
            </Campo>
          ) : (
            <>
              <Campo label="Muro">
                <select
                  className="input-base"
                  value={partida.muro_id ?? ''}
                  onChange={(e) => onCambio({ ...partida, muro_id: e.target.value })}
                >
                  {proyecto.superficies.length === 0 && <option value="">Sin muros todavía</option>}
                  {proyecto.superficies.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre || 'Sin nombre'}
                    </option>
                  ))}
                </select>
              </Campo>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-secondary btn-small" onClick={onNuevoMuroYAsignar}>
                  + Nuevo muro
                </button>
                {muroActual && (
                  <button type="button" className="btn-secondary btn-small" onClick={onExpandirToggle}>
                    {expandido ? 'Ocultar edición' : 'Editar muro'}
                  </button>
                )}
              </div>
            </>
          )}

          {resultado && (
            <dl className="space-y-1 text-sm">
              <Linea etiqueta="P. unitario" valor={formatearMoneda(resultado.precio_unitario, moneda)} />
              <Linea etiqueta="Importe" valor={formatearMoneda(resultado.importe, moneda)} negrita />
              {resultado.origen && <p className="text-xs text-gray-700">Medido en: {resultado.origen}</p>}
              {resultado.error && (
                <p role="alert" className="text-xs text-red-800">
                  {resultado.error}
                </p>
              )}
            </dl>
          )}
        </div>

        <button aria-label={`Quitar partida ${numero}`} className="btn-danger btn-small self-start" onClick={onQuitar}>
          ✕
        </button>
      </div>

      {/* El croquis siempre está a la vista; "Editar muro" solo abre el formulario de medidas. */}
      {modo === 'muro' && muroActual && !expandido && (
        <div className="max-w-xs">
          <p className="mb-1 text-xs font-semibold text-gray-700">Croquis</p>
          <CroquisMuro muro={muroActual} />
        </div>
      )}

      {modo === 'muro' && expandido && muroActual && (
        <EditorMuro
          muro={muroActual}
          onCambiar={onCambiarMuro}
          onEliminar={() => onEliminarMuro(muroActual.id)}
        />
      )}
    </section>
  )
}

function Linea({ etiqueta, valor, negrita = false }: { etiqueta: string; valor: string; negrita?: boolean }) {
  return (
    <div className={`flex justify-between gap-2 ${negrita ? 'font-semibold' : ''}`}>
      <dt>{etiqueta}</dt>
      <dd className="font-mono">{valor}</dd>
    </div>
  )
}
