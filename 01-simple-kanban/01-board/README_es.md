# 00 Board

Vamos a crear un ejemplo simple de Kanban, el objetivo de este ejemplo es el de aprender como funciona la librería, para un ejemplo más elaborado, puedes visitar el ejemplo oficial (https://atlassian.design/components/pragmatic-drag-and-drop/examples/#board).

# Paso a paso

Este ejemplo toma como punto de partida el ejemplo _00-boilerplate_, copiatelo a una carpeta y haz `npm install` y `npm run dev`.


## Modelo de datos y api

Vamos a empezar por ver que estructura de datos nos va a hacer falta:

- Un tablero de _kanban_ va a tener una lista de columnas.

- Una lista de columnas va a tener una lista de tareas/historias (podemos llamarle
  cards)

- Una card la vamos a definir simple de momento, con un _id_ y un título.

Oye pero en mi aplicación real tengo más campos o campos diferentes ¿Qué hacemos?

- De primeras queremos probar la librería, nos podemos preocupar de esto
  más adelante.

- Una vez que nos toque ir a por la implementación real, lo primero es crear un _mapper_, es decir una función que transforme del dominio de mi aplicación al dominio de entidades del _kanban_ y viceversa, de esta manera no manchamos la implementación del _kanban_ con temas específicos de mi aplicación, que después hagan más difícil de usarlo en otras aplicaciones o incluso en la misma _app_ con otras entidades.

- Nos toca plantearnos escenarios:

  - Igual tenemos claro que queremos tener título, descripción del _card_ y poco más, en este caso mapeamos entidades y a lo sumo añadimos un campo "_object_" o "_data_" en el que tenemos la entidad original (esto se podría mirar de tipar con genéricos).

  - Igual queremos una edición rica en la carta o flexible, una opción podría ser pasarle como _children_ o en props el componente que queremos pintar en el _card_ en concreto.

> Mucho cuidado con el Meta Meta y el irnos a super genéricos, cuanto más nos
> dirigimos en esa dirección la curva de complejidad del componente se dispara a
> exponencial, hay que encontrar la justa medida entre genérico y fácil de
> mantener (o si hay que ir a super genérico que sea por justificación de negocio),
> mi consejo aquí siempre es "hacer varios jarrones" antes de "intentar hacer el
> molde".

Así pues de momento creamos el siguiente modelo, primero definimos un _item_ (_card_):

_./src/kanban/model.ts_

```ts
export interface CardContent {
  id: number;
  title: string;
}
```

Vamos ahora a por la columna:

- Tiene un título.
- Tiene una lista de cartas.

_./src/kanban/model.ts_

```diff
export interface CardContent {
  id: number;
  title: string;
}

+ export interface Column {
+  id: number;
+  name: string;
+  content: CardContent[];
+ }
```

Y ahora definimos la entidad de _Kanban_ que de momento ponemos como una lista de columnas.

_./src/kanban/model.ts_

```diff
export interface CardContent {
  id: number;
  title: string;
}

export interface Column {
  id : number;
  name: string;
  content: CardContent[];
}

+ export interface KanbanContent {
+  columns: Column[];
+ }
```

- Y para terminar, _KanbanContent_ será la entidad de punto de entrada que instanciaremos en nuestro componente, así que mejor tener una función para instanciar un _kanban_ vacío que sirva como punto de entrada seguro(creamos un _factory_), de esta manera nos ahorramos ir haciendo chequeos de campo nulo etc...

_./src/kanban/model.ts_

```diff
export interface KanbanContent {
  columns: Column[];
}

+ export const createDefaultKanbanContent = (): KanbanContent => ({
+  columns: [],
+ });
```

Toca crear una api simulada para cargar los datos, así como datos de prueba, a tener en cuenta:

- La api debe tener la misma firma que si estuviéramos cargando datos desde una _API Rest_ (async y promesas), así cuando reemplacemos el _mock_ por datos reales sólo vamos a tener que tocar en la API.

- Los datos _mock_ los definimos en un fichero aparte, así es más fácil de eliminar y no metemos ruido.

De momento tanto api como _mock_ lo vamos a definir dentro del componente _kanban_, en la implementación final seguramente lo saquemos fuera de la carpeta (sea directamente la página de aplicación la que pida los datos a un servidor le pasemos un _mapper_ y lo convirtamos a entidades de la aplicación), pero no nos metemos aquí ahora, mejor no meter más elementos de complejidad en la ecuación, primero gateamos, después andamos y finalmente corremos (recordatorio: es importante que esto sea un _spike_ y que tengamos 2/3 semanas para jugar sin presión).

Los datos _mock_:

_./src/kanban/mock-data.ts_

```ts
import { KanbanContent } from "./model";

// TODO: Move this in the future outside the kanban component folder
export const mockData: KanbanContent = {
  columns: [
    {
      id: 1,
      name: "Backglog",
      content: [
        {
          id: 1,
          title: "Crear las cards",
        },
        {
          id: 2,
          title: "Colocar las cards",
        },
        {
          id: 3,
          title: "Implementar drag card",
        },
        {
          id: 4,
          title: "Implementar drop card",
        },
        {
          id: 5,
          title: "Implementar drag & drop column",
        },
      ],
    },
    {
      id: 2,
      name: "Doing",
      content: [
        {
          id: 6,
          title: "Delete a card",
        },
      ],
    },
    {
      id: 3,
      name: "Done",
      content: [
        {
          id: 7,
          title: "Crear el boilerplate",
        },
        {
          id: 8,
          title: "Definir el modelo de datos",
        },
        {
          id: 9,
          title: "Crear las columnas",
        },
      ],
    },
  ],
};
```

> Cuando tengamos código o implementaciones que necesitan un meneo, es buena idea añadirle un TODO para que cuando llegue la Pull Request salgan a flote (en este fase, no deben de haber TODO's o si los hay deben de estar justificados y aceptar deuda técnica).

- Y ahora vamos a definir la API

_./src/kanban/kanban.api.ts_

```ts
import { KanbanContent } from "./model";
import { mockData } from "./mock-data";

// TODO: Move this outside kanban component folder
export const loadKanbanContent = async (): Promise<KanbanContent> => {
  return mockData;
};
```

¿Por qué no empotramos los datos directamente en el _container_ y a tirar millas? Es importante que la parte de UI se quede con el menor ruido posible, y es buena práctica sacar todo el código que se pueda que no tenga que ver con UI a ficheros TS planos, de esta manera:

- Ayudamos a evitar que el componente se vuelva un monstruo: el típico fichero con 5000 lineas de código, con un _sphaguetti_.

- Al aislar código en fichero TS ya sabemos que no es dependiente de React y un compañero que no sepa React puede trabajar en esa parte sin problemas.

- Es más fácil de testear, tenemos piezas que hacen una cosa y una sola cosa.

### Componentes

Vamos empezar a trabajar en el UI

- Definamos el contenedor del _kanban_, lo primero un poco de estilado:

El div contenedor:

- Va a ser un flexbox.
- Lo suyo es que ocupe todo el espacio disponible.
- Las columnas las mostrará de izquierda a derecha, dejando un espacio entre ellas.
- Además le añadimos un overflow (si hubieran más card que espacio en la columna),
  aquí podríamos ver si a futuro añadir un scroll, etc...

_./src/kanban/kanban.container.module.css_

```css
.container {
  display: flex;
  flex-direction: row;
  flex: 1;
  column-gap: 5px;
  min-width: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid rgb(89, 118, 10);
  background-color: burlywood;
}
```

A tener en cuenta:

- Este no va a ser el diseño definitivo, pero al menos lo tenemos enfocado (cuando la prueba sea un éxito, nos preocuparemos de darle estilo con el martillo fino, rem, media queries, etc...).

- Lo mismo con los colores, tematización, ya aplicaremos esto cuando integremos (aquí tocará decidir si aplicar directamente _harcodear_ estilos o si exponer una api de tematización)

Si te fijas hay un montón de decisiones que podrían añadir ruido a nuestra prueba de concepto, nuestro objetivo como desarrolladores / arquitectos software es retrasar todas las decisiones que no sean indispensable y centrarnos en el núcleo de nuestra prueba de (no está de más ir apuntando todo lo que va saliendo por el camino, tanto para tenerlo en cuenta más adelante, como para enumerarlo en la demo del _spike_ y añadirlo a la _user story_ de implementación real, es muy peligroso mostrar una demo que todo funcione y que el perfil no técnico piense que ya está todo hecho).

Vamos a definir el componente contenedor:

_./src/kanban/kanban.container.tsx_

```tsx
import React from "react";
import { KanbanContent, createDefaultKanbanContent } from "./model";
import { loadKanbanContent } from "./kanban.api";
import classes from "./kanban.container.module.css";

export const KanbanContainer: React.FC = () => {
  const [kanbanContent, setKanbanContent] = React.useState<KanbanContent>(
    createDefaultKanbanContent()
  );

  React.useEffect(() => {
    loadKanbanContent().then((content) => setKanbanContent(content));
  }, []);

  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
        <h4 key={column.id}>{column.name}</h4>
      ))}
    </div>
  );
};
```

Es decir acabamos de hacer la prueba más tonta para ver si el contenedor:

- Se crea vació con los estilos correctos.
- Se carga con datos.

En este momento podemos elegir entre dos aproximaciones:

- Nos ponemos a crear el componente columna y después el card y integramos
  en la aplicación principal a ver si se monta todo.

- Integramos cuanto antes en el contenedor principal y empezamos a tener
  _feedback_ visual de que todo va conectando.

Mi consejo aquí es siempre ir a por la segunda solución, en cuanto antes podamos sacar cosas por la UI antes detectaremos problemas y será más fácil de arreglar, ya que hay menos código y menos componentes para ver si son los responsables de generar el fallo.

Así que vamos a crear un _barrel_ dentro del _kanban_ para exportar nuestro contenedor:

_./src/kanban/index.ts_

```ts
export * from "./kanban.container";
```

Y lo instanciamos en el app de nuestra aplicación de prueba:

_./src/app.tsx_

```diff
import React from "react";
+ import { KanbanContainer } from "./kanban";

export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return <KanbanContainer />;
};
```

Es hora de probar que esto funciona (se ve un rectángulo con tres títulos)... parece poca cosa pero con menos código he metido fallos grandes :), de hecho primer patón, no ocupa toda la pantalla el kanban, pero esto es más problema de aplicación, el _body_ es un contenedor flex ,y tenemos que decirle al _div_ root que ocupe todo el espacio que pueda (podemos ponerle un _flex_ a 1), para esto podemos jugar con las dev tools.

Vamos a cambiarlo en la hoja de estilos.

_./app.css_

```diff
#root {
  max-width: 1280px;
+ flex: 1;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
```

Ahora ejecutamos y ya podemos ver que ocupa bastante espacio :).

