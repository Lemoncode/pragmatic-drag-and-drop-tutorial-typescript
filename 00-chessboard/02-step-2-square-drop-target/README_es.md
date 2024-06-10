# Paso 2: Convertir las casillas en el target de las piezas

Ahora que tenemos piezas arrastrables, queremos que las casillas del tablero actúen como áreas donde se puedan "soltar" las piezas. Para esto, usaremos la función `dropTargetForElements` de Pragmatic drag and drop.

Los objetivos de soltado son elementos sobre los que un elemento arrastrable se puede soltar.

Crear un objetivo de soltado sigue la misma técnica que para el arrastrable. Vamos a abstraer las casillas del tablero, que anteriormente eran divs, en su propio componente.

![Demostración del comportamiento de las casillas dependiendo de si se puede soltar o no](./public/02-step-2-example.gif)

_./src/board/components/square.module.css_

```css
.square {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

_./src/board/components/square.component.tsx_

```tsx
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ReactNode, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Coord } from "../board.model";
import styles from "./square.module.css";

function getColor(isDraggedOver: boolean, isDark: boolean): string {
  if (isDraggedOver) {
    return "skyblue";
  }
  return isDark ? "lightgrey" : "white";
}

interface SquareProps {
  location: Coord;
  children: ReactNode;
}

