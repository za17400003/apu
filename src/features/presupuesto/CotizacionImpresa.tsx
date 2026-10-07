import { Concepto, Insumo, Perfil, Proyecto } from '@/shared/domain/types'
import { Cotizacion } from '@/shared/domain/cotizacion'
import { calcularCostoInsumo, calcularPrecioUnitario } from '@/shared/domain/apu'
import { formatearMoneda, formatearNumero } from '@/shared/domain/rounding'
import { simboloUnidad } from '@/shared/domain/units'

interface Props {
  proyecto: Proyecto
  perfil: Perfil
  cotizacion: Cotizacion
  anexo: boolean
}

/** Porcentaje sin ceros de más: "16 %", "12.5 %". */
const pct = (v: number) => formatearNumero(v, Number.isInteger(v) ? 0 : 2)

/** Documento para imprimir o guardar como PDF. Se muestra solo al imprimir (ver globals.css). */
export function CotizacionImpresa({ proyecto, perfil, cotizacion, anexo }: Props) {
  const m = (v: number) => formatearMoneda(v, proyecto.moneda)
  const hoy = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })

  // Un análisis por concepto distinto usado en la cotización, en orden de aparición.
  const conceptosAnexo: Concepto[] = []
  for (const l of cotizacion.lineas) {
    if (!conceptosAnexo.some((c) => c.id === l.concepto.id)) conceptosAnexo.push(l.concepto)
  }

  return (
    <article className="imp">
      <header className="imp-cabecera">
        <div>
          <p className="imp-marca">{perfil.nombre_comercial || 'Nombre del contratista'}</p>
          {perfil.responsable && <p>Responsable: {perfil.responsable}</p>}
          {perfil.direccion && <p>{perfil.direccion}</p>}
          {perfil.telefono && <p>Tel. {perfil.telefono}</p>}
        </div>
        <div className="imp-doc">
          <p className="imp-titulo">COTIZACIÓN</p>
          <p>Folio: {proyecto.folio || '—'}</p>
          <p>Fecha: {hoy}</p>
          <p>Vigencia: {proyecto.vigencia_dias > 0 ? `${proyecto.vigencia_dias} días naturales` : 'sin vencimiento definido'}</p>
        </div>
      </header>

      <section className="imp-datos">
        <p>
          <strong>Cliente:</strong> {proyecto.cliente || '—'}
        </p>
        <p>
          <strong>Obra:</strong> {proyecto.obra || '—'}
        </p>
        <p>
          <strong>Proyecto:</strong> {proyecto.nombre || 'Sin nombre'}
        </p>
      </section>

      <table className="imp-tabla">
        <thead>
          <tr>
            <th className="w-10">No.</th>
            <th>Concepto</th>
            <th className="w-16">Unidad</th>
            <th className="num w-24">Cantidad</th>
            <th className="num w-28">P. unitario</th>
            <th className="num w-28">Importe</th>
          </tr>
        </thead>
        <tbody>
          {cotizacion.lineas.map((l) => (
            <tr key={l.numero}>
              <td>{l.numero}</td>
              <td>
                {l.concepto.nombre || 'Sin nombre'}
                {l.origen && <div className="imp-nota">Medido en: {l.origen}</div>}
                {l.error && <div className="imp-nota">Revisar: {l.error}</div>}
              </td>
              <td>{simboloUnidad(l.concepto.unidad_obra)}</td>
              <td className="num">{formatearNumero(l.cantidad, 2)}</td>
              <td className="num">{m(l.precio_unitario)}</td>
              <td className="num">{m(l.importe)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="imp-totales">
        <tbody>
          <tr>
            <td>Subtotal</td>
            <td className="num">{m(cotizacion.subtotal)}</td>
          </tr>
          {proyecto.iva_pct > 0 ? (
            <tr>
              <td>IVA ({pct(proyecto.iva_pct)} %)</td>
              <td className="num">{m(cotizacion.iva)}</td>
            </tr>
          ) : (
            <tr>
              <td colSpan={2} className="imp-nota">
                Precios sin impuestos incluidos.
              </td>
            </tr>
          )}
          <tr className="imp-total">
            <td>Total</td>
            <td className="num">{m(cotizacion.total)}</td>
          </tr>
          {cotizacion.anticipo > 0 && (
            <tr>
              <td>Anticipo requerido ({pct(proyecto.anticipo_pct)} %)</td>
              <td className="num">{m(cotizacion.anticipo)}</td>
            </tr>
          )}
        </tbody>
      </table>

      {proyecto.notas && (
        <section className="imp-condiciones">
          <p className="imp-seccion">Notas y condiciones</p>
          <p className="whitespace-pre-line">{proyecto.notas}</p>
        </section>
      )}

      <section className="imp-firmas">
        <div>
          <div className="imp-linea-firma" />
          <p>Acepta el cliente</p>
          <p>{proyecto.cliente || 'Nombre y firma'}</p>
          <p>Fecha: ____________</p>
        </div>
        <div>
          <div className="imp-linea-firma" />
          <p>Entrega el contratista</p>
          <p>{perfil.responsable || perfil.nombre_comercial || 'Nombre y firma'}</p>
          <p>Fecha: ____________</p>
        </div>
      </section>

      {anexo && conceptosAnexo.length > 0 && (
        <section className="imp-anexo">
          <h2 className="imp-seccion">Anexo: análisis de precio unitario</h2>
          {conceptosAnexo.map((c) => (
            <AnalisisConcepto key={c.id} concepto={c} moneda={proyecto.moneda} />
          ))}
        </section>
      )}
    </article>
  )
}

function AnalisisConcepto({ concepto, moneda }: { concepto: Concepto; moneda: string }) {
  const r = calcularPrecioUnitario(concepto)
  const m = (v: number) => formatearMoneda(v, moneda)
  const grupos: { titulo: string; insumos: Insumo[] }[] = [
    { titulo: 'Materiales', insumos: concepto.materiales },
    { titulo: 'Mano de obra', insumos: concepto.mano_obra },
    { titulo: 'Equipo y herramienta', insumos: concepto.equipo },
  ]

  return (
    <div className="imp-analisis">
      <p className="imp-analisis-titulo">
        {concepto.nombre || 'Sin nombre'} · por {simboloUnidad(concepto.unidad_obra)}
      </p>
      <table className="imp-tabla">
        <thead>
          <tr>
            <th>Descripción</th>
            <th className="w-16">Unidad</th>
            <th className="num w-20">Cantidad</th>
            <th className="num w-24">Costo unit.</th>
            <th className="num w-16">Desp. %</th>
            <th className="num w-24">Importe</th>
          </tr>
        </thead>
        <tbody>
          {grupos.map((g) =>
            g.insumos.length === 0 ? null : (
              <FilasGrupo key={g.titulo} titulo={g.titulo} insumos={g.insumos} moneda={moneda} />
            )
          )}
        </tbody>
      </table>
      <table className="imp-totales">
        <tbody>
          <tr>
            <td>Costo directo</td>
            <td className="num">{m(r.costo_directo)}</td>
          </tr>
          <tr>
            <td>
              Indirectos ({pct(concepto.tasa_indirectos_pct)} % sobre{' '}
              {concepto.base_indirectos === 'directo' ? 'costo directo' : 'materiales'})
            </td>
            <td className="num">{m(r.indirectos)}</td>
          </tr>
          <tr>
            <td>
              Utilidad ({pct(concepto.tasa_utilidad_pct)} % sobre{' '}
              {concepto.base_utilidad === 'directo+indirectos' ? 'directo + indirectos' : 'costo directo'})
            </td>
            <td className="num">{m(r.utilidad)}</td>
          </tr>
          <tr className="imp-total">
            <td>Precio unitario</td>
            <td className="num">{m(r.precio_unitario)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function FilasGrupo({ titulo, insumos, moneda }: { titulo: string; insumos: Insumo[]; moneda: string }) {
  return (
    <>
      <tr className="imp-grupo">
        <td colSpan={6}>{titulo}</td>
      </tr>
      {insumos.map((i) => (
        <tr key={i.id}>
          <td>
            {i.descripcion || 'Sin descripción'}
            {(i.fuente || i.fecha_precio) && (
              <div className="imp-nota">
                {i.fuente}
                {i.fuente && i.fecha_precio && ' · '}
                {i.fecha_precio && `precio del ${i.fecha_precio}`}
              </div>
            )}
          </td>
          <td>{simboloUnidad(i.unidad)}</td>
          <td className="num">{formatearNumero(i.cantidad, 2)}</td>
          <td className="num">{formatearMoneda(i.costo_unitario, moneda)}</td>
          <td className="num">{formatearNumero(i.desperdicio_pct, 1)}</td>
          <td className="num">{formatearMoneda(calcularCostoInsumo(i), moneda)}</td>
        </tr>
      ))}
    </>
  )
}
