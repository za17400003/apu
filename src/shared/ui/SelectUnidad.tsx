import { Unidad } from '@/shared/domain/units'

/** Selector de unidades: muestra "m² · metro cuadrado" y guarda solo el código. */
export function SelectUnidad({
  opciones,
  valor,
  onCambio,
  etiqueta,
  className = '',
}: {
  opciones: Unidad[]
  valor: string
  onCambio: (codigo: string) => void
  etiqueta: string
  className?: string
}) {
  // Si el valor guardado no está en la lista (dato importado), se muestra igual.
  const existe = opciones.some((u) => u.codigo === valor)
  return (
    <select
      aria-label={etiqueta}
      value={valor}
      onChange={(e) => onCambio(e.target.value)}
      className={`input-base ${className}`}
    >
      {!existe && <option value={valor}>{valor}</option>}
      {opciones.map((u) => (
        <option key={u.codigo} value={u.codigo}>
          {u.simbolo} · {u.nombre}
        </option>
      ))}
    </select>
  )
}
