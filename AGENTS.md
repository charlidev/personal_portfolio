# AGENTS.md

# Project Guidelines — Personal Portfolio

## 1. Project Overview

Este repositorio contiene el desarrollo de mi portafolio profesional orientado a Ingeniería de Datos.

El objetivo es construir un sitio web profesional que presente:

- Mi perfil profesional.
- Experiencia laboral.
- Habilidades técnicas.
- Proyectos de Ingeniería de Datos.
- Formación académica.
- Certificaciones.
- Cursos.
- Información de contacto.

El sitio comenzó como una landing page y evolucionará progresivamente hacia un portafolio multipágina, donde los proyectos tendrán páginas individuales con sus respectivos casos de estudio.

El responsable del proyecto y de las decisiones de producto es Carlos Martinez.

El asistente de IA actúa como herramienta de apoyo para análisis, planificación, desarrollo, pruebas y revisión.

## 2. Communication and Collaboration

- Comunícate conmigo en español.
- Utiliza inglés para nombres de variables, funciones, componentes y archivos.
- Explica brevemente las decisiones técnicas importantes.
- No implementes funcionalidades que no hayan sido solicitadas o aprobadas.
- Para tareas complejas, presenta primero un plan de implementación.
- Respeta las decisiones de diseño ya aprobadas.
- No inventes información personal, laboral, académica o profesional.
- No avances a una siguiente funcionalidad cuando la tarea actual requiera revisión del usuario.
- Informa claramente qué archivos modificaste y qué validaciones ejecutaste.

El objetivo es desarrollar un proyecto profesional y, al mismo tiempo, aprender buenas prácticas de ingeniería de software y trabajo con agentes de IA.

## 3. Technology Stack

Tecnologías principales:

- Astro.
- TypeScript.
- HTML semántico.
- CSS estándar.
- Git.
- GitHub.

El proyecto es inicialmente estático.

No agregues React, Tailwind, bases de datos, backend ni dependencias adicionales sin justificar previamente la necesidad y obtener aprobación.

Prioriza soluciones sencillas, mantenibles y con pocas dependencias.

Antes de incorporar una librería, verifica si la funcionalidad puede resolverse mediante las herramientas existentes.

## 4. Project Architecture

La arquitectura sigue una separación entre:

- Pages.
- Components.
- Layouts.
- Styles.
- Data.
- Public assets.

El archivo `src/data/portfolio.ts` es la fuente central de información estructurada del portafolio cuando así esté implementado.

Antes de modificar archivos:

1. Inspecciona la estructura real del repositorio.
2. Identifica los componentes responsables.
3. Reutiliza componentes existentes cuando sea conveniente.
4. Mantén separados los datos y su presentación.
5. Evita componentes excesivamente grandes.
6. No dupliques información ni estilos innecesariamente.

No supongas que la estructura permanece idéntica: verifica los archivos existentes antes de trabajar.

## 5. Visual Identity and Design System

La identidad visual aprobada utiliza esta paleta:

- Background: #092327
- Surface: #0B5351
- Primary Accent: #00A9A5
- Secondary Accent: #4E8098
- Highlight: #90C2E7

Tipografías:

- Geist Sans para contenido general.
- Geist Mono para etiquetas técnicas, metadatos y elementos monoespaciados.

Directrices visuales:

- Diseño moderno, limpio y profesional.
- Fondos oscuros.
- Jerarquía tipográfica clara.
- Espaciado equilibrado.
- Bordes discretos.
- Animaciones moderadas y funcionales.
- Excelente legibilidad.
- Evitar efectos decorativos innecesarios.

Los valores geométricos importantes deben mantenerse centralizados mediante variables CSS.

No disperses valores de ancho, márgenes y espaciado por múltiples componentes sin necesidad.

## 6. Approved Layout and Components

La landing page utiliza un topbar horizontal con navegación alineada a la derecha.

No introducir sidebar ni estructura de dashboard.

El topbar debe permanecer visible durante el desplazamiento mediante su implementación sticky actual.

El contenido principal utiliza un contenedor centrado con ancho máximo y márgenes configurables.

Las secciones actuales son:

1. Inicio.
2. Experiencia.
3. Habilidades.
4. Proyectos.
5. Formación y certificaciones.
6. Contacto.

### Experience

Las experiencias profesionales utilizan una línea de tiempo vertical.

Reglas importantes:

- Utilizar elementos HTML reales para nodos y línea.
- No regresar a una implementación basada en pseudoelementos CSS para esta funcionalidad.
- La línea debe permanecer visible.
- No introducir animaciones de aparición o desaparición.
- Los datos de cada experiencia deben provenir de la estructura de datos existente.
- No utilizar tarjetas grandes para separar experiencias.

### Skills

Las habilidades utilizan categorías abiertas.

Cada categoría tiene un título en negrita y las tecnologías se presentan como pequeñas etiquetas individuales.

No agregar contenedores grandes alrededor de las categorías.

No utilizar barras de dominio ni porcentajes de experiencia.

### Education and Certifications

El orden aprobado es:

1. Formación académica.
2. Certificaciones.
3. Cursos.

La formación universitaria debe tener mayor jerarquía que el bachillerato.

### Contact

Los medios de contacto utilizan iconos reconocibles y enlaces funcionales.

Los enlaces externos deben abrirse de manera segura.

### Footer

El texto aprobado es:

"Hecho con cariño by Carlos Martinez"

No añadir corazones ni emojis.

## 7. Professional Content Integrity

El portafolio debe representar fielmente mi trayectoria y conocimientos.

Reglas obligatorias:

- No inventar logros.
- No inventar porcentajes.
- No inventar métricas.
- No inventar responsabilidades.
- No inventar años de experiencia.
- No inventar certificaciones.
- No atribuirme dominio de tecnologías sin evidencia.
- No cambiar las fechas laborales proporcionadas.

