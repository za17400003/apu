import { useState } from 'react'
import { Abertura, Proyecto, Superficie } from '@/shared/domain/types'
import { resumenSuperficie } from '@/shared/domain/surfaces'
import { nuevaAbertura, nuevoMuro } from '@/shared/domain/factories'
import { UNIDADES_COMPRA, simboloUnidad } from '@/shared/domain/units'
import { Campo } from '@/shared/ui/Campo'
import { CampoNumero } from '@/shared/ui/CampoNumero'
import { SelectUnidad } from '@/shared/ui/SelectUnidad'
import { FormNuevoElemento } from '@/shared/ui/FormNuevoElemento'

// Reglas por tipo de dato (ver shared/validation/numeros.ts)
const REGLA_MEDIDA = { positivo: true }
const REGLA_PORCENTAJE = { min: 0, max: 100 }

interface Props {
  proyecto: Proyecto
  onCambiar: (p: Proyecto) => void
}

export default function SuperficiesView({ proyecto, onCambiar }: Props) {
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null)
  const [creando, setCreando] = useState(false)

  const muro = proyecto.superficies.find((s) => s.id === seleccionadoId) ?? proyecto.superficies[0]

  const reemplazar = (s: Superficie) =>
    onCambiar({ ...proyecto, superficies: proyecto.superficies.map((x) => (x.id === s.id ? s : x)) })

  const agregar = (s: Superficie) => {
    onCambiar({ ...proyecto, superficies: [...proyecto.superficies, s] })
    setSeleccionadoId(s.id)
    setCreando(false)
  }

  const eliminar = (s: Superficie) => {
    if (!window.confirm(`¿Eliminar el muro "${s.nombre || 'sin nombre'}"?`)) return
    onCambiar({ ...proyecto, superficies: proyecto.superficies.filter((x) => x.id !== s.id) })
    setSeleccionadoId(null)
  }

  if (!muro) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
        <h2 className="text-lg font-semibold">Muros y superficies</h2>
        <p className="text-gray-700">Mide un muro, descuenta puertas y ventanas y calcula cuánto producto necesitas.</p>
        <FormNuevoElemento titulo="Nuevo muro" placeholder="Ej. Muro sala norte" onCrear={(nombre) => agregar(nuevoMuro(nombre))} />
      </div>
    )
  }

  // Los resultados se calculan desde las entradas; un error indica medidas incompletas, no un fallo de la app.
  let resumen: ReturnType<typeof resumenSuperficie> | null = null
  let aviso = ''
  try {
    resumen = resumenSuperficie(muro)
  } catch (e) {
    aviso = e instanceof Error ? e.message : 'Revisa las medidas.'
  }

  const simboloCompra = simboloUnidad(muro.unidad_compra)

  const actualizarAbertura = (i: number, a: Abertura) =>
    reemplazar({ ...muro, aberturas: muro.aberturas.map((x, k) => (k === i ? a : x)) })

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-end gap-3">
        <Campo label="Muro" className="min-w-0 flex-1 md:max-w-md">
          <select className="input-base" value={muro.id} onChange={(e) => setSeleccionadoId(e.target.value)}>
            {proyecto.superficies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre || 'Sin nombre'}
              </option>
            ))}
          </select>
        </Campo>
        <button className="btn-secondary" onClick={() => setCreando((v) => !v)}>
          + Nuevo muro
        </button>
      </div>

      {creando && (
        <FormNuevoElemento
          titulo="Nuevo muro"
          placeholder="Ej. Muro sala norte"
          onCrear={(nombre) => agregar(nuevoMuro(nombre))}
          onCancelar={() => setCreando(false)}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <section className="card space-y-4">
            <div className="flex items-end gap-3">
              <Campo label="Nombre del muro" className="flex-1">
                <input className="input-base" value={muro.nombre} onChange={(e) => reemplazar({ ...muro, nombre: e.target.value })} />
              </Campo>
              <button className="btn-danger btn-small" onClick={() => eliminar(muro)}>
                Eliminar
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Ancho (m)">
                <CampoNumero
                  etiqueta="Ancho en metros"
                  valor={muro.ancho_m}
                  regla={REGLA_MEDIDA}
                  onCambio={(ancho_m) => reemplazar({ ...muro, ancho_m })}
                />
              </Campo>
              <Campo label="Alto (m)">
                <CampoNumero
                  etiqueta="Alto en metros"
                  valor={muro.alto_m}
                  regla={REGLA_MEDIDA}
                  onCambio={(alto_m) => reemplazar({ ...muro, alto_m })}
                />
              </Campo>
            </div>
          </section>

          <section className="card space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold">Aberturas</h2>
              <button
                className="btn-secondary btn-small"
                onClick={() => reemplazar({ ...muro, aberturas: [...muro.aberturas, nuevaAbertura()] })}
              >
                + Agregar abertura
              </button>
            </div>
            {muro.aberturas.length === 0 && <p className="text-sm text-gray-600">Sin puertas ni ventanas.</p>}
            {muro.aberturas.map((a, i) => (
              <div key={a.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
                <Campo label="Ancho (m)">
                  <CampoNumero
                    etiqueta={`Ancho abertura ${i + 1}`}
                    valor={a.ancho_m}
                    regla={REGLA_MEDIDA}
                    onCambio={(ancho_m) => actualizarAbertura(i, { ...a, ancho_m })}
                  />
                </Campo>
                <Campo label="Alto (m)">
                  <CampoNumero
                    etiqueta={`Alto abertura ${i + 1}`}
                    valor={a.alto_m}
                    regla={REGLA_MEDIDA}
                    onCambio={(alto_m) => actualizarAbertura(i, { ...a, alto_m })}
                  />
                </Campo>
                <button
                  aria-label={`Quitar abertura ${i + 1}`}
                  className="btn-danger btn-small"
                  onClick={() => reemplazar({ ...muro, aberturas: muro.aberturas.filter((_, k) => k !== i) })}
                >
                  ✕
                </button>
              </div>
            ))}
          </section>
        </div>

        <div className="space-y-6">
          <section className="card grid gap-3 sm:grid-cols-2">
            <h2 className="font-semibold sm:col-span-2">Producto</h2>
            <Campo label="Acabado o producto" className="sm:col-span-2">
              <input
                className="input-base"
                value={muro.acabado}
                placeholder="Ej. Pintura vinílica mate blanca"
                onChange={(e) => reemplazar({ ...muro, acabado: e.target.value })}
              />
            </Campo>
            <Campo label={`Rendimiento (${simboloCompra} por m²)`}>
              <CampoNumero
                etiqueta="Rendimiento por m²"
                valor={muro.rendimiento}
                regla={REGLA_MEDIDA}
                onCambio={(rendimiento) => reemplazar({ ...muro, rendimiento })}
              />
            </Campo>
            <Campo label="Unidad de compra">
              <SelectUnidad
                opciones={UNIDADES_COMPRA}
                valor={muro.unidad_compra}
                etiqueta="Unidad de compra"
                onCambio={(unidad_compra) => reemplazar({ ...muro, unidad_compra })}
              />
            </Campo>
            <Campo label={`Contenido por envase (${simboloCompra})`}>
              <CampoNumero
                etiqueta="Contenido por envase"
                valor={muro.presentacion_cantidad}
                regla={REGLA_MEDIDA}
                onCambio={(presentacion_cantidad) => reemplazar({ ...muro, presentacion_cantidad })}
              />
            </Campo>
            <Campo label="Desperdicio %">
              <CampoNumero
                etiqueta="Desperdicio del producto"
                valor={muro.desperdicio_pct}
                regla={REGLA_PORCENTAJE}
                onCambio={(desperdicio_pct) => reemplazar({ ...muro, desperdicio_pct })}
              />
            </Campo>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={muro.redondear_envases}
                onChange={(e) => reemplazar({ ...muro, redondear_envases: e.target.checked })}
              />
              Comprar envases completos (redondear hacia arriba)
            </label>
          </section>

          <section className="card space-y-2">
            <h2 className="font-semibold">Resultado</h2>
            {resumen ? (
              <dl className="space-y-1 text-sm">
                <Linea etiqueta="Área bruta" valor={`${resumen.area_bruta.toFixed(2)} m²`} />
                <Linea etiqueta="Aberturas" valor={`− ${resumen.area_aberturas.toFixed(2)} m²`} />
                <Linea etiqueta="Área neta" valor={`${resumen.area_neta.toFixed(2)} m²`} negrita />
                <Linea etiqueta="Producto necesario" valor={`${resumen.cantidad_bruta.toFixed(2)} ${simboloCompra}`} />
                <div className="rounded-md bg-successGreen/20 p-3">
                  <p className="text-sm text-gray-700">Envases a comprar</p>
                  <p className="font-mono text-3xl font-semibold">
                    {muro.redondear_envases ? resumen.cantidad_final : resumen.cantidad_envases.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-700">
                    de {muro.presentacion_cantidad} {simboloCompra}
                  </p>
                </div>
              </dl>
            ) : (
              <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {aviso}
              </p>
            )}
          </section>
        </div>
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
