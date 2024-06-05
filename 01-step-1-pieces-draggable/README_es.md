# Paso 1: Haciendo las piezas arrastrables

El primer paso para hacer que nuestro tablero de ajedrez sea funcional es permitir que las piezas se puedan arrastrar.

Vamos a instalar el paquete `pragmatic-drag-and-drop`:

```bash
npm install @atlaskit/pragmatic-drag-and-drop
```

También hay que instalar `tiny-invariant`:

```bash
npm install tiny-invariant
```

Ejecutemos el proyecto

```bash
npm run dev
```

Pragmatic drag and drop proporciona una función de arrastre que se adjunta a un elemento para habilitar el comportamiento de arrastre. Al usar React, esto se hace en un useEffect:

![Gif sobre cómo debe funcionar](./public/01-step-1-example.gif)

_./src/board/components/pieces.component.tsx_

```diff
+ import { useEffect, useRef } from "react";
+ import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
+ import invariant from "tiny-invariant";
import { PieceProps } from "../board.model";
import king from "../../assets/king.png";
import pawn from "../../assets/pawn.png";
import styles from "./pieces.module.css";

export type PieceProps = {
  image: string;
  alt: string;
};

function Piece({ image, alt }: PieceProps) {
+ const ref = useRef(null);

+ useEffect(() => {
+   const el = ref.current;
+   // Agrega esto para evitar que TypeScript en modo estricto se queje sobre null
+   // en la llamada a draggable({ element: el });
+   invariant(el);
+
+   return draggable({
+     element: el,
+   });
+ }, []);

  return (
    <img className={styles.piece} src={image} alt={alt} draggable="false"
+    ref={ref}
    />
  ); // se deja draggable establecido en false para evitar el arrastre de las imágenes
}
```

```tsx
function Piece({ image, alt }: PieceProps) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
    });
  }, []);

  return <img className={styles.piece} src={image} alt={alt} ref={ref} />;
}
```

Aunque ahora se puede arrastrar la pieza, no parece que la pieza esté siendo 'levantada', ya que la pieza se queda en su lugar mientras se arrastra.

Para hacer que la pieza se desvanezca mientras se arrastra, podemos usar los argumentos onDragStart y onDrop dentro de draggable para establecer el estado. Luego podemos usar este estado para alternar el CSS dentro de la propiedad style para reducir la opacidad.

_./src/board/components/pieces.component.tsx_

```diff
- import { useEffect, useRef } from "react";
+ import { useEffect, useRef, useState } from "react";

function Piece({ image, alt }: PieceProps) {
+ const [dragging, setDragging] = useState<boolean>(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
+      onDragStart: () => setDragging(true),
+      onDrop: () => setDragging(false),
    });
  }, []);

-  return <img className={styles.piece} src={image} alt={alt} ref={ref} />;
+ return <img className={styles.piece} src={image} alt={alt} ref={ref} style={{ opacity: dragging ? 0.4 : 1 }} />;
}
```
