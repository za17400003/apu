# Cálculo APU y superficies

## Modelo de un concepto

Un concepto (o "unidad de obra") se expresa con:
- **Nombre**: descripción de la unidad de obra (p. ej., "Pintura muro interior")
- **Unidad base**: metro cuadrado (m²), metro lineal (m), pieza, etc.
- **Cantidad base**: cantidad de esa unidad por la que se calcula el APU (generalmente 1)

Cada concepto agrupa insumos en tres categorías:

- **Materiales**: pintura, arena, cemento, acero, etc. (con unidad de compra: L, kg, piezas, etc.)
- **Mano de obra**: oficial, peón, herramientas manuales (con unidad: jornada, hora, etc.)
- **Equipo/herramienta**: andamios, compresores, etc. (con unidad: día, hora, etc.)

Cada renglón (insumo) conserva:
- Descripción y unidad del insumo
- Cantidad necesaria por unidad de concepto
- Costo unitario actual (con fuente y fecha)
- Desperdicio opcional (porcentaje adicional)
- Las conversiones de unidad deben ser explícitas; no inferir equivalencias ocultas

## Fórmulas de cálculo

### Importe por insumo
```
Importe insumo = Cantidad × Costo unitario × (1 + Desperdicio%)
```

### Costo directo unitario
```
Costo directo = Σ(Materiales) + Σ(Mano de obra) + Σ(Equipo/herramienta)
```

### Indirectos (opcional)
Base seleccionable: sobre costo directo, o solo materiales. Tasa editable.
```
Indirectos = Costo directo × Tasa indirectos (%) / 100
```

### Utilidad o ganancia (opcional)
Base seleccionable: sobre costo directo + indirectos, o solo directos. Tasa editable.
```
Utilidad = Base × Tasa utilidad (%) / 100
```

### Precio unitario final
```
Precio unitario = Costo directo + Indirectos + Utilidad
```

**Notas:**
- No redondear internamente cada renglón antes de sumar; acumular precisión completa
- Mostrar el desglose completo (cada insumo, cada categoría, cada etapa de porcentaje)
- El usuario puede desactivar o cambiar porcentajes en cualquier momento
- Impuestos no se calculan automáticamente en v1
- Redondeo configurable solo al presentar el resultado final

## Cálculo de superficies (muros)

### Dimensiones y área
- **Ancho y alto**: en metros, decimales permitidos (p. ej., 3.50 m × 2.80 m)
- **Área bruta**: ancho × alto
- **Aberturas**: rectángulos opcionales (puertas, ventanas) con ancho y alto propios
- **Área neta**: área bruta − Σ(aberturas); no permitir área neta ≤ 0
- El croquis 2D usa proporciones aproximadas, cotas etiquetadas y aberturas seleccionadas. No sustituye plano constructivo ni levantamiento profesional.
- Se permiten varios muros por proyecto y acabado/producto por superficie.

### Ejemplo de cálculo de superficie
```
Ancho: 5.00 m, Alto: 3.00 m
Área bruta = 5.00 × 3.00 = 15.00 m²

Aberturas:
- Puerta: 1.00 m × 2.10 m = 2.10 m²
- Ventana: 1.50 m × 1.20 m = 1.80 m²
- Ventana: 1.50 m × 1.20 m = 1.80 m²
Total aberturas = 5.70 m²

Área neta = 15.00 − 5.70 = 9.30 m²
```

## Rendimiento y cantidades de producto

### Concepto de rendimiento
El **rendimiento** es la cantidad de producto necesario por unidad de superficie y se expresa en unidades de compra:
- **Litros/m²** (p. ej., pintura: 0.15 L/m²)
- **Kg/m²** (p. ej., cemento: 2.5 kg/m²)
- **Piezas/m²** (p. ej., baldosas: 4 piezas/m²)
- **Metros/m²** (p. ej., cinta: 0.5 m/m²)

### Cálculo de cantidad requerida
```
Cantidad bruta = Área neta (m²) × Rendimiento (u/m²) × Capas (si aplica) × (1 + Desperdicio%)
Cantidad en envases = Cantidad bruta / Presentación (p. ej., 1 L por lata)
Envases requeridos = redondear hacia arriba (Cantidad en envases)
```

### Ejemplo con pintura
```
Superficie: 9.30 m² (del ejemplo anterior)
Rendimiento: 0.15 L/m²
Desperdicio: 10%
Presentación: 1 L por lata (mínimo 1 lata por compra)

Cantidad bruta = 9.30 × 0.15 × (1 + 0.10) = 1.54 L
Latas requeridas = redondear_arriba(1.54) = 2 latas
Costo producto = 2 latas × $45/lata = $90
```

El usuario puede:
- Desactivar el redondeo hacia arriba para ver consumo fraccionario
- Modificar el rendimiento, desperdicio y presentación según su experiencia
- Cambiar la unidad de compra (de litro a galón, de kg a bolsa, etc.)

## Imagen de producto

Imagen opcional, local y solo ilustrativa. Debe poder quitarse/reemplazarse y no implica que la aplicación verifique marca, color, stock o precio.

## Calidad del cálculo

- Implementar el motor de cálculo como funciones puras TypeScript sin llamadas a IA.
- Definir pruebas unitarias con casos normales, límites, aberturas, desperdicio, porcentajes y unidades.
- Guardar versión de esquema y versión de fórmula en cada proyecto exportado para facilitar migraciones.
- Las guías incluyen supuestos y un ejemplo resuelto paso a paso.
