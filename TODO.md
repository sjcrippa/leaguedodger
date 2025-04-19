# League Dodger - Todo List

## Fase 1: Configuración y Prototipo Básico
- [x] Configurar proyecto base
  - [x] Inicializar proyecto con Vite + React
  - [x] Configurar TypeScript
  - [x] Instalar dependencias principales (Three.js, React Three Fiber, Cannon.js)
  - [x] Configurar ESLint y Prettier
  - [x] Configurar estructura de carpetas
  - [x] Configurar Tailwind CSS
  - [x] Configurar CSS Modules
  - [x] Establecer estructura de estilos (UI vs Game)

- [x] Configuración de Herramientas
  - [x] Configurar ESLint
  - [x] Configurar Prettier
  - [x] Configurar Tailwind
  - [x] Configurar PostCSS
  - [x] Configurar alias de importación
  - [x] Configurar rutas absolutas

- [x] Estructura de Carpetas
  - [x] Crear estructura base
  ```
  src/
  ├── assets/           # Recursos estáticos
  │   ├── models/       # Modelos 3D
  │   ├── textures/     # Texturas
  │   └── sounds/       # Sonidos
  ├── components/       # Componentes React
  │   ├── game/        # Componentes del juego
  │   └── ui/          # Componentes de UI
  ├── game/            # Lógica del juego
  │   ├── core/        # Sistema central
  │   ├── physics/     # Sistema de física
  │   ├── entities/    # Entidades del juego
  │   └── systems/     # Sistemas del juego
  ├── scenes/          # Escenas del juego
  ├── shaders/         # Shaders personalizados
  ├── styles/          # Estilos
  │   ├── game/        # Estilos del juego
  │   └── ui/          # Estilos de UI
  └── utils/           # Utilidades
  ```

- [x] Configuración de Rutas y Vistas
  - [x] Configurar React Router
  - [x] Implementar rutas base
    - [x] "/" -> Home/Menú Principal
      - [x] Diseñar layout principal
      - [x] Implementar menú de navegación
      - [x] Crear botón de inicio
      - [ ] Añadir sección de configuración
      - [ ] Implementar sección "About"
      - [ ] Añadir sección de tutorial
    - [x] "/game" -> Juego
      - [x] Implementar layout del juego
      - [x] Configurar transición de carga
      - [x] Añadir sistema de pausa
      - [x] Implementar overlay de UI
  - [ ] Rutas adicionales
    - [ ] "/settings" -> Configuración avanzada
    - [ ] "/leaderboard" -> Tabla de puntuaciones
    - [ ] "/tutorial" -> Tutorial detallado
  - [ ] Sistema de navegación
    - [ ] Implementar transiciones entre rutas
    - [ ] Añadir animaciones de transición
    - [ ] Configurar manejo de rutas protegidas
    - [ ] Implementar sistema de redirección

- [x] UI Básica
  - [x] Diseñar y implementar HUD básico con Tailwind
  - [x] Crear menú principal con Tailwind
  - [x] Implementar sistema de puntuación visual
  - [x] Diseñar indicadores de vida/energía
  - [x] Crear sistema de notificaciones

- [x] Escena básica
  - [x] Crear escena Three.js
  - [x] Configurar cámara aérea (perspectiva elevada)
  - [x] Crear cuadrilátero 3D (arena de juego)
  - [x] Configurar iluminación básica
  - [x] Implementar sistema de física básico (Cannon.js)

- [x] Sistema de jugador
  - [x] Crear modelo básico del jugador
  - [x] Implementar movimiento con click derecho
  - [x] Configurar límites de movimiento
  - [x] Implementar sistema de cámara que siga al jugador
  - [x] Configurar cuerpo físico del jugador

## Fase 2: Mecánicas Core
- [x] Sistema de física avanzado
  - [x] Implementar gravedad personalizada
  - [x] Sistema de fuerzas y saltos
  - [x] Sistema de rebotes
  - [x] Fricción y resistencia del aire
  - [x] Optimización de colisiones

- [x] Sistema de colisiones
  - [x] Implementar colisiones con bordes
  - [x] Sistema de detección de colisiones con proyectiles
  - [x] Sistema de respuesta a colisiones
  - [x] Implementar raycasting para detección de suelo

- [x] Sistema de proyectiles
  - [x] Implementar spawn de proyectiles
  - [x] Crear diferentes patrones de movimiento
  - [x] Sistema de destrucción de proyectiles
  - [x] Implementar diferentes tipos de proyectiles
  - [x] Configurar física de proyectiles

