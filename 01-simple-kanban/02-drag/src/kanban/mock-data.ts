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
