export interface CardContent {
  id: number;
  title: string;
}

export interface Column {
  id: number;
  name: string;
  content: CardContent[];
}

export interface KanbanContent {
  columns: Column[];
}

export const createDefaultKanbanContent = (): KanbanContent => ({
  columns: [],
});
