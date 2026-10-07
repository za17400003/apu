import { useEffect, useId, useState } from 'react'
import { ReglaNumero, validarNumero } from '@/shared/validation/numeros'

/**
 * Campo numérico con validación visible. Un texto inválido no se guarda:
 * se muestra el motivo y, al salir del campo, vuelve el último valor válido.
 */
export function CampoNumero({
  valor,
  onCambio,
  etiqueta,
  regla = { min: 0 },
  className = '',
}: {
  valor: number
  onCambio: (n: number) => void
  etiqueta: string
  regla?: ReglaNumero
  className?: string
}) {
  const [texto, setTexto] = useState(String(valor))
  const idError = useId()
  const estado = validarNumero(texto, regla)

  useEffect(() => {
    // Solo reescribe el texto si el valor cambió desde fuera (p. ej. otro concepto).
    setTexto((previo) => {
      const p = validarNumero(previo, regla)
      return p.ok && p.valor === valor ? previo : String(valor)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor])

  return (
    <>
      <input
        type="text"
        inputMode="decimal"
        aria-label={etiqueta}
        aria-invalid={!estado.ok}
        aria-describedby={estado.ok ? undefined : idError}
        value={texto}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => {
          const t = e.target.value
          setTexto(t)
          const r = validarNumero(t, regla)
          if (r.ok) onCambio(r.valor)
        }}
        onBlur={() => {
          if (!estado.ok) setTexto(String(valor))
        }}
        className={`input-base text-right font-mono ${estado.ok ? '' : 'border-red-700'} ${className}`}
      />
      {!estado.ok && (
        <span id={idError} className="text-xs text-red-700">
          {estado.error}
        </span>
      )}
    </>
  )
}
