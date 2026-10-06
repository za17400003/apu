# Automatización e IA

## Objetivo realista

Automatizar tareas repetibles de operación sin delegar responsabilidad legal, financiera o de calidad a un agente. Una empresa no queda autogestionada solo por añadir un LLM: necesita procesos, límites, observabilidad y responsables.

## Fase inicial: sin IA en producción

- CI con GitHub Actions: instalar, lint, pruebas unitarias, pruebas de compilación y análisis estático.
- CodeGraph en ejecución manual/local y opcional en CI.
- Analítica agregada con proveedor que no registre presupuestos; revisar privacidad antes de integrarlo.
- Plantillas de respuesta y FAQ estáticas.
- Alertas de build/errores dirigidas al responsable.

## Automatizaciones futuras

- Clasificar comentarios/solicitudes de soporte y preparar borradores para revisión.
- Proponer borradores de guías basados solo en documentación y fuentes verificables; revisión humana obligatoria antes de publicar.
- Resumir métricas agregadas y sugerir áreas de mejora; nunca mostrar proyectos individuales.
- Dependabot u opción equivalente para alertas de dependencias; una persona revisa y aprueba actualizaciones.

## Posible stack, sujeto a validación

- GitHub Actions para CI/CD y tareas programadas ligeras.
- n8n únicamente si aparecen varios flujos operativos y existe host estable; no autoalojarlo en la PC personal como servicio 24/7.
- API de modelo externo solo desde backend controlado, con límites de gasto, logging mínimo, política de retención revisada y sin claves en el frontend.
- Alternativa local: Ollama para experimentación del propietario; no hace que la web pública use ese modelo si la PC está apagada.

## Límites no delegables

- No modificar fórmulas de APU ni precios sin confirmación humana.
- No activar/cambiar anuncios, consentimiento, políticas de privacidad o textos legales automáticamente.
- No borrar datos, desplegar cambios de producción, contactar clientes o comprometer gastos sin aprobación.
- No presentar salida de IA como norma de construcción o estimación profesional garantizada.

## Criterio para agregar IA

Solo añadirla cuando una tarea repetida esté identificada, haya datos permitidos para procesarla, exista medición de calidad y el ahorro supere costo, riesgo y mantenimiento.
