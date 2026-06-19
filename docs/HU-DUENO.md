# Historias de Usuario — Módulo Dueño

## HU-01 | Registro de dueño

> **Como** visitante  
> **Quiero** registrarme como dueño de cancha con email y contraseña  
> **Para** poder acceder al panel de administración y gestionar mis canchas

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Registro exitoso | El visitante está en el formulario de registro de dueño | Completa nombre, apellido, email, teléfono y contraseña válidos y envía | El sistema crea la cuenta, inicia sesión y redirige al panel con la vista "Mi Perfil" |
| CA-02 | Email duplicado | El visitante ingresa un email ya registrado | Envía el formulario | El sistema muestra "El email ya está registrado" |
| CA-03 | Contraseña débil | El visitante ingresa menos de 6 caracteres en la contraseña | Envía el formulario | El sistema detiene el envío y muestra "Mínimo 6 caracteres" |
| CA-04 | Campos obligatorios vacíos | El visitante deja campos obligatorios sin completar | Intenta enviar el formulario | El navegador o sistema indica qué campos faltan |

---

## HU-02 | Completar perfil personal

> **Como** dueño registrado  
> **Quiero** completar mis datos personales (nombre, apellido, teléfono)  
> **Para** que los jugadores puedan identificarme y contactarme

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Guardar datos personales | El dueño está en "Mi Perfil" | Modifica nombre, apellido o teléfono y presiona "Guardar Cambios" | El sistema actualiza los datos y muestra "Datos guardados correctamente" |
| CA-02 | Editar solo un campo | El dueño quiere cambiar solo el teléfono | Edita únicamente el teléfono y guarda | El sistema actualiza solo el teléfono sin pedir los demás campos |
| CA-03 | Teléfono inválido | El dueño ingresa un teléfono de menos de 9 dígitos | Intenta guardar | El sistema muestra "El teléfono debe tener exactamente 9 dígitos" |
| CA-04 | Sin cambios | El dueño abre "Mi Perfil" sin modificar nada | Presiona "Guardar Cambios" | El sistema muestra "No hay cambios que guardar" |

---

## HU-03 | Configurar perfil financiero

> **Como** dueño de cancha  
> **Quiero** registrar mi RUC, Razón Social, CCI y banco  
> **Para** poder recibir los pagos de las reservas

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Configuración inicial | El dueño ingresa por primera vez sin datos financieros | Completa RUC, Razón Social, CCI y guarda | El sistema guarda los datos, el perfil queda configurado y redirige a agregar un local |
| CA-02 | Auto-detección de banco desde CCI | El dueño completa el CCI con 20 dígitos (ej. 0002...) | Termina de escribir el CCI | El combobox de banco se selecciona automáticamente (BCP para 0002) y muestra "✅ Banco seleccionado: BCP" |
| CA-03 | CCI con prefijo no reconocido | El dueño ingresa un CCI que no comienza con 0002, 0003 ni 0011 | Guarda sin seleccionar banco | El sistema rechaza con "No se pudo identificar el banco a partir del CCI" |
| CA-04 | Banco no coincide con CCI | El dueño selecciona "Interbank" manualmente pero el CCI inicia con 0002 (BCP) | Guarda | El sistema muestra "El banco Interbank no coincide con el CCI" |
| CA-05 | RUC inválido | El dueño ingresa un RUC que no comienza con 10 o 20 o no tiene 11 dígitos | Intenta guardar | El sistema muestra "RUC inválido. Debe tener 11 dígitos, iniciar con 10 o 20" |

---

## HU-04 | Registrar un local

> **Como** dueño de cancha  
> **Quiero** registrar los datos de mi local (dirección, distrito, horarios)  
> **Para** que los jugadores sepan dónde queda y puedan encontrar mis canchas

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Registrar local exitoso | El dueño está en la pestaña "Locales" | Completa nombre, dirección, distrito y guarda | El sistema registra el local y lo muestra en la lista |
| CA-02 | Registrar sin datos financieros | El dueño intenta agregar un local sin haber configurado su perfil financiero | Intenta acceder a "Locales" | El sistema redirige a "Mi Perfil" para completar los datos financieros primero |

---

## HU-05 | Registrar una cancha

