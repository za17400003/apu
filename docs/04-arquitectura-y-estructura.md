# Arquitectura y estructura

## Principios

- Frontend React + TypeScript + Vite; app estática y sin backend en v1.
- Separar dominio/cálculos, persistencia, componentes y pantallas.
- El motor APU es determinista y no depende de servicios de IA ni anuncios.
- Evitar dependencia de servicios con costo recurrente; todo proveedor externo debe ser sustituible.
- Una carpeta por pantalla en `features/`; nada se importa entre carpetas hermanas. Lo que dos pantallas necesitan
  igual sube a `shared/`. Si un componente ya no lo usa más que una pantalla, vive dentro de esa pantalla, no en
  una carpeta aparte (así terminaron `CroquisMuro` y `EditorMuro` dentro de `presupuesto/`: ver docs/15, "Muros
  fusionados en Cotización").
- Nombres de carpeta de `features/` en español, porque así está el resto del dominio y de la interfaz. Dentro de
  `shared/domain/`, los nombres de archivo usan la palabra del dominio cuando el archivo es de este negocio
  (`apu.ts`, `cotizacion.ts`, `croquis.ts`, `folio.ts`) y un término técnico en inglés cuando es una pieza
  genérica de programación (`types.ts`, `factories.ts`, `ids.ts`).

## Estructura real

```text
calculadora-precios-unitarios/
  README.md
  DEVELOPMENT.md
  package.json
  tsconfig.json
  vite.config.ts
  _config/
    codegraph-requirements.txt
  docs/
  src/
    app/
      App.tsx
    features/
      proyectos/
        ListaProyectos.tsx    historial: buscar, filtrar, ordenar, duplicar, archivar
        ProyectoView.tsx      datos del proyecto, folio, cliente, resumen
      apu/
        ApuView.tsx           conceptos: materiales, mano de obra, equipo; sugerencias del catálogo
      presupuesto/
        PresupuestoView.tsx   partidas (concepto × cantidad), condiciones, totales, imprimir
        EditorMuro.tsx        medidas y aberturas de un muro, dentro de una partida
        CroquisMuro.tsx       dibujo 2D del muro a partir de sus medidas
        CotizacionImpresa.tsx documento para imprimir o guardar como PDF
      ajustes/
        AjustesView.tsx       respaldo, borrado, estado del almacenamiento
        PerfilContratista.tsx datos del contratista (van en el encabezado de la cotización)
    shared/
      domain/     tipos y funciones puras (ver tabla abajo)
      storage/    db.ts (Dexie) y backup.ts (exportar/importar JSON)
      ui/         componentes de formulario reutilizados entre pantallas
      validation/ numeros.ts (reglas de los campos) y schemas.ts (Zod, al importar)
    styles/
  tests/
    unit/
  .audit/
    .gitkeep
```

Lo que `docs/00` deja para después y por eso no tiene carpeta propia todavía: modo estudiante (`features/education`)
y anuncios activos (`features/ads`; hoy es solo `shared/ui/EspacioPublicitario.tsx`, que no renderiza nada hasta
tener aprobación — ver docs/06). No crear esas carpetas de antemano es intencional: evita capas vacías sin uso.

## shared/domain: un archivo por cálculo

| Archivo | Qué calcula |
|---|---|
| `types.ts` | Los modelos: `Proyecto`, `Concepto`, `Insumo`, `Superficie`, `Abertura`, `Partida`, `Perfil`, `ItemCatalogo` |
| `factories.ts` | Un objeto nuevo de cada tipo, con valores neutros (las tasas arrancan en 0) |
| `apu.ts` | Precio unitario: costo directo, indirectos, utilidad |
| `surfaces.ts` | Área bruta, aberturas, área neta de un muro |
| `croquis.ts` | Dónde dibujar cada abertura dentro del muro (geometría del croquis) |
| `cotizacion.ts` | Junta partidas con sus conceptos y muros: subtotal, IVA, anticipo |
| `quantities.ts` | Cantidad de producto a partir de rendimiento y desperdicio (función genérica, sin atarse a `Superficie`) |
| `folio.ts` | Folio sugerido (COT-AAAA-NN) y detección de folios repetidos |
| `duplicar.ts` | Copia un proyecto completo con identificadores nuevos |
| `fechas.ts` | Fecha de hoy en local y si una fecha es futura |
| `rounding.ts` | Formato de moneda y de números |
| `units.ts` | Catálogo cerrado de unidades y su símbolo |
| `ids.ts` | Identificadores únicos; con reserva para cuando `crypto.randomUUID` no existe (ver abajo) |
| `archivo.ts` | Nombre sugerido del PDF a partir del nombre del proyecto y el folio |

Todas son funciones puras, sin IA ni llamadas externas, y se prueban sin simular nada (`tests/unit/`).

## Persistencia

### Tecnología: Dexie + IndexedDB

Una sola base, `CalculadoraAPU-v2`, con tres tablas:

| Tabla | Contiene |
|---|---|
| `projects` | Cada proyecto completo: conceptos, muros y partidas van **dentro** del mismo documento, no en tablas separadas con llave foránea. Se guarda y se lee de una vez. |
| `perfil` | Datos del contratista (un solo registro). Se usan en el encabezado de cualquier cotización que se imprima. |
| `catalogo` | Insumos ya capturados (materiales, mano de obra, equipo), para sugerirlos al escribir uno nuevo. |

No hay tabla de imágenes ni de preferencias: no se implementaron (ver docs/00, fuera de alcance en v1).

### Por qué el proyecto completo es un solo documento

Guardar conceptos y muros aparte, con llave al proyecto, hubiera significado dos escrituras por cambio y el riesgo
de que una fallara y la otra no. Al ser un documento único, cada cambio es una sola escritura atómica
(`db.projects.put(proyecto)`), y exportar/importar un proyecto es copiar un objeto, sin reconstruir relaciones.

### Identificadores: no solo `crypto.randomUUID()`

Esa función del navegador solo existe en contextos seguros (HTTPS o `localhost`); al abrir la app por la IP de la
red local es HTTP, y ahí no existe. `shared/domain/ids.ts` genera el identificador con `crypto.getRandomValues`
cuando `randomUUID` no está disponible, para que crear proyectos funcione igual en la red local.

### Ciclo de vida

1. **Lectura**: al abrir la app, `obtenerProyectos()` trae todos los proyectos y completa con valores por defecto
   los campos que no existían en versiones anteriores del formato (ver `normalizar` en `storage/db.ts`).
2. **Escritura**: cada cambio actualiza primero la pantalla y después persiste (sin esperar a Dexie para que no
   haya demora al teclear).
3. **Exportación/importación**: `storage/backup.ts` arma o valida (con Zod) un JSON con todos los proyectos.
4. **Borrado**: opción en Ajustes para vaciar las tres tablas.

### Seguridad y privacidad

- No se almacenan datos de pago ni credenciales.
- Sin servidor ni API: todo vive en el navegador del dispositivo.
- Borrar los datos del navegador elimina todo; no hay copia en la nube.

## Publicación y acceso en red

Mientras se construye, la misma app sirve para desarrollar y para probarse: `npm run dev` levanta un único
servidor Vite, abierto a la red local (`host: true` en `vite.config.ts`), así que un cambio se ve igual en esta
PC y en cualquier otro dispositivo de la misma red, sin reconstruir nada. Antes de publicarla para usuarios
reales (fuera de esta red), hace falta separar un sitio de producción: Cloudflare Pages/Workers es la opción
evaluada: GitHub Pages excluye explícitamente hosting gratuito para sitios de negocio o SaaS.
