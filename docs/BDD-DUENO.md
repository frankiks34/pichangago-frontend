# BDD — Módulo Dueño
## Feature: Registro y autenticación

```gherkin
Feature: Registro de dueño
  As a visitante
  I want to registrarme como dueño
  So that pueda acceder al panel de administración

  Scenario: Registro exitoso
    Given el visitante está en el formulario de registro de dueño
    When completa nombre, apellido, email, teléfono y contraseña válidos
    And envía el formulario
    Then el sistema crea la cuenta
    And inicia la sesión automáticamente
    And redirige al panel con la vista "Mi Perfil" activa

  Scenario: Email duplicado
    Given el visitante está en el formulario de registro
    When ingresa un email que ya está registrado
    And envía el formulario
    Then el sistema muestra "El email ya está registrado"

  Scenario: Contraseña inválida
    Given el visitante está en el formulario de registro
    When ingresa una contraseña de menos de 6 caracteres
    And envía el formulario
    Then el sistema detiene el envío
    And muestra "Mínimo 6 caracteres"
```

```gherkin
Feature: Inicio de sesión
  As a dueño
  I want to iniciar sesión con mi email y contraseña
  So that pueda acceder a mi panel de administración

  Scenario: Login exitoso
    Given el dueño tiene una cuenta activa
    When ingresa email y contraseña correctos
    And envía el formulario
    Then el sistema inicia la sesión
    And redirige al panel del dueño

  Scenario: Credenciales incorrectas
    Given el dueño tiene una cuenta registrada
    When ingresa una contraseña incorrecta
    And envía el formulario
    Then el sistema muestra "Credenciales inválidas"

  Scenario: Token expirado con renovación automática
    Given el dueño tiene una sesión activa
    When el token de acceso expira
    And el sistema intenta renovarlo con el refresh token
    Then el sistema renueva el token sin interrumpir la experiencia

  Scenario: Sesión completamente expirada
    Given el dueño no ha usado la plataforma por varios días
    When el refresh token también expira
    And el sistema intenta renovar el token
    Then el sistema cierra la sesión
    And redirige al login
```

```gherkin
Feature: Cierre de sesión
  As a dueño
  I want to cerrar mi sesión
  So that proteger mi cuenta

  Scenario: Logout exitoso
    Given el dueño está autenticado en el panel
    When presiona "Cerrar sesión"
    Then el sistema elimina los tokens del almacenamiento local
    And redirige al Home
```

---

## Feature: Perfil del dueño

```gherkin
Feature: Completar datos personales
  As a dueño
  I want a completar y editar mis datos personales
  So that los jugadores puedan identificarme

  Scenario: Guardar datos personales exitosamente
    Given el dueño está en la pestaña "Mi Perfil"
    And el formulario muestra sus datos actuales
    When modifica el nombre, apellido o teléfono
    And presiona "Guardar Cambios"
    Then el sistema actualiza los datos
    And muestra "Datos guardados correctamente"

  Scenario: Editar solo un campo específico
    Given el dueño está en "Mi Perfil"
    And solo desea cambiar el teléfono
    When edita únicamente el campo teléfono
    And presiona "Guardar Cambios"
    Then el sistema actualiza solo el teléfono
    And no solicita modificar otros campos

  Scenario: Teléfono inválido
    Given el dueño está editando sus datos personales
    When ingresa un teléfono de 8 dígitos
    And presiona "Guardar Cambios"
    Then el sistema muestra "El teléfono debe tener exactamente 9 dígitos"

  Scenario: Sin cambios realizados
    Given el dueño abre "Mi Perfil"
    When no modifica ningún campo
    And presiona "Guardar Cambios"
    Then el sistema muestra "No hay cambios que guardar"

  Scenario: Datos personales visibles en el banner
    Given el dueño ha guardado sus datos personales
    When vuelve a "Mi Perfil"
    Then el banner muestra su nombre completo y correo electrónico
    And el banner muestra su teléfono
```

