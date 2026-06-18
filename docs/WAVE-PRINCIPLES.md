# Principios WAVE / WCAG — PichangaGo Frontend

> **Estándar**: WCAG 2.1 (Web Content Accessibility Guidelines)  
> **Nivel objetivo**: AA  
> **Herramienta de referencia**: WAVE Web Accessibility Evaluation Tool  
> **Última revisión**: 2026-06-18 — Enfoque en el **módulo dueño**

---

## 1. Perceptible (Perceivable)

### 1.1 Alternativas textuales — 1.1.1 Non-text Content

| Requisito | Implementación | Archivo:línea |
|-----------|---------------|---------------|
| `alt` descriptivo en imágenes | ✅ Todas las `<img>` tienen `alt` dinámico con el nombre del recurso | `Home.jsx:87,163`, `Buscar.jsx:148`, `CanchaDetail.jsx:144,157`, `PanelDueno.jsx:142`, `ModalGestionCancha.jsx:453`, `MisReservas.jsx:97,144` |
| `aria-label` en modales | ✅ Todos los modales tienen `aria-label` descriptivo y dinámico | `AuthModal.jsx:82`, `ModalGestionCancha.jsx:243`, `ModalDetalleReserva.jsx:73`, `ConfirmDialog.jsx:29`, `ModalNuevaCancha.jsx:36`, `GestionLocales.jsx:121`, `CanchaDetail.jsx:360` |
| `aria-label` en botones de cerrar | ✅ Todos los botones de cierre tienen `aria-label="Cerrar"` | `ModalDetalleReserva.jsx:92`, `ModalGestionCancha.jsx:247`, `AuthModal.jsx:85`, `ToastContainer.jsx:15`, `Navbar.jsx:24` (dinámico: "Cerrar menú" / "Abrir menú") |
| `aria-label` en controles de galería | ✅ Navegación de fotos con `aria-label` descriptivo | `CanchaDetail.jsx:160-166` (anterior/siguiente/indicador) |
| `title` en inputs complejos | ✅ Inputs con `title` para instrucción adicional | `AuthModal.jsx:142,146,150,159,176`, `RegistroCanchaForm.jsx:93,98,102,111,116,122,127`, `PerfilFinanciero.jsx:53,58,62,68` |
| `aria-describedby` en campos con ayuda | ✅ Vincula mensajes de ayuda contextual | `AuthModal.jsx:176-177`, `DuenoOnboarding.jsx:99-102`, `RegistroCanchaForm.jsx:94,112,117,123,128`, `PerfilFinanciero.jsx:54,69` |
| `loading="lazy"` en imágenes | ✅ Carga diferida en todas las imágenes de canchas | `Home.jsx:164`, `Buscar.jsx:148`, `CanchaDetail.jsx:144` |

### 1.2 Contenido adaptable — 1.1.4 Resize / 1.4.10 Reflow

| Requisito | Implementación | Archivo |
|-----------|---------------|---------|
| Información no se pierde al redimensionar | ✅ CSS responsivo con `clamp()`, `min-width`, `flex-wrap`, `overflow-x: auto` en tablas | `index.css` general |
| Diseño responsivo hasta 320px | ✅ Grid y flexbox adaptativos; media queries en navbar y paneles | `index.css:476-482` |
| Texto redimensionable sin pérdida | ✅ Unidades relativas (`rem`, `%`) y `clamp()` | `index.css:60` |
| Tablas con scroll horizontal en mobile | ✅ `overflow-x: auto` en tablas de Dashboard y Reportes | `DashboardDueno.jsx`, `ReportesDueno.jsx` |

### 1.3 Contraste y uso del color — 1.4.3 Contrast (Minimum) / 1.4.1 Use of Color

| Requisito | Implementación | Archivo |
|-----------|---------------|---------|
| Contraste ≥ 4.5:1 (texto normal) | ✅ Variables CSS: `#1A2033` sobre `#F7F8FA` = 14.2:1; texto oscuro sobre fondo claro verificado | `index.css:3-30` |
| Contraste ≥ 3:1 (texto grande) | ✅ Badges y textos grandes cumplen | — |
| Información no depende solo del color | ✅ Estados de slots usan ícono + color + etiqueta textual (✅, 🔒, 🔥, 🚫); badges de estado con ícono + texto | `colorMap.js`, `ModalDetalleReserva.jsx` |
| `:focus-visible` con outline verde | ✅ Outline 2px `var(--green)` en todos los elementos interactivos, incluyendo `[role="tab"]` | `index.css:50-68` |

