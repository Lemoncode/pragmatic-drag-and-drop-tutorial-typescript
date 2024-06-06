# 01 Drop

Vamos a implementar el drop, ¿Cual crees tu que debería ser al área \_droppable?

Seguro que a bote pronto se te ocurre decir que las columnas... tiene todo el sentido.

En este ejemplo vamos a hacer que las columnas sean droppables, y que al soltar un elemento en una columna, este se añada a la lista de elementos de la columna.

Después nos vamos a encontrar con un problema y enumeraremos que nos haría flata para dejarlo fino (por tema de tiempo no implementaramos ese camino complicado, aunque es buen ejercicio para el lector).

Y en el siguiente ejemplo _recogeremos carrete_ e implementaremos el drop en las cards y veremos que problemas resuelve esta aproximacíon y que trucos debemos de aplicar (no hay bala de plata).

## Paso a paso

Hemos dicho que ibamos a marcar el componente columna como `droppable`.

_./src/kanban/components/column/column.component.tsx_

```diff
- import React from "react";
+ import React, { useState, useEffect, useRef } from "react";
+ import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
+ import invariant from "tiny-invariant";
import classes from "./column.component.module.css";
import { CardContent } from "../../model";
import { Card } from "../card/card.component";

interface Props {
  name: string;
  content: CardContent[];
}

export const Column: React.FC<Props> = (props) => {
  const { name, content } = props;
+  const ref = useRef(null);
+  const [isDraggedOver, setIsDraggedOver] = useState(false);

+  useEffect(() => {
+    const el = ref.current;
+    invariant(el);
+
+    return dropTargetForElements({
+      element: el,
+      onDragEnter: () => setIsDraggedOver(true),
+      onDragLeave: () => setIsDraggedOver(false),
+      onDrop: () => setIsDraggedOver(false),
+    });
+  }, []);

  return (
-    <div className={classes.container}>
+    <div className={classes.container} ref={ref}
+       style={{backgroundColor: (isDraggedOver) ? "white" : "aliceblue"}}
+>
      <h4>{name}</h4>
      {content.map((card) => (
        <Card key={card.id} content={card} />
      ))}
    </div>
  );
};
```

¿Qué estamos haciendo aquí?

- `DropTargetForElements` es un hook que nos permite marcar un elemento como droppable.
- Jugamos con los eventos `onDragEnter`, `onDragLeave` y `onDrop` para cambiar el color de fondo del contenedor de la columna y que sea vea que podemos soltar ahí contenido.

¿Pinta bien eh? Peeero si intentamos soltar, verás que no hace nada, nos hace falta hacer lo siguiente:

- Por un lado saber de que tarjeta estamos hablando.
- Por otro en que columna estamos.

A fin de cuentas por detrás lo que tenemos es un array de columnas en las que para cada columna tenemos un array de cards.

Vamos primero a guardar la información de la tarjeta que estamos arrastrando, para ello nos vamos a component y le informamos del _id_ del card que estamos editando (podríamos también almacenar la columna para hacerlo más fácil).

_./src/kanban/components/card/card.component.tsx_

```diff
export const Card: React.FC<Props> = (props) => {
  const { content } = props;
  const [dragging, setDragging] = useState<boolean>(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;

    invariant(el);

    return draggable({
      element: el,
+     getInitialData: () => ({ card: content }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, []);
```

Con esto cuando hagamos drag, tendremos la id de la card que se está arrastrando.

Y ¿El Drop? Cómo informo de la columna destino en la que estamos?

Lo primero vamos a pasar el id de la columna al column component:

_./src/kanban/components/kanban/column/column.component.tsx_

```diff
interface Props {
+ columnId : number;
  name: string;
  content: CardContent[];
}

export const Column: React.FC<Props> = (props) => {
-  const { name, content } = props;
+ const { columnId, name, content } = props;
```

Vamos a pasarselo desde el container:

_./src/kanban/kanban.container.tsx_

```diff
  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <Column key={column.id} name={column.name} content={column.content}
+         columnId={column.id}
        />
      ))}
    </div>
  );
```

Y ahora en la columna, en el drop vamos a informar de la columna destino:

_./src/kanban/components/column.component.tsx_

```diff
export const Column: React.FC<Props> = (props) => {
  const { name, content, columnId } = props;
  const ref = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
+     getData: () => ({columnId}),
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, []);

```

Ya tenemos la info de lo que estamos arrastrando, y la info del destino donde queremos soltarlo.

Ahora nos queda detectar cuando se ha realizado el drop con éxito y actualizar el estado de la aplicación.

Aquí hay una pieces que nos sirve de gran ayuda el _monitor_ de la librería de drag and drop, esto nos permite ponernos a monitorizar si ha habido un drop, y tener los datos del cardId de la columna destino, con lo que podemos actualizar nuestro estado de la aplicación y añadir la card a la columna destino.

El sitio donde puede tener más sentido añadir este monitor es en el _kanban.container.tsx_ ya que allí tenemos el estado del kanban content.