> **Como** dueño de cancha  
> **Quiero** registrar una nueva cancha con nombre, fotos, precios y local asociado  
> **Para** que los jugadores puedan verla y reservarla

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Cancha creada correctamente | El dueño tiene al menos un local registrado | Completa nombre, selecciona local, sube foto, define precios y guarda | El sistema crea la cancha y aparece en "Mis Canchas" |
| CA-02 | Sin locales registrados | El dueño intenta crear una cancha sin tener locales | Abre el modal de nueva cancha | El modal muestra un mensaje indicando que debe registrar un local primero |
| CA-03 | Foto opcional | El dueño registra una cancha sin subir foto | Guarda la cancha sin foto | La cancha se crea y muestra una imagen por defecto |

---

## HU-06 | Gestionar horarios y tarifas de una cancha

> **Como** dueño de cancha  
> **Quiero** configurar los horarios disponibles y las tarifas (Base, Prime, Baja)  
> **Para** definir cuándo y a qué precio pueden reservar los jugadores

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Agregar bloque horario | El dueño está en la gestión de una cancha | Selecciona día, rango horario (ej. 18:00-22:00) y tarifa Prime, luego agrega | El sistema genera bloques de 1 hora y los muestra en el cronograma semanal |
| CA-02 | Guardar cronograma completo | El dueño ha agregado varios bloques horarios | Presiona "Guardar Cronograma" | El sistema guarda todos los horarios y genera los slots disponibles para reservar |
| CA-03 | Eliminar bloque | El dueño ya tiene horarios configurados | Elimina un bloque horario existente | El sistema elimina el bloque y los slots asociados |

---

## HU-07 | Pausar y reactivar cancha

> **Como** dueño de cancha  
> **Quiero** pausar una cancha temporalmente o reactivarla  
> **Para** gestionar su disponibilidad según mantenimiento o temporada baja

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Pausar cancha | La cancha está activa y disponible | Presiona "Pausar Cancha" | La cancha cambia a estado SUSPENDIDO y ya no aparece en las búsquedas |
| CA-02 | Reactivar cancha | La cancha está suspendida | Presiona "Reactivar Cancha" | La cancha vuelve a estado DISPONIBLE y los jugadores pueden reservarla |

---

## HU-08 | Ver resumen del día (Dashboard)

> **Como** dueño de cancha  
> **Quiero** ver un resumen con indicadores clave y las reservas del día  
> **Para** tener una visión rápida del estado de mi negocio

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Dashboard con datos | El dueño tiene canchas con reservas activas | Entra al panel | Ve tarjetas con reservas hoy, ingresos, ocupación, canchas activas; la lista de reservas de hoy; y la próxima liquidación |
| CA-02 | Dashboard sin reservas hoy | El dueño no tiene reservas para el día actual | Entra al panel | Las tarjetas muestran 0, la sección de reservas muestra "No hay reservas para hoy" |
| CA-03 | Sin datos financieros | El dueño aún no ha configurado su perfil financiero | Entra al panel | El sistema redirige a "Mi Perfil" para completar la configuración |

---

## HU-09 | Ver agenda diaria y semanal

> **Como** dueño de cancha  
> **Quiero** consultar la agenda de reservas por día o semana  
> **Para** ver qué slots están ocupados, libres o en oferta

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Vista diaria | El dueño abre la Agenda | Selecciona una fecha | Ve todos los slots de todas sus canchas con estado (disponible, reservado, bloqueado, oferta) |
| CA-02 | Vista semanal | El dueño cambia a vista semanal | Presiona el botón "Semanal" | Ve una tabla con los días de la semana y las canchas, con el estado de cada slot |
| CA-03 | Bloquear slot | El dueño quiere reservar una cancha para uso propio | Presiona "Bloquear" en un slot disponible | El slot cambia a estado BLOQUEADO y ya no puede ser reservado |

---

## HU-10 | Gestionar ofertas en slots