```bash
npm start
```

✅ Somos capaces de mostrar un contenedor vacio...

Vamos a definir el componente de columnas:

- Vamos a por el estilado.
- En nuestro caso el componente columna va a recibir del contenedor el nombre de la misma y una lista de tareas (lo llamaremos _content_, el como nombrar variables / componentes / carpetas, lleva mucha discusión y estudio, es muy importante, quizás un nombre más apropiado podría ser _cardContentCollection_).

Sobre el estilado:

- La columna va a ser otro contenedor flex.

- Para la prueba va a tener un ancho fijo (apuntar martillo fino para después si añadir media queries para poner un ancho relativo o por porcentajes).

- Le pondremos _overflow_ por si hubiera más _cards_ que espacio en la columna (martillo fino todo, resolver esto cuando se integre en real)

- Le añadimos un color de fondo a cada columna (TODO martillo fino aquí, o bien en la aplicación real usar los colores que vengan, o bien exponer una API de CSS / tematizado o mediante variables HTML).

- La altura le damos el 100% del alto del contenedor padre.

_./src/kanban/column/column.component.module.css_

```css
.container {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  align-items: center;
  width: 250px; /* TODO: relative sizes or media queries?*/
  height: 100vh; /* TODO: review height, shouldn't be 100vh*/
  overflow: hidden; /*TODO: scroll? */
  border: 1px solid rgb(4, 1, 19); /* TODO: Theme colors, variables, CSS API? */
  background-color: aliceblue;
}
```

