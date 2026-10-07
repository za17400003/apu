import { useState } from 'react'
import { BaseIndirectos, BaseUtilidad, Concepto, Insumo, Proyecto } from '@/shared/domain/types'
import { calcularCostoInsumo, calcularPrecioUnitario, sumarInsumos } from '@/shared/domain/apu'
import { nuevoConcepto, nuevoInsumo } from '@/shared/domain/factories'
import { UNIDADES_INSUMO, UNIDADES_OBRA, simboloUnidad } from '@/shared/domain/units'
import { formatearMoneda } from '@/shared/domain/rounding'
import { esFutura, hoyISO } from '@/shared/domain/fechas'
import { Campo } from '@/shared/ui/Campo'
import { CampoNumero } from '@/shared/ui/CampoNumero'
import { GrupoRadio } from '@/shared/ui/GrupoRadio'
import { SelectUnidad } from '@/shared/ui/SelectUnidad'
import { FormNuevoElemento } from '@/shared/ui/FormNuevoElemento'

type Grupo = 'materiales' | 'mano_obra' | 'equipo'

const GRUPOS: { id: Grupo; titulo: string; agregar: string; unidadInicial: string }[] = [
  { id: 'materiales', titulo: 'Materiales', agregar: 'Agregar material', unidadInicial: 'pza' },
  { id: 'mano_obra', titulo: 'Mano de obra', agregar: 'Agregar mano de obra', unidadInicial: 'jornada' },
  { id: 'equipo', titulo: 'Equipo y herramienta', agregar: 'Agregar equipo', unidadInicial: 'dia' },
]

const BASES_INDIRECTOS: { valor: BaseIndirectos; etiqueta: string }[] = [
  { valor: 'directo', etiqueta: 'Costo directo' },
  { valor: 'materiales', etiqueta: 'Solo materiales' },
]

const BASES_UTILIDAD: { valor: BaseUtilidad; etiqueta: string }[] = [
  { valor: 'directo+indirectos', etiqueta: 'Costo directo + indirectos' },
  { valor: 'directo', etiqueta: 'Costo directo' },
]

// Reglas por tipo de dato (ver shared/validation/numeros.ts)
const REGLA_CANTIDAD = { positivo: true }
const REGLA_COSTO = { min: 0 }
const REGLA_PORCENTAJE = { min: 0, max: 100 }

interface Props {
  proyecto: Proyecto
  onCambiar: (p: Proyecto) => void
}

