# 02 Drag

We already have a basic board, let's go for the first step, being able to drag a card.

## Step by step

We will use Atlassian's `Pragmatic drag and drop`, so the first thing we'll do is install it:

```bash
npm install @atlaskit/pragmatic-drag-and-drop
```

Pragmatic drag and drop provides a drag function that attaches to an element to enable drag behavior. When using React, this is done in a `useEffect`, which we will implement:

    - The drag starts in the card component.
    - We import `draggable` from the pragmatic drag and drop library.
    - We use `useRef` to reference the parent div of the `card`.
    - We run a `useEffect` that will call `draggable` with the reference to the parent div of the `card`.

> Once we have written the code, we will fix an issue and see how `useEffect` and the cleanup function work.

_./src/kanban/components/card/card.component.tsx_

```diff
import React from "react";
+ import { useEffect, useRef } from "react";
+ import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { CardContent } from "../../model";
import classes from "./card.component.module.css";

interface Props {
  content: CardContent;
}

export const Card: React.FC<Props> = (props) => {
  const { content } = props;

+ const ref = useRef(null);

+ useEffect(() => {
+   const el = ref.current;
+   return draggable({
+     element: el,
+   });
+ }, []);

-  return <div className={classes.card}>{content.title}</div>;
+  return <div ref={ref} className={classes.card}>{content.title}</div>;
};
```

Notice that we get an error, this is because `draggable` expects an element of type `HTMLElement` and `useRef` might have a null type. We know it’s not null, but in strict mode, we always play it safe. To make this work, we will install the `tiny-invariant` library which checks if the object exists, and if not, throws an exception (so we always have a non-null value).

```bash
npm install tiny-invariant
```

```diff
+ import invariant from "tiny-invariant";

 useEffect(() => {
   const el = ref.current;

+   // Add this to prevent TypeScript in strict mode from complaining about null
+   // in the call to draggable({ element: el });
+   invariant(el);

   return draggable({
     element: el,
   });
 }, []);
```

It's worth pausing for a second to look at the code for this library:

https://github.com/alexreardon/tiny-invariant/blob/master/src/tiny-invariant.ts

Let's take a moment to study the `useEffect` code, specifically the cleanup function.

You might think, “Hey, does the cleanup function only run when the component unmounts?” Here’s a trick: we execute the `draggable` function (note the parentheses at the end) and it returns a cleanup function, so:

- On the first render, `draggable` is executed and returns the cleanup function.
- When the component unmounts, the cleanup function returned by `draggable` will be executed.

To make this clearer, we could write the code like this:

** Only do this for understanding, then return to the previous function **

```diff
  useEffect(() => {
    const el = ref.current;

    invariant(el);

+    const cleanup = draggable({
+      element: el,
+    });

-    return draggable({
-      element: el,
-    });
+   return cleanup;
  }, []);
```

Now, if we run the application, we will see that we can drag the cards.

But, when we drag the card, it looks a bit odd; there’s nothing indicating which card is being dragged. Let’s do something about that by playing with the opacity to show the card a bit faded.

_./src/kanban/components/card/card.component.tsx_

```diff
- import { useEffect, useRef } from "react";
+ import { useEffect, useRef, useState } from "react";
// (...)

export const Card: React.FC<Props> = (props) => {
  const { content } = props;
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

  return (
-    <div ref={ref} className={classes.card}>
+    <div ref={ref} className={classes.card} style={{ opacity: dragging ? 0.4 : 1 }}>
      {content.title}
    </div>
  );
};
```

Now you can see that it highlights.

Shall we go for the drop?