```gherkin
Feature: Configuración del perfil financiero
  As a dueño
  I want a registrar mis datos bancarios
  So that pueda recibir los pagos de las reservas

  Scenario: Configuración financiera inicial
    Given el dueño ingresa al panel por primera vez
    And no tiene perfil financiero configurado
    When el sistema detecta que faltan datos financieros
    Then redirige a "Mi Perfil" con el formulario financiero visible

  Scenario: Guardar datos financieros exitosamente
    Given el dueño está en la sección de pagos de "Mi Perfil"
    When completa RUC, Razón Social, CCI y selecciona banco
    And presiona "Guardar Cambios"
    Then el sistema guarda los datos financieros
    And marca el perfil como configurado
    And permite al dueño acceder al resto del panel

  Scenario: Auto-detección de banco desde CCI — BCP
    Given el dueño está ingresando su CCI
    When escribe exactamente 20 dígitos comenzando con "0002"
    Then el combobox de banco se selecciona automáticamente como "BCP"
    And el hint muestra "✅ Banco seleccionado: BCP"

  Scenario: Auto-detección de banco desde CCI — Interbank
    Given el dueño está ingresando su CCI
    When escribe exactamente 20 dígitos comenzando con "0003"
    Then el combobox de banco se selecciona automáticamente como "Interbank"

  Scenario: Auto-detección de banco desde CCI — BBVA
    Given el dueño está ingresando su CCI
    When escribe exactamente 20 dígitos comenzando con "0011"
    Then el combobox de banco se selecciona automáticamente como "BBVA"

  Scenario: CCI con prefijo no reconocido
    Given el dueño está ingresando su CCI
    When escribe 20 dígitos comenzando con "9999"
    And el combobox de banco está en "— Auto-detectar —"
    Then el hint muestra "⚠️ CCI no reconocido"

  Scenario: Banco seleccionado no coincide con CCI
    Given el dueño tiene un CCI que inicia con "0002"
    When selecciona manualmente "Interbank" en el combobox
    And presiona "Guardar Cambios"
    Then el sistema muestra "El banco Interbank no coincide con el CCI"

  Scenario: RUC inválido
    Given el dueño está configurando sus datos financieros
    When ingresa un RUC de 11 dígitos que comienza con "00"
    And presiona "Guardar Cambios"
    Then el sistema muestra "RUC inválido. Debe tener 11 dígitos, iniciar con 10 o 20"

  Scenario: Datos sensibles ocultos por defecto
    Given el dueño abre "Mi Perfil"
    When la sección de pagos se carga
    Then los campos de RUC y CCI se muestran como contraseña (puntos)
    And el botón muestra "👁 Mostrar datos sensibles"

  Scenario: Revelar datos sensibles
    Given el dueño está en la sección de pagos con datos ocultos
    When presiona "👁 Mostrar datos sensibles"
    Then los campos de RUC y CCI se vuelven visibles como texto normal
    And el botón cambia a "🙈 Ocultar datos sensibles"
```

---

## Feature: Gestión de locales

```gherkin
Feature: Registrar local
  As a dueño
  I want to registrar los datos de mi local
  So that los jugadores sepan dónde queda

  Scenario: Registrar local exitosamente
    Given el dueño tiene su perfil financiero configurado
    When está en la pestaña "Locales"
    And completa nombre, dirección, distrito y datos del local
    And guarda el formulario
    Then el sistema registra el local
    And aparece en la lista de locales del dueño

  Scenario: Intentar registrar local sin perfil financiero
    Given el dueño no ha configurado su perfil financiero
    When intenta acceder a la pestaña "Locales"
    Then el sistema redirige a "Mi Perfil"
    And muestra un mensaje para completar los datos financieros primero
```

---

## Feature: Gestión de canchas

```gherkin
Feature: Registrar cancha
  As a dueño
  I want to registrar una nueva cancha
  So that los jugadores puedan reservarla

  Scenario: Crear cancha exitosamente
    Given el dueño tiene al menos un local registrado
    When está en "Mis Canchas"
    And presiona "➕ Nueva Cancha"
    And completa nombre, selecciona local, define precios
    And guarda
    Then el sistema crea la cancha
    And aparece en la lista de canchas

  Scenario: Crear cancha sin locales
    Given el dueño no tiene locales registrados
    When intenta crear una cancha
    Then el modal muestra que debe registrar un local primero

  Scenario: Foto opcional al crear cancha
    Given el dueño está creando una nueva cancha
    When completa todos los campos obligatorios
    And omite subir una foto
    Then la cancha se crea igualmente
    And muestra una imagen por defecto
```

```gherkin
Feature: Estados de cancha
  As a dueño
  I want to pausar y reactivar mis canchas
  So that gestionar su disponibilidad

  Scenario: Pausar cancha
    Given una cancha está en estado DISPONIBLE
    When el dueño presiona "⏸ Pausar Cancha"
    Then la cancha cambia a estado SUSPENDIDO
    And ya no aparece en los resultados de búsqueda para jugadores

  Scenario: Reactivar cancha
    Given una cancha está en estado SUSPENDIDO
    When el dueño presiona "▶ Reactivar Cancha"
    Then la cancha vuelve a estado DISPONIBLE
    And los jugadores pueden volver a reservarla
```

---

## Feature: Dashboard y resumen

