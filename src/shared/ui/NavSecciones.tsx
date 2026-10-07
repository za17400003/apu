export type Seccion = 'proyecto' | 'apu' | 'superficies' | 'cotizacion' | 'ajustes'

const SECCIONES: { id: Seccion; etiqueta: string }[] = [
  { id: 'proyecto', etiqueta: 'Proyecto' },
  { id: 'apu', etiqueta: 'APU' },
  { id: 'superficies', etiqueta: 'Muros' },
  { id: 'cotizacion', etiqueta: 'Cotización' },
  { id: 'ajustes', etiqueta: 'Ajustes' },
]

/**
 * Escritorio (≥ 768 px): columna lateral con texto.
 * Móvil: barra inferior fija con las mismas secciones, también con texto.
 */
export function NavSecciones({ seccion, onCambiar }: { seccion: Seccion; onCambiar: (s: Seccion) => void }) {
  const boton = (s: { id: Seccion; etiqueta: string }, extra: string) => (
    <button
      key={s.id}
      onClick={() => onCambiar(s.id)}
      aria-current={seccion === s.id ? 'page' : undefined}
      className={`rounded-md px-3 py-2 text-left text-sm font-semibold transition ${extra} ${
        seccion === s.id ? 'bg-safetyYellow text-charcoal' : 'text-warmWhite hover:bg-gray-700'
      }`}
    >
      {s.etiqueta}
    </button>
  )

  return (
    <>
      <nav aria-label="Secciones" className="hidden w-44 shrink-0 flex-col gap-1 bg-charcoal p-3 md:flex">
        {SECCIONES.map((s) => boton(s, 'w-full'))}
      </nav>
      <nav
        aria-label="Secciones"
        className="fixed inset-x-0 bottom-0 z-10 flex gap-1 border-t border-gray-600 bg-charcoal p-2 md:hidden"
      >
        {SECCIONES.map((s) => boton(s, 'flex-1 px-0.5 text-center text-xs'))}
      </nav>
    </>
  )
}
