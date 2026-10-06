# Guía de Desarrollo

## 🚀 Inicio rápido

### Terminal 1: Dev Server (HMR en tiempo real)
```bash
npm run dev
# Abre automáticamente http://localhost:5173
# Los cambios en src/ se reflejan instantáneamente en el navegador
```

### Terminal 2: Tests en watchmode (opcional)
```bash
npm test -- --watch
# Ejecuta tests cada vez que cambias archivos
```

### Terminal 3: Compilador TypeScript (opcional)
```bash
npx tsc --watch
# Verifica tipos en tiempo real sin ejecutar
```

---

## 🛠️ Herramientas disponibles

### Type-check
```bash
npx tsc --noEmit
# Verifica tipos sin emitir JS
```

### Linting
```bash
npm run lint
# Ejecuta ESLint (setup pendiente)
```

### Build producción
```bash
npm run build
# Genera dist/ optimizado para producción
```

### Análisis de arquitectura
```bash
npm run codegraph
# Requiere Python 3 + codegraph CLI
# Genera .audit/codegraph.html
```

---

## 📂 Estructura de carpetas para edición

### Dominio (Lógica pura)
```
src/shared/domain/
├─ types.ts          ← Modelos TypeScript
├─ apu.ts            ← Cálculos de APU (CRÍTICO)
├─ surfaces.ts       ← Cálculos de superficies
├─ quantities.ts     ← Cálculos de cantidades
└─ rounding.ts       ← Formateo
```

**Cambios aquí = tests deben pasar**

### UI (Componentes React)
```
src/app/
└─ App.tsx           ← Punto de entrada principal

src/features/
├─ projects/         ← Gestión de proyectos
│  └─ ProyectosView.tsx
├─ unit-prices/      ← Editor de APU
│  └─ ApuView.tsx
├─ surfaces/         ← Editor de superficies
│  └─ SuperficiesView.tsx
└─ catalog/          ← Ajustes y respaldo
   └─ AjustesView.tsx

src/shared/ui/
└─ Sidebar.tsx       ← Navegación lateral
```

### Persistencia
```
src/shared/storage/
├─ db.ts             ← Operaciones CRUD + Dexie
└─ backup.ts         ← Export/import JSON
```

### Estilos
```
src/styles/
└─ globals.css       ← Tailwind + custom CSS
```

---

## 🔄 Flujo de desarrollo

### 1. Cambiar algo en el dominio
```bash
# Edita: src/shared/domain/apu.ts
# Resultado: HMR actualiza automáticamente
# Verifica: Abre DevTools (F12) → Console → Sin errores
```

### 2. Cambiar algo en UI
```bash
# Edita: src/features/unit-prices/ApuView.tsx
# Resultado: HMR recompila y recarga componentes
# Verifica: Los cambios se ven en tiempo real
```

### 3. Agregar un nuevo insumo al test
```bash
# Edita: tests/unit/apu.test.ts
# Corre: npm test
# Resultado: Tests se ejecutan automáticamente
```

---

## 🐛 Debugging

### En el navegador (Chrome, Edge, Firefox)
1. Abre http://localhost:5173
2. Presiona **F12** para abrir DevTools
3. **Console** → Mensajes de error
4. **Sources** → Paso a paso en el código
5. **Application** → IndexedDB (ver datos guardados)

### Acceder a IndexedDB
```javascript
// En la consola del navegador:
const db = await (async () => {
  const stores = await indexedDB.databases();
  return stores;
})();
// Luego ve a Application → IndexedDB → CalculadoraAPU
```

### Ver datos guardados
```javascript
// En Console:
// 1. Crea un proyecto
// 2. Va a Application → IndexedDB → CalculadoraAPU → projects
// 3. Verás los datos guardados
```

---

## 📝 Ediciones comunes

### Cambiar un cálculo en APU
Archivo: `src/shared/domain/apu.ts`
```typescript
// Ejemplo: modificar cálculo de indirectos
export function calcularIndirectos(
  costo_directo: number,
  costo_materiales: number,
  tasa_pct: number,
  base: 'directo' | 'materiales'
): number {
  // TU CAMBIO AQUÍ
  const base_amount = base === 'directo' ? costo_directo : costo_materiales
  return (base_amount * tasa_pct) / 100
}
```

### Cambiar colores
Archivo: `tailwind.config.js`
```javascript
// Cambiar paleta de colores
colors: {
  charcoal: '#2B2B2B',      // Negro/gris oscuro
  warmWhite: '#FAFAF8',     // Blanco cálido
  safetyYellow: '#FFD700',  // Amarillo seguridad
  successGreen: '#2ECC71',  // Verde éxito
}
```

### Agregar un nuevo concepto/formulario
Archivo: `src/features/unit-prices/ApuView.tsx`
```typescript
// Hay un patrón de componentes: InsumoRow, ResultadoRow
// Copia + modifica para nuevos campos
```

### Cambiar almacenamiento
Archivo: `src/shared/storage/db.ts`
```typescript
// Usa la clase CalculadoraDB y sus métodos CRUD
// Ejemplo: await crearProyecto({ ... })
```

---

## ✅ Checklist antes de commit

```bash
# 1. Type-check
npx tsc --noEmit

# 2. Tests
npm test

# 3. Visual en el navegador
# - Navega por la app
# - Crea un proyecto
# - Crea un concepto
# - Verifica cálculos

# 4. Git
git status
git add .
git commit -m "feat: Descripción de cambios"
```

---

## 🔗 Enlaces útiles

- **Documentación** → `docs/00-16`
- **Plan de arquitectura** → `.claude/plans/mellow-honking-spindle.md`
- **Tests** → `tests/unit/`
- **Build** → `dist/` (después de `npm run build`)

---

## 🆘 Problemas comunes

### "Cannot find module '@/...'"
```bash
# Solución: TypeScript paths en tsconfig.json están bien
# Reinicia el dev server:
npm run dev
```

### "Tests fallan por precisión decimal"
```bash
# Solución: Usa toBeCloseTo(valor, decimales)
expect(resultado).toBeCloseTo(1.54, 2)  // Permite ±0.005
```

### "IndexedDB no guarda datos"
```bash
# Verificar en DevTools → Application → IndexedDB → CalculadoraAPU
# Si está vacío, ejecuta: await initializeDatabase()
```

### "Cambios no aparecen en vivo"
```bash
# Reinicia el dev server:
# 1. Ctrl+C en la terminal
# 2. npm run dev
```

---

## 💡 Tips

1. **Usa React DevTools extension** → Inspecciona componentes en tiempo real
2. **Redux DevTools** → Pendiente (si se agrega estado global)
3. **Chrome Lighthouse** → Auditoría de performance
4. **Console API** → `console.log()`, `console.table()`, `console.time()`

---

**Última actualización:** octubre 2026
