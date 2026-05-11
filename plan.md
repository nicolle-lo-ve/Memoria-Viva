
# Plan: App de Asistencia Cognitiva (Modo Paciente + Cuidador)

## Resumen
Aplicación accesible con dos modos: **Paciente** (interfaz gigante, cámara + reconocimiento, voz cálida) y **Cuidador** (configuración protegida con PIN, gestión de QR, recordatorios, contactos).

## Diseño visual
- **Tipografía**: Nunito (redonda, cálida) para todo; tamaños XXL para paciente.
- **Paleta**: fondo beige suave (#F7F3EC), verde calmo para confirmaciones, rojo cálido para emergencia, alto contraste.
- **Botones**: mínimo 96px de alto en modo paciente, bordes redondeados grandes, sombras suaves.
- **Pictogramas**: emoji nativos (💧🔥🎵💊) para máxima legibilidad sin assets externos.
- **Voz**: Web Speech API (`speechSynthesis`) en español — sin red, sin claves.

## Rutas (TanStack Router)
```
/                       Pantalla bienvenida (Paciente / Cuidador)
/patient                Cámara principal + hora + Ayuda
/patient/recognize      Cámara activa con detección (MobileNet vía TF.js)
/patient/steps/$id      Instrucciones paso a paso
/patient/reminders      Lista de recordatorios
/patient/help           Pantalla emergencia (llamar familia)
/caregiver/pin          Acceso con PIN
/caregiver              Menú principal cuidador
/caregiver/qr/new       Generar nuevo QR (escanear o desde cero)
/caregiver/qr           Lista + editar QR existentes
/caregiver/qr/$id       Editor de QR
/caregiver/stats        Estadísticas de uso
/caregiver/reminders    Configurar recordatorios
/caregiver/contact      Contacto de emergencia
/caregiver/settings     Configuración (tamaño, contraste, volumen)
```

## Funcionalidades clave (v1)
1. **Modo Paciente**:
   - Pantalla principal con hora en vivo, botón Recordatorios, botón rojo Ayuda flotante.
   - Cámara con `getUserMedia` + MobileNet (`@tensorflow-models/mobilenet`) cargado dinámicamente.
   - Etiqueta flotante con nombre detectado, botones Sí/No gigantes, lectura por voz automática.
   - Vista de pasos con paso resaltado, navegación grande, lectura automática + manual, confeti al terminar.
   - Recordatorios con checkbox gigantes, persistidos en `localStorage`, reinicio diario.
   - Pantalla de emergencia roja con `tel:` link.

2. **Modo Cuidador** (PIN simple en `localStorage`, hash básico):
   - Menú con 6 botones grandes.
   - Generador de QR: escaneo (MobileNet sugiere nombre editable) o desde cero; editor de pasos con texto + emoji + grabación de audio (`MediaRecorder`, base64 en localStorage).
   - QR generado con `qrcode` lib (descargable PNG).
   - Lista/edición de QRs guardados.
   - Stats simples (contadores en localStorage).
   - Configuración de tamaño de letra/contraste/volumen aplicada vía CSS variables.
   - Contacto de emergencia (nombre + teléfono).

3. **Compartido**:
   - Pantalla de carga con spinner XXL.
   - Mensajes de error con voz.
   - Todo local (sin backend, sin Lovable Cloud en esta primera versión — la especificación pide procesamiento local y privacidad).

## Detalles técnicos
- **Persistencia**: `localStorage` con un wrapper tipado (objetos: `qrs`, `reminders`, `contact`, `stats`, `settings`, `pin`).
- **TensorFlow.js**: import dinámico solo en rutas de cámara para no inflar el bundle inicial. Fallback amable si el modelo no carga.
- **Cámara**: hook `useCamera` que maneja stream + cleanup.
- **QR scanning** (cuando el paciente apunte a un QR pegado): `jsqr` para detectar y abrir directamente la vista de pasos.
- **Voz**: hook `useSpeak(text)` con voz española preferida.
- **Diseño tokens**: definidos en `src/styles.css` (oklch), variantes `patient`/`caregiver` para botones.

## Alcance v1 vs futuro
- v1 entrega todas las pantallas listadas, navegables, con persistencia local funcional.
- Reconocimiento de imagen real con MobileNet incluido; si falla la carga, modo manual (cuidador escribe el nombre).
- "Enviar al paciente por WhatsApp" se hace con `navigator.share` cuando esté disponible, fallback a descarga.
- Quechua queda como placeholder en el selector (solo español funcional).

¿Procedo con la implementación?
