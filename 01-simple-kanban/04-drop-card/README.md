# 04 Drop Card

Let's implement the drop area in the cards so we can drop cards between them..

## Step by Step

We start from the previous example, you can copy it, install dependencies, and run the project.

```bash
npm install
```

```bash
npm run dev
```

To make it easier to search in which column we want to drop the card, we will pass the column id to the card component:

_./src/kanban/components/card/card.component.tsx_

```diff
interface Props {
+ columnId: number;
  content: CardContent;
}

export const Card: React.FC<Props> = (props) => {
-  const { content } = props;
+  const { content, columnId } = props;
  const [dragging, setDragging] = useState<boolean>(false);
  const ref = useRef(null);
```

_./src/kanban/components/column/column.component.tsx_

```diff
  {content.map((card) => (
    <Card
      key={card.id}
      content={card}
+     columnId={columnId}
    />
  ))}
```

Now that we have it informed, the only thing we are going to do is remove the drop from the column and pass it to the card (informing the column).

_./src/kanban/components/column/column.component.tsx_

```diff
- import React, { useState, useEffect, useRef } from "react";
+ import React from "react";
- import invariant from "tiny-invariant";
- import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import classes from "./column.component.module.css";
import { CardContent } from "../../model";
import { Card } from "../card/card.component";
```

```diff
export const Column: React.FC<Props> = (props) => {
  const { name, content, columnId } = props;
-  const ref = useRef(null);
-  const [isDraggedOver, setIsDraggedOver] = useState(false);

-  useEffect(() => {
-    const el = ref.current;
-    invariant(el);
-
-    return dropTargetForElements({
-      element: el,
-      getData: () => ({columnId}),
-      onDragEnter: () => setIsDraggedOver(true),
-      onDragLeave: () => setIsDraggedOver(false),
-      onDrop: () => setIsDraggedOver(false),
-    });
-  }, []);
```

```diff
  return (
    <div
      className={classes.container}
-      ref={ref}
-      style={{ backgroundColor: isDraggedOver ? "white" : "aliceblue" }}
    >
      <h4>{name}</h4>
      {content.map((card) => (
        <Card key={card.id} content={card} />
      ))}
    </div>
  );
```

And let's add it to the card, but this time we also indicate the destination card Id.

_./src/kanban/components/card/card.component.tsx_

```diff
import React from "react";
import { useEffect, useRef, useState } from "react";
- import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
+ import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { CardContent } from "../../model";
import classes from "./card.component.module.css";
import invariant from "tiny-invariant";
```

```diff
export const Card: React.FC<Props> = (props) => {
  const { content } = props;
  const [dragging, setDragging] = useState<boolean>(false);
+ const [isDraggedOver, setIsDraggedOver] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;

    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({ card: content }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, []);

+  useEffect(() => {
+    const el = ref.current;
+    invariant(el);
+
+    return dropTargetForElements({
+      element: el,
+      getData: () => ({columnId, cardId: content.id}),
+      onDragEnter: () => setIsDraggedOver(true),
+      onDragLeave: () => setIsDraggedOver(false),
+      onDrop: () => setIsDraggedOver(false),
+    });
+  }, []);

  return (
    <div
      ref={ref}
      className={classes.card}
      style={{
        opacity: dragging ? 0.4 : 1,
+        background: isDraggedOver ? "lightblue" : "white",
      }}
    >

```

And in the monitor, we have to take into account the new _cardId_ field just to use it in the drop.

_./src/kanban/kanban.container.tsx_

```diff
  React.useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) {
          // if dropped outside of any target
          return;
        }

        const card = source.data.card as CardContent;
        const columnId = destination.data.columnId as number;
+       const destinationCardId = destination.data.cardId as number;
        // Also here we ensure we are working with the latest state
        setKanbanContent((kanbanContent) =>
-          moveCard(card, columnId, kanbanContent)
+          moveCard(card, {columnId, cardId: destinationCardId}, kanbanContent)
        );
      },
    });
  }, [kanbanContent]);

```

We need to modify the business function so as not to complicate ourselves too much with immutable updates, let's use the _immer_ library (in case you haven't installed before).

```bash
npm install immer
```

And now in the business logic:

_./src/kanban/kanban.container.business.ts_

