import { z } from 'zod'
import type { Abertura, Concepto, Insumo, Partida, Proyecto, Superficie } from '@/shared/domain/types'
import { esFutura } from '@/shared/domain/fechas'

// Validación al importar respaldos. Las mismas reglas que la UI (validation/numeros.ts):
// cantidades > 0, costos ≥ 0, porcentajes 0–100. Los tipos deben coincidir con domain/types.ts.
// Los respaldos de versiones anteriores se completan con valores por defecto.

const porcentaje = z.number().min(0).max(100)
const fecha = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha con formato AAAA-MM-DD')
  .refine((f) => !esFutura(f), 'La fecha del precio no puede ser posterior a hoy')

const InsumoSchema: z.ZodType<Insumo> = z.object({
  id: z.string(),
  descripcion: z.string(),
  unidad: z.string().min(1),
  cantidad: z.number().positive(),
  costo_unitario: z.number().nonnegative(),
  desperdicio_pct: porcentaje,
  fuente: z.string().optional(),
  fecha_precio: fecha.optional(),
})

const ConceptoSchema: z.ZodType<Concepto> = z.object({
  id: z.string(),
  nombre: z.string(),
  unidad_obra: z.string().min(1),
  materiales: z.array(InsumoSchema),
  mano_obra: z.array(InsumoSchema),
  equipo: z.array(InsumoSchema),
  tasa_indirectos_pct: porcentaje,
  base_indirectos: z.enum(['directo', 'materiales']),
  tasa_utilidad_pct: porcentaje,
  base_utilidad: z.enum(['directo+indirectos', 'directo']),
})

const AberturaSchema: z.ZodType<Abertura> = z.object({
  id: z.string(),
  ancho_m: z.number().positive(),
  alto_m: z.number().positive(),
})

const SuperficieSchema: z.ZodType<Superficie> = z.object({
  id: z.string(),
  nombre: z.string(),
  ancho_m: z.number().positive(),
  alto_m: z.number().positive(),
  aberturas: z.array(AberturaSchema),
  acabado: z.string(),
  rendimiento: z.number().positive(),
  unidad_compra: z.string().min(1),
  presentacion_cantidad: z.number().positive(),
  desperdicio_pct: porcentaje,
  redondear_envases: z.boolean(),
})

const PartidaSchema: z.ZodType<Partida> = z.object({
  id: z.string(),
  concepto_id: z.string(),
  muro_id: z.string().optional(),
  cantidad: z.number().nonnegative(),
})

export const ProyectoSchema: z.ZodType<Proyecto, z.ZodTypeDef, unknown> = z.object({
  id: z.string(),
  nombre: z.string(),
  fecha_creacion: z.string(),
  cliente: z.string().optional(),
  obra: z.string().optional(),
  folio: z.string().optional(),
  moneda: z.string().min(3),
  notas: z.string().optional(),
  iva_pct: porcentaje.default(0),
  anticipo_pct: porcentaje.default(0),
  vigencia_dias: z.number().int().nonnegative().default(15),
  conceptos: z.array(ConceptoSchema),
  superficies: z.array(SuperficieSchema),
  partidas: z.array(PartidaSchema).default([]),
  archivado: z.boolean().optional(),
})

export const BackupDataSchema = z.object({
  app: z.string().optional(),
  schema_version: z.number().int().positive(),
  formula_version: z.number().int().positive(),
  fecha_backup: z.string(),
  proyectos: z.array(ProyectoSchema),
})