- Hora de tocar el código, seguimos los mismos pasos que con en el contenedor, montamos el mínimo, y simplemente mostramos el nombre de cada _card_.

_./src/kanban/column/column.component.tsx_

```tsx
import React from "react";
import classes from "./column.component.module.css";
import { CardContent } from "../model";

interface Props {
  name: string;
  content: CardContent[];
}

export const Column: React.FC<Props> = (props) => {
  const { name, content } = props;

  return (
    <div className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
        <h5>{card.title}</h5>
      ))}
    </div>
  );
};
```

> Pregunta aquí... ¿Merecería la pena exponer la columna en el barrel?

- Ya nos falta tiempo para probarlo :), vamos a integrarlo en nuestro contenedor de _Kanban_:

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
import {
  KanbanContent,
  createDefaultKanbanContent,
  CardContent,
} from "./model";
import { loadKanbanContent } from "./container.api";
+ import { Column } from "./column/column.component";
import classes from "./container.css";

```

```diff
  return (
    <div className={classes.container}>
      {kanbanContent.columns.map((column) => (
-        <h4 key={column.id}>{column.name}</h4>
+         <Column key={column.id} name={column.name} content={column.content} />
      ))}
    </div>
  );
};
```

- Corremos a probarlo :)

```bash
npm start
```

✅ Somos capaces de mostrar las columnas del _kanban_...

Esto empieza a tener buena pinta, ahora vamos a por el componente de _card_:

En cuanto estilado vamos a definir: Una clase para estilar el card (ancho, borde...).

El diseño es mínimo, más adelante habría que aplicar _martillo fino_ para dejar una _card_ con aspecto profesional.

_./src/kanban/card/card.component.module.css_

```css
.card {
  display: flex;
  border: 1px dashed gray; /* TODO: review sizes, colors...*/
  padding: 5px 15px;
  background-color: white;
  width: 210px;
}
```

Vamos ahora a por el tsx:

_./src/kanban/card/card.component.tsx_

```tsx
import React from "react";
import { CardContent } from "../model";
import classes from "./card.component.module.css";

