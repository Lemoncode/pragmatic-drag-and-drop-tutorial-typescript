# Step 1: Making the pieces draggable

The first step to make our chess board functional is to allow the pieces to be dragged around.

Let's install the `pragmatic-drag-and-drop` package:

```bash
npm install @atlaskit/pragmatic-drag-and-drop
```

And let's install `tiny-invariant`:

```bash
npm install tiny-invariant
```

Let's run the project

```bash
npm run dev
```

Pragmatic drag and drop provides a draggable function that you attach to an element to enable the draggable behavior. When using React this is done in an effect:

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
+   // Add this to avoid typescript in strict mode complaining about null
+   // on draggable({ element: el }); call
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
  ); // draggable set to false to prevent dragging of the images
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

Although the piece can now be dragged around, it doesn't feel as though the piece is being 'picked up', as the piece stays in place while being dragged.

To make the piece fade while being dragged we can use the onDragStart and onDrop arguments within draggable to set state. We can then use this state to toggle css within the style prop to reduce the opacity.

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
