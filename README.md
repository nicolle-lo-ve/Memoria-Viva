# Memoria Viva — Asistente cognitivo

**Memoria Viva** es una aplicación web local-first pensada para personas con deterioro cognitivo (Alzheimer, demencia) y sus cuidadores. Funciona **100% en el dispositivo**: la cámara, el reconocimiento de objetos (TensorFlow.js + MobileNet), los códigos QR, los recordatorios y la voz se procesan localmente. **No requiere internet ni servidor backend** después de instalada.

---

## Contenido del proyecto

- **Modo Paciente**: cámara con reconocimiento de objetos y QR, instrucciones paso a paso con voz, botón de ayuda (emergencia), recordatorios.
- **Modo Cuidador**: acceso por PIN, generador de QRs personalizados con audio, estadísticas de uso, configuración de accesibilidad (tamaño de fuente, volumen de voz), contacto de emergencia.
- **Stack**: TanStack Start (React 19) + Vite 7 + Tailwind CSS v4 + TypeScript.

---

## Requisitos previos

Antes de empezar, necesitas tener instalado en tu computadora:

### 1. Node.js (versión 20 o superior)
- Descárgalo desde: https://nodejs.org/ (elige la versión **LTS**).
- Para verificar que se instaló correctamente, abre una terminal y ejecuta:
  ```bash
  node --version
  ```
  Debes ver algo como `v20.x.x` o superior.

### Bun (gestor de paquetes recomendado)
Este proyecto usa **Bun** (es más rápido que npm). Instálalo así:

- **macOS / Linux** (en la terminal):
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
  Luego cierra y vuelve a abrir la terminal.

- **Windows** (en PowerShell):
  ```powershell
  powershell -c "irm bun.sh/install.ps1 | iex"
  ```

- Verifica la instalación:
  ```bash
  bun --version
  ```
  Debes ver un número de versión (por ejemplo, `1.1.x`).

> **Alternativa**: si no quieres instalar Bun, puedes usar `npm` (que viene con Node.js). En cada comando de la guía donde diga `bun`, sustituye por `npm` (excepto `bun add` → `npm install`).

### 3. Un navegador moderno
- **Recomendado**: Google Chrome, Microsoft Edge o Brave (mejor soporte para cámara y voz en español).
- Firefox y Safari también funcionan.