export default function ApuView({ proyecto, onCambiar }: Props) {
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null)
  const [creando, setCreando] = useState(false)

  const concepto = proyecto.conceptos.find((c) => c.id === seleccionadoId) ?? proyecto.conceptos[0]

  const reemplazar = (c: Concepto) =>
    onCambiar({ ...proyecto, conceptos: proyecto.conceptos.map((x) => (x.id === c.id ? c : x)) })

  const agregar = (c: Concepto) => {
    onCambiar({ ...proyecto, conceptos: [...proyecto.conceptos, c] })
    setSeleccionadoId(c.id)
    setCreando(false)
  }

  const eliminar = (c: Concepto) => {
    if (!window.confirm(`¿Eliminar el concepto "${c.nombre || 'sin nombre'}"?`)) return
    onCambiar({ ...proyecto, conceptos: proyecto.conceptos.filter((x) => x.id !== c.id) })
    setSeleccionadoId(null)
  }

  if (!concepto) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
        <h2 className="text-lg font-semibold">Conceptos de obra</h2>
        <p className="text-gray-700">Un concepto describe una unidad de obra, por ejemplo “Pintura de muro interior, por m²”.</p>
        <FormNuevoElemento
          titulo="Nuevo concepto"
          placeholder="Ej. Pintura de muro interior"
          unidades={UNIDADES_OBRA}
          unidadInicial="m2"
          onCrear={(nombre, unidad) => agregar(nuevoConcepto(nombre, unidad))}
        />
      </div>
    )
  }

  const resultado = calcularPrecioUnitario(concepto)
  const simbolo = simboloUnidad(concepto.unidad_obra)
  const moneda = proyecto.moneda

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-end gap-3">
        <Campo label="Concepto" className="min-w-0 flex-1 md:max-w-md">
          <select className="input-base" value={concepto.id} onChange={(e) => setSeleccionadoId(e.target.value)}>
            {proyecto.conceptos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre || 'Sin nombre'} · por {simboloUnidad(c.unidad_obra)}
              </option>
            ))}
          </select>
        </Campo>
        <button className="btn-secondary" onClick={() => setCreando((v) => !v)}>
          + Nuevo concepto
        </button>
      </div>

      {creando && (
        <FormNuevoElemento
          titulo="Nuevo concepto"
          placeholder="Ej. Aplanado de muro"
          unidades={UNIDADES_OBRA}
          unidadInicial="m2"
          onCrear={(nombre, unidad) => agregar(nuevoConcepto(nombre, unidad))}
          onCancelar={() => setCreando(false)}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="card grid gap-3 md:grid-cols-[minmax(0,1fr)_16rem]">
            <Campo label="Nombre del concepto">
              <input
                className="input-base"
                value={concepto.nombre}
                placeholder="Ej. Pintura de muro interior"
                aria-invalid={!concepto.nombre.trim()}
                onChange={(e) => reemplazar({ ...concepto, nombre: e.target.value })}
              />
              {!concepto.nombre.trim() && <span className="text-xs text-red-700">Falta el nombre del concepto.</span>}
            </Campo>
            <Campo label="Unidad de obra">
              <SelectUnidad
                opciones={UNIDADES_OBRA}
                valor={concepto.unidad_obra}
                etiqueta="Unidad de obra"
                onCambio={(unidad_obra) => reemplazar({ ...concepto, unidad_obra })}
              />
            </Campo>
            <div className="flex justify-end md:col-span-2">
              <button className="btn-danger btn-small" onClick={() => eliminar(concepto)}>
                Eliminar concepto
              </button>
            </div>
          </section>

          {GRUPOS.map((g) => (
            <GrupoInsumos
              key={g.id}
              titulo={g.titulo}
              agregar={g.agregar}
              insumos={concepto[g.id]}
              unidadInicial={g.unidadInicial}
              moneda={moneda}
              onCambio={(lista) => reemplazar({ ...concepto, [g.id]: lista } as Concepto)}
            />
          ))}
        </div>

        <aside className="card space-y-4 lg:sticky lg:top-4 lg:self-start">
          <h2 className="text-base font-semibold">Precio unitario por {simbolo}</h2>

          <dl className="space-y-1 text-sm">
            <Linea etiqueta="Materiales" valor={formatearMoneda(resultado.materiales, moneda)} />
            <Linea etiqueta="Mano de obra" valor={formatearMoneda(resultado.mano_obra, moneda)} />
            <Linea etiqueta="Equipo" valor={formatearMoneda(resultado.equipo, moneda)} />
            <Linea etiqueta="Costo directo" valor={formatearMoneda(resultado.costo_directo, moneda)} negrita />
          </dl>

          <div className="space-y-3 rounded-md border border-gray-300 p-3">
            <p className="text-sm font-semibold">Indirectos</p>
            <div className="flex items-end gap-2">
              <Campo label="Tasa %" className="w-24">
                <CampoNumero
                  etiqueta="Tasa de indirectos"
                  valor={concepto.tasa_indirectos_pct}
                  regla={REGLA_PORCENTAJE}
                  onCambio={(tasa_indirectos_pct) => reemplazar({ ...concepto, tasa_indirectos_pct })}
                />
              </Campo>
              <p className="flex-1 pb-2 text-right font-mono text-sm">{formatearMoneda(resultado.indirectos, moneda)}</p>
            </div>
            <GrupoRadio<BaseIndirectos>
              legend="Calculados sobre"
              nombre={`base-indirectos-${concepto.id}`}
              opciones={BASES_INDIRECTOS}
              valor={concepto.base_indirectos}
              onCambio={(base_indirectos) => reemplazar({ ...concepto, base_indirectos })}
            />
          </div>

          <div className="space-y-3 rounded-md border border-gray-300 p-3">
            <p className="text-sm font-semibold">Utilidad</p>
            <div className="flex items-end gap-2">
              <Campo label="Tasa %" className="w-24">
                <CampoNumero
                  etiqueta="Tasa de utilidad"
                  valor={concepto.tasa_utilidad_pct}
                  regla={REGLA_PORCENTAJE}
                  onCambio={(tasa_utilidad_pct) => reemplazar({ ...concepto, tasa_utilidad_pct })}
                />
              </Campo>
              <p className="flex-1 pb-2 text-right font-mono text-sm">{formatearMoneda(resultado.utilidad, moneda)}</p>
            </div>
            <GrupoRadio<BaseUtilidad>
              legend="Calculada sobre"
              nombre={`base-utilidad-${concepto.id}`}
              opciones={BASES_UTILIDAD}
              valor={concepto.base_utilidad}
              onCambio={(base_utilidad) => reemplazar({ ...concepto, base_utilidad })}
            />
          </div>

          <div className="rounded-md bg-successGreen/20 p-4">
            <p className="text-sm text-gray-700">Precio unitario</p>
            <p className="font-mono text-3xl font-semibold">{formatearMoneda(resultado.precio_unitario, moneda)}</p>
            <p className="text-sm text-gray-700">por {simbolo}</p>
          </div>
          <p className="text-xs text-gray-600">Para imprimir la cotización, usa la sección Cotización.</p>
        </aside>
      </div>
    </div>
  )
}