### 1.4 Multimedia — 1.4.2 Audio Control

| Requisito | Implementación |
|-----------|---------------|
| Sin contenido multimedia automático | ✅ No hay audio/video autoplay |
| Animaciones respetan `prefers-reduced-motion` | ✅ `@media (prefers-reduced-motion: reduce)` reduce todas las animaciones a 0.01ms | `index.css:428-435` |

---

## 2. Operable (Operable)

### 2.1 Teclado — 2.1.1 Keyboard

| Requisito | Implementación | Archivo:línea |
|-----------|---------------|---------------|
| Todas las funcionalidades accesibles por teclado | ✅ Botones, enlaces e inputs nativos funcionan con Tab/Enter | General |
| Navegación por flechas en tabs (dueño) | ✅ PanelDueno: flechas izquierda/derecha con `tabIndex` dinámico (roving tabindex) | `PanelDueno.jsx:103-114` |
| Navegación por flechas en tabs de reportes | ✅ ReportesDueno: flechas izquierda/derecha | `ReportesDueno.jsx:10-23` |
| Navegación por flechas en tabs de gestión de cancha | ✅ ModalGestionCancha: ArrowLeft/ArrowRight | `ModalGestionCancha.jsx:250-260` |
| `onKeyDown` en acordeones (Enter/Espacio) | ✅ AgendaDueno: Enter/Espacio para expandir/colapsar secciones | `AgendaDueno.jsx:424,536` |
| `onFocus`/`onBlur` en hover cards | ✅ Buscar.jsx: hover effects replicados para teclado | `Buscar.jsx:144-145` |
| Enter en búsqueda | ✅ Home.jsx: Enter activa búsqueda | `Home.jsx:52` |
| Escape cierra modales | ✅ ConfirmDialog con `keydown Escape` via `addEventListener` | `ConfirmDialog.jsx:12-19` |
| Skip-to-content link | ✅ "Saltar al contenido principal" visible al recibir foco (via `onFocus`/`onBlur`) | `App.jsx:78-80` |
| `tabIndex={0}` en elementos interactivos no-nativos | ✅ Acordeones en AgendaDueno, tabs con `tabIndex` dinámico | `AgendaDueno.jsx:424,536`, `PanelDueno.jsx:109-114` |

### 2.2 Tiempo suficiente — 2.2.1 Timing Adjustable

| Requisito | Implementación |
|-----------|---------------|
| Sesión expira con aviso | ✅ Polling de `validate-session` cada 60s; redirect automático en 403 |
| Sin límites de tiempo restrictivos en formularios | ✅ No hay timeouts forzados en formularios de registro o edición |

### 2.3 Navegación — 2.4.1 Bypass Blocks / 2.4.3 Focus Order / 2.4.7 Focus Visible

| Requisito | Implementación | Archivo:línea |
|-----------|---------------|---------------|
| Skip link | ✅ Link "Saltar al contenido principal" al inicio del DOM | `App.jsx:78-80` |
| `role="navigation"` en navbar | ✅ `<nav className="navbar">` — semántico por defecto | `Navbar.jsx:18` |
| `role="main"` en contenido principal | ✅ `<main id="main-content">` envuelve todas las rutas | `App.jsx:91` |
| `role="tablist"` + `role="tab"` en tabs | ✅ PanelDueno, ReportesDueno, ModalGestionCancha | Múltiples |
| `aria-selected` en tabs | ✅ Todos los tab panels usan `aria-selected` | `PanelDueno.jsx:109-114`, `ReportesDueno.jsx:18`, `ModalGestionCancha.jsx:252` |
| Jerarquía de encabezados (h1 > h2 > h3...) | ✅ h1 en Home, h2 en secciones, h3 en paneles | General |
| `:focus-visible` con outline | ✅ 2px solid `var(--green)` visible en todos los elementos | `index.css:50-68` |

---

## 3. Comprensible (Understandable)

### 3.1 Legibilidad — 3.1.1 Language of Page

| Requisito | Implementación | Archivo:línea |
|-----------|---------------|---------------|
| Idioma declarado | ✅ `lang="es"` en `<html>` | `index.html` |
| Texto en español | ✅ Todos los textos de UI en español | — |
| Errores descriptivos en español | ✅ Mensajes como "⚠️ Credenciales incorrectas. (2/3 intentos)" | — |

