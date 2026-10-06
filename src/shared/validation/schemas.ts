import { z } from 'zod'

// Esquemas de validación Zod

export const InsumoSchema = z.object({
  id: z.string(),
  descripcion: z.string().min(1),
  unidad: z.string().min(1),
  cantidad: z.number().positive('La cantidad debe ser positiva'),
  costo_unitario: z.number().nonnegative('El costo no puede ser negativo'),
  desperdicio_pct: z.number().min(0).max(100),
  fuente: z.string().optional(),
  fecha_precio: z.string().optional(),
})

export const ConceptoSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1),
  unidad_obra: z.string().min(1),
  cantidad_base: z.number().positive(),
  materiales: z.array(InsumoSchema),
  mano_obra: z.array(InsumoSchema),
  equipo: z.array(InsumoSchema),
  costo_directo: z.number().nonnegative(),
  tasa_indirectos_pct: z.number().min(0).max(100),
  base_indirectos: z.enum(['directo', 'materiales']),
  tasa_utilidad_pct: z.number().min(0).max(100),
  base_utilidad: z.enum(['directo+indirectos', 'directo']),
  precio_unitario: z.number().nonnegative(),
  fecha_actualizacion: z.string(),
})

export const AperturaSchema = z.object({
  id: z.string(),
  ancho_m: z.number().positive(),
  alto_m: z.number().positive(),
})

export const SuperficieSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  nombre: z.string().min(1),
  ancho_m: z.number().positive(),
  alto_m: z.number().positive(),
  aberturas: z.array(AperturaSchema),
  area_bruta: z.number().positive(),
  area_neta: z.number().positive(),
  acabado: z.string(),
  producto_id: z.string().optional(),
  rendimiento: z.number().positive(),
  desperdicio_pct: z.number().min(0).max(100),
  presentacion: z.string().min(1),
  cantidad_redondeada: z.boolean(),
  cantidad_total: z.number().nonnegative(),
  fecha_actualizacion: z.string(),
})

export const ProyectoSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1),
  fecha_creacion: z.string(),
  ubicacion: z.string().optional(),
  moneda: z.string(),
  notas: z.string().optional(),
  conceptos: z.array(ConceptoSchema),
  superficies: z.array(SuperficieSchema),
})

export const BackupDataSchema = z.object({
  version: z.string(),
  schema_version: z.number(),
  formula_version: z.number(),
  fecha_backup: z.string(),
  proyectos: z.array(ProyectoSchema),
})

// Tipos inferidos de Zod
export type Insumo = z.infer<typeof InsumoSchema>
export type Concepto = z.infer<typeof ConceptoSchema>
export type Superficie = z.infer<typeof SuperficieSchema>
export type Proyecto = z.infer<typeof ProyectoSchema>
export type BackupData = z.infer<typeof BackupDataSchema>
