export type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
};

export type TaskFilters = {
  completed?: boolean;
  search?: string;
};

export type TaskUpdateInput = {
  title: string;
  completed: boolean;
};

export type TaskPatchInput = {
  title?: string;
  completed?: boolean;
};