> **Como** dueño de cancha  
> **Quiero** crear ofertas con descuento en slots disponibles  
> **Para** atraer más jugadores en horarios de baja demanda

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Crear oferta en un slot | El dueño está en la agenda | Selecciona un slot disponible, ingresa % descuento y fecha de expiración | El slot se marca como OFERTA y aparece destacado en el Home |
| CA-02 | Crear ofertas múltiples | El dueño quiere ofertar varios slots de una misma cancha | Selecciona múltiples slots, ingresa descuento y expiración | Todos los slots seleccionados se marcan como OFERTA |
| CA-03 | Quitar oferta | El dueño ya no quiere mantener una oferta | Presiona "Quitar oferta" en un slot con oferta | El slot vuelve a estado DISPONIBLE |
| CA-04 | Descuento fuera de rango | El dueño ingresa un descuento mayor a 50 % | Intenta guardar | El sistema muestra "El % debe estar entre 1 y 50" |

---

## HU-11 | Marcar no asistió (No Show)

> **Como** dueño de cancha  
> **Quiero** marcar una reserva como "No Asistió"  
> **Para** liberar el slot y registrar la inasistencia del jugador

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Marcar No Show | Una reserva está confirmada y el jugador no llegó | Presiona "No asistió" en el slot reservado | El slot cambia a NO_ASISTIO y se libera para futuras reservas |

---

## HU-12 | Ver reportes de ingresos

> **Como** dueño de cancha  
> **Quiero** consultar mis ingresos en un rango de fechas  
> **Para** evaluar el rendimiento económico de mis canchas

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Reporte con datos | El dueño selecciona un rango de fechas con reservas | Filtra y busca | Ve el total de ingresos, cantidad de reservas y ticket promedio |
| CA-02 | Reporte sin datos | El dueño selecciona un rango sin reservas | Filtra y busca | Ve "No se encontraron ingresos en este período" |
| CA-03 | Rango inválido | El dueño selecciona fecha fin menor a fecha inicio | Intenta buscar | El sistema muestra "La fecha de inicio debe ser menor a la fecha fin" |

---

## HU-13 | Ver saldo pendiente

> **Como** dueño de cancha  
> **Quiero** consultar mi saldo pendiente por cobrar  
> **Para** saber cuánto dinero tengo acumulado antes de la liquidación

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Saldo disponible | El dueño tiene reservas confirmadas no liquidadas | Abre el reporte de saldo | Ve el monto total pendiente y el detalle por reserva |

---

## HU-14 | Ver historial de liquidaciones

> **Como** dueño de cancha  
> **Quiero** ver el historial de liquidaciones realizadas  
> **Para** llevar un control de los pagos que he recibido

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Liquidaciones previas | El dueño tiene liquidaciones pasadas | Abre el reporte de liquidaciones | Ve una lista con período, monto neto, comisiones y estado de cada liquidación |
| CA-02 | Sin liquidaciones | El dueño es nuevo y aún no tiene liquidaciones | Abre el reporte | Ve "Aún no tienes liquidaciones" |

---

## HU-15 | Ver estadísticas de ocupación

> **Como** dueño de cancha  
> **Quiero** ver el porcentaje de ocupación mensual de mis canchas  
> **Para** identificar tendencias y ajustar precios u horarios

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Ocupación detallada | El dueño selecciona un mes y año | Selecciona mes y busca | Ve una tabla con cada cancha, sus slots ocupados vs totales y el % de ocupación con barras de progreso |
| CA-02 | Mes sin datos | El dueño selecciona un mes futuro | Busca | Ve "No hay datos de ocupación para este período" |

---

## HU-16 | Buscar historial de reservas

> **Como** dueño de cancha  
> **Quiero** buscar reservas por rango de fechas y estado  
> **Para** revisar el detalle de reservas antiguas o filtrar por estado

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Búsqueda con resultados | El dueño selecciona un rango con reservas y un estado | Presiona "Buscar" | Ve una tabla con cancha, jugador, fecha, hora, monto y estado |
| CA-02 | Búsqueda sin resultados | El dueño selecciona un rango sin reservas | Busca | Ve "No se encontraron reservas" |
| CA-03 | Filtro por estado | El dueño selecciona solo reservas canceladas | Filtra y busca | Solo se muestran reservas con estado CANCELADA |

---

## HU-17 | Recibir notificaciones en tiempo real

