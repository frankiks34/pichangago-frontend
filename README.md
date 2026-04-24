(PichangaGo)
1. Instalación de Herramientas
Para establecer un flujo de trabajo moderno, estandarizado y colaborativo, se configuraron las siguientes herramientas de nivel empresarial en el entorno local:

Node.js y NPM: Entorno de ejecución y gestor de paquetes fundamentales para la descarga de dependencias y la ejecución de scripts de construcción.

Git: Sistema de control de versiones distribuido, esencial para la trazabilidad de los cambios en el código.

Visual Studio Code (VS Code): IDE configurado con extensiones de formateo y validación de sintaxis para mantener un código limpio y legible.

2. Configuración del Entorno de Desarrollo
Para la creación y empaquetado del proyecto, se descartaron herramientas legadas y se seleccionó Vite.

Justificación Técnica: Se inicializó el proyecto con el comando npm create vite@latest, seleccionando el template de React con JavaScript. Vite proporciona un servidor de desarrollo con Hot Module Replacement (HMR) ultrarrápido y un proceso de construcción optimizado (basado en esbuild), lo que reduce drásticamente los tiempos de compilación durante el desarrollo local.

3. Configuración de Dependencias y Optimización
Según las necesidades de la arquitectura de la aplicación, se instalaron y configuraron dependencias clave:

Enrutamiento del Cliente (Client-Side Routing): Se implementó react-router-dom. Como se evidencia en el archivo App.jsx, se configuraron los componentes <BrowserRouter>, <Routes> y <Route> para permitir una navegación fluida sin recargar la página (arquitectura SPA).

Optimización de Rendimiento (WPO): Se aplicó el patrón de diseño Code Splitting (División de código) utilizando las APIs nativas de React: lazy y Suspense. Las vistas principales (como la página Home) se cargan de forma diferida solo cuando el usuario las solicita. Mientras el chunk de JavaScript se descarga, se muestra un Fallback visual interactivo ("Cargando pichanga... ⚽").

4. Definición de la Estructura del Proyecto
Para garantizar la escalabilidad y el mantenimiento a largo plazo, se implementó una arquitectura de carpetas modular dentro del directorio src/, separando claramente las responsabilidades:

assets/: Archivos estáticos como el hero.png y vectores (vite.svg).

components/: Elementos de UI aislados y reutilizables (ej. Navbar.jsx).

context/: Manejo del estado global de la aplicación.

pages/: Vistas completas que agrupan componentes y responden a las rutas del navegador (Home.jsx).

services/: Módulos encargados de la lógica de negocio y futuras peticiones HTTP/APIs.

styles/: Archivos de estilos y configuración de CSS.

5. Creación del Repositorio en GitHub y Git Flow
Se estableció un control de versiones riguroso para documentar el progreso del desarrollo:

Repositorio Remoto: Se vinculó el proyecto local al repositorio de GitHub: https://github.com/frankiks34/pichangago-frontend.git.

Commit Inicial (Root): Se realizó el primer commit en la rama main bajo el mensaje "estructura inicial del proyecto", consolidando la base de carpetas y los 14 archivos de configuración base (incluyendo vite.config.js y eslint.config.js).

Estrategia de Ramas (Git Flow): Para mantener la rama main protegida, se implementó el uso de ramas de características (feature branches). Se creó la rama feature/configuracion-inicial para aislar los cambios del enrutador y estilos globales ("feat: instalacion de react router y configuracion de css global"), haciendo un push exitoso hacia el repositorio remoto para su posterior revisión (Pull Request).

6. Documentación del Proyecto (README)
Dentro del primer commit, se incluyó la creación del archivo README.md. Este documento sirve como la carta de presentación técnica del proyecto, definiendo las instrucciones para que cualquier otro desarrollador o evaluador pueda clonar el repositorio, instalar las dependencias (npm install) y levantar el servidor local (npm run dev) sin fricciones
