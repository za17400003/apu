/** Elegir una de pocas opciones excluyentes: se ven todas a la vez. */
export function GrupoRadio<T extends string>({
  legend,
  nombre,
  opciones,
  valor,
  onCambio,
}: {
  legend: string
  nombre: string
  opciones: { valor: T; etiqueta: string }[]
  valor: T
  onCambio: (v: T) => void
}) {
  return (
    <fieldset className="space-y-1">
      <legend className="text-xs font-semibold text-gray-700">{legend}</legend>
      {opciones.map((o) => (
        <label key={o.valor} className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={nombre}
            value={o.valor}
            checked={valor === o.valor}
            onChange={() => onCambio(o.valor)}
          />
          {o.etiqueta}
        </label>
      ))}
    </fieldset>
  )
}
