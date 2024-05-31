# Step 2: Making the squares drop targets

Now that we have draggable pieces we want the squares on the board to act as areas that can be 'dropped' onto. For this we will use the dropTargetForElements function from Pragmatic drag and drop.

Drop targets are elements that a draggable element can be dropped on.

Creating a drop target follows the same technique as for draggable. Let's abstract out the board's squares, which were previously divs, into their own component.

_./src/board/components/square.component.css_

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

To take this a step further we can color the square green when a piece is eligible to be dropped onto and red when it is not.

To achieve this we first use the getInitialData argument on draggable to surface the piece type and starting location of the dragging piece.

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

- export function King() {
+ export function King({ location }: PawnProps) {
-  return <Piece image={king} alt="King" />;
+  return <Piece image={king} alt="King" pieceType="king" location={location}/>;
}

+ interface PawnProps {
+  location: Coord;
+ }

- export function Pawn() {
+ export function Pawn({ location }: PawnProps) {
-  return <Piece image={pawn} alt="Pawn" />;
+  return <Piece image={pawn} alt="Pawn" pieceType="pawn" location={location}/>;
}
```

And let's update the square board to pass the location to the pieces:

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

We then need to consume this data at the drop targets.

You can see below that the drop target can now access to the draggable element's location and piece type that was surfaced from the draggable. We've also introduced a new canMove function which determines whether a piece can move to a square based on the start and end location, the piece type and whether there is already a piece on that square.

What is important to note is that when using Typescript the type of the data is not carried over from the draggable to the drop target's source. Therefore we need to call the type guarding functions isCoord and isPieceType before canMove can be called.

Let's add a helper function to check if a piece can move to a square.

_./src/board/board.utils.ts_

```diff
import { ReactElement } from "react";
- import { Coord, PieceRecord } from "./board.model";
+ import { Coord, PieceRecord, PieceType } from "./board.model";
import { King, Pawn } from "./components";
```

** Append to the file **

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

Let's go to the square an use this function to calculate if we are dropping the piece in a valid square.

_./src/board/components/square.component.tsx_

```diff
import { ReactNode, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
- import { Coord } from "../board.model";
+ import { Coord, PieceRecord, PieceType } from "../board.model";
import styles from "./square.module.css";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
+ import { canMove } from "../board.utils";
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

    return dropTargetForElements({
      element: el,
-      onDragEnter: () => setIsDraggedOver(true),
+      onDragEnter: ({ source }) => {
+          // source is the piece being dragged over the drop target
+          if (
+            // type guards
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

Let's update the getColor function to change the color of the square based on its state.

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

And in the component:

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

Let's update the board to pass the pieces to the squares.

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

We can also make use of the data we attached to the draggable to prevent interractions with the square it is being dragged from. This makes use of the canDrop argument on dropTargetForElements.

_./src/board/components/square.component.tsx_

```diff
- import { canMove, isCoord, isEqualCoord } from "../board.utils";
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
        // source is the piece being dragged over the drop target
        if (
          // type guards
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