Se pueden mejorar las descripciones y utilizar terminología profesional, siempre conservando el significado original.

Las tecnologías deben reflejar conocimientos y experiencias reales.

Cuando falte información, utiliza placeholders claramente identificados o pregunta antes de completarla.

## 8. Responsive and Accessibility

Todos los cambios visuales deben considerar:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Implementa HTML semántico, etiquetas accesibles, navegación por teclado y estados de foco visibles.

Evita desbordamientos horizontales.

Respeta `prefers-reduced-motion`.

No consideres validada una interfaz únicamente porque el build termina correctamente.

Cuando sea posible, realiza pruebas visuales en navegador.

## 9. Git Strategy and Version Control

Utilizamos las siguientes ramas:

### main
Representa el código estable y la futura versión de producción.

No trabajar directamente sobre main.

### develop
Rama de integración de funcionalidades aprobadas.

### feature/*
Ramas de trabajo para implementar funcionalidades específicas.

Deben crearse desde develop.

Las funcionalidades se integran mediante Pull Requests hacia develop.

### release/*
Ramas temporales para preparar versiones candidatas que posteriormente se validarán en TEST.

La promoción a main se realizará mediante Pull Request después de la aprobación correspondiente.

### Git Safety Rules

Antes de realizar operaciones Git:

- Ejecuta `git status`.
- Comprueba la rama actual.
- Inspecciona los cambios pendientes.
- Comprueba el estado remoto cuando sea necesario.

No descartes cambios del usuario.

No utilices automáticamente:

- `git reset --hard`.
- `git push --force`.
- Reescritura de historial.
- Eliminación de ramas.
- Restauración destructiva de archivos.

Nunca cambies de rama si existe riesgo de sobrescribir cambios.

No realices commit, push, Pull Request ni merge automáticamente.

Estas operaciones requieren instrucciones explícitas del usuario.

Cuando se soliciten commits, utiliza Conventional Commits.

## 10. AI Attribution Policy

No agregar a Codex como coautor de los commits.

No agregar trailers:

`Co-authored-by`

No modificar:

- `git config user.name`
- `git config user.email`
- La identidad de autor configurada en Git.

No atribuir automáticamente los commits a bots o agentes de IA.

Los agentes son herramientas de asistencia y no contribuyentes que deban aparecer en el historial del repositorio.

## 11. AI Agents and Delegation Strategy

El desarrollo debe utilizar un modelo de agente principal por defecto.

No es necesario utilizar múltiples agentes para tareas sencillas.

El agente principal es responsable de:

- Comprender los requisitos.
- Analizar el código.
- Planificar.
- Implementar.
- Ejecutar validaciones.
- Revisar los resultados de las delegaciones.
- Entregar un informe final.

Los subagentes pueden utilizarse para tareas especializadas como:

- Exploración de arquitectura.
- Revisión independiente de código.
- Auditoría de accesibilidad.
- Evaluación responsive.
- Pruebas y QA.
- Investigación técnica.

### Cuándo considerar múltiples agentes

La delegación es conveniente cuando:

1. La tarea tiene suficiente complejidad.
2. Existen actividades independientes que pueden ejecutarse en paralelo.
3. Las responsabilidades pueden delimitarse claramente.
4. Los agentes no necesitan modificar simultáneamente los mismos archivos.
5. El beneficio esperado supera el costo adicional de coordinación.

No utilizar subagentes solamente para aumentar la cantidad de agentes.

Por defecto utiliza un solo agente.

Cuando una tarea pueda beneficiarse de múltiples agentes, presenta una propuesta de delegación explicando:

- Número de agentes.
- Responsabilidad de cada uno.
- Alcance de cada tarea.
- Archivos o áreas que revisará.
- Cómo se integrarán los resultados.

Espera autorización del usuario antes de iniciar una delegación no solicitada.

Nunca permitas que varios agentes modifiquen simultáneamente los mismos archivos sin una estrategia explícita de coordinación.

## 12. Quality Assurance and Validation

Después de implementar cambios, ejecuta las validaciones pertinentes.

Revisa primero los scripts disponibles en `package.json`.

Las validaciones habituales del proyecto incluyen:

- Astro Check.
- Build de producción.
- Pruebas automatizadas disponibles.
- Revisión visual en navegador.

Informa los comandos realmente ejecutados y sus resultados.

No declares que una prueba fue exitosa si no se ejecutó.

Separa claramente:

- Validación técnica.
- Validación funcional.
- Validación visual.

## 13. Deployment and Environments

El proyecto tendrá tres ambientes:

- DEV.
- TEST.
- PROD.

Actualmente el despliegue y la automatización están pendientes de implementación.

La infraestructura futura deberá utilizar herramientas y planes gratuitos siempre que resulte viable.

Candidatos de despliegue:

- Vercel.
- Cloudflare.

No configurar infraestructura, dominios, secretos, servicios de pago ni despliegues sin aprobación.

No asumir que un nombre de rama representa automáticamente un ambiente.

Las ramas y los ambientes son conceptos diferentes.

## 14. General Working Principles

- Prioriza soluciones simples.
- Evita sobreingeniería.
- Conserva las decisiones visuales aprobadas.
- Mantén el código legible y reutilizable.
- No agregues dependencias sin justificación.
- No modifiques funcionalidades ajenas a la tarea.
- Revisa los cambios antes de integrarlos.
- Reporta riesgos y decisiones pendientes.
- Aprende del contexto existente antes de proponer una arquitectura diferente.

La meta es construir un portafolio profesional mantenible y utilizar el proceso como experiencia práctica de desarrollo de software asistido por IA.

---
