# 🧩 Ejemplos de Pragmatic Drag & Drop

¡Bienvenido al repositorio de Ejemplos de Pragmatic Drag & Drop!

El objetivo de este proyecto, es el de mejorar la guía de ejemplos de [Pragmatic Drag & Drop](https://github.com/atlassian/pragmatic-drag-and-drop) y que te permita aprender a manejarte con este librería de una forma más sencilla y rápida.

- 🇬🇧: [Guia en ingles](https://github.com/Lemoncode/pragmatic-drag-and-drop-tutorial-typescript/blob/main/README.md)

## 📝 Descripción general

Pragmatic Drag & Drop de Atlassian es una librería potente para incorporar funcionalidad de arrastrar y soltar en tu aplicacione web. En su [sección de tutoriales](https://atlassian.design/components/pragmatic-drag-and-drop/tutorial), Atlassian proporciona ejemplos interesantes utilizando un tablero de ajedrez para explicar los conceptos básicos de arrastrar y soltar.

Sin embargo, estos ejemplos tienen algunas desventajas:

- 📄 El código es un poco difícil de seguir porque todo está en un solo archivo.
- 💄 Los ejemplos usan la librería Emotion para CSS, lo que puede ser una distracción debido a que se mete ruido con dependencias adicionales.
- 🛠️ Si descargas el código desde CodeSandbox para ejecutarlo localmente, puedes encontrar problemas durante la instalación y ejecución debido a conflictos de versiones.

## 🔧 ¿Qué hemos hecho?

Para eliminar estos problemas, hemos:

- 🧹 Simplificado el ejemplo eliminando dependencias innecesarias, como Emotion, y usando CSS simple en su lugar.
- 📂 Organizado el proyecto en carpetas y archivos para hacer el código más modular y fácil de entender.
- 📚 Creado guías paso a paso en formato markdown para cada ejemplo, permitiéndote reproducir los ejemplos fácilmente.
- 🆕 Añadido nuevos ejemplos como un tablero de Kanban simple para que puedas ver cómo aplicar la librería sin distraerte en detalles de implementación.
- 🇪🇸 Traducido las guías al español para que puedas seguir los ejemplos en tu idioma nativo.

Esperamos que estas mejoras te hagan más fácil seguir el tutorial y pues aprender mejor cómo funciona esta fantástica librería.

## Ejemplos implementados

### Chessboard

![Tablero de ajedrez con un rey y un peón, puedes arrastrar y soltar ambas piezas; si el destino del movimiento es válido, se coloreará en verde; si no, en rojo.](./00-chessboard/03-step-3-moving-the-pieces/public/03-step-3-example.gif)

This [example is taken from its original tutorial](https://atlassian.design/components/pragmatic-drag-and-drop/tutorial). What are the differences from the original?

    - The Emotion dependency has been removed and simple CSS has been used.

    - The code has been organized into folders and files to make it more modular and easier to understand.

    - A step-by-step guide in markdown format has been created so you can easily reproduce the example.

    - The guide is also translated into Spanish so you can follow the example in your native language.

### Simple Kanban Board

Este ejemplo muestra como implementar un tablero Kanban Simple, el objetivo de esta base de código es que te centres en lo que ofrece la librería sin distraerte en detalles (si buscas una solución más refinada, puedes consultar la [Demo que ofrece Pragmatic Drag And Drop](https://atlassian.design/components/pragmatic-drag-and-drop/examples)).

Qué se ha implementado:

    - Un punto de partida (se muestran columnas y tarjetas).

    - Cómo hacer drag de las cartas.

    - Cómo hacer drop en las columnas (y por qué no es buena del todo la solución).

    - Cómo hacer drop en las cards.

    - Cómo mostrar una card _fantasma_ mientras se hace drag, para indicar donde se va a soltar la card.

> Este kanban es `Work in Progress` ahora mismo hay cinco pasos implementados, en el futuro iremos añadiendo más mejoras.

## 🔮 Mejoras a futuro.

- Añadir más ejemplos ampliando el tutorial actual.

## 🛠️ Como arrancarte

Para comenzar con los ejemplos, clona este repositorio y sigue las instrucciones proporcionadas en las respectivas guías markdown.

Clona el repositorio

```sh
git clone https://github.com/Lemoncode/pragmatic-drag-and-drop-tutorial-typescript.git
```

Ahora, por ejemplo, abre el ejemplo `00-starter-code`

```sh
cd 00-starter-code
```

Instala las dependencias

```sh
npm install
```

Ejecuta el proyecto

```sh
npm run dev
```

Ahora puedes abrir tu navegador y dirigirte a `http://localhost:5173` para ver el proyecto.

Y comienza a construir el siguiente paso siguiendo la guía ubicada en:

https://github.com/Lemoncode/pragmatic-drag-and-drop-tutorial-typescript/blob/main/01-step-1-pieces-draggable/README_es.md

Sigue las guías paso a paso en el directorio de guías para cada ejemplo.

## 🤝 Como contribuir al proyecto

¡Las contribuciones son bienvenidas! Si tienes alguna mejora o nuevos ejemplos para agregar, no dudes en abrir una pull request.

## 📜 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

---

Esperamos que estos ejemplos y guías te sean útiles y puedes poner al día con esta librería tan buena.

¡ A por ello ! :)
