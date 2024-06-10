# 01 Board

We are going to create a simple Kanban example, the objective of this example is to learn how the library works, for a more elaborate example, you can visit the official example (https://atlassian.design/components/pragmatic-drag-and-drop/examples/#board).

# Step by step

This example takes the _00-boilerplate_ example as a starting point, copy it to a folder and do `npm install` and `npm run dev`.

## Data model and api

Let's start by seeing what data structure we will need:

- A _kanban_ board is going to have a list of columns.

- A list of columns is going to have a list of tasks/stories (we can call them
  cards)

- A card is going to be defined simple for the moment, with an _id_ and a title.

Hey but in my real application I have more fields or different fields, what do we do?

- At first we want to test the library, we can worry about this later.
  later.

- Once we go for the real implementation, the first thing is to create a _mapper_, ie a function that transforms from the domain of my application to the domain of entities of the _kanban_ and vice versa, so we do not taint the implementation of the _kanban_ with specific issues of my application, which then make it more difficult to use it in other applications or even in the same _app_ with other entities.

- We have to think about scenarios:

  - Maybe we are clear that we want to have title, description of the _card_ and little more, in this case we map entities and at most add a field “_object_” or “_data_” in which we have the original entity (this could be looked at typing with generics).

  - Maybe we want a rich edition in the card or flexible, an option could be to pass as _children_ or in props the component that we want to paint in the _card_ in particular.

> Be careful with the Meta Meta and going to super generics, the more we
> head in that direction the complexity curve of the component skyrockets.
> the more we go in that direction the complexity curve of the component shoots up exponentially, it is necessary to find the right measure between generic and easy to
> maintenance (or if you have to go super generic then for business justification),
> my advice here is always to “make several vases” before “trying to make the
> mold".

So for the moment we create the following model, first we define an _item_ (_card_):

_./src/kanban/model.ts_

```ts
export interface CardContent {
  id: number;
  title: string;
}
```

Let's go now for the column:

- It has a title.
- It has a list of letters.

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

- And finally, _KanbanContent_ will be the entry point entity that we will instantiate in our component, so it is better to have a function to instantiate an empty _kanban_ that serves as a safe entry point (we create a _factory_), this way we save doing null field checks, etc...

_./src/kanban/model.ts_

```diff
export interface KanbanContent {
  columns: Column[];
}

+ export const createDefaultKanbanContent = (): KanbanContent => ({
+  columns: [],
+ });
```

It is time to create a mock api to load the data, as well as test data, to be taken into account:

- The api must have the same signature as if we were loading data from an _API Rest_ (async and promises), so when we replace the _mock_ with real data we are only going to have to touch in the API.

- The _mock_ data we define it in a separate file, so it is easier to delete and we don't make noise.

At the moment both api and _mock_ are going to be defined inside the _kanban_ component, in the final implementation we will probably take it out of the folder (it will be directly the application page that asks for the data to a server, we pass it a _mapper_ and convert it to entities of the application), but we do not get involved here now, better not to put more elements of complexity in the equation, first we crawl, then walk and finally run (reminder: it is important that this is a _spike_ and that we have 2/3 weeks to play without pressure).

The _mock_ data:

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

> When we have code or implementations that need a wiggle, it is a good idea to add a TODO so that when the Pull Request arrives, they come to the surface (in this phase, there should not be TODO's or if there are, they should be justified and accept technical debt).

- And now let's define the API

_./src/kanban/kanban.api.ts_

``ts
import { KanbanContent } from «./model»;
import { mockData } from «./mock-data»;

// TODO: Mover esto fuera de la carpeta de componentes kanban
export const loadKanbanContent = async (): Promise<ContenidoKanban> => {
return mockData;
};

```
Why don't we just embed the data directly into the _container_ and go for miles? It is important that the UI part is left with as little noise as possible, and it is good practice to remove as much code as possible that does not have to do with UI to flat TS files, in this way:

- We help to avoid that the component becomes a monster: the typical file with 5000 lines of code, with a _sphaguetti_.

- By isolating code in TS file we already know that it is not dependent on React and a colleague who does not know React can work on that part without problems.

- It is easier to test, we have parts that do one thing and one thing only.
```

### Components

Let's start working on the UI

- Let's define the _kanban_ container, first a little style:

The container div:

- It's going to be a flexbox.
- Your thing is that it takes up all the available space.
- The columns will be shown from left to right, leaving a space between them.
- We also add an overflow (if there were more cards than space in the column),
  here we could see if in the future add a scroll, etc...

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

To consider:

- This is not going to be the final design, but at least we have it focused (when the test is a success, we will worry about styling it with the fine hammer, rem, media queries, etc...).

- The same with colors, theming, we will apply this when we integrate (here we will have to decide whether to directly apply _harcode_ styles or expose a theming api)

If you notice, there are a lot of decisions that could add noise to our proof of concept, our goal as software developers / architects is to delay all decisions that are not essential and focus on the core of our proof of concept (it doesn't hurt to point out everything that comes along the way, both to take it into account later, and to list it in the _spike_ demo and add it to the real implementation _user story_, it is very dangerous to show a demo that everything works and that the non-technical profile think that everything is already done).

Let's define the container component:

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

That is, we just did the dumbest test to see if the container:

- Void is created with the correct styles.
- Loaded with data.

At this point we can choose between two approaches:

- We start creating the column component and then the card and integrate
  in the main application to see if everything is mounted.

- We integrate as soon as possible into the main container and begin to have
  Visual _feedback_ that everything is connecting.

My advice here is to always go for the second solution, the sooner we can get things out of the UI the sooner we will detect problems and it will be easier to fix, since there is less code and fewer components to see if they are responsible for generating the failure.

So let's create a _barrel_ inside the _kanban_ to export our container:

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

It's time to test that this works (you see a rectangle with three titles)... it seems like a small thing but with less code I have made big mistakes :), in fact first pattern, the kanban does not take up the entire screen, but this is more application problem, the _body_ is a flex container, and we have to tell the root _div_ to take up all the space it can (we can set a _flex_ to 1), for this we can play with the dev tools.

Let's change it in the style sheet.

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

Now we run it and we can see that it takes up a lot of space :).

```bash
npm run dev
```

✅ We are able to show an empty container...

Let's define the columns component:

- Let's go for the style.
- In our case the column component will receive from the container its name and a list of tasks (we will call it _content_, how to name variables / components / folders, takes a lot of discussion and study, it is very important, perhaps one more name appropriate could be _cardContentCollection_).

About the style:

- The column is going to be another flex container.

- For the test it will have a fixed width (point a fine hammer and then add media queries to set a relative width or by percentages).

- We will put _overflow_ in case there are more _cards_ than space in the column (fine hammer everything, resolve this when it is integrated into real)

- We add a background color to each column (EVERYTHING fine hammer here, either in the real application use the colors that come, or expose a CSS / theming API or through HTML variables).

- We give the height 100% of the height of the parent container.

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
  color: black;
}
```

- Time to touch the code, we follow the same steps as in the container, we mount the minimum, and simply show the name of each _card_.

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

> Ask here... Would it be worth exposing the column in the barrel?

- We don't have time to test it :), let's integrate it into our _Kanban_ container:

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

- Let's run to try it :)

```bash
npm run dev
```

✅ We are able to show the _kanban_ columns...

This is starting to look good, now let's go for the _card_ component:

As for styling we are going to define: A class to style the card (width, border...).

The design is minimal, later you would have to apply _fine hammer_ to leave a _card_ with a professional appearance.

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

Now let's go for the tsx:

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

- As always we run to use it in our column component and see the results:

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

- Let's see how it turns out :)

```bash
npm run dev
```

✅ We are able to show the _cards_...

- We already have our board set up, it's time to see how our _kanban_ folder is looking. It seems that there are many files, it would be a good idea to organize a little, let's create two folders:
- _components_: where we will put the components that are not containers.
- _api_: where we will put the files that are responsible for communication
  with the _backend_ (which in this case are _mock_).

Let's create a _barrel_ for each of them:

_./src/kanban/components/index.ts_

```ts
export * from "./card";
export * from "./column";
```

> You have to create the sweeps for the card and column subfolder

_./src/kanban/api/index.ts_

```ts
export * from "./kanban.api";
```

And we fix the _imports_ of:

- api
- components
- kanban.container

_./src/kanban/api/kanban.api.ts_

```diff
- import { KanbanContent } from "./model";
- import { mockData } from "./mock-data";
+ import { KanbanContent } from "../model";
+ import { mockData } from "../mock-data";
```

_./src/kanban/components/cards/cards.component.tsx_

```diff
import React from "react";
- import { CardContent } from "../model";
+ import { CardContent } from "../../model";
```

_./src/kanban/components/column/column.component.tsx_

```diff
import classes from "./column.component.module.css";
- import { CardContent } from "../model";
+ import { CardContent } from "../../model";
- import { Card } from "../card/card.component";
+ import { Card } from "../card";
```

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
