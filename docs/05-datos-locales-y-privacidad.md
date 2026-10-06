# Datos locales y privacidad

## Qué se guarda

- **Proyectos y conceptos**: nombres, fechas, ubicaciones, conceptos APU con insumos, costos, porcentajes
- **Catálogo local**: insumos reutilizables, precios, unidades, rendimientos, fechas de actualización
- **Superficies (muros)**: dimensiones, aberturas, acabados, productos seleccionados
- **Imágenes**: fotos de productos/acabados, almacenadas como blobs en IndexedDB (JPEG/PNG optimizados)
- **Preferencias**: moneda, idioma, porcentajes por defecto, última sesión

**Almacenamiento:**
- IndexedDB en el navegador, en el mismo dispositivo, separado por origen (protocolo + dominio + puerto)
- Cuota típica: ~50MB por origen (negociable según el navegador)
- Ningún dato se envía a servidores en v1; todo es local

## Ciclo de vida de imágenes

1. **Captura/carga**: usuario selecciona archivo local (JPEG/PNG)
2. **Optimización**: redimensionar si es muy grande (p. ej., máx. 2MB por imagen)
3. **Almacenamiento**: guardar como blob en tabla `images` de IndexedDB
4. **Referencia**: la tabla `catalog` o `surfaces` apunta a la imagen por `imageId`
5. **Visualización**: cargar blob desde IndexedDB y mostrar como miniatura
6. **Exportación**: incluir imagen en base64 dentro del JSON (si cabe en memoria) o como referencia externa
7. **Importación**: validar que las imágenes en el JSON sean base64 válidos; crear nuevos blobs en IndexedDB
8. **Límites**: si la cuota se agota, permitir eliminar imágenes grandes antes de guardar más datos

**Casos de error:**
- Imagen corrupta: mostrar placeholder y permitir reemplazarla
- Sin espacio: alertar al usuario, ofrecer eliminar imágenes antiguas o exportar sin imágenes
- Navegador no soporta IndexedDB: degradar gracefully (funcionar sin imágenes locales, usar URLs externas)

## Límites que deben comunicarse

- No hay usuario/contraseña ni sincronización entre dispositivos.
- Limpiar los datos del navegador, cambiar de navegador/perfil o usar incógnito puede eliminar o aislar los proyectos.
- Cambiar de dominio/origen puede hacer que los datos anteriores no estén disponibles.
- El navegador puede limitar o eliminar almacenamiento (~50MB típico); no prometer preservación permanente.
- Exportar respaldo JSON con regularidad; el usuario decide dónde guardarlo.
- Las imágenes toman espacio; considerar reducir tamaño o eliminar las antiguas.

## Controles

- Guardado automático con estado visible.
- Exportar, importar y borrar todos los datos.
- Validar tamaño y versión del archivo importado.
- Manejar errores de cuota sin descartar silenciosamente cambios.
- Evitar registrar valores de presupuesto en logs, telemetría o herramientas de terceros.
- No enviar nombres, domicilios, teléfonos, archivos ni presupuestos a un modelo de IA.

## Terceros

Hosting, analítica y publicidad pueden recibir metadatos de conexión o utilizar tecnologías propias. Si se integra un proveedor, actualizar aviso de privacidad, controles de consentimiento que correspondan y documentación de datos compartidos antes de publicarlo.
