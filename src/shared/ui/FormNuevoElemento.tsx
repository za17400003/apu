import { useState } from 'react'
import { Unidad } from '@/shared/domain/units'
import { Campo } from './Campo'
import { SelectUnidad } from './SelectUnidad'

/**
 * Alta de un concepto o muro: pide el nombre (y la unidad, si aplica)
 * antes de crear el elemento. Sin ventanas emergentes.
 */
export function FormNuevoElemento({
  titulo,
  placeholder,
  unidades,
  unidadInicial,
  onCrear,
  onCancelar,
}: {
  titulo: string
  placeholder: string
  unidades?: Unidad[]
  unidadInicial?: string
  onCrear: (nombre: string, unidad: string) => void
  onCancelar?: () => void
}) {
  const [nombre, setNombre] = useState('')
  const [unidad, setUnidad] = useState(unidadInicial ?? '')
  const [error, setError] = useState('')

  return (
    <form
      className="card flex flex-col gap-3 md:flex-row md:items-end"
      onSubmit={(e) => {
        e.preventDefault()
        if (!nombre.trim()) {
          setError('Escribe un nombre antes de crear.')
          return
        }
        onCrear(nombre.trim(), unidad)
      }}
    >
      <p className="text-sm font-semibold md:hidden">{titulo}</p>
      <Campo label="Nombre" className="flex-1">
        <input
          autoFocus
          value={nombre}
          placeholder={placeholder}
          onChange={(e) => {
            setNombre(e.target.value)
            setError('')
          }}
          className="input-base"
        />
      </Campo>
      {unidades && (
        <Campo label="Unidad de obra" className="md:w-64">
          <SelectUnidad opciones={unidades} valor={unidad} onCambio={setUnidad} etiqueta="Unidad de obra" />
        </Campo>
      )}
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">
          Crear
        </button>
        {onCancelar && (
          <button type="button" className="btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  )
}
