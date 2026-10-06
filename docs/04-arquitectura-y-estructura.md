# Arquitectura y estructura

## Principios

- Frontend React + TypeScript + Vite; app estática y sin backend en v1.
- Separar dominio/cálculos, persistencia, componentes y pantallas.
- El motor APU es determinista y no depende de servicios de IA ni anuncios.
- Evitar dependencia de servicios con costo recurrente; todo proveedor externo debe ser sustituible.
- Orientar la estructura a módulos de obra futuros, no crear capas vacías sin uso.

## Estructura prevista

```text
calculadora-precios-unitarios/
  README.md
  package.json
  tsconfig.json
  vite.config.ts
  _config/
    codegraph-requirements.txt
  docs/
  public/
    images/
  scripts/
    scan-codegraph.ps1
    query-codegraph.py
  src/
    app/
      App.tsx
      routes.tsx
    features/
      projects/
      unit-prices/
      surfaces/
      catalog/
      education/
      ads/
    shared/
      domain/
      storage/
      ui/
      validation/
    styles/
  tests/
    unit/
    e2e/
  .audit/
    .gitkeep
```

## Responsabilidades

### Características (features/)
- **`projects`**: creación, edición, duplicación y borrado de proyectos. Gestiona lista de conceptos y metadatos (ubicación, moneda, notas).
- **`unit-prices`**: entrada de insumos (materiales, mano de obra, equipo), cálculo de costos directos, aplicación de indirectos y utilidad. Presentación del APU desglosado.
- **`surfaces`**: dibujo de muro 2D, cálculo de área neta, selección de aberturas, asociación de acabados y productos con imágenes.
- **`catalog`**: almacén local de insumos/productos reutilizables con unidades, costos, rendimientos y fechas de actualización.
- **`education`**: ejemplos guiados y ejercicios para estudiantes. Reutiliza la misma lógica de cálculo pero con datos de ejemplo claramente marcados.
- **`ads`**: slots publicitarios tipados, desactivados en v1, listos para configuración futura.

### Compartido (shared/)
- **`domain`**: núcleo de la aplicación
  - Modelos TypeScript (Project, Concept, UnitPrice, Surface, Catalog)
  - Funciones puras de cálculo: APU, área neta, rendimiento, cantidades
  - Sin dependencias externas, sin llamadas a IA o servicios
  - Completamente testeable sin mocks
  - Ejemplo: `calculateUnitPrice(costos_directos, tasa_indirectos, base_indirectos, tasa_utilidad, base_utilidad)`

- **`storage`**: persistencia
  - Repositorio Dexie/IndexedDB (lectura, escritura, búsqueda)
  - Exportación a JSON portátil con imágenes embedidas o referencias
  - Importación validada (verificar versión de esquema, migración si aplica)
  - Manejo de errores de cuota

- **`validation`**: esquemas de entrada
  - Zod o similar para validar datos al importar
  - Validar rango de valores (p. ej., área no negativa)
  - Conversiones de unidad seguras

- **`scripts`**: automatización local de CodeGraph.
- **`_config`**: dependencias auxiliares Python, fuera del runtime web.
- **`.audit`**: salidas generadas del análisis, no código fuente.

## Persistencia

### Tecnología: Dexie + IndexedDB
- **Base de datos**: IndexedDB nativa del navegador (Dexie es un wrapper tipado)
- **Origen**: datos separados por origen (protocolo + dominio + puerto)
- **Cuota**: típicamente 50MB por origen en navegadores modernos; límite negociable con el usuario

### Tablas IndexedDB
| Tabla | Contiene | Índices |
|-------|----------|---------|
| `projects` | Proyecto (nombre, fecha, ubicación, notas, conceptos) | id (PK), fecha |
| `concepts` | Concepto/APU (nombre, unidad, insumos, costos, porcentajes) | id (PK), projectId (FK) |
| `catalog` | Insumo/producto (descripción, unidad, costo, fecha, proveedor, rendimiento) | id (PK), categoryTag |
| `surfaces` | Muro (ancho, alto, aberturas, acabado) | id (PK), projectId (FK) |
| `images` | Blob de imagen (JPEG/PNG, optimizado) | id (PK), relatedId (p. ej., productId) |
| `preferences` | Moneda, idioma, porcentajes por defecto | singletonKey |

### Ciclo de vida
1. **Lectura**: al abrir la app, cargar proyectos recientes desde `projects`
2. **Escritura**: cada cambio en un input se guarda automáticamente en IndexedDB
3. **Exportación**: serializar `projects` + `concepts` + `catalog` a JSON; imágenes en base64 o como referencias
4. **Importación**: validar archivo JSON, verificar esquema/versión, migrar si necesario, escribir en IndexedDB
5. **Borrado**: opción en Ajustes para limpiar todo (proyectos, catálogo, imágenes)

### Manejo de límites de almacenamiento
- Alertar al usuario antes de alcanzar cuota (p. ej., 80%)
- Permitir eliminar imágenes grandes o proyectos antiguos
- En caso de fallo de escritura: mostrar error, mantener formulario, ofrecer exportación inmediata
- No silenciar errores de almacenamiento

### Seguridad y privacidad
- No almacenar datos de pago, credenciales, ni información sensible
- Sin API de usuario en v1
- Los datos son del navegador local; no hay sincronización en la nube
- Borrar los datos del navegador elimina todo

## Publicación

Despliegue estático en un host cuyo plan permita uso comercial y monetización; evaluar Cloudflare Pages/Workers según los términos vigentes. No usar GitHub Pages para operar la versión comercial, pues sus restricciones excluyen hosting gratuito para sitios de negocio o SaaS. Dominio separado y opcional. No se integran servicios cloud de datos en la primera entrega.
