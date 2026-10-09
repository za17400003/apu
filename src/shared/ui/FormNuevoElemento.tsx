import { useState } from 'react'
import { Campo } from './Campo'

/** Alta rápida de un elemento: solo pide el nombre. Sin ventanas emergentes. */
export function FormNuevoElemento({
  titulo,
  placeholder,
  onCrear,
  onCancelar,
}: {
  titulo: string
  placeholder: string
  onCrear: (nombre: string) => void
  onCancelar?: () => void
}) {
  const [nombre, setNombre] = useState('')
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
        onCrear(nombre.trim())
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