interface Props {
  content: CardContent;
}

export const Card: React.FC<Props> = (props) => {
  const { content } = props;

  return <div className={classes.card}>{content.title}</div>;
};
```

- Como siempre corremos a usarlo en nuestro componente de columna y ver los resultados:

_./src/kanban/column/column.component.tsx_

```diff
import React from "react";
import classes from "./column.component.css";
import { CardContent } from "./model";
+ import { Card } from '../card/card.component';
```

_./src/kanban/column/column.component.tsx_

```diff
  return (
    <div className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
-        <h5>{card.title}</h5>
+       <Card key={card.id} content={card} />
      ))}
    </div>
  );
```

- A ver qué tal sale :)

```bash
npm start
```

✅ Somos capaces de mostrar las _cards_...

- Ya tenemos nuestro tablero montado, es hora de ver cómo va quedando nuestra carpeta _kanban_ parece que hay muchos ficheros, sería buena idea organizar un poco, vamos a crear dos carpetas:
- _components_: donde meteremos los componentes que no son contenedores.
- _api_: donde meteremos los ficheros que se encargan de la comunicación
  con el _backend_ (que en este caso son _mock_).

Vamos a crear un _barrel_ para cada una de ellas:

_./src/kanban/components/index.ts_

```ts
export * from "./card";
export * from "./column";
```

> Hay que crear los barrer para la subcarpeta card y column

_./src/kanban/api/index.ts_

```ts
export * from "./kanban.api";
```

Y arreglamos los _imports_ de:

- api
- components
- kanban.container

_./src/kanban/kanban.container.tsx_

```diff
import React from "react";
import { KanbanContent, createDefaultKanbanContent } from "./model";
- import { loadKanbanContent } from "./api/kanban.api";
+ import { loadKanbanContent } from "./api";
- import { Column } from "./components/column/column.component";
+ import { Column } from "./components";
  import classes from "./kanban.container.module.css";
```

