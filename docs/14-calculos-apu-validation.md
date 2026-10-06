# Validación de cálculos APU

Documento de referencia con fórmulas detalladas y ejemplos numéricos completos para verificar que la aplicación calcula correctamente.

## Fórmulas de referencia

### 1. Costo por insumo

```
Costo insumo = Cantidad × Costo unitario × (1 + Desperdicio%)
```

Ejemplo:
```
Pintura: 0.15 L × $400/L × (1 + 10%) = 0.15 × 400 × 1.10 = $66
```

### 2. Costo directo por categoría

```
Costo materiales = Σ(insumos materiales)
Costo mano de obra = Σ(insumos mano de obra)
Costo equipo = Σ(insumos equipo/herramienta)

Costo directo total = Costo materiales + Costo mano de obra + Costo equipo
```

### 3. Indirectos

```
Indirectos = Costo directo × (Tasa indirectos% / 100)
```

Bases opcionales:
- Sobre costo directo (más común)
- Solo sobre materiales

### 4. Utilidad

```
Utilidad = Base × (Tasa utilidad% / 100)
```

Bases opcionales:
- Sobre (costo directo + indirectos)
- Solo sobre costo directo

### 5. Precio unitario

```
Precio unitario = Costo directo + Indirectos + Utilidad
```

### 6. Redondeo

El redondeo se aplica **solo al resultado final**, no a cada insumo:
```
Precio unitario redondeado = redondear(Precio unitario, 2 decimales)
```

## Ejemplo 1: Pintura muro interior (1 m²)

### Datos de entrada

| Insumo | Unidad | Cantidad | Costo unitario | Desperdicio | Costo |
|--------|--------|----------|----------------|-------------|-------|
| Pintura látex | L | 0.15 | $400 | 10% | (calc) |
| Rodillo | pieza | 0.05 | $80 | 0% | (calc) |
| **Mano de obra** |  |  |  |  |  |
| Pintor | jornada | 0.25 | $600 | 0% | (calc) |

### Cálculo detallado

**Materiales:**
```
Pintura = 0.15 L × $400/L × (1 + 10%) = 0.15 × 400 × 1.10 = $66.00
Rodillo = 0.05 pieza × $80/pieza × (1 + 0%) = 0.05 × 80 × 1.00 = $4.00
Total materiales = $66.00 + $4.00 = $70.00
```

**Mano de obra:**
```
Pintor = 0.25 jornada × $600/jornada × (1 + 0%) = 0.25 × 600 = $150.00
Total mano de obra = $150.00
```

**Costo directo:**
```
Costo directo = $70.00 + $150.00 + $0 = $220.00
```

**Indirectos (15% sobre costo directo):**
```
Indirectos = $220.00 × (15 / 100) = $33.00
```

**Utilidad (25% sobre costo directo + indirectos):**
```
Utilidad = ($220.00 + $33.00) × (25 / 100) = $253.00 × 0.25 = $63.25
```

**Precio unitario:**
```
Precio unitario = $220.00 + $33.00 + $63.25 = $316.25
```

**Redondeado (2 decimales):**
```
Precio unitario final = $316.25
```

---

## Ejemplo 2: Muros con superficies

### Datos de entrada

Concepto: **Mortero y ladrillo (1 m²)**

Muro: 5.0 m ancho × 3.0 m alto, 2 ventanas de 1.5 m × 1.2 m cada una

### Cálculo de superficie

```
Área bruta = 5.0 × 3.0 = 15.0 m²
Área aberturas = 2 × (1.5 × 1.2) = 2 × 1.8 = 3.6 m²
Área neta = 15.0 - 3.6 = 11.4 m²
```

### Cálculo de insumos

