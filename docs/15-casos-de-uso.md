# Casos de uso y flujos de datos

Descripción de los dos flujos principales: contratista y estudiante, con mapeo de datos y estados.

## Caso de uso 1: Contratista prepara presupuesto

**Actor primario:** Contratista pequeño o trabajador independiente  
**Precondición:** La app está cargada en el navegador  
**Objetivo:** Crear un presupuesto de obra con APU, superficies y exportar PDF

### Flujo principal

```
1. Contratista abre la app
   → Estado: Vacío o historial de proyectos recientes
   
2. Crear proyecto
   → Ingresa: nombre ("Casa García"), ubicación (opcional), moneda (MXN)
   → Se guarda en IndexedDB → projects
   → Estado: Proyecto creado (vacío de conceptos)
   
3. Crear concepto (pintura)
   → Ingresa: nombre, unidad (m²), cantidad base (1)
   → Agrega materiales:
      - Pintura: 0.15 L, $400/L, 10% desperdicio
      - Rodillo: 0.05 pieza, $80/pieza
   → Agrega mano de obra:
      - Pintor: 0.25 jornada, $600/jornada
   → Se calcula y guarda en IndexedDB → concepts
   → Estado: Concepto guardado, APU calculado
   
4. Revisar y ajustar porcentajes
   → Cambia: Indirectos 15%, Utilidad 25%
   → Se recalcula precio unitario en tiempo real
   → Se guarda automáticamente
   → Estado: APU actualizado
   
5. Agregar superficie (muro)
   → Dibuja muro: 5m ancho × 3m alto
   → Agrega aberturas: 2 ventanas 1.5m × 1.2m
   → Se calcula área neta = 9.3 m²
   → Selecciona acabado/producto: "Pintura mate blanca"
   → Carga imagen del producto (opcional)
   → Se guarda en IndexedDB → surfaces, images
   → Estado: Superficie creada con área y producto
   
6. Vincular concepto a superficie
   → Selecciona concepto (pintura)
   → Aplica rendimiento: 0.15 L/m²
   → Se calcula cantidad: 9.3 m² × 0.15 L × 1.10 = 1.54 L
   → Redondea a 2 latas (presentación 1 L)
   → Se guarda vínculo en IndexedDB
   → Estado: Superficie con cantidad calculada
   
7. Exportar presupuesto
   → Genera PDF con:
      - Nombre del proyecto y fecha
      - Tabla de conceptos (nombre, unidad, precio unitario)
      - Para cada superficie: croquis, área neta, producto con imagen
      - Desglose de APU (materiales, mano de obra, indirectos, utilidad)
   → Descarga como PDF
   → Estado: PDF generado
   
8. Exportar respaldo
   → Genera JSON con todos los datos (proyectos, conceptos, catálogo, imágenes en base64)
   → Descarga como .json
   → Estado: Respaldo descargado
```

### Datos involucrados

| Tabla | Operación | Datos |
|-------|-----------|-------|
| projects | INSERT | {id, nombre, fecha, ubicación, moneda, conceptos[]} |
| concepts | INSERT | {id, nombre, unidad, cantidad_base, insumos[], costo_directo, indirectos%, utilidad%} |
| insumos | INSERT (nested) | {descripción, unidad, cantidad, costo_unitario, desperdicio%} |
| surfaces | INSERT | {id, ancho, alto, aberturas[], area_bruta, area_neta, producto_id} |
| catalog | INSERT/SELECT | {id, nombre, unidad, precio, proveedor, rendimiento, fecha_precio} |
| images | INSERT | {id, blob, related_id} |

### Variantes

**V1: Cambiar APU después de crear superficie**
- Contratista va a la pestaña APU, modifica insumos o porcentajes
- Se recalcula precio unitario automáticamente
- Superficie vinculada se actualiza si usa ese concepto

**V2: Duplicar concepto para variante**
- Selecciona "Duplicar concepto", modifica insumos
- Crea una nueva línea de presupuesto con datos similares
- Permite comparar variantes rápidamente

**V3: Importar respaldo anterior**
- Carga archivo JSON de respaldo previo
- Se valida esquema y versión
- Se importan todos los proyectos y catálogo
- Se restauran imágenes desde base64

---

## Caso de uso 2: Estudiante practica cálculo APU

**Actor primario:** Estudiante de construcción o interesado en presupuestos  
**Precondición:** La app está cargada  
**Objetivo:** Aprender a calcular APU a través de ejemplos guiados

### Flujo principal

