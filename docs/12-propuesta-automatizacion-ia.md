# Propuesta de automatización con IA

Este documento define qué se automatiza ahora y qué queda para después. El objetivo es una operación ligera con aprobación humana en decisiones de impacto.

## Automatizar desde el inicio

- Pull requests: lint, tipos, unit tests, build y pruebas E2E críticas.
- Dependencias: alertas automatizadas; actualización solo mediante pull request revisado.
- CodeGraph: comando local que escanea funciones/clases y guarda artefactos en `.audit/`.
- Despliegue: manual al inicio, con posibilidad de CI tras pruebas.

## Operación asistida por IA, etapa posterior

- Triage de comentarios/soporte y propuesta de respuesta basada en FAQ.
- Borradores de guías a partir de cálculos verificados y fuentes identificadas.
- Resumen de métricas agregadas de uso y errores.

## Arquitectura futura si se justifica

- Un backend pequeño (p. ej. Cloudflare Worker) protege credenciales del proveedor LLM y limita gasto/solicitudes.
- El frontend nunca contiene claves privadas.
- El modelo recibe solo pregunta anonimizada/FAQ; no recibe presupuesto local, nombres, direcciones, fotos ni precios privados.
- Registro mínimo de solicitudes, retención documentada y límite mensual de costo.

## Aprobación obligatoria

Personas revisan antes de publicar contenido, responder formalmente a usuarios, alterar fórmulas/precios, desplegar a producción, cambiar consentimiento/avisos o incurrir en gasto. No construir agentes que se concedan permisos generales al sistema operativo o a cuentas financieras.
