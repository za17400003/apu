import { useState } from 'react'
import { Proyecto, Concepto, Insumo } from '@/shared/domain/types'
import { actualizarConceptoConCalculos } from '@/shared/domain/apu'
import { actualizarProyecto, crearConcepto } from '@/shared/storage/db'
import { formatearMoneda } from '@/shared/domain/rounding'

interface ApuViewProps {
  proyecto: Proyecto
  onActualizar: () => void
}

export default function ApuView({ proyecto, onActualizar }: ApuViewProps) {
  const [conceptoActivo, setConceptoActivo] = useState<Concepto | null>(
    proyecto.conceptos[0] || null
  )
  const [creando, setCreando] = useState(false)

  const crearConceptoNuevo = async () => {
    const nombre = prompt('Nombre del concepto (ej: Pintura muro interior):')
    if (!nombre) return

    const unidad = prompt('Unidad de obra (ej: m²):') || 'm²'
    const id = await crearConcepto({
      nombre,
      unidad_obra: unidad,
      cantidad_base: 1,
      materiales: [],
      mano_obra: [],
      equipo: [],
      costo_directo: 0,
      tasa_indirectos_pct: 15,
      base_indirectos: 'directo',
      tasa_utilidad_pct: 25,
      base_utilidad: 'directo+indirectos',
      precio_unitario: 0,
      fecha_actualizacion: new Date().toISOString(),
    })

    onActualizar()
  }

  const actualizarConcepto = async (c: Concepto) => {
    const calculado = actualizarConceptoConCalculos(c)
    // Actualizar en el proyecto
    const proyectoActualizado = {
      ...proyecto,
      conceptos: proyecto.conceptos.map((con) => (con.id === c.id ? calculado : con)),
    }
    await actualizarProyecto(proyectoActualizado)
    setConceptoActivo(calculado)
    onActualizar()
  }

  const agregarInsumo = (tipo: 'materiales' | 'mano_obra' | 'equipo') => {
    if (!conceptoActivo) return

    const nuevoInsumo: Insumo = {
      id: crypto.randomUUID(),
      descripcion: 'Nuevo insumo',
      unidad: 'unidad',
      cantidad: 1,
      costo_unitario: 0,
      desperdicio_pct: 0,
    }

    const concepto = {
      ...conceptoActivo,
      [tipo]: [...conceptoActivo[tipo], nuevoInsumo],
    }

    actualizarConcepto(concepto)
  }

  const actualizarInsumo = (
    tipo: 'materiales' | 'mano_obra' | 'equipo',
    index: number,
    insumo: Insumo
  ) => {
    if (!conceptoActivo) return

    const concepto = {
      ...conceptoActivo,
      [tipo]: conceptoActivo[tipo].map((i, idx) => (idx === index ? insumo : i)),
    }

    actualizarConcepto(concepto)
  }

  const eliminarInsumo = (tipo: 'materiales' | 'mano_obra' | 'equipo', index: number) => {
    if (!conceptoActivo) return

    const concepto = {
      ...conceptoActivo,
      [tipo]: conceptoActivo[tipo].filter((_, idx) => idx !== index),
    }

    actualizarConcepto(concepto)
  }

  if (!conceptoActivo) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 mb-4">Sin conceptos</p>
        <button onClick={crearConceptoNuevo} className="btn-primary">
          Crear concepto
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{conceptoActivo.nombre}</h2>
        <button onClick={crearConceptoNuevo} className="btn-secondary btn-small">
          + Nuevo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insumos */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Insumos</h3>

          {/* Materiales */}
          <div className="mb-6">
            <h4 className="font-semibold text-charcoal mb-3">Materiales</h4>
            <div className="space-y-3">
              {conceptoActivo.materiales.map((ins, idx) => (
                <InsumoRow
                  key={idx}
                  insumo={ins}
                  onChange={(updated) => actualizarInsumo('materiales', idx, updated)}
                  onDelete={() => eliminarInsumo('materiales', idx)}
                />
              ))}
            </div>
            <button
              onClick={() => agregarInsumo('materiales')}
              className="btn-secondary btn-small mt-2"
            >
              + Material
            </button>
          </div>

          {/* Mano de obra */}
          <div className="mb-6">
            <h4 className="font-semibold text-charcoal mb-3">Mano de obra</h4>
            <div className="space-y-3">
              {conceptoActivo.mano_obra.map((ins, idx) => (
                <InsumoRow
                  key={idx}
                  insumo={ins}
                  onChange={(updated) => actualizarInsumo('mano_obra', idx, updated)}
                  onDelete={() => eliminarInsumo('mano_obra', idx)}
                />
              ))}
            </div>
            <button
              onClick={() => agregarInsumo('mano_obra')}
              className="btn-secondary btn-small mt-2"
            >
              + Mano de obra
            </button>
          </div>

          {/* Equipo */}
          <div className="mb-6">
            <h4 className="font-semibold text-charcoal mb-3">Equipo/Herramienta</h4>
            <div className="space-y-3">
              {conceptoActivo.equipo.map((ins, idx) => (
                <InsumoRow
                  key={idx}
                  insumo={ins}
                  onChange={(updated) => actualizarInsumo('equipo', idx, updated)}
                  onDelete={() => eliminarInsumo('equipo', idx)}
                />
              ))}
            </div>
            <button
              onClick={() => agregarInsumo('equipo')}
              className="btn-secondary btn-small mt-2"
            >
              + Equipo
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Resultado</h3>
          <div className="card space-y-4 sticky top-6">
            <ResultadoRow
              label="Costo directo"
              valor={conceptoActivo.costo_directo}
              moneda={proyecto.moneda}
            />

            {conceptoActivo.tasa_indirectos_pct > 0 && (
              <div>
                <label className="label-base">Indirectos: {conceptoActivo.tasa_indirectos_pct}%</label>
                <select
                  value={conceptoActivo.base_indirectos}
                  onChange={(e) => {
                    const updated = {
                      ...conceptoActivo,
                      base_indirectos: e.target.value as any,
                    }
                    actualizarConcepto(updated)
                  }}
                  className="input-base text-sm"
                >
                  <option value="directo">Sobre costo directo</option>
                  <option value="materiales">Solo sobre materiales</option>
                </select>
              </div>
            )}

            <div className="border-t pt-4">
              <label className="label-base">
                Utilidad: {conceptoActivo.tasa_utilidad_pct}%
              </label>
              <select
                value={conceptoActivo.base_utilidad}
                onChange={(e) => {
                  const updated = {
                    ...conceptoActivo,
                    base_utilidad: e.target.value as any,
                  }
                  actualizarConcepto(updated)
                }}
                className="input-base text-sm"
              >
                <option value="directo+indirectos">Sobre directo + indirectos</option>
                <option value="directo">Solo sobre directo</option>
              </select>
            </div>

            <div className="border-t pt-4 bg-successGreen bg-opacity-20 p-4 rounded">
              <p className="text-sm text-gray-600">Precio unitario</p>
              <p className="text-2xl font-bold text-charcoal">
                {formatearMoneda(conceptoActivo.precio_unitario, proyecto.moneda)}
              </p>
            </div>

            <button onClick={() => window.print()} className="btn-secondary w-full">
              🖨️ Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InsumoRow({
  insumo,
  onChange,
  onDelete,
}: {
  insumo: Insumo
  onChange: (updated: Insumo) => void
  onDelete: () => void
}) {
  const costo = insumo.cantidad * insumo.costo_unitario * (1 + insumo.desperdicio_pct / 100)

  return (
    <div className="card p-3 space-y-2">
      <input
        type="text"
        value={insumo.descripcion}
        onChange={(e) => onChange({ ...insumo, descripcion: e.target.value })}
        className="input-base text-sm"
        placeholder="Descripción"
      />
      <div className="grid grid-cols-3 gap-2">
        <input
          type="number"
          value={insumo.cantidad}
          onChange={(e) => onChange({ ...insumo, cantidad: parseFloat(e.target.value) || 0 })}
          className="input-base text-sm"
          placeholder="Cant"
        />
        <input
          type="text"
          value={insumo.unidad}
          onChange={(e) => onChange({ ...insumo, unidad: e.target.value })}
          className="input-base text-sm"
          placeholder="Unidad"
        />
        <input
          type="number"
          value={insumo.costo_unitario}
          onChange={(e) =>
            onChange({ ...insumo, costo_unitario: parseFloat(e.target.value) || 0 })
          }
          className="input-base text-sm"
          placeholder="Costo"
        />
      </div>
      <div className="flex justify-between items-center">
        <input
          type="number"
          value={insumo.desperdicio_pct}
          onChange={(e) => onChange({ ...insumo, desperdicio_pct: parseFloat(e.target.value) || 0 })}
          className="input-base text-sm w-24"
          placeholder="Desperdicio %"
        />
        <p className="text-sm font-semibold">${costo.toFixed(2)}</p>
        <button onClick={onDelete} className="btn-danger btn-small">
          ✕
        </button>
      </div>
    </div>
  )
}

function ResultadoRow({
  label,
  valor,
  moneda,
}: {
  label: string
  valor: number
  moneda: string
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b">
      <span className="text-charcoal font-medium">{label}</span>
      <span className="font-mono font-semibold">{formatearMoneda(valor, moneda)}</span>
    </div>
  )
}
