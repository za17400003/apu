# Decisiones de tecnología

Justificación de cada herramienta, librería y servicio elegido para el proyecto.

## Stack principal

### React + TypeScript + Vite

**Decisión:** Frontend web con React en TypeScript, empaquetado con Vite.

**Por qué React:**
- Componentes reutilizables para formularios (entrada de insumos, edición de superficies)
- Estado local predecible (useState, useReducer) para datos de edición
- Ecosistema maduro para tablas, gráficos y validación
- Comunidad grande; fácil encontrar soluciones

**Por qué TypeScript:**
- Tipos estrictos (`strict: true`) para reducir bugs de cálculo (p. ej., número vs string)
- Documentación automática en el IDE (autocompletado, tipos de función)
- Refactorizar con confianza (renombrar una propiedad afecta todos los usos)
- Contrato claro entre dominio (cálculos puros) y componentes

**Por qué Vite:**
- Build extremadamente rápido (HMR < 100ms)
- Salida optimizada: code-splitting, lazy-loading, minificación
- Esencialmente configurable; sin capas de abstracción innecesarias
- Ideal para app estática (sin servidor)
- Alternativa: webpack es más pesado para este caso

**Alternativas rechazadas:**
- Next.js: excesivo para una app estática; introduce complejidad de API routes
- CRA (Create React App): build lento, menos control, EoL anunciado en documentación oficial
- Vue/Angular/Svelte: menores; React tiene mayor ecosistema de herramientas de construcción

---

## Persistencia: Dexie + IndexedDB

**Decisión:** Base de datos local en IndexedDB, accedida mediante Dexie (ORM tipado).

**Por qué IndexedDB:**
- Almacenamiento local en el navegador (~50MB/origen)
- No requiere backend ni servidor
- Datos privados del usuario, no se envían a terceros
- Sincrónico + async; Dexie expone promesas
- Separado por origen (protocolo + dominio + puerto); datos no se pierden entre sesiones (a menos que se limpie caché)

**Por qué Dexie (no acceso directo a IndexedDB):**
- Wrapper tipado con TypeScript (tipos seguros para esquema)
- Sintaxis más limpia que IndexedDB raw API
- Manejo de transacciones simplificado
- Migraciones de esquema manejables
- Activamente mantenido

**Cuota y límites:**
- Límite típico: 50MB/origen (navegadores modernos permiten ir hasta GB si el usuario acepta)
- Nuestro caso: con imágenes optimizadas (~2MB c/u), caben ~25 imágenes + datos de texto
- Estrategia: alertar al usuario antes de 80%, permitir limpiar datos antiguos

**Alternativas rechazadas:**
- Firebase Realtime/Firestore: requiere backend y sincronización; fuera de alcance v1
- SQLite.js (sql.js): más pesado; IndexedDB es más eficiente
- LocalStorage: límite ~5MB; insuficiente para imágenes
- Service Worker + cache: complicado para datos estructurados

---

## Testing: Vitest + Playwright

**Decisión:** Tests unitarios con Vitest; tests E2E con Playwright.

**Por qué Vitest:**
- Configuración de Jest pero con ejecución ultrarápida (ESM native)
- Perfecto para funciones puras de cálculo sin dependencias
- Integración con TypeScript sin pasos adicionales
- Snapshots para verificar fórmulas complejas
- Cobertura nativa

**Por qué Playwright:**
- Cross-browser (Chrome, Firefox, Safari) sin instalarlos
- Headless + headed mode (útil para debug)
- Grabación de videos en caso de fallos
- Soporte excelente para móvil/tablet
- Buena integración en CI/CD

**Cobertura esperada:**
- Vitest: >= 90% en `shared/domain/` (funciones puras)
- Vitest: >= 80% en `shared/storage/` (persistencia)
- Playwright: 3-5 flujos críticos (crear proyecto, APU, exportar)

**Alternativas rechazadas:**
- Jest: más lento; Vitest es mejor para este caso
- Cypress: bueno pero menos ligero que Playwright
- Testing Library: lo usaremos pero más para componentes, no reemplaza Playwright

---

## Validación: Zod

**Decisión:** Esquemas de validación con Zod para importación/exportación.

**Por qué Zod:**
- Esquemas declarativos y fáciles de leer
- Excelentes mensajes de error en castellano
- Validación al importar JSON (verificar tipos, rangos)
- Inferencia de tipos TypeScript automática

**Casos de uso:**
- Importar archivo JSON: validar que tenga estructura correcta antes de cargar en IndexedDB
- Importar desde CSV: validar que números sean válidos, conversiones de unidad correctas
- Validar entrada de usuario: áreas no negativas, costos > 0, etc.