```gherkin
Feature: Dashboard del dueño
  As a dueño
  I want to ver un resumen ejecutivo al entrar al panel
  So that tener una visión rápida del negocio

  Scenario: Dashboard con datos del día
    Given el dueño tiene canchas activas
    And hay reservas confirmadas para hoy
    When entra al panel
    Then ve 4 tarjetas con: reservas hoy, ingresos hoy, ocupación y canchas activas
    And ve una tabla con las reservas del día ordenadas por hora
    And ve tarjeta de próxima liquidación si aplica

  Scenario: Dashboard sin reservas hoy
    Given el dueño tiene canchas activas
    But no hay reservas para la fecha actual
    When entra al panel
    Then las tarjetas muestran valores en 0
    And la sección de reservas muestra "📭 No hay reservas para hoy"

  Scenario: Dashboard con próxima liquidación
    Given el dueño tiene una liquidación pendiente
    When está en el Dashboard
    Then ve una tarjeta "📄 Próxima Liquidación"
    And muestra período, monto neto y estado
```

---

## Feature: Agenda y slots

```gherkin
Feature: Agenda diaria y semanal
  As a dueño
  I want to consultar la agenda de mis canchas
  So that ver qué slots están ocupados o libres

  Scenario: Vista diaria con slots
    Given el dueño tiene canchas con horarios configurados
    When abre la pestaña "Agenda"
    Then ve todos los slots del día agrupados por cancha
    And cada slot muestra hora, estado y precio

  Scenario: Vista semanal
    Given el dueño está en la agenda
    When cambia a vista semanal
    Then ve una tabla con días vs canchas
    And cada celda muestra los slots del día

  Scenario: Bloquear slot manualmente
    Given un slot está en estado DISPONIBLE
    When el dueño presiona "🔒 Bloquear"
    Then el slot cambia a estado BLOQUEADO
    And ya no puede ser reservado por jugadores

  Scenario: Desbloquear slot
    Given un slot está en estado BLOQUEADO
    When el dueño presiona "🔓 Desbloquear"
    Then el slot vuelve a estado DISPONIBLE
```

```gherkin
Feature: Ofertas en slots
  As a dueño
  I want to crear ofertas con descuento en slots disponibles
  So that atraer más jugadores en horas de baja demanda

  Scenario: Crear oferta en un slot individual
    Given un slot está en estado DISPONIBLE
    When el dueño selecciona el slot
    And ingresa 20% de descuento y una fecha de expiración
    And guarda la oferta
    Then el slot cambia a estado OFERTA
    And aparece destacado en el Home con el precio rebajado

  Scenario: Crear ofertas múltiples
    Given el dueño selecciona múltiples slots disponibles de una misma cancha
    When ingresa 30% de descuento y fecha de expiración
    And confirma
    Then todos los slots seleccionados pasan a estado OFERTA

  Scenario: Quitar oferta de un slot
    Given un slot está en estado OFERTA
    When el dueño presiona "🗑️ Quitar oferta"
    Then el slot vuelve a estado DISPONIBLE

  Scenario: Descuento fuera de rango permitido
    Given el dueño está creando una oferta
    When ingresa un descuento de 60%
    Then el sistema muestra "El % debe estar entre 1 y 50"

  Scenario: Slots en oferta visibles en Home
    Given existen slots con estado OFERTA para hoy
    When un visitante ingresa al Home
    Then ve una sección "⚡ Último Minuto — Hoy"
    And cada oferta muestra precio original tachado, precio oferta y % descuento
```

```gherkin
Feature: Marcar No Show
  As a dueño
  I want to marcar una reserva como "No Asistió"
  So that registrar la inasistencia y liberar el slot

  Scenario: Marcar no show exitosamente
    Given un slot está reservado y confirmado
    When el dueño presiona "🚫 No asistió"
    Then el slot cambia a estado NO_ASISTIO
```

---

## Feature: Reportes

```gherkin
Feature: Reporte de ingresos
  As a dueño
  I want a consultar mis ingresos por rango de fechas
  So that evaluar el rendimiento económico

  Scenario: Reporte de ingresos con datos
    Given el dueño tiene reservas en un período específico
    When selecciona fecha inicio y fecha fin
    And presiona "Buscar"
    Then ve el total de ingresos, cantidad de reservas y ticket promedio

  Scenario: Reporte de ingresos sin datos
    Given el dueño selecciona un rango sin reservas
    When presiona "Buscar"
    Then ve "No se encontraron ingresos en este período"
```

