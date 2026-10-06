import { useState } from 'react'
import { Proyecto, Superficie } from '@/shared/domain/types'
import { actualizarSuperficieAreas } from '@/shared/domain/surfaces'
import { calcularCantidadProducto } from '@/shared/domain/quantities'
import { actualizarProyecto, crearSuperficie, actualizarSuperficie } from '@/shared/storage/db'
import { formatearMoneda } from '@/shared/domain/rounding'

interface SuperficiesViewProps {
  proyecto: Proyecto
  onActualizar: () => void
}

export default function SuperficiesView({ proyecto, onActualizar }: SuperficiesViewProps) {
  const [superficieActiva, setSuperficieActiva] = useState<Superficie | null>(
    proyecto.superficies[0] || null
  )

  const crearMuro = async () => {
    const nombre = prompt('Nombre del muro:') || 'Muro'
    const id = await crearSuperficie({
      project_id: proyecto.id,
      nombre,
      ancho_m: 5,
      alto_m: 3,
      aberturas: [],
      area_bruta: 15,
      area_neta: 15,
      acabado: 'Pintura',
      rendimiento: 0.2,
      desperdicio_pct: 10,
      presentacion: '1L',
      cantidad_redondeada: true,
      cantidad_total: 0,
      fecha_actualizacion: new Date().toISOString(),
    })
    onActualizar()
  }

  const actualizarSuperficieGuardada = async (s: Superficie) => {
    const calculada = actualizarSuperficieAreas(s)
    // Recalcular cantidad si hay rendimiento
    if (calculada.rendimiento > 0) {
      const qty = calcularCantidadProducto(
        calculada.area_neta,
        calculada.rendimiento,
        parseFloat(calculada.presentacion) || 1,
        1,
        calculada.desperdicio_pct,
        calculada.cantidad_redondeada
      )
      calculada.cantidad_total = qty.cantidad_final
    }
    await actualizarSuperficie(calculada)
    setSuperficieActiva(calculada)
    onActualizar()
  }

  const agregarAbertura = () => {
    if (!superficieActiva) return
    const nuevaAbertura = {
      id: crypto.randomUUID(),
      ancho_m: 1,
      alto_m: 2,
    }
    const superficie = {
      ...superficieActiva,
      aberturas: [...superficieActiva.aberturas, nuevaAbertura],
    }
    actualizarSuperficieGuardada(superficie)
  }

  if (!superficieActiva) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 mb-4">Sin superficies (muros)</p>
        <button onClick={crearMuro} className="btn-primary">
          Crear muro
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{superficieActiva.nombre}</h2>
        <button onClick={crearMuro} className="btn-secondary btn-small">
          + Nuevo muro
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dimensiones y aberturas */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Dimensiones</h3>
            <div className="space-y-4">
              <div>
                <label className="label-base">Ancho (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={superficieActiva.ancho_m}
                  onChange={(e) => {
                    const superficie = {
                      ...superficieActiva,
                      ancho_m: parseFloat(e.target.value) || 0,
                    }
                    actualizarSuperficieGuardada(superficie)
                  }}
                  className="input-base"
                />
              </div>
              <div>
                <label className="label-base">Alto (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={superficieActiva.alto_m}
                  onChange={(e) => {
                    const superficie = {
                      ...superficieActiva,
                      alto_m: parseFloat(e.target.value) || 0,
                    }
                    actualizarSuperficieGuardada(superficie)
                  }}
                  className="input-base"
                />
              </div>
              <div className="bg-blue-50 p-3 rounded text-sm">
                <p>Área bruta: <strong>{superficieActiva.area_bruta.toFixed(2)} m²</strong></p>
              </div>
            </div>
          </div>

          {/* Aberturas */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Aberturas (puertas, ventanas)</h3>
              <button onClick={agregarAbertura} className="btn-secondary btn-small">
                + Abertura
              </button>
            </div>
            <div className="space-y-3">
              {superficieActiva.aberturas.map((abertura, idx) => (
                <div key={abertura.id} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <input
                      type="number"
                      step="0.1"
                      value={abertura.ancho_m}
                      onChange={(e) => {
                        const aberturas = [...superficieActiva.aberturas]
                        aberturas[idx].ancho_m = parseFloat(e.target.value) || 0
                        const superficie = { ...superficieActiva, aberturas }
                        actualizarSuperficieGuardada(superficie)
                      }}
                      className="input-base text-sm"
                      placeholder="Ancho"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      step="0.1"
                      value={abertura.alto_m}
                      onChange={(e) => {
                        const aberturas = [...superficieActiva.aberturas]
                        aberturas[idx].alto_m = parseFloat(e.target.value) || 0
                        const superficie = { ...superficieActiva, aberturas }
                        actualizarSuperficieGuardada(superficie)
                      }}
                      className="input-base text-sm"
                      placeholder="Alto"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const aberturas = superficieActiva.aberturas.filter((_, i) => i !== idx)
                      const superficie = { ...superficieActiva, aberturas }
                      actualizarSuperficieGuardada(superficie)
                    }}
                    className="btn-danger btn-small"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-green-50 p-3 rounded text-sm">
              <p>Área neta: <strong>{superficieActiva.area_neta.toFixed(2)} m²</strong></p>
            </div>
          </div>
        </div>

        {/* Producto y cantidad */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Producto</h3>
            <div className="space-y-4">
              <div>
                <label className="label-base">Acabado</label>
                <input
                  type="text"
                  value={superficieActiva.acabado}
                  onChange={(e) => {
                    const superficie = { ...superficieActiva, acabado: e.target.value }
                    actualizarSuperficieGuardada(superficie)
                  }}
                  className="input-base"
                  placeholder="Ej: Pintura mate blanca"
                />
              </div>
              <div>
                <label className="label-base">Rendimiento (por m²)</label>
                <input
                  type="number"
                  step="0.01"
                  value={superficieActiva.rendimiento}
                  onChange={(e) => {
                    const superficie = {
                      ...superficieActiva,
                      rendimiento: parseFloat(e.target.value) || 0,
                    }
                    actualizarSuperficieGuardada(superficie)
                  }}
                  className="input-base"
                  placeholder="Ej: 0.15 para L/m²"
                />
              </div>
              <div>
                <label className="label-base">Presentación (unidad)</label>
                <input
                  type="text"
                  value={superficieActiva.presentacion}
                  onChange={(e) => {
                    const superficie = { ...superficieActiva, presentacion: e.target.value }
                    actualizarSuperficieGuardada(superficie)
                  }}
                  className="input-base"
                  placeholder="Ej: 1L, 4L, 20kg"
                />
              </div>
              <div>
                <label className="label-base">Desperdicio (%)</label>
                <input
                  type="number"
                  value={superficieActiva.desperdicio_pct}
                  onChange={(e) => {
                    const superficie = {
                      ...superficieActiva,
                      desperdicio_pct: parseFloat(e.target.value) || 0,
                    }
                    actualizarSuperficieGuardada(superficie)
                  }}
                  className="input-base"
                  placeholder="Ej: 10"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={superficieActiva.cantidad_redondeada}
                  onChange={(e) => {
                    const superficie = {
                      ...superficieActiva,
                      cantidad_redondeada: e.target.checked,
                    }
                    actualizarSuperficieGuardada(superficie)
                  }}
                />
                <span className="text-sm">Redondear hacia arriba</span>
              </label>
            </div>
          </div>

          {/* Resultado */}
          <div className="card bg-successGreen bg-opacity-20">
            <h3 className="text-lg font-semibold mb-4">Cantidad calculada</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Cantidad total:</span>
                <span className="font-mono font-bold text-lg">{superficieActiva.cantidad_total.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-600">
                {superficieActiva.area_neta.toFixed(2)} m² × {superficieActiva.rendimiento} /m² ×
                (1+{superficieActiva.desperdicio_pct}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
