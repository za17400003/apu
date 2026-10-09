import { geometriaMuro } from '@/shared/domain/croquis'
import { Superficie } from '@/shared/domain/types'

const CARBON = '#2B2B2B'

/**
 * Dibujo 2D aproximado del muro a partir de sus medidas: no sustituye un
 * plano constructivo ni un levantamiento (ver docs/01-diseno-visual.md).
 */
export function CroquisMuro({ muro }: { muro: Superficie }) {
  const g = geometriaMuro(muro)
  const margenSup = Math.max(g.alto * 0.22, 0.35)
  const margenIzq = Math.max(g.ancho * 0.14, 0.5)
  const anchoViewBox = g.ancho + margenIzq
  const altoViewBox = g.alto + margenSup
  const fuente = Math.max(g.ancho, g.alto) * 0.045

  return (
    <div>
      <svg
        viewBox={`0 0 ${anchoViewBox} ${altoViewBox}`}
        className="mx-auto block w-full"
        style={{ maxWidth: 420 }}
        role="img"
        aria-label={`Croquis del muro: ${g.ancho.toFixed(2)} por ${g.alto.toFixed(2)} metros, ${g.aberturas.length} abertura(s)`}
      >
        {/* Cota de ancho */}
        <line
          x1={margenIzq}
          y1={margenSup * 0.35}
          x2={margenIzq + g.ancho}
          y2={margenSup * 0.35}
          stroke={CARBON}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        <text x={margenIzq + g.ancho / 2} y={margenSup * 0.2} fontSize={fuente} textAnchor="middle" fill={CARBON}>
          {g.ancho.toFixed(2)} m
        </text>

        {/* Cota de alto */}
        <text
          x={margenIzq * 0.3}
          y={margenSup + g.alto / 2}
          fontSize={fuente}
          textAnchor="middle"
          fill={CARBON}
          transform={`rotate(-90 ${margenIzq * 0.3} ${margenSup + g.alto / 2})`}
        >
          {g.alto.toFixed(2)} m
        </text>

        <g transform={`translate(${margenIzq}, ${margenSup})`}>
          {/* Muro */}
          <rect
            x={0}
            y={0}
            width={g.ancho}
            height={g.alto}
            fill="#2B2B2B22"
            stroke={CARBON}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />

          {/* Aberturas, medidas desde el piso: y=0 del muro es la base */}
          {g.aberturas.map((a) => {
            const ySvg = g.alto - a.y - a.alto
            return (
              <g key={a.id}>
                <rect
                  x={a.x}
                  y={ySvg}
                  width={a.ancho}
                  height={a.alto}
                  fill="#FAFAF8"
                  stroke={CARBON}
                  strokeDasharray="0.1 0.08"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
                {a.ancho > g.ancho * 0.08 && (
                  <text
                    x={a.x + a.ancho / 2}
                    y={ySvg + a.alto / 2}
                    fontSize={fuente * 0.8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={CARBON}
                  >
                    {a.ancho.toFixed(2)}×{a.alto.toFixed(2)}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </svg>

      {g.avisos.length > 0 && (
        <ul className="mt-2 space-y-1">
          {g.avisos.map((aviso, i) => (
            <li key={i} role="alert" className="text-xs text-amber-900">
              {aviso}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1 text-xs text-gray-600">
        Croquis aproximado a partir de las medidas. No sustituye un plano constructivo ni un levantamiento.
      </p>
    </div>
  )
}