```gherkin
Feature: Saldo pendiente
  As a dueño
  I want to consultar mi saldo por cobrar
  So that saber cuánto dinero tengo acumulado

  Scenario: Saldo pendiente disponible
    Given el dueño tiene reservas confirmadas no liquidadas
    When abre el reporte de saldo pendiente
    Then ve el monto total pendiente
    And ve el detalle de cada reserva no liquidada
```

```gherkin
Feature: Historial de liquidaciones
  As a dueño
  I want a ver el historial de pagos recibidos
  So that llevar control de mis ingresos

  Scenario: Liquidaciones existentes
    Given el dueño tiene liquidaciones previas
    When abre el reporte de liquidaciones
    Then ve una lista con período, monto neto, comisiones y estado

  Scenario: Sin liquidaciones aún
    Given el dueño es nuevo en la plataforma
    When abre el reporte de liquidaciones
    Then ve "Aún no tienes liquidaciones"
```

```gherkin
Feature: Estadísticas de ocupación
  As a dueño
  I want a ver el % de ocupación mensual
  So that identificar tendencias y ajustar precios

  Scenario: Ocupación mensual detallada
    Given el dueño selecciona un mes con datos
    When abre el reporte de ocupación
    Then ve una tabla con cada cancha
    And cada fila muestra ocupados/totales y % con barra de progreso

  Scenario: Mes sin reservas
    Given el dueño selecciona un mes futuro
    When busca la ocupación
    Then ve "No hay datos de ocupación para este período"
```

```gherkin
Feature: Historial de reservas
  As a dueño
  I want a buscar reservas por fecha y estado
  So that revisar reservas antiguas

  Scenario: Búsqueda con resultados
    Given el dueño selecciona un rango de fechas con reservas
    When selecciona un estado o "Todos"
    And presiona "🔍 Buscar"
    Then ve una tabla con cancha, jugador, fecha, hora, monto y estado

  Scenario: Búsqueda sin resultados
    Given el dueño selecciona un rango sin reservas
    When presiona "🔍 Buscar"
    Then ve "No se encontraron reservas"

  Scenario: Filtro por estado específico
    Given el dueño quiere ver solo reservas canceladas
    When selecciona estado "CANCELADA"
    And presiona "🔍 Buscar"
    Then solo se muestran reservas con estado CANCELADA
```

---

## Feature: Notificaciones en tiempo real

```gherkin
Feature: Notificaciones vía WebSocket
  As a dueño
  I want a recibir notificaciones cuando alguien reserva
  So that estar al tanto sin recargar la página

  Scenario: Notificación de nueva reserva
    Given el dueño está conectado al panel
    When un jugador realiza una nueva reserva
    Then el sistema muestra un toast "📩 Nueva reserva de [jugador] en [cancha]"
    And la agenda y dashboard se actualizan automáticamente

  Scenario: Reconexión automática tras caída
    Given el dueño perdió la conexión a internet
    When la conexión se restaura
    Then el socket se reconecta automáticamente
    And el dueño sigue recibiendo notificaciones sin intervención
```

```gherkin
Feature: Detalle de reserva
  As a dueño
  I want to ver el detalle completo de una reserva
  So that conocer datos del jugador y pago

  Scenario: Ver detalle de reserva
    Given el dueño está en la agenda
    When presiona "Ver más" en una reserva reservada
    Then se abre un modal con datos del jugador, horario, monto y estado de pago
```

---

## Feature: Navegación y onboarding

```gherkin
Feature: Flujo de onboarding para nuevo dueño
  As a nuevo dueño
  I want a completar los pasos iniciales guiado
  So que activar mi cuenta rápidamente

  Scenario: Registro → Mi Perfil
    Given el visitante se registra como dueño exitosamente
    When es redirigido al panel
    Then la pestaña activa es "Mi Perfil"
    And el banner muestra sus datos de registro

  Scenario: Perfil completo → Agregar local
    Given el dueño acaba de completar su perfil financiero
    When el sistema detecta que no tiene locales
    Then redirige automáticamente a la pestaña "Locales"

  Scenario: Perfil y local completo → Dashboard
    Given el dueño tiene perfil configurado y al menos un local
    When entra al panel
    Then la pestaña activa por defecto es "Resumen" (Dashboard)
```

```gherkin
Feature: Navegación entre pestañas
  As a dueño
  I want a navegar entre las secciones del panel
  So that acceder a cada funcionalidad

  Scenario: Navegación con teclado (flechas)
    Given el dueño está en el panel con el foco en las pestañas
    When presiona la flecha derecha
    Then la siguiente pestaña se activa

  Scenario: Navegación con clic
    Given el dueño ve las pestañas del panel
    When hace clic en "Reportes"
    Then la pestaña Reportes se activa y muestra su contenido
