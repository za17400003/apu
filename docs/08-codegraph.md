# CodeGraph

## Propósito

CodeGraph es una herramienta de desarrollo para visualizar dependencias entre funciones, métodos y clases. No forma parte de la aplicación web ni recibe datos de usuarios. La CLI instalada localmente es `codegraph`; la versión comprobada en este entorno es 1.2.0.

## Instalación en otro entorno

Requiere Python 3 y pip. Desde la raíz:

```powershell
python -m pip install -r _config/codegraph-requirements.txt
```

La CLI comprobada funciona como `codegraph`; `python -m codegraph` no está soportado por esta versión.

## Escaneo del proyecto

```powershell
npm run codegraph
```

El script escanea solo `src/` para no mezclar dependencias de terceros, documentación o salidas. Genera:

- `.audit/codegraph.html`: grafo interactivo.
- `.audit/codegraph.csv`: entidades y relaciones exportadas.

Comando equivalente:

```powershell
New-Item -ItemType Directory -Force .audit | Out-Null
codegraph .\src --output .\.audit\codegraph.html --csv .\.audit\codegraph.csv
```

## Consulta de funciones

`npm run codegraph:query -- NombreFuncion` consultará el CSV generado y mostrará coincidencias de entidad. Las columnas del CSV deben inspeccionarse al generar el primer reporte, porque dependen de la CLI y su parser. Si la exportación no identifica claramente tipo/nombre/archivo, el script lo indicará y se corregirá después de la primera ejecución; no debe fingir que encontró funciones.

## Cuándo ejecutarlo

- Tras cambiar módulos que modifiquen flujos o dependencias.
- Antes de una revisión de arquitectura.
- En CI solo como artefacto informativo; no bloquear builds por diferencias visuales del HTML.

## Limitaciones

CodeGraph analiza sintaxis y dependencias; no prueba comportamiento, tipos ni calidad. Complementar con Vitest, TypeScript, ESLint y pruebas E2E.