export function Square({ location, children }: SquareProps) {
  const ref = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, []);

  const isDark = (location[0] + location[1]) % 2 === 1;

  return (
    <div
      className={styles.square}
      style={{ backgroundColor: getColor(isDraggedOver, isDark) }}
      ref={ref}
    >
      {children}
    </div>
  );
}
```

_./src/board/components/squares.component.tsx_

```diff
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/dist/types/adapter/element-adapter";
import { ReactNode, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { Coord } from "../board.model";
+ import { Square } from "./square.component";
- import styles from "./Square.module.css";
```

```diff
-      const isDark = (row + col) % 2 === 1;
-      const squareClass = isDark ? styles.dark : styles.light;

      squares.push(
-        <div
-          className={`${styles.square} ${squareClass}`}
-          key={`${row}-${col}`}
-        >
+        <Square location={[row, col]} key={`${row}-${col}`}>
          {piece && pieceLookup[piece.type]()}
-        </div>
+        </Square>
      );
```

Para llevar esto un paso más allá, podemos colorear la casilla de verde cuando una pieza es elegible para ser soltada en ella y de rojo cuando no lo es.

Para lograr esto, primero usamos el argumento `getInitialData` en `draggable` para obtener el tipo de pieza y la ubicación inicial de la pieza que se está arrastrando.

_./src/board/components/piece.component.tsx_

```diff
import styles from "./pieces.module.css";
+ import { Coord } from "../board.model";

export type PieceProps = {
  image: string;
  alt: string;
+  pieceType: string;
+  location: Coord;
};

- function Piece({ image, alt }: PieceProps) {
+ function Piece({ image, alt, pieceType, location }: PieceProps) {
```

```diff
    return draggable({
      element: el,
+      getInitialData: () => ({ location, pieceType }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
```

```diff
+ interface KingProps {
+  location: Coord;
+ }

+ interface PawnProps {
+  location: Coord;
+ }

- export function King() {
+ export function King({ location }: KingProps) {
-  return <Piece image={king} alt="King" />;
+  return <Piece image={king} alt="King" pieceType="king" location={location}/>;
}

- export function Pawn() {
+ export function Pawn({ location }: PawnProps) {
-  return <Piece image={pawn} alt="Pawn" />;
+  return <Piece image={pawn} alt="Pawn" pieceType="pawn" location={location}/>;
}
```

Y actualicemos la casilla del tablero para pasar la ubicación a las piezas:

_./src/boards/board.utils.tsx_

```diff
export const pieceLookup: {
-  [Key in PieceType]: () => ReactElement;
+  [Key in PieceType]: (props: { location: Coord }) => ReactElement;
} = {
-  king: () => <King />,
+ king: ({ location }) => <King location={location} />,
-  pawn: () => <Pawn />,
+ pawn: ({ location }) => <Pawn location={location} />,
};
```

_./src/board/components/squares.component.tsx_

```diff
      squares.push(
        <Square location={[row, col]} key={`${row}-${col}`} pieces={pieces}>
-          {piece && pieceLookup[piece.type]()}
+          {piece && pieceLookup[piece.type]({ location: [row, col] })}
        </Square>
      );
```

Luego necesitamos consumir estos datos en los objetivos de soltado.

Como puedes ver, el objetivo de soltado ahora puede acceder a la ubicación y al tipo de pieza del elemento arrastrable que se obtuvieron de `draggable`. También hemos introducido una nueva función `canMove` que determina si una pieza puede moverse a una casilla basada en la ubicación de inicio y fin, el tipo de pieza y si ya hay una pieza en esa casilla.

Es importante notar que cuando se usa TypeScript, el tipo de los datos no se transfiere del elemento arrastrable al origen del objetivo de soltado. Por lo tanto, necesitamos llamar a las funciones de verificación de tipos `isCoord` e `isPieceType` antes de que se pueda llamar a `canMove`.

Vamos a agregar una función auxiliar para verificar si una pieza puede moverse a una casilla.

_./src/board/board.utils.ts_

```diff
import { ReactElement } from "react";
- import { Coord, PieceRecord } from "./board.model";
+ import { Coord, PieceRecord, PieceType } from "./board.model";
import { King, Pawn } from "./components";
```

** Añadir al archivo **

```ts
export function isCoord(token: unknown): token is Coord {
  return (
    Array.isArray(token) &&
    token.length === 2 &&
    token.every((val) => typeof val === "number")
  );
}

const pieceTypes: PieceType[] = ["king", "pawn"];

export function isPieceType(value: unknown): value is PieceType {
  return typeof value === "string" && pieceTypes.includes(value as PieceType);
}

export function canMove(
  start: Coord,
  destination: Coord,
  pieceType: PieceType,
  pieces: PieceRecord[]
) {
  const rowDist = Math.abs(start[0] - destination[0]);
  const colDist = Math.abs(start[1] - destination[1]);

  if (pieces.find((piece) => isEqualCoord(piece.location, destination))) {
    return false;
  }

  switch (pieceType) {
    case "king":
      return [0, 1].includes(rowDist) && [0, 1].includes(colDist);
    case "pawn":
      return colDist === 0 && start[0] - destination[0] === -1;
    default:
      return false;
  }
}
```

Vamos a la casilla y usamos esta función para calcular si estamos soltando la pieza en una casilla válida.

_./src/board/components/square.component.tsx_

```diff
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ReactNode, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
- import { Coord } from "../board.model";
+ import { Coord, PieceRecord, PieceType } from "../board.model";
import styles from "./square.module.css";
+ import { canMove, isCoord, isPieceType } from "../board.utils";

```

```diff
+ type HoveredState = 'idle' | 'validMove' | 'invalidMove';

interface SquareProps {
  location: Coord;
  children: ReactNode;
+ pieces: PieceRecord[];

}

- export function Square({ location, children }: SquareProps) {
+ export function Square({ location, children, pieces }: SquareProps) {
  const ref = useRef(null);
+ const [state, setState] = useState<HoveredState>('idle');
-  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return

 dropTargetForElements({
      element: el,
-      onDragEnter: () => setIsDraggedOver(true),
+      onDragEnter: ({ source }) => {
+          // source es la pieza que se arrastra sobre el objetivo de soltado
+          if (
+            // comprobaciones de tipo
+            !isCoord(source.data.location) ||
+            !isPieceType(source.data.pieceType)
+          ) {
+            return;
+          }
+
+          if (
+            canMove(source.data.location, location, source.data.pieceType, pieces)
+          ) {
+            setState('validMove');
+          } else {
+            setState('invalidMove');
+          }
+      },
-      onDragLeave: () => setIsDraggedOver(false),
+     onDragLeave: () => setState('idle'),
-      onDrop: () => setIsDraggedOver(false),
+      onDrop: () => setState('idle'),
    });
  }, []);
```

Actualicemos la función `getColor` para cambiar el color de la casilla según su estado.

```diff
- function getColor(isDraggedOver: boolean, isDark: boolean): string {
-  if (isDraggedOver) {
-    return "skyblue";
-  }
-  return isDark ? "lightgrey" : "white";
- }


+ function getColor(state: HoveredState, isDark: boolean): string {
+  if (state === 'validMove') {
+    return 'lightgreen';
+  } else if (state === 'invalidMove') {
+    return 'pink';
+  }
+  return isDark ? 'lightgrey' : 'white';
+}
```

Y en el componente:

```diff
  return (
    <div
      className={styles.square}
-      style={{ backgroundColor: getColor(isDraggedOver, isDark) }}
+      style={{ backgroundColor: getColor(state, isDark) }}
      ref={ref}
    >
      {children}
    </div>
  );
```

Actualizaremos el tablero para pasar las piezas a las casillas.

_./src/board/components/squares.component.tsx_

```diff
export function renderSquares(pieces: PieceRecord[]) {
  const squares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const squareCoord: Coord = [row, col];

      const piece = pieces.find((piece) =>
        isEqualCoord(piece.location, squareCoord)
      );

      squares.push(
-        <Square location={[row, col]} key={`${row}-${col}`}>
+       <Square location={[row, col]} key={`${row}-${col}`} pieces={pieces}>
          {piece && pieceLookup[piece.type]()}
        </Square>
      );
    }
  }
  return squares;
}
```

También podemos usar los datos que adjuntamos al elemento arrastrable para prevenir interacciones con la casilla desde la cual se está arrastrando. Esto hace uso del argumento `canDrop` en `dropTargetForElements`.

_./src/board/components/square.component.tsx_

```diff
- import { canMove, isCoord, isPieceType } from "../board.utils";
+ import { canMove, isCoord, isEqualCoord, isPieceType } from "../board.utils";

// (...)

    return dropTargetForElements({
      element: el,
+      canDrop: ({ source }) => {
+        if (!isCoord(source.data.location)) {
+          return false;
+        }
+
+        return !isEqualCoord(source.data.location, location);
+      },
      onDragEnter: ({ source }) => {
        // source es la pieza que se arrastra sobre el objetivo de soltado
        if (
          // comprobaciones de tipo
          !isCoord(source.data.location) ||
          !isPieceType(source.data.pieceType)
        ) {
          return;
        }

        if (
          canMove(source.data.location, location, source.data.pieceType, pieces)
        ) {
          setState("validMove");
        } else {
          setState("invalidMove");
        }
      },
      onDragLeave: () => setState("idle"),
      onDrop: () => setState("idle"),
    });
  }, []);
```