```
1. Estudiante abre la app
   → Ve opción: "Cargar ejemplo educativo" o "Crear proyecto propio"
   → Selecciona: "Ejemplo: Pintura muro interior"
   → Estado: Ejemplo cargado
   
2. Lee la guía
   → Aparece panel educativo:
      - ¿Qué es un APU?
      - ¿Cuál es el rendimiento de la pintura?
      - ¿Por qué sumamos indirectos?
   → Ejemplo paso a paso (como en 14-calculos-apu-validation.md)
   → Estado: Estudiante leyendo
   
3. Modifica insumos
   → Cambia cantidad de pintura de 0.15 L a 0.20 L
   → Se recalcula automáticamente
   → Se muestra: "Antes: $316.25 → Ahora: $xx.xx"
   → Panel educativo actualiza explicación
   → Estado: Insumo modificado, cálculo recalculado
   
4. Experimenta con porcentajes
   → Modifica indirectos de 15% a 20%
   → Se muestra impacto en el precio final
   → Pregunta interactiva: "¿Por qué subió el precio?" → tooltip
   → Estado: Porcentaje modificado
   
5. Resetea al ejemplo original (opcional)
   → Botón "Restaurar ejemplo"
   → Vuelve a valores iniciales
   → Estado: Ejemplo restaurado
   
6. Guarda su propia copia
   → Elige "Guardar como presupuesto propio"
   → Se renombra a "Mi presupuesto - Pintura"
   → Se marca como "usuario", no como "educativo"
   → Se guarda en IndexedDB
   → Estado: Copia guardada, disponible en historial
   
7. Explorar otros ejemplos
   → Menú de ejemplos: Mortero, Concreto, Tejas, etc.
   → Cada uno con explicación y datos reales típicos
   → Puede cargar varios y comparar
   → Estado: Navegando ejemplos
```

### Datos involucrados

| Tabla | Operación | Datos |
|-------|-----------|-------|
| concepts (educativo) | SELECT | {id, nombre, insumos[], tags: ["example", "education"]} |
| projects (educativo) | INSERT | {nombre, fecha, educativo: true, conceptos_ejemplo[]} |
| guías | DISPLAY | {titulo, pasos[], explicaciones[], interactivos[]} |

### Diferencias con flujo de contratista

| Aspecto | Contratista | Estudiante |
|--------|-------------|-----------|
| Datos iniciales | Vacío | Ejemplo precargado |
| Objetivo | Crear presupuesto real | Aprender fórmulas |
| Edición | Libre, sin límites | Guiada con preguntas |
| Precio | Datos reales del usuario | Datos típicos de ejemplo |
| Guardado | JSON para respaldo/reuso | Copia personal opcional |
| Etiquetas | Proyecto profesional | "Educativo" + enlace a guía |

---

## Diagrama de estados (máquina de estados)

```
[Inicio]
   ↓
[Seleccionar: Nuevo o Historial]
   ├→ [Historial de proyectos]
   │   ↓
   │   [Abrir proyecto existente]
   │   ↓
   │   [Editar / Exportar / Duplicar]
   │
   └→ [Crear proyecto]
       ↓
       [Ingresar metadatos]
       ↓
       [Vacío: sin conceptos]
       ↓
       [Crear/editar concepto]
       ├→ [Agregar insumos] → [Calcular APU] → [Guardar concepto]
       │
       ├→ [Crear/editar superficie]
       │   ├→ [Dibujar muro] → [Calcular área neta]
       │   ├→ [Agregar aberturas]
       │   ├→ [Seleccionar producto] → [Calcular cantidad]
       │   └→ [Guardar superficie]
       │
       ├→ [Revisar / Comparar APUs]
       │
       ├→ [Exportar]
       │   ├→ [PDF]
       │   ├→ [JSON respaldo]
       │   └→ [Imprimir]
       │
       └→ [Fin: Proyecto guardado]
```

---

## Entidades y relaciones (ERD textual)

```
Project
  ├─ id (PK)
  ├─ nombre
  ├─ fecha_creación
  ├─ ubicación (opcional)
  ├─ moneda
  ├─ notas
  └─ conceptos[] (FK → Concept)

Concept
  ├─ id (PK)
  ├─ project_id (FK)
  ├─ nombre
  ├─ unidad
  ├─ cantidad_base
  ├─ insumos[] (nested → Insumo)
  ├─ costo_directo
  ├─ tasa_indirectos%
  ├─ tasa_utilidad%
  ├─ base_indirectos ("directo" | "materiales")
  ├─ base_utilidad ("directo+indirectos" | "directo")
  └─ precio_unitario

Insumo
  ├─ id (PK, dentro de Concept)
  ├─ descripción
  ├─ unidad
  ├─ cantidad
  ├─ costo_unitario
  ├─ desperdicio%
  ├─ fuente
  └─ fecha_precio

Surface
  ├─ id (PK)
  ├─ project_id (FK)
  ├─ ancho_m
  ├─ alto_m
  ├─ aberturas[] (nested)
  │  ├─ id
  │  ├─ ancho_m
  │  └─ alto_m
  ├─ area_bruta
  ├─ area_neta
  ├─ producto_id (FK → CatalogItem)
  ├─ acabado (string)
  ├─ image_id (FK → Image)
  └─ cantidad_calculada

CatalogItem
  ├─ id (PK)
  ├─ nombre
  ├─ unidad_compra
  ├─ precio_unitario
  ├─ proveedor
  ├─ rendimiento (L/m², kg/m², etc.)
  ├─ presentación
  ├─ fecha_precio
  ├─ categoría
  └─ image_id (FK → Image)

Image
  ├─ id (PK)
  ├─ blob (JPEG/PNG, optimizado)
  ├─ related_id (product_id | surface_id)
  └─ fecha_carga

Preference
  ├─ key (PK, singleton)
  ├─ moneda
  ├─ idioma
  ├─ indirectos_default%
  └─ utilidad_default%
```

