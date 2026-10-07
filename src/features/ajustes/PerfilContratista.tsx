import { useEffect, useState } from 'react'
import { Perfil } from '@/shared/domain/types'
import { guardarPerfil, obtenerPerfil } from '@/shared/storage/db'
import { Campo } from '@/shared/ui/Campo'

/** Datos del contratista que aparecen en cada cotización. Se guardan al escribir. */
export function PerfilContratista() {
  const [perfil, setPerfil] = useState<Perfil | null>(null)

  useEffect(() => {
    obtenerPerfil().then(setPerfil)
  }, [])

  if (!perfil) return null

  const cambiar = (cambios: Partial<Perfil>) => {
    const nuevo = { ...perfil, ...cambios }
    setPerfil(nuevo)
    void guardarPerfil(nuevo)
  }

  return (
    <section className="card grid gap-3 md:grid-cols-2">
      <h3 className="font-semibold md:col-span-2">Datos del contratista (para la cotización)</h3>
      <Campo label="Nombre comercial">
        <input
          className="input-base"
          value={perfil.nombre_comercial}
          placeholder="Ej. Construcciones Ramírez"
          onChange={(e) => cambiar({ nombre_comercial: e.target.value })}
        />
      </Campo>
      <Campo label="Responsable">
        <input className="input-base" value={perfil.responsable} onChange={(e) => cambiar({ responsable: e.target.value })} />
      </Campo>
      <Campo label="Teléfono">
        <input
          type="tel"
          className="input-base"
          value={perfil.telefono}
          onChange={(e) => cambiar({ telefono: e.target.value })}
        />
      </Campo>
      <Campo label="Dirección">
        <input className="input-base" value={perfil.direccion} onChange={(e) => cambiar({ direccion: e.target.value })} />
      </Campo>
    </section>
  )
}
