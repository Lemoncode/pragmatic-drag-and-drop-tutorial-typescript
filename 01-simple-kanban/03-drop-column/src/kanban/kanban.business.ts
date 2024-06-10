import { CardContent, Column, KanbanContent } from "./model";
import { produce } from "immer";

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
  if (destinationCardId === -1) {
    return produce(destinationColumn, (draft) => {
      draft.content.push(origincard);
    });
  }

  return produce(destinationColumn, (draft: { content: CardContent[] }) => {
    const index = draft.content.findIndex(
      (card: { id: number }) => card.id === destinationCardId
    );
    draft.content.splice(index, 0, origincard);
  });
};

const addCardToColumn = (
  card: CardContent,
  columnId: number,
  kanbanContent: KanbanContent
): KanbanContent => {
  const newColumns = kanbanContent.columns.map((column) => {
    if (column.id === columnId) {
      return dropCardAfter(card, -1, column);
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
  destinationColumnId: number,
  kanbanContent: KanbanContent
): KanbanContent => {
  const newKanbanContent = removeCardFromColumn(card, kanbanContent);
  return addCardToColumn(card, destinationColumnId, newKanbanContent);
};
