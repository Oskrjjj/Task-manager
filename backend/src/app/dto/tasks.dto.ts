export type ListTasksQuery = {
  completed?: string;
  search?: string;
};

export type CreateTaskInput = {
  title: string;
};

export type TaskIdParam = {
  id: number;
};

export type UpdateTaskInput = {
  title?: string;
  completed?: boolean;
};
