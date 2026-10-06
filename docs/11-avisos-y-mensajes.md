# Avisos y mensajes

| Evento | Tipo | Texto/acción | Bloqueante |
|---|---|---|---|
| Primer uso | Estado vacío | “Crea un presupuesto” y enlace “Ver ejemplo” | No |
| Autoguardado | Estado | “Guardado en este dispositivo” | No |
| Guardado fallido | Aviso persistente | Explica que los cambios no se guardaron; botón “Exportar respaldo” | No; preservar formulario |
| Precio antiguo | Aviso contextual | Mostrar fecha y permitir actualizar | No |
| Dato inválido | Error inline | Indicar campo y unidad esperada | Sí para ese cálculo |
| Eliminar proyecto | Diálogo de confirmación | Nombre del proyecto; cancelar por defecto | Sí |
| Borrar almacenamiento | Diálogo destructivo | Explicar que se eliminan proyectos e imágenes locales; sugerir exportar | Sí |
| Importar respaldo | Diálogo de revisión | Mostrar versión, proyectos y opción de combinar/reemplazar | Sí |
| Imagen muy grande/formato inválido | Aviso | Explicar formatos y límite configurado | No, rechazar solo archivo |
| Sin conexión | Estado discreto | “Tus datos locales siguen disponibles; no hay sincronización en nube” | No |
| Anuncio bloqueado/no aprobado | Ninguno | No mostrar slot ni hueco reservado | No |

## Convenciones

- Errores en lenguaje claro y con siguiente acción concreta.
- Destructivo siempre requiere confirmación explícita; “Cancelar” es la acción inicial.
- No mostrar popup al cargar la página.
- El botón de cerrar diálogo funciona con teclado y devuelve el foco al control que lo abrió.
- No se muestra publicidad como toast, alerta ni modal.
