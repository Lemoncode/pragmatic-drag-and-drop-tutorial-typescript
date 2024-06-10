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
          title: "Create the cards",
        },
        {
          id: 2,
          title: "Place the cards in the columns",
        },
        {
          id: 3,
          title: "Implement card dragging",
        },
        {
          id: 4,
          title: "Implement drop card",
        },
        {
          id: 5,
          title: "Implement drag & drop column",
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
          title: "Create boilerplate",
        },
        {
          id: 8,
          title: "Define data model",
        },
        {
          id: 9,
          title: "Create columns",
        },
      ],
    },
  ],
};
