# 05 Fine tune drop

We already have a very basic kanban board, let's start refining it (this can take up to 80% of the development time of a project :)).

Right now, when we drop the card, we're not sure where it will be dropped - on top of the card? Below it?

As a first step, let's show a _ghost card_ indicating the position where it will be placed. Later on, we could consider having a top area (for dropping the card above) and a bottom area (for dropping the card below).

## Step by step

Starting from the previous example, let's copy it, install dependencies, and run the project.

```bash
npm install
```

```bash
npm run dev
```

To display the _ghost card_, let's go to the card component and if we're in edit mode, we'll show an empty space. First, let's display a simple text:

_./src/kanban/components/card/card.component.tsx_

```diff
  return (
+   <>
+   {(isDraggedOver) ?
+    <div style={{}}>
+     Card will be dropped here !
+    </div>
+   : null
+   }
    <div
      ref={ref}
      className={classes.card}
      style={{
        opacity: dragging ? 0.4 : 1,
        background: isDraggedOver ? "lightblue" : "white",
      }}
    >
      {content.title}
    </div>
+   </>
  );
```

Now we can create a more realistic ghost card. For this, let's create a new component _ghost-card_ responsible for displaying the _ghost card_.

_./src/kanban/components/ghost-card/ghost-card.component.module.css_

```css
.card {
  display: flex;
  border: 1px dashed gray; /* TODO: review sizes, colors...*/
  padding: 5px 15px;
  background-color: gray;
  width: 210px;
}
```

_./src/kanban/components/ghost-card/ghost-card.component.tsx_

```tsx
import React from "react";
import classes from "./ghost-card.component.module.css";

interface Props {
  show: boolean;
}

export const GhostCard: React.FC<Props> = ({ show }) => {
  return show ? <div className={classes.card}></div> : null;
};
```

And let's replace it in our card component.

_./src/kanban/components/card/card.component.tsx_

```diff
+ import { GhostCard } from "../ghost-card/ghost-card.component";
// (...)

  return (
    <>
-      {isDraggedOver ? <div style={{}}>Card will be dropped here !</div> : null}
+      <GhostCard show={isDraggedOver} />
      <div
        ref={ref}
        className={classes.card}
        style={{
          opacity: dragging ? 0.4 : 1,
          background: isDraggedOver ? "lightblue" : "white",
        }}
      >
        {content.title}
      </div>
    </>
  );
```

Now we have the bottom part left, the _empty-space-drop-zone_.

_./src/kanban/components/empty-space-drop-zone/empty-space-drop-zone.component.tsx_

```diff
- import { useEffect, useRef } from "react";
+ import { useEffect, useRef, useState } from "react";
+ import { GhostCard } from "./ghost-card/ghost-card.component";

export const EmptySpaceDropZone: React.FC<Props> = (props) => {
  const { columnId } = props;
  const ref = useRef(null);
+  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ columnId, cardId: -1 }),
+      onDragEnter: () => setIsDraggedOver(true),
+      onDragLeave: () => setIsDraggedOver(false),
+      onDrop: () => setIsDraggedOver(false),
    });
  }, []);

  return (
+   <div
+     ref={ref}
+     style={{ flexGrow: 1, width: "100%", background: "transparent" }}
+   >
+     <GhostCard show={isDraggedOver} />
-    <div
-        ref={ref}
-        style={{ flexGrow: 1, width: "100%", background: "transparent" }}
-     />
+   </div>
  );
};
```
