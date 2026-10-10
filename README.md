# Calculadora de precios unitarios de obra

Herramienta web **gratuita, responsiva y sin backend** para calcular análisis de precios unitarios (APU) de conceptos de construcción. Dirigida a contratistas pequeños y trabajadores independientes.

## Estado: Prototipo Funcional ✅

**Versión:** 0.1.0 | **Fecha:** octubre 2026

### Lo que ya funciona

- ✅ **Gestión de proyectos** - crear, editar, duplicar proyectos
- ✅ **Editor de APU** - desglose de materiales, mano de obra, equipo con cálculo automático
- ✅ **Cálculo preciso** - sin redondeo intermedio, conforme a docs/14-calculos-apu-validation.md
- ✅ **Superficies (muros)** - dibujar con ancho/alto, agregar aberturas, calcular área neta
- ✅ **Cantidades de producto** - cálculo por rendimiento, desperdicio y presentación
- ✅ **Persistencia local** - IndexedDB, datos seguros en el navegador del usuario
- ✅ **Respaldo/Restauración** - exportar/importar JSON portátil
- ✅ **Responsive UI** - mobile, tablet y desktop con navegación adaptativa
- ✅ **Tests validados** - 21 tests unitarios pasando (dominio + superficies + cantidades)
- ✅ **Build optimizado** - 85 KB gzipped, listo para producción

### Por hacer (próximas fases)

- 🔲 Imágenes de productos en superficies
- 🔲 Modo educativo para estudiantes con ejemplos guiados
- 🔲 Catálogo completo y reutilizable
- 🔲 PWA (instalable, offline-first)
- 🔲 Tests E2E con Playwright
- 🔲 Publicidad (cuando se apruebe)
- 🔲 Disponibilidad en GitHub Pages / Cloudflare Pages

## Arquitectura

```
src/
├─ shared/domain/       Lógica pura de cálculo (sin dependencias)
│  ├─ types.ts          Modelos TypeScript
│  ├─ apu.ts            Cálculos de precio unitario
│  ├─ surfaces.ts       Cálculos de superficies (muros)
│  ├─ quantities.ts     Cálculos de cantidades
│  └─ rounding.ts       Formateo y redondeo
├─ shared/storage/      Persistencia (Dexie + IndexedDB)
│  ├─ db.ts             Operaciones CRUD
│  └─ backup.ts         Export/import JSON
├─ shared/ui/           Componentes compartidos
│  └─ Sidebar.tsx
├─ shared/validation/   Esquemas Zod
│  └─ schemas.ts
├─ features/            Vistas de características
│  ├─ projects/         Gestión de proyectos
│  ├─ unit-prices/      Editor de APU
│  ├─ surfaces/         Editor de muros
│  └─ catalog/          Ajustes y respaldo
├─ app/                 Punto de entrada
│  └─ App.tsx           Enrutamiento y estado global
├─ styles/
│  └─ globals.css       Tailwind + custom CSS
└─ main.tsx             Bootstrap de React

tests/unit/
├─ apu.test.ts          Tests de cálculo de APU
├─ surfaces.test.ts     Tests de cálculo de superficies
└─ quantities.test.ts   Tests de cálculo de cantidades
```

## Stack técnico

- **Frontend:** React 18 + TypeScript 5 (strict mode)
- **Build:** Vite 5
- **Estilos:** Tailwind CSS 3 + IBM Plex Sans/Mono
- **Persistencia:** Dexie 4 + IndexedDB
- **Testing:** Vitest 1 + Playwright (preparado para E2E)
- **Validación:** Zod 3
- **Deploy:** estático (Cloudflare Pages, Netlify, GitHub Pages)

## Documentación

Ver carpeta `docs/`:

