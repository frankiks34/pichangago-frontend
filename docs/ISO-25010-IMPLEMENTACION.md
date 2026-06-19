# Implementación ISO/IEC 25010 — PichangaGo Frontend

> **Estándar**: ISO/IEC 25010 — Modelo de Calidad del Producto de Software  
> **Versión del documento**: 2.0  
> **Fecha**: 2026-06-18  
> **Alcance**: Frontend React (Vite) — Enfoque en el **módulo dueño**  
> **Auditor**: Revisión exhaustiva de código fuente

---

## Índice

1. [Eficiencia de Desempeño (Performance Efficiency)](#1-eficiencia-de-desempeño-performance-efficiency)
2. [Seguridad (Security)](#2-seguridad-security)
3. [Usabilidad (Usability)](#3-usabilidad-usability)
4. [Fiabilidad (Reliability)](#4-fiabilidad-reliability)

---

## 1. Eficiencia de Desempeño (Performance Efficiency)

### 1.1 Comportamiento Temporal (Time Behaviour)

*Definición ISO: Tiempos de respuesta, procesamiento y tasas de rendimiento del sistema.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Debounce en filtros de búsqueda** — Los cambios en filtros (`nombre`, `distrito`, `precio`) se deboucean 300ms antes de disparar la petición, evitando llamadas innecesarias durante escritura | `src/hooks/useDebounce.js` | 1–8 |
| 2 | Aplicación del hook en `Buscar`: `filtrosActivos` reemplaza a `filtros` en dependencia del `useEffect` | `src/pages/Buscar.jsx` | 38, 46 |
| 3 | **Lazy loading de rutas** — Todas las rutas del panel dueño, detalle de cancha, buscar y reservas usan `React.lazy()` + `Suspense` con `role="status"` | `src/App.jsx` | 9–19, 90 |
| 4 | **Carga diferida de imágenes** — Atributo `loading="lazy"` en todas las `<img>` de listados | `src/pages/Buscar.jsx:142`, `src/pages/Home.jsx:164`, `src/pages/CanchaDetail.jsx:144` |
| 5 | **Fetch paralelo en Dashboard** — `obtenerDashboard()` + `obtenerAgendaDiaria(fechaHoy)` se ejecutan en paralelo con `Promise.all`, reduciendo tiempo de carga inicial del panel | `src/components/dueno/DashboardDueno.jsx` | 30–45 |
| 6 | **Socket.io en tiempo real** — Las notificaciones de `nueva-reserva` llegan vía WebSocket, eliminando la necesidad de polling para actualizar la agenda | `src/hooks/useSocket.js` | 1–63 |
| 7 | **`useCallback` / `useRef` para callbacks socket** — Evita renderizados innecesarios al mantener referencia estable del callback sin reconectar el socket | `src/hooks/useSocket.js` | 8–13 |

#### Pendiente / Mejora futura

- Monitoreo de Core Web Vitals (FCP, LCP, CLS) con `performance.mark()` / `web-vitals`.
- Virtualización de lista de slots con `react-window` para agendas con >50 slots/día.
- `React.memo` en componentes de lista (agenda diaria, ofertas, reportes) para evitar re-renders cuando cambia el padre.
- Code splitting por ruta con `React.lazy()` ya implementado; evaluar splitting por componente pesado (calendar, charts).

---

### 1.2 Utilización de Recursos (Resource Utilization)

*Definición ISO: Cantidad y tipo de recursos de hardware y software utilizados.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Dimensiones explícitas en imágenes** — `width` y `height` en imágenes de cards de búsqueda eliminan Cumulative Layout Shift (CLS) | `src/pages/Buscar.jsx` | 142 |
| 2 | **Fragments de React** — Uso de `<></>` en lugar de divs extra para reducir nodos del DOM | Múltiples | — |
| 3 | **FormData condicional** — `buildFormData` omite valores `null`/`undefined`/`''`, evitando enviar campos vacíos en peticiones multipart | `src/services/duenoService.js` | 3–12 |
| 4 | **Limpieza de efectos** — Todos los `useEffect` retornan función de cleanup; socket se desconecta al desmontar | `src/hooks/useSocket.js:56-59` |
| 5 | **Animaciones respetan `prefers-reduced-motion`** — Media query reduce todas las animaciones a 0.01ms para usuarios que prefieren evitar movimiento | `src/index.css` | 428–435 |

#### Pendiente / Mejora futura

- Migrar estilos inline complejos a CSS modules para purgado de CSS no utilizado.
- Agregar dimensiones explícitas (`width`/`height`) a imágenes en `Home.jsx` y `CanchaDetail.jsx`.
- Evaluar `useMemo` en cómputos costosos (filtrado de slots, cálculos de reportes).

---

### 1.3 Capacidad (Capacity)

*Definición ISO: Límites máximos de parámetros del producto que cumplen con los requisitos.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Validación de tamaño de archivo client-side** — Las fotos no pueden superar los 5 MB; se valida antes de enviar al backend | `src/components/dueno/ModalGestionCancha.jsx` | 421–427 |
| 2 | **Deshabilitación de botón submit durante carga** — Previene peticiones duplicadas en todos los formularios | `src/components/AuthModal.jsx:167`, `src/pages/Login.jsx:167`, `src/components/dueno/PerfilDueno.jsx` |
| 3 | **Rate limiting detectado (429)** — Manejo amigable: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." | `src/utils/apiFetch.js` | 24–27 |
| 4 | **Reconexión socket con backoff** — `reconnectionAttempts: 10`, `reconnectionDelay: 3000` — evita sobrecargar el servidor en caídas | `src/hooks/useSocket.js` | 21–24 |

#### Pendiente / Mejora futura

- Paginación en agendas diaria y semanal (actualmente carga todos los slots de golpe).
- Paginación en historial de reservas y reportes.
- Definir límite de fotos por cancha y validarlo en frontend.

---

## 2. Seguridad (Security)

### 2.1 Confidencialidad (Confidentiality)

*Definición ISO: Garantizar que la información solo sea accesible para usuarios autorizados.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Tokens JWT con Authorization Bearer** — Todas las peticiones autenticadas incluyen `Authorization: Bearer <token>` | `src/utils/apiFetch.js` | 10–13 |
| 2 | **Refresh token en localStorage** — El refresh token persiste para renovación silenciosa del access token | `src/services/authService.js` | 35 |
| 3 | **Enmascaramiento de datos sensibles** — RUC y CCI usan `type="password"` por defecto con botón de mostrar/ocultar | `src/components/dueno/PerfilDueno.jsx` | 248, 279 |
| 4 | **Roles de acceso (RBAC)** — `ProtectedRoute` filtra rutas por rol (`JUGADOR` / `DUENO`) | `src/App.jsx` | 99–108 |
| 5 | **Auto-detección de banco desde CCI** — Previene almacenar datos bancarios incorrectos; el frontend valida que los primeros 4 dígitos del CCI correspondan al banco seleccionado antes de enviar | `src/components/dueno/PerfilDueno.jsx` | — |
| 6 | **Logout con confirmación** — Navbar muestra confirmación antes de cerrar sesión, evitando cierres accidentales | `src/components/Navbar.jsx` | 94–137 |

#### Pendiente / Mejora futura

- Migrar access token a memoria volátil (variable JS) en vez de `localStorage`, usando refresh token en cookie HttpOnly con `SameSite=Strict`.
- Implementar Content Security Policy (CSP) headers.

---

### 2.2 Integridad (Integrity)

*Definición ISO: Prevenir modificación no autorizada de datos, asegurando exactitud y completitud.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Validación de formularios client-side** — Regex en RUC (11 dígitos), CCI (20 dígitos), precios, email, teléfono | `src/components/dueno/PerfilDueno.jsx` | — |
| 2 | **Validación CCI vs Banco** — Verifica que los primeros 4 dígitos del CCI coincidan con el banco seleccionado; rechaza el envío si hay mismatch | `src/components/dueno/PerfilDueno.jsx` | — |
| 3 | **PUT financiero con todos los campos** — Al enviar datos financieros, se envían `ruc`, `razonSocial`, `cci`, `banco` en el body (nunca parcial) para evitar datos huérfanos | `src/components/dueno/PerfilDueno.jsx` | — |
| 4 | **`noValidate` en formularios con validación custom** — Permite validación manual antes del submit | `src/pages/dueno/RegistroCanchaForm.jsx` | 91 |
| 5 | **Validación tamaño archivo (5 MB)** — Evita subir archivos que el backend rechazaría | `src/components/dueno/ModalGestionCancha.jsx` | 421–427 |

#### Pendiente / Mejora futura

- Agregar checksum (hash) en peticiones de actualización de perfil financiero para detectar manipulación en tránsito.

---

### 2.3 No Repudio (Non-repudiation)

*Definición ISO: Capacidad de probar la ocurrencia de una acción, de forma que el autor no pueda negarla.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Logs estructurados con timestamp** — Errores del sistema se registran con `{ error, timestamp }` para trazabilidad | `src/services/authService.js` | 15, 40, 54 |
| 2 | **Logs con contexto de módulo** — Prefijo `[authService.login]`, `[authService.register]`, `[apiFetch]` identifica el origen del evento | Múltiples | — |

#### Pendiente / Mejora futura

- Enviar eventos de auditoría a un endpoint dedicado (`POST /api/audit`) para acciones críticas del dueño:
  - Cambio de estado de slot (bloquear/disponible/oferta)
  - Modificación de horarios y tarifas
  - Eliminación de fotos
  - Actualización de datos financieros
- Integrar logs con Sentry o Datadog para agregación centralizada.

---

### 2.4 Autenticidad (Authenticity)

*Definición ISO: Capacidad de validar inequívocamente que la identidad de un usuario es la que dice ser.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **JWT con renovación automática** — `apiFetch.js` detecta 401, llama a `/api/refresh` y reintenta la petición original con el nuevo token | `src/utils/apiFetch.js` | 34–52 |
| 2 | **Refresh token con renovación en socket** — Cuando el token del socket expira, se renueva automáticamente vía `/api/refresh` y reconecta | `src/hooks/useSocket.js` | 28–48 |
| 3 | **Validación periódica de sesión** — Cada 60s se verifica el estado del token contra `/api/validate-session`; si responde 403, cierra sesión | `src/App.jsx` | 42–57 |
| 4 | **Contador de intentos de login** — Muestra "(X/3 intentos)" tras fallar; el backend bloquea la cuenta al alcanzar el límite | `src/components/AuthModal.jsx` | 62–64 |
| 5 | **Logout con limpieza completa** — `localStorage.clear()` + `window.location.href = '/'` + llamado a `/api/logout` | `src/services/authService.js:45-61`, `src/utils/apiFetch.js:6` |

#### Pendiente / Mejora futura

- Implementar Autenticación de Múltiples Factores (MFA) para acciones críticas del dueño (cambio de datos financieros).
- Migrar a flujo OAuth2 completo si se integra con proveedores externos.

---

### 2.5 Responsabilidad (Accountability)

*Definición ISO: Capacidad de rastrear de manera única las acciones de una entidad dentro del sistema.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Logs estructurados con contexto** — `console.error` con `{ error, timestamp }` y prefijo del módulo | Múltiples | — |
| 2 | **Trazabilidad de sesión** — Cada petición autenticada lleva el token JWT que identifica al usuario; el backend puede correlacionar acciones | `src/utils/apiFetch.js` | 10–13 |

#### Pendiente / Mejora futura

- Integrar SIEM (Sentry, Datadog) para agregación centralizada de logs.
- Registrar en backend: quién modificó un registro financiero, desde qué IP, cuándo.
- Implementar `X-Request-ID` en cada petición para trazabilidad extrema a extremo.

---

## 3. Usabilidad (Usability)

### 3.1 Inteligibilidad / Reconocibilidad de Adecuación (Appropriateness Recognisability)

*Definición ISO: Facilidad con la que el usuario comprende si el software es apropiado para sus necesidades.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Landing page descriptiva** — Hero section: "Reserva tu cancha en 30 segundos" con título y subtítulo claros | `src/pages/Home.jsx` | 34–36 |
| 2 | **Onboarding del dueño** — Flujo de 3 pasos con indicador de progreso visual que guía al usuario nuevo desde registro hasta operación | `src/pages/dueno/DuenoOnboarding.jsx` | 61–65 |
| 3 | **Onboarding inteligente** — Detecta automáticamente si el dueño tiene perfil financiero y locales, redirigiendo al paso correspondiente | `src/pages/dueno/PanelDueno.jsx` | — |
| 4 | **Tooltips descriptivos** — Atributo `title` en inputs de formularios para guiar al usuario | `src/components/AuthModal.jsx:142,146,150,159,176`, `src/pages/dueno/RegistroCanchaForm.jsx`, `src/pages/dueno/PerfilFinanciero.jsx` |
| 5 | **Íconos representativos en tabs** — Cada tab del panel dueño tiene emoji + texto: 📊 Resumen, 🏟️ Locales, ⚽ Mis Canchas, 📅 Agenda, 📈 Reportes, 👤 Mi Perfil | `src/pages/dueno/PanelDueno.jsx` | 109–114 |

---

### 3.2 Aprendizaje (Learnability)

*Definición ISO: Facilidad con la que los usuarios aprenden a operar el software de forma autónoma.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Grid de horarios con tutorial implícito** — "Haz clic en cada celda para activar/desactivar o cambiar la tarifa" | `src/components/dueno/ModalGestionCancha.jsx` | 273 |
| 2 | **Texto de ayuda en contraseña** — "Mínimo 6 caracteres" con `aria-describedby` | `src/components/AuthModal.jsx` | 164–165 |
| 3 | **Texto de ayuda en RANGO de horas** — "Ej: 08:00 - 22:00" con `aria-describedby` en onboarding | `src/pages/dueno/DuenoOnboarding.jsx` | 99–102 |
| 4 | **Auto-detección de banco desde CCI** — Muestra hint en vivo del banco detectado mientras el usuario escribe los 20 dígitos | `src/components/dueno/PerfilDueno.jsx` | — |
| 5 | **Badges de estado con color + texto** — CONFIRMADA (verde), PENDIENTE (ámbar), CANCELADA (rojo), NO_SHOW (rojo oscuro) — aprendizaje visual inmediato | `src/components/dueno/ModalDetalleReserva.jsx` | — |
| 6 | **Tooltips en inputs de RUC/CCI** — Instrucciones de formato visibles | `src/pages/dueno/PerfilFinanciero.jsx` | 53, 58, 62, 68 |

---

### 3.3 Operabilidad (Operability)

*Definición ISO: Facilidad de control y operación técnica de las funciones del sistema.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Navegación por teclado en tabs (dueño)** — PanelDueno, ReportesDueno, ModalGestionCancha: flechas izquierda/derecha con roving `tabIndex` | `PanelDueno.jsx:103-114`, `ReportesDueno.jsx:10-23`, `ModalGestionCancha.jsx:250-260` |
| 2 | **Acordeones con teclado** — AgendaDueno: Enter/Espacio para expandir/colapsar | `AgendaDueno.jsx` | 424, 536 |
| 3 | **Cards de búsqueda con teclado** — `onFocus`/`onBlur` replican hover visual | `src/pages/Buscar.jsx` | 144–145 |
| 4 | **Skip-to-content link** — "Saltar al contenido principal" al inicio de cada página | `src/App.jsx` | 78–80 |
| 5 | **Tabs con `<button>` nativo** — Todos los tabs son `<button>` navegables por teclado | Múltiples | — |
| 6 | **Consistencia en posición de botones** — Guardar siempre abajo a la derecha, Cancelar a la izquierda | General | — |
| 7 | **Cierre de modales con click en backdrop** — Todos los modales cierran al hacer click fuera | Múltiples | — |

#### Pendiente / Mejora futura

- Agregar atajos de teclado globales (ej: `Ctrl+K` para búsqueda, `Esc` para cerrar cualquier modal).
- Focus trapping en modales para evitar que Tab salga del diálogo.
- `autoFocus` en el primer input al abrir formularios.

---

### 3.4 Protección Frente a Errores de Usuario (User Error Protection)

*Definición ISO: Capacidad del sistema para defender al usuario de cometer errores involuntarios.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Validación en tiempo real** — RUC (11 dígitos), CCI (20 dígitos), email, teléfono validados al escribir | `src/components/dueno/PerfilDueno.jsx` | — |
| 2 | **CCI vs Banco: validación cruzada** — Rechaza envío si los primeros 4 dígitos del CCI no coinciden con el banco | `src/components/dueno/PerfilDueno.jsx` | — |
| 3 | **Submit deshabilitado durante carga** — Botón se deshabilita para evitar doble envío | Múltiples | — |
| 4 | **ConfirmDialog antes de acciones destructivas** — Reemplaza `confirm()` nativo con `role="alertdialog"`, soporte de teclado y auto-foco | `src/components/dueno/ConfirmDialog.jsx` | 1–75 |
| 5 | Aplicado en: eliminación de fotos, bloqueo de canchas, activación/desactivación de slots | `src/components/dueno/ModalGestionCancha.jsx` | 428–433 |
| 6 | **Validación tamaño de archivo (5 MB)** — Error antes del envío si la foto excede el límite | `src/components/dueno/ModalGestionCancha.jsx` | 421–427 |
| 7 | **Toast con auto-dismiss** — Notificaciones con auto-cierre a los 4 segundos; el usuario no necesita cerrarlas manualmente | `src/hooks/useToast.js` | 7–14 |
| 8 | **Bloqueo de cuenta tras 3 intentos fallidos** — El backend bloquea; el frontend muestra contador regresivo | `src/components/AuthModal.jsx` | 62–64 |
| 9 | **Botones emoji con etiqueta textual** — ⚙️ Gestionar, ⏸ Pausar, ▶ Reactivar — siempre acompañados de texto | `src/pages/dueno/PanelDueno.jsx` | 152–154 |

---

### 3.5 Estética de la Interfaz de Usuario (User Interface Aesthetics)

*Definición ISO: Grado en el que la interfaz resulta agradable, armónica y satisfactoria visualmente.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Paleta de colores unificada** — Variables CSS en `:root` con colores semánticos: `--green`, `--amber`, `--red`, `--dark1`–`dark4`, `--prime` | `src/index.css` | 3–30 |
| 2 | **Tipografía consistente** — `--font-head: 'Syne'` (títulos), `--font-body: 'DM Sans'` (cuerpo) | `src/index.css` | 28–29 |
| 3 | **Animaciones suaves** — `shimmer`, `fadeIn`, `spin`, `toastIn` con respeto a `prefers-reduced-motion` | `src/index.css` | 387–435 |
| 4 | **Tarjetas agrupadas con secciones visuales** — ModalDetalleReserva con tarjetas internas (Jugador, Cancha, Pago, Cancelación) con fondo alterno | `src/components/dueno/ModalDetalleReserva.jsx` | — |
| 5 | **Badges de estado con colores semánticos** — Estado de reserva y pago con colores distintivos (verde/ámbar/rojo) + ícono | `src/components/dueno/ModalDetalleReserva.jsx` | — |
| 6 | **Modal con sombra y bordes redondeados** — `box-shadow: 0 20px 60px rgba(0,0,0,0.15)`, `border-radius: 16px` | `src/components/dueno/ModalDetalleReserva.jsx` | 82 |
| 7 | **Dashboard con KPIs y tabla de reservas** — Diseño limpio con indicadores numéricos destacados + tabla de agenda diaria | `src/components/dueno/DashboardDueno.jsx` | — |

---

### 3.6 Accesibilidad (Accessibility)

*Definición ISO: Grado en el que el software puede ser utilizado por personas con la gama más amplia de capacidades.*

> 📖 Ver documento completo: [`WAVE-PRINCIPLES.md`](./WAVE-PRINCIPLES.md)

#### Implementado — Resumen por categoría

| Categoría | Medidas implementadas | Archivos clave |
|-----------|----------------------|----------------|
| **Roles ARIA** | `role="dialog"`, `role="alertdialog"`, `role="tablist"`, `role="tab"`, `role="alert"`, `role="status"`, `role="button"` | Todos los modales, tabs, mensajes |
| **Atributos ARIA** | `aria-modal`, `aria-label`, `aria-selected`, `aria-expanded`, `aria-live`, `aria-atomic`, `aria-describedby`, `aria-required` | Múltiples |
| **Semántica HTML** | `<nav>`, `<main>`, `<form>`, `<table>`, `<button>`, `<h1>`–`<h5>` | General |
| **Teclado** | Flechas en tabs, Enter/Espacio en acordeones, skip link, `tabIndex` dinámico | `PanelDueno.jsx`, `AgendaDueno.jsx`, `App.jsx` |
| **Focus management** | `ref.focus()` en ConfirmDialog, `:focus-visible` outline verde | `ConfirmDialog.jsx`, `index.css` |
| **Contraste** | Variables CSS verificadas: texto `#1A2033` sobre `#F7F8FA` = 14.2:1 | `index.css` |
| **Motion** | `@media (prefers-reduced-motion: reduce)` desactiva animaciones | `index.css:428-435` |
| **Alt text** | Todas las imágenes tienen `alt` descriptivo | Múltiples |
| **Labels** | `htmlFor` en AuthModal, ModalNuevaCancha, ModalGestionCancha, GestionLocales, Buscar, CanchaDetail, RegistroCanchaForm, PerfilFinanciero | Múltiples |

#### Pendiente — Priorizado

| Prioridad | Deuda técnica | Archivo |
|-----------|--------------|---------|
| 🔴 Crítica | Login.jsx: tabs sin `role="tab"`, selector de rol sin `role="radio"`, labels sin `htmlFor`, errores sin `role="alert"` | `src/pages/Login.jsx` |
| 🔴 Crítica | MisReservas.jsx: overlay sin `role="dialog"`, botón cerrar sin `aria-label` | `src/pages/MisReservas.jsx` |
| 🔴 Crítica | PerfilDueno.jsx: labels sin `htmlFor` (usan `<span>` en vez de `<label>`) | `src/components/dueno/PerfilDueno.jsx` |
| 🟡 Media | Escape key en todos los modales (solo ConfirmDialog lo tiene) | Múltiples |
| 🟡 Media | Focus trapping en modales | Múltiples |
| 🟡 Media | `<th scope="col">` en tablas de Dashboard, Reportes, DuenoOnboarding | Múltiples |
| 🟡 Media | `aria-label` en botones ◀▶ de AgendaDueno (solo tienen `title`) | `AgendaDueno.jsx` |
| 🟡 Media | `aria-label` en botones emoji-only de PanelDueno (➕, ⚙️, ⏸) | `PanelDueno.jsx` |

---

## 4. Fiabilidad (Reliability)

### 4.1 Madurez (Maturity)

*Definición ISO: Capacidad del sistema para evitar fallas bajo condiciones normales de operación continua.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Lint 0 errores** — ESLint con `eslint-plugin-react-hooks` y `react-refresh`; pasa sin errores ni warnings | `package.json` | 9 |
| 2 | **Prevención de fugas de memoria** — `useRef` + cleanup en efectos asíncronos y sockets | `src/pages/Buscar.jsx:39,44,48`, `src/hooks/useSocket.js:56-59` |
| 3 | **Dependencias correctas en useEffect** — Revisadas y con comentarios `eslint-disable-next-line` solo donde hay razón técnica documentada | Múltiples | — |
| 4 | **Validación de datos nulos** — `setReservaDetalle(res.status === 'success' && res.data ? res.data : null)` — manejo defensivo de respuestas API | `src/components/dueno/ModalDetalleReserva.jsx` | 15 |
| 5 | **Fallback de variables de entorno** — `VITE_API_URL \|\| 'http://localhost:5000'` en todos los servicios | Múltiples | — |
| 6 | **Socket.io con manejo de error de token** — Si el token del socket expira, lo renueva automáticamente y reconecta | `src/hooks/useSocket.js` | 28–48 |

#### Pendiente / Mejora futura

- Agregar suite de pruebas unitarias (Vitest + React Testing Library) con cobertura > 70%.
- Migrar a TypeScript para capturar errores en compilación.
- Implementar pruebas de integración para flujos críticos del dueño (crear cancha, gestionar horarios, ver dashboard).

---

### 4.2 Disponibilidad (Availability)

*Definición ISO: Grado en el que el sistema es operativamente accesible cuando se requiere su uso.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Health check** — Página `/status` verifica conectividad con backend | `src/pages/SystemStatus.jsx` | 19–41 |
| 2 | **Validación periódica de sesión** — Polling cada 60s a `/api/validate-session`; si responde 403, cierra sesión automáticamente | `src/App.jsx` | 42–57 |
| 3 | **ErrorBoundary global** — Captura errores no manejados en el árbol de React, muestra pantalla de error con botón "Recargar página" | `src/components/ErrorBoundary.jsx` | 1–49 |
| 4 | ErrorBoundary envuelve todas las rutas de la aplicación | `src/App.jsx` | 89, 114 |
| 5 | **Toast de notificaciones** — Sistema de notificaciones toast para errores, éxito y advertencias; auto-dismiss a los 4s | `src/components/ToastContainer.jsx`, `src/hooks/useToast.js` |

#### Pendiente / Mejora futura

- SLA documentado (ej: 99.9% uptime).

---

### 4.3 Tolerancia a Fallos (Fault Tolerance)

*Definición ISO: Capacidad del software para operar de forma correcta o degradada a pesar de la presencia de fallos.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **Reintento automático de peticiones** — Si el token expira (401), `apiFetch.js` renueva el token automáticamente y reintenta la petición original (retry pattern) | `src/utils/apiFetch.js` | 34–52 |
| 2 | **Socket.io con reconexión automática** — 10 reintentos con delay de 3s + renovación de token en `connect_error` | `src/hooks/useSocket.js` | 15–48 |
| 3 | **Manejo de error 429 (Rate limiting)** — Mensaje amigable: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." | `src/utils/apiFetch.js` | 24–27 |
| 4 | **Manejo de error 403 (Acceso denegado)** — Limpieza de sesión + redirección a home | `src/utils/apiFetch.js` | 29–32 |
| 5 | **Manejo de error 401 (Token expirado)** — Renovación automática + reintento; si falla, cierre de sesión limpio | `src/utils/apiFetch.js` | 34–52 |
| 6 | **Fallback de import.meta.env** — Si `VITE_API_URL` no está definida, cae a `http://localhost:5000` | Múltiples | — |
| 7 | **Manejo de error en generación de slots** — Captura error y devuelve `{ status: 'error', error: '...' }` en vez de lanzar excepción | `src/services/duenoService.js` | 103–114 |
| 8 | **Try/catch en peticiones API** — Todos los servicios envuelven llamadas en try/catch con logging | Múltiples | — |

#### Pendiente / Mejora futura

- Implementar patrón Circuit Breaker para evitar fallos en cascada cuando el backend está caído.
- Cachear datos del dashboard y perfil en `sessionStorage` para funcionamiento parcial offline.

---

### 4.4 Capacidad de Recuperación (Recoverability)

*Definición ISO: Capacidad del software para restablecer su nivel de rendimiento y recuperar datos tras una falla.*

#### Implementado

| # | Medida | Archivo | Línea |
|---|--------|---------|-------|
| 1 | **ErrorBoundary con recarga** — El usuario puede reiniciar la app con un clic sin perder la página actual | `src/components/ErrorBoundary.jsx` | 31–40 |
| 2 | **Limpieza completa de sesión en 403/401** — `localStorage.clear()` + `window.location.href = '/'` | `src/utils/apiFetch.js:6`, `src/services/authService.js:56-59` |
| 3 | **Reintento de conexión socket** — Reconexión automática hasta 10 intentos con backoff de 3s | `src/hooks/useSocket.js` | 15–24 |
| 4 | **Cierre de sesión graceful en logout** — Llama a `/api/logout` antes de limpiar localStorage, permitiendo al backend invalidar el refresh token | `src/services/authService.js` | 45–61 |

#### Pendiente / Mejora futura

- Definir RTO (< 1 hora) y RPO (< 5 minutos) documentados para el módulo dueño.
- Implementar Service Worker con estrategia Stale-While-Revalidate para respaldo offline parcial del dashboard.
- Auto-healing: reintento automático de carga de datos del dashboard si la primera petición falla.

---

## Resumen de Cumplimiento ISO 25010

| Característica | Subcaracterística | Estado | Evidencia clave |
|---------------|-------------------|--------|-----------------|
| **Eficiencia** | 1.1 Comportamiento Temporal | ✅ Alto | Debounce, lazy loading, fetch paralelo, socket.io |
| **Eficiencia** | 1.2 Utilización de Recursos | ✅ Medio | Dimensiones imágenes, fragments, FormData condicional, prefers-reduced-motion |
| **Eficiencia** | 1.3 Capacidad | ✅ Medio | Validación 5 MB, rate limiting, socket backoff |
| **Seguridad** | 2.1 Confidencialidad | ✅ Alto | JWT, RBAC, enmascaramiento RUC/CCI, auto-detección banco |
| **Seguridad** | 2.2 Integridad | ✅ Alto | Validación RUC/CCI, PUT completo, validación CCI-vs-banco |
| **Seguridad** | 2.3 No Repudio | ⚠️ Bajo | Logs estructurados; falta endpoint de auditoría |
| **Seguridad** | 2.4 Autenticidad | ✅ Alto | JWT + refresh, polling sesión, contador intentos, renovación socket |
| **Seguridad** | 2.5 Responsabilidad | ⚠️ Medio | Logs con contexto; falta SIEM |
| **Usabilidad** | 3.1 Inteligibilidad | ✅ Alto | Landing, onboarding, tooltips, íconos en tabs |
| **Usabilidad** | 3.2 Aprendizaje | ✅ Alto | Tutorial implícito, ayuda contextual, auto-detección banco, badges |
| **Usabilidad** | 3.3 Operabilidad | ✅ Medio | Tabs con teclado, skip link, acordeones, consistencia |
| **Usabilidad** | 3.4 Protección Errores | ✅ Alto | ConfirmDialog, validación tiempo real, CCI vs banco, toasts |
| **Usabilidad** | 3.5 Estética UI | ✅ Alto | CSS vars, tipografía, animaciones, tarjetas, dashboard |
| **Usabilidad** | 3.6 Accesibilidad | ✅ Medio-Alto | Roles ARIA, teclado, contraste, skip link; ver WAVE-PRINCIPLES.md |
| **Fiabilidad** | 4.1 Madurez | ✅ Medio | Lint 0 errores, prevención memory leaks, manejo defensivo |
| **Fiabilidad** | 4.2 Disponibilidad | ✅ Alto | Health check, polling sesión, ErrorBoundary, toasts |
| **Fiabilidad** | 4.3 Tolerancia Fallos | ✅ Alto | Retry pattern, socket reconexión, manejo 429/401/403 |
| **Fiabilidad** | 4.4 Recuperación | ✅ Medio | ErrorBoundary, limpieza sesión, reintento socket |

### Leyenda

| Estado | Significado |
|--------|-------------|
| ✅ Alto | Implementado con todas las subcaracterísticas; cumple criterios ISO |
| ✅ Medio | Implementado parcialmente; cubre casos principales, faltan refinamientos |
| ⚠️ Medio/Bajo | Implementación básica; requiere mejoras significativas |

---

## Referencias

- ISO/IEC 25010:2011 — Systems and software Quality Requirements and Evaluation (SQuaRE)
- WCAG 2.1 — Web Content Accessibility Guidelines (referencia cruzada con accesibilidad)
- OWASP Top 10 — Web Application Security Risks (referencia cruzada con seguridad)
- [`WAVE-PRINCIPLES.md`](./WAVE-PRINCIPLES.md) — Documento detallado de accesibilidad
- [`HU-DUENO.md`](./HU-DUENO.md) — Historias de usuario del módulo dueño
- [`BDD-DUENO.md`](./BDD-DUENO.md) — Escenarios BDD en Gherkin
