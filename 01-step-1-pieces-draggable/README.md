# Step 1: Making the pieces draggable

The first step to make our chess board functional is to allow the pieces to be dragged around.

Let's install the `pragmatic-drag-and-drop` package:

```bash
npm install pragmatic-drag-and-drop
```

And let's install `tiny-invariant`:

```bash
npm install tiny-invariant
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

  return <img css={imageStyles} src={image} alt={alt} ref={ref} />;
}
```

Now you can drag the pieces around the board (but not drop... next step :P)).
