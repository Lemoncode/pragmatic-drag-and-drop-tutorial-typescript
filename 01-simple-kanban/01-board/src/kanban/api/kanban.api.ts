import { KanbanContent } from "../model";
import { mockData } from "./mock-data";

// TODO: Move this outside kanban component folder
export const loadKanbanContent = async (): Promise<KanbanContent> => {
  return mockData;
};