### 4. (Opcional) Un editor de código
- [Visual Studio Code](https://code.visualstudio.com/) — el más popular y gratuito.

---

## Paso a paso para ejecutar la aplicación

### Paso 1 — Descomprimir el ZIP

1. Localiza el archivo `acompana.zip` que descargaste.
2. Haz **clic derecho → Extraer aquí** (Windows) o doble clic (macOS).
3. Se creará una carpeta llamada `acompana` (o similar). Dentro encontrarás archivos como `package.json`, `src/`, `vite.config.ts`, etc.

### Paso 2 — Abrir una terminal en la carpeta del proyecto

- **Windows**: abre la carpeta extraída en el Explorador, haz clic en la barra de direcciones, escribe `cmd` y presiona Enter.
- **macOS**: abre la app **Terminal**, escribe `cd ` (con un espacio al final), arrastra la carpeta del proyecto a la terminal y presiona Enter.
- **Linux**: clic derecho dentro de la carpeta → **Abrir en terminal**.

Verifica que estás en la carpeta correcta listando el contenido:
```bash
ls          # macOS / Linux
dir         # Windows
```
Debes ver `package.json` en la lista.

### Paso 3 — Instalar las dependencias

En la terminal, dentro de la carpeta del proyecto, ejecuta:

```bash
bun install
```

> Si usas npm: `npm install`

Este paso descarga todas las librerías necesarias (React, TensorFlow.js, etc.). Puede tardar **2 a 5 minutos** la primera vez. Verás una barra de progreso. Al terminar, aparecerá una nueva carpeta `node_modules/`.

### Paso 4 — Iniciar el servidor de desarrollo

```bash
bun run dev
```

> Si usas npm: `npm run dev`

Después de unos segundos verás un mensaje similar a:

```
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

### Paso 5 — Abrir la aplicación en el navegador

1. Abre tu navegador y ve a: **http://localhost:3000**
2. Verás la pantalla de bienvenida con dos botones gigantes: **PACIENTE** y **CUIDADOR**.

---

## 🔧 Primera configuración (importante)

Antes de que el paciente use la app, el cuidador debe configurarla:

1. En la pantalla principal, toca **CUIDADOR**.
2. **Crea un PIN de 4 dígitos** (la primera vez te pedirá crearlo). Recuérdalo: lo necesitarás para volver a entrar.
3. Configura:
   - **Contacto de emergencia** → nombre y teléfono al que se llamará al pulsar "AYUDA".
   - **Códigos QR** → crea instrucciones para objetos comunes (microondas, control remoto, etc.) con texto, pictograma y, si quieres, **graba tu propia voz**.
   - **Recordatorios** → medicinas, comidas, paseos.
   - **Ajustes** → tamaño de letra y volumen de voz.
4. Vuelve al inicio y entrega el dispositivo al paciente en **MODO PACIENTE**.

---

## Permisos necesarios en el navegador

Cuando uses la cámara por primera vez, el navegador pedirá permiso. Debes **Permitir** acceso a:
- **Cámara** (para reconocer objetos y leer QR).
- **Micrófono** (solo si el cuidador graba audio personalizado).
- **Audio** (la voz se reproduce automáticamente).

**Muy importante**: la cámara solo funciona en navegadores en **`http://localhost`** o en sitios con **HTTPS**. No funcionará si abres el archivo `index.html` directamente.

---

## Usarlo en una tablet o móvil (red local)

Si quieres probarlo en una tablet en la misma red Wi-Fi que tu computadora:

1. Cuando ejecutes `bun run dev`, mira la línea `Network: http://192.168.x.x:3000/`.
2. En la tablet, abre el navegador y escribe esa dirección.
3. **Limitación**: muchos navegadores móviles **bloquean la cámara** si la URL no es HTTPS. Soluciones:
   - Usa la app desde la misma computadora con cámara web.
   - O genera una build de producción y publícala (ver siguiente sección).

---

## Generar una versión de producción (opcional)

Si quieres una versión optimizada (más rápida, lista para subir a un servidor):

```bash
bun run build
```

Esto genera una carpeta `dist/` (o similar) con archivos estáticos listos para publicar en Netlify, Vercel, Cloudflare Pages, etc.

Para previsualizarla localmente:
```bash
bun run start
```

---

## Solución de problemas comunes

| Problema | Solución |
|----------|----------|
| `bun: command not found` | Cierra y vuelve a abrir la terminal después de instalar Bun. En macOS/Linux puede necesitar `source ~/.bashrc` o `source ~/.zshrc`. |
| `EADDRINUSE: port 3000` | Otro programa usa el puerto 3000. Ciérralo o ejecuta `PORT=3001 bun run dev`. |
| La cámara no se abre | Verifica que estés en `http://localhost` y que diste permiso. Revisa los iconos junto a la barra de URL. |
| No se escucha la voz | Sube el volumen del sistema. En el modo Cuidador → Ajustes, sube el volumen de voz. En Chrome, asegúrate de tener instaladas voces en español (Configuración → Idiomas). |
| El reconocimiento es lento la primera vez | Normal: MobileNet (~16 MB) se descarga en el primer uso y queda cacheado. |
| Pantalla en blanco al abrir | Borra `node_modules` y vuelve a ejecutar `bun install`. |

---

## Privacidad

- **Todo es local**: cámara, micrófono, datos, fotos, audios y estadísticas se quedan en el navegador (`localStorage`).
- **No hay servidor**: la app no envía nada a internet.
- Para borrar todos los datos: en el navegador → `F12` → pestaña **Application** → **Local Storage** → eliminar las claves que empiezan por `ca:`.

---

## Licencia

Uso libre con fines personales y de cuidado familiar.

¡Gracias por usar **Memoria Viva**! 
