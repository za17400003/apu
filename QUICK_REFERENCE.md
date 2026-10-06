# Referencia Rápida - Calculadora APU

## 🚀 Start

```bash
npm run dev
# Abre http://localhost:5173 con HMR automático
```

## 🧪 Tests

```bash
npm test                 # Ejecuta tests una vez
npm test -- --watch     # Watch mode (rerun al cambiar)
npm run test:ui         # UI interactiva
npm run test:coverage   # Reporte de cobertura
```

## 🔍 Verificación

```bash
npx tsc --noEmit        # Type-check sin emitir
npm run build           # Build producción
npm run lint            # ESLint
npm run codegraph       # Análisis de arquitectura
```

---

## 📁 Archivos principales por tarea

| Tarea | Archivo |
|-------|---------|
| Cambiar fórmula de APU | `src/shared/domain/apu.ts` |
| Cambiar UI de APU | `src/features/unit-prices/ApuView.tsx` |
| Cambiar superficies | `src/features/surfaces/SuperficiesView.tsx` |
| Cambiar persistencia | `src/shared/storage/db.ts` |
| Cambiar colores/estilos | `tailwind.config.js` + `src/styles/globals.css` |
| Cambiar navegación | `src/app/App.tsx` + `src/shared/ui/Sidebar.tsx` |
| Agregar test | `tests/unit/*.test.ts` |

---

## 🎨 Paleta de colores (Tailwind)

```javascript
// tailwind.config.js
charcoal: '#2B2B2B'      // Oscuro/estructura
warmWhite: '#FAFAF8'     // Fondo principal
safetyYellow: '#FFD700'  // Acciones primarias
successGreen: '#2ECC71'  // Resultados/éxito
```

Uso en componentes:
```typescript
// Botón primario
<button className="bg-safetyYellow text-charcoal">

// Fondo resultado
<div className="bg-successGreen bg-opacity-20">
```

---

## 📊 Modelo de datos

### Proyecto
```typescript
{
  id: string
  nombre: string
  moneda: 'MXN' | 'USD'
  conceptos: Concepto[]
  superficies: Superficie[]
}
```

### Concepto (APU)
```typescript
{
  nombre: string
  unidad_obra: 'm²'
  materiales: Insumo[]        // Pintura, cemento, etc.
  mano_obra: Insumo[]         // Oficial, peón, etc.
  equipo: Insumo[]            // Andamios, herramientas, etc.
  costo_directo: number       // Material + Mano + Equipo
  tasa_indirectos_pct: 15     // % configurable
  tasa_utilidad_pct: 25       // % configurable
  precio_unitario: number     // Resultado final
}
```

### Superficie (Muro)
```typescript
{
  nombre: string
  ancho_m: 5
  alto_m: 3
  aberturas: { ancho_m, alto_m }[]  // Ventanas, puertas
  area_bruta: number          // ancho × alto
  area_neta: number           // bruta - aberturas
  rendimiento: 0.15           // L/m², kg/m², etc.
  desperdicio_pct: 10         // % adicional
  cantidad_total: number      // Envases finales
}
```

---

## 🔄 Flujo de guardado

```
Usuario edita insumo
        ↓
ApuView actualiza estado local
        ↓
Llama: actualizarConcepto(concepto)
        ↓
Calcula: calcularPrecioUnitario()
        ↓
Guarda en DB: actualizarProyecto()
        ↓
HMR recarga componente
        ↓
UI muestra nuevo precio
```

---

## 🧠 Lógica de cálculo (sin redondeo intermedio)

```typescript
// src/shared/domain/apu.ts

// 1. Costo por insumo (con desperdicio)
Costo = Cantidad × Costo_unitario × (1 + Desperdicio%)

// 2. Costo directo (suma sin redondeo)
Costo_directo = Σ(Materiales) + Σ(Mano_obra) + Σ(Equipo)

// 3. Indirectos
Indirectos = Costo_directo × (Tasa% / 100)

// 4. Utilidad (base configurable)
Utilidad = (Costo_directo + Indirectos) × (Tasa% / 100)

// 5. Precio unitario
Precio = Costo_directo + Indirectos + Utilidad

// Solo redondear al mostrar: 2 decimales
```

---

## 🗄️ IndexedDB (Persistencia)

### Tablas
- `projects` → Proyectos
- `concepts` → Conceptos por proyecto
- `surfaces` → Superficies por proyecto
- `preferences` → Configuración global

### Operaciones
```typescript
import { 
  crearProyecto, 
  obtenerProyectos,
  actualizarProyecto,
  eliminarProyecto 
} from '@/shared/storage/db'

// Crear
const id = await crearProyecto({ nombre: '...', ... })

// Obtener
const proyectos = await obtenerProyectos()
const uno = await obtenerProyecto(id)

// Actualizar
await actualizarProyecto({ ...proyecto, nombre: 'Nuevo' })

// Eliminar
await eliminarProyecto(id)
```

---

## 🐛 Debug en la consola del navegador

```javascript
// Ver datos de IndexedDB
// Ve a: DevTools → Application → IndexedDB → CalculadoraAPU

// Ver última orden
console.log(window.location.href)

// Ver estado React (con React DevTools)
// InstalaExtensión: https://react-devtools-tutorial.vercel.app

// Medir performance
console.time('miOperacion')
// ... tu código ...
console.timeEnd('miOperacion')

// Ver tabla
console.table(miArray)
```

---

## 📝 Agregar un nuevo campo

### 1. Actualizar tipo
```typescript
// src/shared/domain/types.ts
export interface Concepto {
  // ... campos existentes
  mi_campo_nuevo: string
}
```

### 2. Inicializar en formulario
```typescript
// src/features/unit-prices/ApuView.tsx
const concepto = {
  // ... otros campos
  mi_campo_nuevo: '',
}
```

### 3. Guardar en DB
```typescript
await actualizarConcepto({
  ...conceptoActivo,
  mi_campo_nuevo: nuevoValor,
})
```

### 4. Migrar datos antiguos (si aplica)
```typescript
// src/shared/storage/backup.ts - en importarRespaldo()
if (!proyecto.mi_campo_nuevo) {
  proyecto.mi_campo_nuevo = 'valor_por_defecto'
}
```

---

## ✅ Checklist: antes de hacer push

- [ ] `npx tsc --noEmit` sin errores
- [ ] `npm test` todos en verde
- [ ] Abre http://localhost:5173 y prueba flujo
- [ ] Recargar página → datos persisten
- [ ] DevTools Console sin errores rojo
- [ ] Git commit con mensaje descriptivo

---

## 🔗 Enlaces útiles

- **Documentación completa:** `docs/00-16`
- **Decisiones técnicas:** `docs/16-tech-decisions.md`
- **Fórmulas de cálculo:** `docs/14-calculos-apu-validation.md`
- **Casos de uso:** `docs/15-casos-de-uso.md`
- **Esta guía:** `DEVELOPMENT.md`

---

**Para empezar:** `npm run dev` y abre http://localhost:5173 ✨
