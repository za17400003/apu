import { Proyecto } from '@/shared/domain/types'
import { calcularPrecioUnitario } from '@/shared/domain/apu'
import { resumenSuperficie } from '@/shared/domain/surfaces'
import { formatearMoneda } from '@/shared/domain/rounding'
import { simboloUnidad } from '@/shared/domain/units'
import { Campo } from '@/shared/ui/Campo'
import { folioEnUso } from '@/shared/domain/folio'

const MONEDAS = ['MXN', 'USD', 'EUR', 'COP']

interface Props {
  proyecto: Proyecto
  /** Resto de proyectos (archivados incluidos), para avisar folios repetidos. */
  otrosProyectos: Proyecto[]
  /** Folio que se usará si el usuario no escribe uno; se calcula en cada render. */
  folioSugerido: string
  onCambiar: (p: Proyecto) => void
  onEliminar: () => void
  onArchivar: (archivar: boolean) => void
}

/** El nombre se escribe aquí o en la pestaña: ambos leen el mismo dato y se actualizan juntos. */
export default function ProyectoView({
  proyecto,
  otrosProyectos,
  folioSugerido,
  onCambiar,
  onEliminar,
  onArchivar,
}: Props) {
  const enUso = folioEnUso(proyecto.folio ?? '', otrosProyectos.map((p) => p.folio ?? ''))

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      <section className="card grid gap-4 md:grid-cols-2">
        <h2 className="text-lg font-semibold md:col-span-2">Datos del proyecto</h2>

        <Campo label="Nombre del proyecto" className="md:col-span-2">
          <input
            className="input-base"
            value={proyecto.nombre}
            placeholder="Ej. Remodelación casa García"
            onChange={(e) => onCambiar({ ...proyecto, nombre: e.target.value })}
          />
        </Campo>

        <Campo label="Cliente">
          <input
            className="input-base"
            value={proyecto.cliente ?? ''}
            placeholder="Nombre de quien recibe la cotización"
            onChange={(e) => onCambiar({ ...proyecto, cliente: e.target.value || undefined })}
          />
        </Campo>

        <Campo label="Folio de cotización" className="md:col-span-2">
          <input
            className="input-base"
            value={proyecto.folio ?? folioSugerido}
            aria-invalid={enUso}
            aria-describedby="folio-ayuda"
            onChange={(e) => onCambiar({ ...proyecto, folio: e.target.value || undefined })}
          />
          <span id="folio-ayuda" className={`text-xs ${enUso ? 'text-red-700' : 'text-gray-600'}`}>
            {enUso
              ? 'Este folio ya lo usa otro proyecto. Cámbialo para no repetir números.'
              : proyecto.folio
                ? 'Folio fijo. Puedes escribir el de tu propio sistema.'
                : 'Sugerido: se fija al imprimir la cotización. Si creas otro proyecto antes, el sugerido avanza.'}
          </span>
        </Campo>

        <Campo label="Dirección o ubicación de la obra" className="md:col-span-2">
          <input
            className="input-base"
            value={proyecto.obra ?? ''}
            onChange={(e) => onCambiar({ ...proyecto, obra: e.target.value || undefined })}
          />
        </Campo>

        <Campo label="Moneda">
          <select
            className="input-base"
            value={proyecto.moneda}
            onChange={(e) => onCambiar({ ...proyecto, moneda: e.target.value })}
          >
            {MONEDAS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Campo>

        <Campo label="Notas y condiciones para la cotización" className="md:col-span-2">
          <textarea
            className="input-base min-h-24"
            value={proyecto.notas ?? ''}
            placeholder="Ej. Materiales incluidos. Tiempo de ejecución: 10 días hábiles."
            onChange={(e) => onCambiar({ ...proyecto, notas: e.target.value || undefined })}
          />
        </Campo>

        <p className="text-xs text-gray-600 md:col-span-2">
          Creado el {new Date(proyecto.fecha_creacion).toLocaleDateString('es-MX')}. Los datos solo existen en este navegador.
        </p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">Resumen</h2>
        <h3 className="text-sm font-semibold text-gray-700">Conceptos ({proyecto.conceptos.length})</h3>
        {proyecto.conceptos.length === 0 && <p className="text-sm text-gray-600">Sin conceptos todavía.</p>}
        <ul className="divide-y divide-gray-200">
          {proyecto.conceptos.map((c) => (
            <li key={c.id} className="flex justify-between gap-2 py-2 text-sm">
              <span>
                {c.nombre || 'Sin nombre'} <span className="text-gray-600">· por {simboloUnidad(c.unidad_obra)}</span>
              </span>
              <span className="font-mono">{formatearMoneda(calcularPrecioUnitario(c).precio_unitario, proyecto.moneda)}</span>
            </li>
          ))}
        </ul>
        <h3 className="pt-2 text-sm font-semibold text-gray-700">Muros ({proyecto.superficies.length})</h3>
        <ul className="divide-y divide-gray-200">
          {proyecto.superficies.map((s) => {
            let texto = 'Medidas incompletas'
            try {
              texto = `${resumenSuperficie(s).area_neta.toFixed(2)} m² netos`
            } catch {
              // se muestra el aviso por defecto
            }
            return (
              <li key={s.id} className="flex justify-between gap-2 py-2 text-sm">
                <span>{s.nombre || 'Sin nombre'}</span>
                <span className="font-mono">{texto}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="flex flex-wrap justify-end gap-2">
        <button onClick={() => onArchivar(!proyecto.archivado)} className="btn-secondary">
          {proyecto.archivado ? 'Restaurar proyecto' : 'Archivar proyecto'}
        </button>
        <button onClick={onEliminar} className="btn-danger">
          Eliminar proyecto
        </button>
      </section>
    </div>
  )
}