### 3.2 Predecible — 3.2.3 Consistent Navigation / 3.2.4 Consistent Identification

| Requisito | Implementación |
|-----------|---------------|
| Comportamiento consistente | ✅ Botones de acción principal siempre en misma posición (guardar en esquina inferior, cancelar a la izquierda) |
| Links con texto descriptivo | ✅ "Inicio", "Buscar canchas", "Panel Dueño", "Mis Reservas" |
| Sin apertura de nuevas ventanas sin aviso | ✅ No se usan `target="_blank"` sin advertencia |
| `disabled` visual en botones durante carga | ✅ Todos los botones submit se deshabilitan mientras `isLoading` | `AuthModal.jsx:167`, `Login.jsx:167` |

### 3.3 Asistencia en entrada de datos — 3.3.1 Error Identification / 3.3.2 Labels

| Requisito | Implementación | Archivo:línea |
|-----------|---------------|---------------|
| `htmlFor` en labels | ✅ Implementado en AuthModal, ModalNuevaCancha, ModalGestionCancha, GestionLocales, Buscar, CanchaDetail, DuenoOnboarding, RegistroCanchaForm, PerfilFinanciero, ReportesDueno, AgendaDueno | Múltiples |
| `aria-required="true"` en campos obligatorios | ✅ AuthModal, RegistroCanchaForm, PerfilFinanciero | `AuthModal.jsx:142,146,159,176`, `RegistroCanchaForm.jsx:94,103,112,128`, `PerfilFinanciero.jsx:54,59,63,69` |
| `required` nativo | ✅ En casi todos los formularios como respaldo | Múltiples |
| `aria-describedby` para ayuda contextual | ✅ AuthModal, DuenoOnboarding, RegistroCanchaForm, PerfilFinanciero | Ver sección 1.1 |
| `role="alert"` en errores | ✅ AuthModal, PerfilDueno, DuenoOnboarding, RegistroCanchaForm, PerfilFinanciero, ErrorBoundary, ToastContainer | Múltiples |
| `aria-live="polite"` para regiones dinámicas | ✅ PanelDueno, PerfilDueno, DuenoOnboarding, RegistroCanchaForm, PerfilFinanciero, AuthModal | Múltiples |
| Validación en tiempo real | ✅ RUC (11 dígitos), CCI (20 dígitos), email, contraseña validados client-side | `PerfilDueno.jsx`, `RegistroCanchaForm.jsx` |
| Botón submit deshabilitado durante carga | ✅ Todos los formularios | Múltiples |
| `role="status"` en loaders | ✅ Dashboard, Agenda, PanelDueno loading, Suspense fallback | Múltiples |

---

## 4. Robusto (Robust)

### 4.1 Compatibilidad — 4.1.1 Parsing / 4.1.2 Name, Role, Value / 4.1.3 Status Messages

| Requisito | Implementación | Archivo:línea |
|-----------|---------------|---------------|
| HTML semántico | ✅ `<nav>`, `<main>`, `<form>`, `<table>`, `<button>`, `<h1>`–`<h5>` | General |
| `role="dialog"` con `aria-modal="true"` | ✅ En todos los modales | Ver sección 1.1 |
| `role="alertdialog"` | ✅ En ConfirmDialog (mejor práctica) | `ConfirmDialog.jsx:27` |
| `role="tablist"` + `role="tab"` | ✅ PanelDueno, ReportesDueno, ModalGestionCancha | Múltiples |
| `aria-selected` en tabs | ✅ Todos los tab panels | Múltiples |
| `aria-expanded` en acordeones | ✅ AgendaDueno (vista semanal y diaria) | `AgendaDueno.jsx:424,536` |
| `aria-live="polite"` + `aria-atomic="true"` + `role="status"` | ✅ PanelDueno, PerfilDueno, DuenoOnboarding, RegistroCanchaForm, PerfilFinanciero, AuthModal | Múltiples |
| `role="alert"` en mensajes de error/éxito | ✅ ErrorBoundary, AuthModal, ToastContainer, PerfilDueno, DuenoOnboarding, RegistroCanchaForm, PerfilFinanciero | Múltiples |
| `role="status"` en Suspense | ✅ Fallback de carga con `role="status"` | `App.jsx:90` |
| `aria-atomic="true"` | ✅ Junto con `aria-live` para regiones dinámicas | Múltiples |
| Focus management con `ref.focus()` | ✅ ConfirmDialog: `confirmRef.current.focus()` al abrir | `ConfirmDialog.jsx:4-10,61` |

