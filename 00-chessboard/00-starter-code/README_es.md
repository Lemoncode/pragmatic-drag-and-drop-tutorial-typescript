# Código Inicial para Pragmatic Drag and Drop

Este proyecto se basa en el tutorial para Pragmatic Drag and Drop de Atlassian Design, que puedes encontrar [aquí](https://atlassian.design/components/pragmatic-drag-and-drop/tutorial).

En este proyecto:

- Hemos eliminado dependencias (en lugar de usar Emotion, solo usamos CSS plano).
- Hemos estructurado el proyecto de una manera que es fácil de entender y extender.
- Hemos añadido guías paso a paso para reproducir el tutorial.

## Empezando

Instala las dependencias:

```bash
npm install
```

Ejecuta el proyecto

```bash
npm run dev
```

Ahora puedes abrir tu navegador y dirigirte a `http://localhost:5173` para ver el proyecto.

Y comienza a construir el siguiente paso siguiendo la guía ubicada en:

https://github.com/Lemoncode/pragmatic-drag-and-drop-tutorial-typescript/blob/main/01-step-1-pieces-draggable/README.md

Sigue las guías paso a paso en el directorio de guías para cada ejemplo.

## Estructura del Proyecto

El proyecto está estructurado de la siguiente manera:

```
├── src
│ ├── assets
│ ├── board
│ ├── App.tsx
│ ├── index.css
│ ├── main.tsx
│ └── vite-env.d.ts
├── package.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

Carpetas principales:

- `assets`: Contiene las imágenes usadas en el proyecto.
- `board`: Contiene los componentes para el tablero (piezas, cuadrado, cuadrados, tablero de ajedrez).
- `App.tsx`: Componente principal del proyecto.
- `index.css`: Archivo CSS principal (contiene algunos estilos CSS genéricos).
- `main.tsx`: Punto de entrada del proyecto (`ReactDOM.createRoot`).
- `vite-env.d.ts`: Archivo TypeScript para Vite.