```diff
+ type DropArgs = {columnId : number, cardId: number};

export const moveCard = (
  card: CardContent,
-  destinationColumnId: number,
+  dropArgs: DropArgs,
  kanbanContent: KanbanContent
): KanbanContent => {
 const newKanbanContent = removeCardFromColumn(card, kanbanContent);
- return addCardToColumn(card, destinationColumnId, newKanbanContent);
+ return addCardToColumn(card, dropArgs, newKanbanContent);
};
```

```diff
- import { CardContent, KanbanContent } from "./model";
+ import { CardContent, Column, KanbanContent } from "./model";
+ import { produce } from "immer";
// (...)

 const dropCardAfter = (
  origincard: CardContent,
  destinationCardId: number,
  destinationColumn: Column,
 ): Column => {
-  if (destinationCardId === -1) {
-    return produce(destinationColumn, (draft) => {
-      draft.content.push(origincard);
-    });
-  }

-  return produce(destinationColumn, (draft: { content: CardContent[] }) => {
-    const index = draft.content.findIndex(
-      (card: { id: number }) => card.id === destinationCardId
-    );
+  return produce(destinationColumn, (draft) => {
+    const index = draft.content.findIndex((card) => card.id === destinationCardId);
     draft.content.splice(index, 0, origincard);
   });
 };

 const addCardToColumn = (
   card: CardContent,
-  columnId: number,
+  dropArgs: DropArgs,
   kanbanContent: KanbanContent
 ): KanbanContent => {
   const newColumns = kanbanContent.columns.map((column) => {
-    if (column.id === columnId) {
-      return dropCardAfter(card, -1, column);
+    if (column.id === dropArgs.columnId) {
+      return dropCardAfter(card, dropArgs.cardId, column);
     }
     return column;
   });

   return {
     ...kanbanContent,
     columns: newColumns,
   };
 };
```

We test:

```
npm run dev
```

It seems to work, but there's an edge case not working: if we drop the card at the bottom of the column, we can see that the drop is not performed. What's happening here? Well, there's no drop zone there. We fix this by creating a kind of empty card at the bottom of the column that occupies all the empty space.

Let's do something, we fill that div with a give a color so it's temporary distinguishable, once we see it in action, we'll apply a transparent color.

_./src/kanban/components/empty-space-drop-zone.component.tsx_

```tsx
import React from "react";
import { useEffect, useRef } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

interface Props {
  columnId: number;
}

export const EmptySpaceDropZone: React.FC<Props> = (props) => {
  const { columnId } = props;
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ columnId, cardId: -1 }),
    });
  }, []);

  return (
    <div ref={ref} style={{ flexGrow: 1, width: "100%", background: "blue" }} />
  );
};
```

Let's add it at the bottom of each column:

_./src/kanban/components/column/column.component.tsx_

```diff
import classes from "./column.component.module.css";
import { CardContent } from "../../model";
import { Card } from "../card/card.component";
+ import { EmptySpaceDropZone } from "../empty-space-drop-zone.component";

interface Props {
  columnId: number;
  name: string;
  content: CardContent[];
}

export const Column: React.FC<Props> = (props) => {
  const { name, content, columnId } = props;

  return (
    <div className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
        <Card key={card.id} content={card} columnId={columnId} />
      ))}
+     <EmptySpaceDropZone columnId={columnId} />
    </div>
  );
};
```

Now we test it and... Hey ! we got the edge case covereed !.

Let's make it transparent, so the user won't even notice what's going on:

_./src/kanban/components/empty-space-drop-zone.component.tsx_

```diff
  return (
    <div ref={ref} style={{ flexGrow: 1,
                            width: "100%",
-                            background: "blue"
+                            background: "transparent"
                            }} />
  );
```

Next steps... The goal of this example is for you to get familiar with this drag & drop library. How could it be improved?

- Introduce ghost cards during drop.
- For the cards, define two drop areas, one that drops the card above and another one below.
- Implement automatic scrolling when approaching the edges of the screen.
- Make drag and drop accessible.
- It's also a good idea to implement more operations:
  - Add Card.
  - Delete Card.
  - Modify Card.
  - Move columns.
- Another option is to create a richer card.

We will cover some of these improvements in the next examples... :)
