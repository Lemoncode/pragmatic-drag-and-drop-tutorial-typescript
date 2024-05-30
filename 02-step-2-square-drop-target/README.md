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