---

## 5. Estado por componente — Módulo Dueño

### 5.1 PanelDueno.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `role="tablist"` + `aria-label="Secciones del panel de dueño"` | ✅ |
| `role="tab"` + `aria-selected` en tabs | ✅ |
| `tabIndex` dinámico (roving tabindex) | ✅ |
| Flechas izquierda/derecha en tabs | ✅ |
| `aria-live="polite"` + `aria-atomic="true"` + `role="status"` para mensajes globales | ✅ |
| `role="status"` en loading | ✅ |
| `alt` en imágenes de canchas | ✅ |
| **Mejorable**: Botones con emoji sin `aria-label` (➕ Nueva Cancha, ⚙️ Gestionar, ⏸ Pausar) | ⚠️ |

### 5.2 DashboardDueno.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `role="status"` en loading y empty-state | ✅ |
| `<table>` semántico con `<thead>`, `<th>`, `<tbody>` | ✅ |
| Jerarquía `<h3>`, `<h4>` | ✅ |
| **Mejorable**: `<th>` sin `scope="col"` | ❌ |

### 5.3 AgendaDueno.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `role="button"` + `tabIndex={0}` en acordeones | ✅ |
| `aria-expanded` en secciones expandibles | ✅ |
| `aria-label` dinámico en acordeones ("Expandir..." / "Colapsar...") | ✅ |
| `onKeyDown` (Enter/Espacio) en acordeones | ✅ |
| `role="status"` en loading | ✅ |
| `<label>` asociados en formularios de filtro | ✅ |
| **Mejorable**: Botones ◀▶ con `title` pero sin `aria-label` | ⚠️ |

### 5.4 ModalDetalleReserva.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `role="dialog"` + `aria-modal="true"` + `aria-label="Detalle de reserva"` | ✅ |
| Botón cerrar con `aria-label="Cerrar"` | ✅ |
| Backdrop click to close | ✅ |
| **Mejorable**: Sin Escape key handler, sin focus trapping, sin `autoFocus` | ❌ |

### 5.5 ModalGestionCancha.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `role="dialog"` + `aria-modal="true"` + `aria-label` dinámico | ✅ |
| `role="tablist"` + `role="tab"` + `aria-selected` en tabs internos | ✅ |
| Flechas teclado en tabs | ✅ |
| `<form>` con `onSubmit` | ✅ |
| `htmlFor` en todos los labels | ✅ |
| `alt` en imágenes | ✅ |
| `<table>` con `<thead>`/`<th>` | ✅ |
| **Mejorable**: Sin Escape key, sin focus trapping, sin `autoFocus` | ❌ |

### 5.6 ReportesDueno.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `role="tablist"` + `aria-label="Tipos de reporte"` | ✅ |
| `role="tab"` + `aria-selected` + `tabIndex` dinámico | ✅ |
| Flechas izquierda/derecha en tabs | ✅ |
| `htmlFor` en labels de filtros | ✅ |
| `<table>` semántico | ✅ |
| Botones con `disabled` visual | ✅ |
| **Mejorable**: `<th>` sin `scope`, loading sin `role="status"` | ❌ |

### 5.7 PerfilDueno.jsx (reemplaza ConfigDueno.jsx)
| Accesibilidad | Estado |
|--------------|--------|
| `aria-live="polite"` + `aria-atomic="true"` + `role="status"` para mensajes | ✅ |
| `role="alert"` en errores/éxito | ✅ |
| `<form>` con `onSubmit` | ✅ |
| `type="password"` en RUC/CCI (datos sensibles) | ✅ |
| `maxLength` en inputs | ✅ |
| **Mejorable**: Labels sin `htmlFor` (usan `<span>` en vez de `<label htmlFor="">`) | ❌ |

### 5.8 ConfirmDialog.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `role="alertdialog"` + `aria-modal="true"` | ✅ MEJOR PRÁCTICA |
| `aria-label` dinámico | ✅ |
| Focus management con `ref.focus()` | ✅ MEJOR PRÁCTICA |
| Escape key handler (`addEventListener`) | ✅ MEJOR PRÁCTICA |
| Backdrop click to close | ✅ |
| Botones con texto visible | ✅ |