- [x] Sistema de habilidades (Q-W-E-R)
  - [x] Diseñar mecánicas de cada habilidad
  - [x] Implementar sistema de cooldown
  - [x] Crear efectos visuales básicos
  - [x] Sistema de activación/desactivación
  - [ ] Integrar habilidades con sistema de física

## Fase 3: Assets y Visuales
- [x] Modelado 3D
  - [x] Crear modelo del jugador
  - [x] Diseñar diferentes tipos de proyectiles
  - [x] Crear efectos visuales
  - [x] Optimizar modelos para web
  - [x] Crear efectos de partículas para saltos

- [x] Texturas y Materiales
  - [x] Crear/implementar texturas básicas
  - [x] Implementar sistema de materiales
  - [x] Crear efectos de partículas
  - [x] Implementar shaders básicos
  - [x] Crear efectos visuales para física

## Fase 4: Gameplay y Balance
- [x] Sistema de puntuación
  - [x] Implementar contador de puntos
  - [x] Sistema de multiplicadores
  - [x] Implementar high scores
  - [x] Crear UI para puntuación

- [x] Sistema de dificultad
  - [x] Implementar niveles de dificultad
  - [x] Sistema de progresión
  - [x] Balancear spawn de proyectiles
  - [x] Ajustar velocidades y patrones
  - [x] Balancear física de saltos

- [x] Sistema de vidas/energía
  - [x] Implementar barra de vida/energía
  - [x] Sistema de daño
  - [x] Efectos visuales de daño
  - [x] Sistema de game over

## Fase 5: Pulido y Optimización
- [x] Efectos visuales avanzados
  - [x] Implementar efectos de partículas
  - [x] Crear efectos de impacto
  - [x] Implementar efectos de habilidad
  - [x] Añadir efectos post-procesamiento
  - [ ] Efectos visuales para saltos y rebotes

- [ ] UI/UX Avanzada
  - [ ] Implementar animaciones de UI con CSS Modules
  - [ ] Crear transiciones entre pantallas
  - [ ] Diseñar efectos visuales para estados del juego
  - [ ] Implementar sistema de tooltips
  - [ ] Crear efectos de hover y focus
  - [ ] Optimizar UI para diferentes resoluciones

- [ ] Audio
  - [ ] Implementar sistema de audio
  - [ ] Crear/importar efectos de sonido
  - [ ] Implementar música de fondo
  - [ ] Sistema de ajuste de volumen
  - [ ] Efectos de sonido para física

- [ ] Optimización
  - [ ] Optimizar modelos 3D
  - [ ] Implementar LOD (Level of Detail)
  - [ ] Optimizar texturas
  - [ ] Implementar frustum culling
  - [ ] Optimizar sistema de física
  - [ ] Implementar pooling para objetos físicos
  - [ ] Optimizar bundle de Tailwind
  - [ ] Implementar lazy loading para componentes UI

- [x] UI/UX Final
  - [x] Crear menú principal
  - [x] Implementar pantalla de pausa
  - [x] Crear pantalla de game over
  - [x] Implementar ajustes de configuración
  - [x] Añadir indicadores visuales de física
  - [ ] Implementar sistema de tutorial
  - [ ] Crear pantalla de créditos

## Fase 6: Testing y Deployment
- [ ] Testing
  - [ ] Implementar pruebas unitarias
  - [ ] Realizar pruebas de rendimiento
  - [ ] Testing de compatibilidad cross-browser
  - [ ] Testing en diferentes dispositivos
  - [ ] Testing específico de física
  - [ ] Testing de UI en diferentes resoluciones
  - [ ] Testing de accesibilidad

- [ ] Deployment
  - [ ] Configurar build de producción
  - [ ] Optimizar assets para producción
  - [ ] Implementar sistema de actualizaciones
  - [ ] Configurar analytics y monitoreo
  - [ ] Optimizar carga inicial de UI

## Nuevas Tareas
- [ ] Implementar pantalla de tutorial
  - [ ] Diseñar layout de tutorial
  - [ ] Crear secciones explicativas para cada habilidad
  - [ ] Implementar demostraciones interactivas
  - [ ] Añadir controles básicos del juego
  - [ ] Incluir sección de ataques básicos
  - [ ] Explicar comportamiento especial con tecla "S"