function GrupoInsumos({
  titulo,
  agregar,
  insumos,
  unidadInicial,
  moneda,
  onCambio,
}: {
  titulo: string
  agregar: string
  insumos: Insumo[]
  unidadInicial: string
  moneda: string
  onCambio: (lista: Insumo[]) => void
}) {
  return (
    <section className="card space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="font-semibold">{titulo}</h2>
        <span className="font-mono text-sm">{formatearMoneda(sumarInsumos(insumos), moneda)}</span>
      </div>

      {insumos.length === 0 && <p className="text-sm text-gray-600">Sin renglones.</p>}

      {insumos.map((ins, i) => (
        <FilaInsumo
          key={ins.id}
          insumo={ins}
          moneda={moneda}
          onCambio={(nuevo) => onCambio(insumos.map((x, k) => (k === i ? nuevo : x)))}
          onQuitar={() => onCambio(insumos.filter((_, k) => k !== i))}
        />
      ))}

      <button className="btn-secondary btn-small" onClick={() => onCambio([...insumos, nuevoInsumo(unidadInicial)])}>
        + {agregar}
      </button>
    </section>
  )
}

/** Un renglón de precio: el costo se edita aquí mismo, con su fuente y fecha. */
function FilaInsumo({
  insumo,
  moneda,
  onCambio,
  onQuitar,
}: {
  insumo: Insumo
  moneda: string
  onCambio: (i: Insumo) => void
  onQuitar: () => void
}) {
  // Tres líneas con anchos relativos: descripción completa, medidas en una rejilla, fuente y fecha.
  return (
    <div className="space-y-3 rounded-md border border-gray-300 p-3">
      <div className="flex items-end gap-2">
        <Campo label="Descripción" className="min-w-0 flex-1">
          <input
            className="input-base"
            value={insumo.descripcion}
            placeholder="Ej. Pintura látex"
            onChange={(e) => onCambio({ ...insumo, descripcion: e.target.value })}
          />
        </Campo>
        <button aria-label="Quitar renglón" onClick={onQuitar} className="btn-danger btn-small mb-0.5">
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
        <Campo label="Unidad">
          <SelectUnidad
            opciones={UNIDADES_INSUMO}
            valor={insumo.unidad}
            etiqueta="Unidad del renglón"
            onCambio={(unidad) => onCambio({ ...insumo, unidad })}
          />
        </Campo>
        <Campo label="Cantidad">
          <CampoNumero
            etiqueta="Cantidad"
            valor={insumo.cantidad}
            regla={REGLA_CANTIDAD}
            onCambio={(cantidad) => onCambio({ ...insumo, cantidad })}
          />
        </Campo>
        <Campo label={`Costo unit. (${moneda})`}>
          <CampoNumero
            etiqueta="Costo unitario"
            valor={insumo.costo_unitario}
            regla={REGLA_COSTO}
            onCambio={(costo_unitario) => onCambio({ ...insumo, costo_unitario })}
          />
        </Campo>
        <Campo label="Desperdicio %">
          <CampoNumero
            etiqueta="Desperdicio"
            valor={insumo.desperdicio_pct}
            regla={REGLA_PORCENTAJE}
            onCambio={(desperdicio_pct) => onCambio({ ...insumo, desperdicio_pct })}
          />
        </Campo>
        <Campo label="Importe">
          <p className="input-base bg-gray-100 text-right font-mono">{formatearMoneda(calcularCostoInsumo(insumo), moneda)}</p>
        </Campo>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Campo label="Proveedor o fuente del precio" className="md:col-span-2">
          <input
            className="input-base"
            value={insumo.fuente ?? ''}
            placeholder="Ej. Ferretería Centro, lista 2026"
            onChange={(e) => onCambio({ ...insumo, fuente: e.target.value || undefined })}
          />
        </Campo>
        <Campo label="Fecha del precio">
          <input
            type="date"
            className="input-base"
            value={insumo.fecha_precio ?? ''}
            max={hoyISO()}
            aria-describedby={insumo.fecha_precio ? undefined : `sin-fecha-${insumo.id}`}
            onChange={(e) => {
              // Una fecha futura no se acepta: el precio conserva la última fecha válida.
              if (e.target.value && esFutura(e.target.value)) return
              onCambio({ ...insumo, fecha_precio: e.target.value || undefined })
            }}
          />
        </Campo>
        {!insumo.fecha_precio && (
          <p id={`sin-fecha-${insumo.id}`} className="text-xs text-amber-900 md:col-span-3">
            Falta la fecha del precio: no se sabe si sigue vigente.
          </p>
        )}
      </div>
    </div>
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