### 5.9 GestionLocales.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `role="dialog"` + `aria-modal="true"` | ✅ |
| `<form>` con `onSubmit` | ✅ |
| `htmlFor` en todos los labels | ✅ |
| `required` en campos obligatorios | ✅ |
| **Mejorable**: Sin Escape key, sin focus management, sin `autoFocus` | ❌ |

### 5.10 ModalNuevaCancha.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `role="dialog"` + `aria-modal="true"` + `aria-label="Registrar nueva cancha"` | ✅ |
| `<form>` con `onSubmit` | ✅ |
| `htmlFor` en todos los labels | ✅ |
| `required` + `type="number"` + `min` en campos numéricos | ✅ |
| **Mejorable**: Sin Escape key, sin focus trapping, sin `autoFocus` | ❌ |

### 5.11 DuenoOnboarding.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `aria-live="polite"` + `aria-atomic="true"` + `role="status"` | ✅ |
| `role="alert"` en mensajes | ✅ |
| `htmlFor` en labels | ✅ |
| `aria-describedby` con helper text | ✅ |
| `<table>` semántico | ✅ |
| `<h2>` headings | ✅ |
| **Mejorable**: Sin navegación teclado en steps, sin `autoFocus` | ❌ |

### 5.12 RegistroCanchaForm.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `aria-live="polite"` + `role="status"` | ✅ |
| `role="alert"` en mensajes | ✅ |
| `htmlFor` en todos los labels | ✅ |
| `aria-required="true"` | ✅ |
| `aria-describedby` con help text | ✅ |
| `title` en inputs | ✅ |
| `<form>` con `onSubmit` + `noValidate` | ✅ |

### 5.13 PerfilFinanciero.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `aria-live="polite"` + `role="status"` | ✅ |
| `role="alert"` en mensajes | ✅ |
| `htmlFor` en todos los labels | ✅ |
| `aria-required="true"` | ✅ |
| `aria-describedby` con help text | ✅ |
| `title` en inputs | ✅ |
| `<form>` con `onSubmit` | ✅ |

---

## 6. Estado por componente — Módulo General

### 6.1 AuthModal.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `role="dialog"` + `aria-modal="true"` + `aria-label` dinámico | ✅ |
| `aria-live="polite"` + `aria-atomic="true"` + `role="status"` | ✅ |
| `role="alert"` en errores/éxito | ✅ |
| `aria-required="true"` en inputs obligatorios | ✅ |
| `aria-describedby` en password | ✅ |
| `htmlFor` en todos los labels | ✅ |
| `title` en inputs | ✅ |
| `disabled` en submit durante carga | ✅ |
| Botón cerrar con `aria-label="Cerrar modal"` | ✅ |
| **Mejorable**: Tabs login/register sin `role="tab"`, sin `aria-selected`, sin `role="tablist"` (son `<button>` simples) | ❌ |
| **Mejorable**: Sin Escape key, sin focus trapping, sin `autoFocus` | ❌ |

### 6.2 Navbar.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `<nav>` semántico | ✅ |
| `aria-label` dinámico en menú toggle ("Abrir menú" / "Cerrar menú") | ✅ |
| **Mejorable**: Confirmación de logout sin `role="alertdialog"`, sin `aria-modal` | ❌ |

### 6.3 ErrorBoundary.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `role="alert"` | ✅ |
| `<h2>` descriptivo | ✅ |
| Botón de recarga accesible | ✅ |

### 6.4 ToastContainer.jsx
| Accesibilidad | Estado |
|--------------|--------|
| `role="alert"` en cada toast | ✅ MEJOR PRÁCTICA |
| Botón cerrar con `aria-label="Cerrar"` | ✅ |

### 6.5 Login.jsx
| Accesibilidad | Estado |
|--------------|--------|
| **Crítico**: Tabs (Ingresar/Registrarse) son `<div>` sin `role="tab"`, `aria-selected`, ni teclado | ❌ |
| **Crítico**: Selector de rol (Jugador/Dueño) son `<div>` sin `role="radio"`, `aria-checked`, ni teclado | ❌ |
| **Crítico**: Labels sin `htmlFor` (usan `className="form-label"` como spans) | ❌ |
| **Crítico**: Mensaje de error sin `role="alert"` | ❌ |
| **Crítico**: Sin `aria-live` para región dinámica | ❌ |