**Alternativas:**
- Ajv: más rápido pero menos amigable
- Yup: más pesado que Zod
- Validación manual: propenso a bugs

---

## UI: Material-UI o Headless

**Decisión:** A definir entre Material-UI (MUI) o componentes headless (Headless UI / Radix).

**Pro Material-UI:**
- Componentes completos listos para usar
- Tema visual coherente
- Documentación excelente
- Accesibilidad WCAG built-in

**Pro Headless (Radix/Headless UI):**
- Más ligero
- Máximo control de estilos
- Mejor para diseños custom
- Menos dependencias

**Recomendación:** Headless + Tailwind para v1 (más control, menos peso). Si la UI se complica, migrar a MUI.

---

## Estilos: Tailwind CSS

**Decisión:** Utility-first CSS con Tailwind.

**Por qué Tailwind:**
- Clases predefinidas, no necesita escribir CSS nuevo
- Responsive fácil (@media breakpoints integrados)
- Dark mode automático (si el SO lo soporta)
- Integración con componentes de React
- Salida optimizada en build (solo clases usadas)

**Alternativas:**
- CSS Modules: más control pero menos eficiente
- Styled Components: runtime overhead; Tailwind es compile-time
- PostCSS raw: muy manual

---

## Gráficos: Plotly.js o Recharts

**Decisión:** A definir según necesidad de dashboards.

En v1, no son críticos (mostrar tablas es suficiente). Si hay demanda:
- **Recharts**: ligero, React nativo, suficiente para gráficos simples
- **Plotly.js**: más poderoso pero más pesado

---

## Hosting y despliegue

**Decisión:** Cloudflare Pages para hosting estático.

**Por qué Cloudflare Pages:**
- Despliegue automático desde Git
- HTTPS automático
- CDN global
- Planes comerciales permitidos (a diferencia de GitHub Pages)
- Bajo costo o gratuito
- Workers para lógica backend futura (si se necesita)

**Alternativas:**
- GitHub Pages: restringe usos comerciales/SaaS
- Netlify: bueno, similar a Cloudflare
- AWS S3 + CloudFront: más caro, menos automático
- Vercel: orientado a Next.js; overhead para app estática

**Dominio:** Separado, opcional en v1. Inicialmente usar dominio de Cloudflare (*.pages.dev).

---

## Internacionalización (i18n)

**Decisión:** i18next (si hay demanda).

En v1, enfocarse en español (MXN moneda por defecto). Si se expande a otros países:
- **i18next**: framework estándar, con plugin React
- Ficheros JSON por idioma
- Namespace por módulo
- Plurales y fechas automáticas

**MVP:** Hardcodear en español; refactorizar a i18next si es necesario.

---

## Analytics (opcional)

**Decisión:** No incluir en v1. Si se agrega, usar Plausible o Fathom Analytics.

**Por qué no Google Analytics:**
- No se ajusta a nuestra privacidad de first-party
- Vendedor centralizado con datos de usuarios

**Si se agrega analytics:**
- **Plausible**: respeta privacidad, no requiere consentimiento
- **Fathom Analytics**: alternativa igual de buena
- **Mediciones mínimas:** proyectos creados/mes, flujos completados, errores

---

## Definición de "no depender de servicios recurrentes"

Criterio: todo proveedor externo debe:
1. Tener alternativa local o reemplazable (Cloudflare Pages → Netlify, etc.)
2. No ser el cuello de botella para funcionalidad crítica (cálculo APU no depende de API)
3. Tener política de datos clara y auditada
4. Plan de salida documentado (si cierran, ¿podemos migrar? ¿es sencillo?)

**Proveedores aceptables:**
- Cloudflare Pages: código abrazable, no vendor lock-in
- Anuncios: reemplazables, no críticos

**Proveedores inaceptables:**
- Firebase Firestore obligatorio: lock-in alto, costo escala mal
- IA generativa en cálculo: no es determinista, no es verificable

---

## Roadmap de tecnología

| Fase | Decisión |
|------|----------|
| **v1** | React + TypeScript + Vite + Dexie + Tailwind + Cloudflare Pages |
| **v1.1** | Agregue i18next si es necesario; Analytics opcional (Plausible) |
| **v2** | Considere PWA (offline-first); Service Worker |
| **v2+** | Backend solo si hay colaboración real o sincronización entre dispositivos |
| **Never** | IA en cálculo crítico; SaaS sin plan de salida |

