# Configuración y publicación

## Entorno

- Windows PowerShell.
- Node.js 22 LTS/actual compatible y npm 11 en el entorno de creación.
- Python 3 solo para CodeGraph.
- Git para control de versiones.

## Comandos locales previstos

```powershell
npm install
npm run dev
npm run lint
npm test
npm run build
npm run codegraph
```

## Configuración de publicidad

- Ninguna clave de proveedor en el repositorio.
- Variables de entorno de build solo para IDs públicos permitidos; secretos jamás en Vite `VITE_*`.
- Anuncios apagados por defecto hasta aprobación y configuración revisada.

## Publicación

- Generar build estático con Vite.
- Elegir host cuyo plan permita expresamente el uso comercial/publicitario y revisar límites vigentes.
- Usar dominio propio solo después de confirmar marca y registrar dominio a nombre del titular del proyecto.
- Configurar HTTPS, política de seguridad y metadata mínima.
- Publicar aviso de privacidad, contacto y descargos del cálculo antes de tráfico real.
- Verificar en PC, tableta, Android/iOS y navegación con teclado.

## Reversión

Conservar la versión anterior del deploy y un respaldo de datos de prueba. No publicar cambios de fórmula sin actualizar pruebas y versión del esquema.