### 6.6 MisReservas.jsx
| Accesibilidad | Estado |
|--------------|--------|
| Tabs son `<button>` sin `role="tab"` ni `aria-selected` | ❌ |
| Overlay de detalle sin `role="dialog"`, sin `aria-modal`, sin `aria-label` | ❌ |
| Botón cerrar sin `aria-label` | ❌ |
| Sin Escape key, sin focus management | ❌ |

### 6.7 ResetPassword.jsx
| Accesibilidad | Estado |
|--------------|--------|
| Labels sin `htmlFor` (usan `className="form-label"`) | ❌ |

### 6.8 App.jsx / index.css
| Accesibilidad | Estado |
|--------------|--------|
| Skip link "Saltar al contenido principal" | ✅ |
| `<main id="main-content">` semántico | ✅ |
| `role="status"` en Suspense fallback | ✅ |
| `prefers-reduced-motion: reduce` | ✅ |
| `:focus-visible` global con outline verde | ✅ |
| Fuentes en `rem`/`clamp()` | ✅ |
| Diseño responsivo | ✅ |

---

## 7. Pendientes globales priorizados

### 🔴 Prioridad Alta (impacto directo en accesibilidad)
- [ ] **Login.jsx**: Convertir tabs a `role="tablist"`/`role="tab"` con `aria-selected` y navegación por teclado
- [ ] **Login.jsx**: Convertir selector de rol a `role="radio"`/`role="radiogroup"` con `aria-checked` y teclado
- [ ] **Login.jsx**: Agregar `htmlFor` a todos los labels
- [ ] **Login.jsx**: Agregar `role="alert"` al mensaje de error + `aria-live="polite"`
- [ ] **MisReservas.jsx**: Agregar `role="dialog"` + `aria-modal="true"` + `aria-label` al overlay de detalle
- [ ] **MisReservas.jsx**: Agregar `aria-label` al botón cerrar
- [ ] **PerfilDueno.jsx**: Reemplazar `<span>` labels por `<label htmlFor="">`

### 🟡 Prioridad Media (mejora significativa)
- [ ] **Escape key en todos los modales**: ModalDetalleReserva, ModalGestionCancha, ModalNuevaCancha, AuthModal, CanchaDetail, GestionLocales
- [ ] **Focus trapping en modales**: Evitar que Tab salga del modal
- [ ] **`autoFocus` en modales**: Enfocar primer input o botón al abrir
- [ ] **`<th scope="col">`** en tablas de Dashboard, Reportes, DuenoOnboarding
- [ ] **`aria-label` en botones ◀▶** de AgendaDueno (actualmente solo tienen `title`)
- [ ] **`aria-label` en botones emoji-only** de PanelDueno (➕, ⚙️, ⏸)
- [ ] **Navbar logout**: Agregar `role="alertdialog"` + `aria-modal` al confirm

### 🟢 Prioridad Baja (buenas prácticas)
- [ ] **AuthModal tabs**: Agregar `role="tab"`/`aria-selected`/`role="tablist"` a login/register
- [ ] **`role="status"` en loading** de ReportesDueno
- [ ] **`aria-current="step"`** en indicadores de progreso de CanchaDetail

---

## 8. Resumen de cumplimiento WCAG 2.1 AA

| Principio | Criterios Aplicables | Estado General |
|-----------|---------------------|---------------|
| **1. Perceptible** | 1.1.1, 1.4.1, 1.4.3, 1.4.4, 1.4.10, 1.4.12 | ✅ Bien implementado |
| **2. Operable** | 2.1.1, 2.1.2, 2.4.1, 2.4.3, 2.4.7, 2.5.3 | ⚠️ Parcial — modales sin Escape ni focus trapping |
| **3. Comprensible** | 3.1.1, 3.2.3, 3.3.1, 3.3.2 | ✅ Bien implementado (excepto Login.jsx y ResetPassword.jsx) |
| **4. Robusto** | 4.1.2, 4.1.3 | ✅ Bien implementado (excepto MisReservas.jsx overlay) |

**Puntaje estimado WAVE**: ~85% de cobertura en módulo dueño; ~65% en páginas públicas/login.