Para no guarrear el container con lógica de negocios vamos a crear una función con TypeScript plano que se encargue de actualizar las listas de cards (está función es ideal para desarrollarlo siguiendo TDD).

_./src/kanban/kanban.business.ts_

```typescript
import { CardContent, Column, KanbanContent } from "./model";
import { produce } from "immer";

type DropArgs = { columnId: number; cardId: number };

// Esto se podría hacer más optimo

const removeCardFromColumn = (
  card: CardContent,
  kanbanContent: KanbanContent
): KanbanContent => {
  const newColumns = kanbanContent.columns.map((column) => {
    const newContent = column.content.filter((c) => c.id !== card.id);

    return {
      ...column,
      content: newContent,
    };
  });

  return {
    ...kanbanContent,
    columns: newColumns,
  };
};

const dropCardAfter = (
  origincard: CardContent,
  destinationCardId: number,
  destinationColumn: Column
): Column => {
  return produce(destinationColumn, (draft: { content: CardContent[] }) => {
    const index = draft.content.findIndex(
      (card: { id: number }) => card.id === destinationCardId
    );
    draft.content.splice(index, 0, origincard);
  });
};

const addCardToColumn = (
  card: CardContent,
  dropArgs: DropArgs,
  kanbanContent: KanbanContent
): KanbanContent => {
  const newColumns = kanbanContent.columns.map((column) => {
    if (column.id === dropArgs.columnId) {
      return dropCardAfter(card, dropArgs.cardId, column);
    }
    return column;
  });

  return {
    ...kanbanContent,
    columns: newColumns,
  };
};

export const moveCard = (
  card: CardContent,
  dropArgs: DropArgs,
  kanbanContent: KanbanContent
): KanbanContent => {
  const newKanbanContent = removeCardFromColumn(card, kanbanContent);
  return addCardToColumn(card, dropArgs, newKanbanContent);
};
```

// TODO: Instead of cardId pass whole card !!?

Vamos ahora a utilizar esta función en el container:

Fijate que en el `useEffect` que usamos le decimos que salta como dependencia cuando `kanbanContent` cambie, esto lo hacemos para evitar que se queda con datos antiguos de `kanbanContent` y no se actualice bien.

_./src/kanban/kanban.container.tsx_

```diff
+ import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
+ import { moveCard } from "./kanban.business";
// (...)

export const KanbanContainer: React.FC = () => {
  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
    createDefaultKanbanContent()
  );

  React.useEffect(() => {
    loadKanbanContent().then((content) => setKanbanContent(content));
  }, []);

+  React.useEffect(() => {
+    return monitorForElements({
+      onDrop({ source, location }) {
+        const destination = location.current.dropTargets[0];
+        if (!destination) {
+          // si se suelta fuera de cualquier target
+          return;
+        }
+
+        const card = source.data.card as CardContent;
+        const columnId = destination.data.columnId as number;
+
+        // También aquí nos aseguramos de que estamos trabajando con el último estado
+        setKanbanContent((kanbanContent) =>
+          moveCard(card, { cardId: card.id, columnId }, kanbanContent)
+        );
+      },
+    });
+  }, [kanbanContent]);

   return (
     <div className={classes.container}>

```

Vamos a modificar el business para que en el -1 lo ponga al final de la columna:

_./src/kanban/kanban.business.ts_

```diff
const dropCardAfter = (
  origincard: CardContent,
  destinationCardId: number,
  destinationColumn: Column
): Column => {
+  if (destinationCardId === -1) {
+    return produce(destinationColumn, (draft) => {
+      draft.content.push(origincard);
+    });
+  }

  return produce(destinationColumn, (draft) => {
    const index = draft.content.findIndex(
      (card) => card.id === destinationCardId
    );
    draft.content.splice(index, 0, origincard);
  });
};
```

Si ahora lo probamos

```bash
npm run dev
```

Parece que funciona bien, podemos arrastrar y soltar, peeeroooo....

El diablo está en los detalles ¿Qué pasa si queremos intercalar la card entre dos existentes de otra columna? Aquí siempre se añade al final.

Esto se convierte en un follón ¿Cómo podríamos solucionarlo?

- Cuando se hace drop capturar la posición del ratón.
- Guardar un array de ref de los divs que contienen cada card en la columna destino.
- Recorrer con un bucle y comprobar si la posición del ratón está entre dos elementos.
- Insertarlo allí (y si está por debajo de la última card añadilo al final, lo mismo con el principio)

Esto tiene su trabajo y complejidad, es un buen ejercicio meterse en este jardin.

Ahora vamos darle al coco ¿No hay manera más sencilla de hacer esto? SIIII.... Y si en vez de hacer Drop en las columnas, lo hacemos en las cards, ¿Qué pasaría?

- Podríamos intercalar las cards sin problemas.
- Para la parte final de la columna (si hay un espacio en blanco) podemos crear una card invisible que ocupe ese espacio y sirva como area de drop.

> Si queremos afinar más podemos partir la card en tres areas para ver dependiendo de la parte en la que estemos se haga el drop en la parte de arriba o en la de abajo.

Esto lo vamos a ver en el siguiente ejemplo.
