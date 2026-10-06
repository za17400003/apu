# Calidad y roadmap

## Calidad

### Estrategia de testing (en orden de prioridad)

**Fase 1: Tests unitarios (Vitest)**
- `shared/domain/*`: funciones puras de cálculo sin mocks
  - `calculateUnitPrice`: casos normales, con indirectos, con utilidad, sin porcentajes, redondeos
  - `calculateNetArea`: área normal, sin aberturas, con múltiples aberturas, área neta = 0 (debe fallar)
  - `calculateProductQuantity`: rendimiento simple, con desperdicio, con capas, redondeo hacia arriba
  - `roundPrice`: redondeo a 2 decimales, casos límite (0.005, 0.015)
- Cobertura objetivo: >= 90% en `shared/domain/`

**Fase 2: Tests de integración (Vitest + mock IndexedDB)**
- `shared/storage/*`: guardar y cargar proyectos, catálogo, imágenes
  - Escribir proyecto, recargar, verificar que existe
  - Importar JSON, verificar estructura
  - Exportar JSON, verificar que contenga todos los datos
  - Limpieza de IndexedDB
- Mock de IndexedDB o usar `fake-indexeddb` para tests sin navegador
- Cobertura objetivo: >= 80% en `shared/storage/`

**Fase 3: Tests E2E (Playwright)**
- Flujo completo del contratista:
  1. Crear proyecto, nombrar
  2. Crear concepto (pintura), agregar materiales/mano de obra
  3. Dibujar muro, verificar área neta
  4. Seleccionar producto, verificar cantidad calculada
  5. Ver precio unitario actualizado
  6. Exportar PDF, verificar que contiene datos
  7. Recargar página, verificar que proyecto persiste
- Tests de navegación responsive (mobile, tablet, desktop)
- Cobertura: al menos 3 flujos críticos

**Accesibilidad (axe-core)**
- Ejecutar en CI contra rutas principales
- Verificar: contraste de colores, etiquetas ARIA, navegación con teclado
- Corregir errores críticos antes de lanzar

**Código y compilación**
- TypeScript: `strict: true` en tsconfig.json
- ESLint: sin warnings; usar preset recomendado
- Build en CI: verificar que la app compila sin errores
- Tests en CI: ejecutar Vitest + Playwright antes de merge

## Puertas de decisión

### Antes de añadir funciones

Probar con cinco contratistas pequeños y estudiantes. Medir si terminan un presupuesto sin ayuda, dónde se detienen y si volverían a guardar conceptos. Esta prueba no demuestra aún rentabilidad.

### Antes de activar publicidad

Verificar contenido original suficiente, revisión/aprobación del proveedor, privacidad/consentimiento aplicables, tráfico real y ubicación no intrusiva. No hacer clics propios ni tráfico artificial.

### Antes de backend o IA

Exigir una necesidad observada, política de datos, presupuesto máximo, seguridad, respaldo y plan de salida del proveedor.

## Roadmap propuesto

1. MVP local: un concepto de pintura por m², catálogo editable, muro 2D, producto con imagen, exportación/impresión.
2. Prueba de uso y corrección de fórmulas.
3. Más conceptos recurrentes según feedback.
4. Publicación estática; privacidad, contenido educativo y métricas mínimas.
5. Solicitud de monetización por anuncios solo al cumplir requisitos.
6. PWA/respaldo mejorado si los usuarios lo piden.
7. IA operacional en modo borrador, nunca control autónomo de cálculos o producción.
