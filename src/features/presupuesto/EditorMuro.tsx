import { Abertura, Superficie } from '@/shared/domain/types'
import { nuevaAbertura } from '@/shared/domain/factories'
import { resumenSuperficie } from '@/shared/domain/surfaces'
import { Campo } from '@/shared/ui/Campo'
import { CampoNumero } from '@/shared/ui/CampoNumero'
import { CroquisMuro } from './CroquisMuro'

const REGLA_MEDIDA = { positivo: true }
const REGLA_DESDE_PISO = { min: 0 }

/** Editor completo de un muro (medidas, aberturas, croquis), pensado para ir dentro de una partida. */
export function EditorMuro({
  muro,
  onCambiar,
  onEliminar,
}: {
  muro: Superficie
  onCambiar: (s: Superficie) => void
  onEliminar: () => void
}) {
  let aviso = ''
  try {
    resumenSuperficie(muro)
  } catch (e) {
    aviso = e instanceof Error ? e.message : 'Revisa las medidas.'
  }

  const actualizarAbertura = (i: number, a: Abertura) =>
    onCambiar({ ...muro, aberturas: muro.aberturas.map((x, k) => (k === i ? a : x)) })

  return (
    <div className="space-y-4 rounded-md border border-gray-300 bg-warmWhite p-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo label="Nombre del muro">
          <input
            className="input-base"
            value={muro.nombre}
            onChange={(e) => onCambiar({ ...muro, nombre: e.target.value })}
          />
        </Campo>
        <Campo label="Acabado o producto (opcional)">
          <input
            className="input-base"
            value={muro.acabado}
            placeholder="Ej. Pintura vinílica mate blanca"
            onChange={(e) => onCambiar({ ...muro, acabado: e.target.value })}
          />
        </Campo>
        <Campo label="Ancho (m)">
          <CampoNumero
            etiqueta="Ancho en metros"
            valor={muro.ancho_m}
            regla={REGLA_MEDIDA}
            onCambio={(ancho_m) => onCambiar({ ...muro, ancho_m })}
          />
        </Campo>
        <Campo label="Alto (m)">
          <CampoNumero
            etiqueta="Alto en metros"
            valor={muro.alto_m}
            regla={REGLA_MEDIDA}
            onCambio={(alto_m) => onCambiar({ ...muro, alto_m })}
          />
        </Campo>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold">Aberturas (puertas, ventanas)</p>
          <button
            type="button"
            className="btn-secondary btn-small"
            onClick={() => onCambiar({ ...muro, aberturas: [...muro.aberturas, nuevaAbertura()] })}
          >
            + Agregar abertura
          </button>
        </div>
        {muro.aberturas.length === 0 && <p className="text-xs text-gray-600">Sin puertas ni ventanas.</p>}
        {muro.aberturas.length > 0 && (
          <p className="text-xs text-gray-600">Altura desde el piso: 0 = toca el piso, como una puerta.</p>
        )}
        {muro.aberturas.map((a, i) => (
          <div key={a.id} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
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
            <Campo label="Desde el piso (m)">
              <CampoNumero
                etiqueta={`Altura desde el piso, abertura ${i + 1}`}
                valor={a.altura_piso_m ?? 0}
                regla={REGLA_DESDE_PISO}
                onCambio={(altura_piso_m) => actualizarAbertura(i, { ...a, altura_piso_m })}
              />
            </Campo>
            <button
              aria-label={`Quitar abertura ${i + 1}`}
              className="btn-danger btn-small"
              onClick={() => onCambiar({ ...muro, aberturas: muro.aberturas.filter((_, k) => k !== i) })}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <CroquisMuro muro={muro} />

      {aviso && (
        <p role="alert" className="rounded-md bg-red-50 p-2 text-sm text-red-800">
          {aviso}
        </p>
      )}

      <div className="flex justify-end">
        <button type="button" className="btn-danger btn-small" onClick={onEliminar}>
          Eliminar este muro
        </button>
      </div>
    </div>
  )
}
