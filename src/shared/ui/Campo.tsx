import { ReactNode } from 'react'

/** Etiqueta visible + control. El texto de la etiqueta es el nombre accesible. */
export function Campo({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`flex min-w-0 flex-col gap-1 ${className}`}>
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      {children}
    </label>
  )
}