| Insumo | Rendimiento | Unidad | Cantidad base (1m²) | Cantidad real (11.4 m²) | Costo unitario | Desperdicio | Costo total |
|--------|-------------|--------|---------------------|-------------------------|----------------|-------------|-------------|
| Ladrillo | 60 piezas/m² | pieza | 60 | 684 | $0.80 | 5% | $573.12 |
| Mortero | 40 kg/m² | kg | 40 | 456 | $0.20 | 10% | $100.32 |
| Mano de obra | 1 jornada/4m² | jornada | 0.25 | 2.85 | $600 | 0% | $1,710 |

**Cálculo detallado:**

```
Ladrillo = 684 piezas × $0.80/pieza × (1 + 5%) = 684 × 0.80 × 1.05 = $573.12
Mortero = 456 kg × $0.20/kg × (1 + 10%) = 456 × 0.20 × 1.10 = $100.32
Mano de obra = 2.85 jornadas × $600/jornada = $1,710.00

Costo directo = $573.12 + $100.32 + $1,710.00 = $2,383.44
Indirectos (10%) = $2,383.44 × 0.10 = $238.34
Utilidad (20%) = ($2,383.44 + $238.34) × 0.20 = $544.36

Precio unitario = $2,383.44 + $238.34 + $544.36 = $3,166.14
```

---

## Ejemplo 3: Producto con rendimiento

### Datos de entrada

Concepto: **Pintura muro interior (1 m²)**
- Rendimiento: 0.2 L/m²
- Producto: lata de 4 L, $1,200/lata
- Desperdicio: 15%

Superficie: 45 m²

### Cálculo de cantidad

```
Cantidad bruta = 45 m² × 0.2 L/m² × (1 + 15%) = 45 × 0.2 × 1.15 = 10.35 L
Latas requeridas = redondear_arriba(10.35 L / 4 L) = redondear_arriba(2.5875) = 3 latas
Costo total = 3 latas × $1,200/lata = $3,600
```

---

## Casos de prueba (test cases)

### T1: Cálculo básico sin porcentajes

```
Entrada:
- Material: 2 unidades × $10 = $20
- Mano de obra: 1 jornada × $100 = $100
- Indirectos: 0%
- Utilidad: 0%

Salida esperada: $120.00
```

### T2: Cálculo con desperdicio

```
Entrada:
- Material: 10 L × $50/L × (1 + 20% desperdicio) = 10 × 50 × 1.20 = $600

Salida esperada: $600.00
```

### T3: Cálculo con múltiples porcentajes

```
Entrada:
- Costo directo: $1,000
- Indirectos: 15% → $150
- Utilidad: 25% sobre (directo + indirectos) → $287.50
Base final = $1,000 + $150 + $287.50

Salida esperada: $1,437.50
```

### T4: Área neta con aberturas

```
Entrada:
- Muro: 10 m × 3 m = 30 m²
- Puerta: 1 m × 2.5 m = 2.5 m²
- Ventana: 2 m × 1 m = 2 m²
Área neta = 30 - 2.5 - 2 = 25.5 m²

Salida esperada: 25.5 m²
```

### T5: Redondeo de precio

```
Entrada:
Precio calculado = $316.2546

Salida esperada (redondeo 2 decimales): $316.25
```

### T6: Cantidad de producto con redondeo

```
Entrada:
- Área: 100 m²
- Rendimiento: 0.15 L/m²
- Desperdicio: 10%
- Presentación: 4 L

Cantidad = 100 × 0.15 × 1.10 = 16.5 L
Envases = redondear_arriba(16.5 / 4) = redondear_arriba(4.125) = 5

Salida esperada: 5 envases
```

---

## Validación en la aplicación

Cada vez que se modifique un insumo, costo o porcentaje, la aplicación debe:

1. Recalcular **todos** los valores derivados
2. Mostrar el **desglose completo** (cada insumo, cada categoría, cada porcentaje)
3. **No redondear** internamente; mostrar precisión completa
4. Aplicar redondeo **solo** al resultado final presentado
5. Permitir al usuario **verificar** cada paso del cálculo