> **Como** dueño de cancha  
> **Quiero** recibir una notificación cuando un jugador haga una reserva  
> **Para** estar al tanto de nuevas reservas sin necesidad de recargar la página

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Notificación de nueva reserva | El dueño está en el panel con el socket conectado | Un jugador realiza una reserva | El sistema muestra un toast "Nueva reserva de [jugador] en [cancha]" y actualiza el panel |
| CA-02 | Reconexión automática | El dueño pierde conexión a internet | La conexión se restaura | El socket se reconecta automáticamente sin pérdida de funcionalidad |

---

## HU-18 | Ver detalle de una reserva

> **Como** dueño de cancha  
> **Quiero** ver el detalle completo de una reserva  
> **Para** conocer los datos del jugador, método de pago y comprobante

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Detalle completo | El dueño está en la agenda | Presiona "Ver más" en una reserva | Ve un modal con datos del jugador, cancha, horario, monto, estado de pago y comprobante |

---

## HU-19 | Protección de datos sensibles

> **Como** dueño de cancha  
> **Quiero** que mis datos financieros (RUC, CCI) estén ocultos por defecto  
> **Para** evitar que alguien vea mi información sensible si mi pantalla está visible

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Datos ocultos al cargar | El dueño abre "Mi Perfil" | La vista se carga | RUC y CCI se muestran como campos de contraseña (puntos) |
| CA-02 | Revelar datos sensibles | El dueño quiere ver sus datos | Presiona "Mostrar datos sensibles" | RUC y CCI se vuelven visibles como texto normal |
| CA-03 | Ocultar nuevamente | El dueño ya terminó de ver sus datos | Presiona "Ocultar datos sensibles" | RUC y CCI vuelven a mostrarse como puntos |

---

## HU-20 | Próxima liquidación visible desde el dashboard

> **Como** dueño de cancha  
> **Quiero** ver el monto y período de mi próxima liquidación en el resumen  
> **Para** saber cuándo y cuánto me pagarán sin tener que ir a reportes

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Liquidación próxima visible | El dueño tiene una liquidación pendiente | Abre el Dashboard | Ve una tarjeta con período, monto neto y estado de la próxima liquidación |
| CA-02 | Sin liquidación próxima | El dueño no tiene ingresos suficientes para una liquidación | Abre el Dashboard | La tarjeta de liquidación no se muestra |

---

## HU-21 | Prerregistro de cancha durante onboarding

> **Como** nuevo dueño  
> **Quiero** registrar mi primera cancha justo después de completar mi perfil  
> **Para** activar mi cuenta rápidamente y empezar a recibir reservas

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Onboarding completo | El dueño recién se registró, completó su perfil | El sistema lo guía a agregar un local | Ve la pestaña "Locales" activa con un mensaje para registrar su primer local |
| CA-02 | Saltear onboarding | El dueño no quiere registrar un local inmediatamente | Cierra o navega a otra pestaña | El sistema recuerda que le falta al menos un local y lo redirige automáticamente |

---

## HU-22 | Login y gestión de sesión

> **Como** dueño de cancha  
> **Quiero** iniciar sesión con mi email y contraseña  
> **Para** acceder al panel de administración

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Login exitoso | El dueño tiene una cuenta activa | Ingresa email y contraseña correctos | El sistema inicia sesión y redirige al Panel del Dueño |
| CA-02 | Credenciales incorrectas | El dueño ingresa mal la contraseña | Envía el formulario | El sistema muestra "Credenciales inválidas" |
| CA-03 | Token expirado | El dueño tiene una sesión iniciada y el token expira | El sistema intenta renovar automáticamente | El sistema renueva el token sin interrumpir la experiencia del usuario |
| CA-04 | Sesión expirada sin refresh | El dueño no ha usado la plataforma por mucho tiempo y el refresh expiró | Intenta realizar una acción | El sistema cierra la sesión y redirige al login |

---

## HU-23 | Cerrar sesión

> **Como** dueño de cancha  
> **Quiero** cerrar mi sesión  
> **Para** proteger mi cuenta cuando termino de usar la plataforma

| Código | Escenario | Contexto | Acción | Resultado esperado |
|--------|-----------|----------|--------|--------------------|
| CA-01 | Logout exitoso | El dueño está en el panel | Presiona "Cerrar sesión" | El sistema elimina tokens, cierra sesión y redirige al Home |
