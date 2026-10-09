// Tamaño real del hueco reservado: 300×250 px, el "rectángulo mediano" — el formato
// de anuncio más común y el de mejor visibilidad dentro de contenido (paquete
// universal de IAB). Vista previa para decidir el lugar; no es un anuncio activo.
const ANCHO = 300
const ALTO = 250

/**
 * Lugar reservado para un anuncio, a su tamaño real, para ver cómo va a quedar.
 * Antes de mostrarlo a un usuario real sin aprobación del proveedor, debe volver
 * a no renderizar nada (ver docs/06-publicidad.md: "los espacios reservados no
 * se muestran vacíos ni bloquean el contenido" se refiere al uso real, no a esta
 * vista previa de diseño).
 */
export function EspacioPublicitario({ nombre }: { nombre: string }) {
  return (
    <div
      data-espacio-publicidad={nombre}
      className="mx-auto flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-400 bg-gray-100 text-gray-500"
      style={{ width: ANCHO, height: ALTO, maxWidth: '100%' }}
    >
      <span className="text-xs font-semibold uppercase tracking-wide">Espacio de anuncio</span>
      <span className="text-xs">
        {ANCHO} × {ALTO} px
      </span>
      <span className="text-xs">Reservado · inactivo</span>
    </div>
  )
}