- **[00-alcance-y-requisitos.md](docs/00-alcance-y-requisitos.md)** - Propósito, usuarios, requisitos
- **[01-diseno-visual.md](docs/01-diseno-visual.md)** - Paleta, tipografía, responsividad
- **[02-pantallas-y-flujos.md](docs/02-pantallas-y-flujos.md)** - Flujos del contratista y estudiante
- **[03-calculo-apu-y-superficies.md](docs/03-calculo-apu-y-superficies.md)** - Fórmulas de APU
- **[04-arquitectura-y-estructura.md](docs/04-arquitectura-y-estructura.md)** - Estructura del código
- **[05-datos-locales-y-privacidad.md](docs/05-datos-locales-y-privacidad.md)** - Persistencia, privacidad
- **[14-calculos-apu-validation.md](docs/14-calculos-apu-validation.md)** - Fórmulas + ejemplos + casos de prueba
- **[15-casos-de-uso.md](docs/15-casos-de-uso.md)** - Flujos detallados, ERD
- **[16-tech-decisions.md](docs/16-tech-decisions.md)** - Por qué cada herramienta

## Instalación local

### Requisitos

- Node.js 22+
- npm 11+

### Setup

```bash
git clone https://github.com/za17400003/calculadora-precios-unitarios.git
cd calculadora-precios-unitarios

npm install
npm run dev      # http://localhost:5173
```

## Scripts disponibles

```bash
npm run dev          # Inicia dev server con HMR
npm run build        # Build producción en dist/
npm run preview      # Sirve el build localmente
npm test             # Ejecuta tests unitarios (Vitest)
npm run test:ui      # Tests con UI interactiva
npm run test:coverage # Reporte de cobertura
npm run lint         # ESLint (setup pendiente)
npm run codegraph    # Análisis de arquitectura (requiere Python)
```

## Criterios de aceptación MVP (v0.1)

✅ **Fase 1: Proyecto y APU**
- [x] Crear proyecto con nombre, ubicación, moneda
- [x] Crear concepto con materiales, mano de obra, equipo
- [x] Calcular precio unitario en tiempo real
- [x] Ajustar indirectos y utilidad
- [x] Cambiar un costo y ver actualizado el resultado

✅ **Fase 2: Superficies**
- [x] Dibujar muro con ancho, alto en metros
- [x] Calcular área bruta y neta (con aberturas opcionales)
- [x] Calcular cantidad de producto por rendimiento
- [x] Visualizar cantidad redondeada

✅ **Fase 3: Persistencia y respaldo**
- [x] Recargar página y recuperar proyectos
- [x] Exportar JSON
- [x] Importar JSON sin perder datos
- [x] Opción de borrar todo

✅ **Fase 4: UI y Responsividad**
- [x] Layout desktop con sidebar
- [x] Layout mobile con navegación inferior
- [x] Sin desplazamiento horizontal en móvil
- [x] Imprimir/descargar como PDF

✅ **Fase 5: Calidad**
- [x] TypeScript strict sin errores
- [x] Tests unitarios 21/21 verde
- [x] Build sin warnings
- [x] Archivo .gitignore configurado

## Cómo verificar

### Tests unitarios

```bash
npm test

# Expected output:
# Test Files  3 passed (3)
# Tests  21 passed (21)
```

### Type-check

```bash
npx tsc --noEmit
# Sin output = sin errores
```

### Build producción

```bash
npm run build
# dist/index.html  0.64 kB
# dist/assets/... 266 KB → 85 KB gzipped
```

## Privacidad

- ✅ Sin servidor backend en v1
- ✅ Todos los datos en IndexedDB local (navegador)
- ✅ Sin sincronización a la nube (usuario controla respaldos)
- ✅ Sin telemetría ni tracking (pending: métricas mínimas)
- ✅ Sin IA en cálculos críticos

Ver [docs/05-datos-locales-y-privacidad.md](docs/05-datos-locales-y-privacidad.md) para más detalles.

## Monetización

- ✅ Herramienta gratuita (sin suscripción)
- 🔲 Publicidad (cuando se apruebe): espacios documentados pero desactivados
- 🔲 Futuro: PWA instalable, SaaS colaborativo (v2+)

## Contribuciones

Este es un proyecto en desarrollo. Las contribuciones se aceptan solo a través de pull requests a `https://github.com/za17400003/calculadora-precios-unitarios`.

## Licencia

(Pendiente definir)

---

**Última actualización:** octubre 2026 | **Desarrollado con:** React, TypeScript, Vite
