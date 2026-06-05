import type { TaskFilters } from "../../domain/entities/task.js";

export const mapQueryToTaskFilters = (query: {
  completed?: unknown;
  search?: unknown;
}): TaskFilters => {
  const completed =
    query.completed === "true"
      ? true
      : query.completed === "false"
      ? false
      : undefined;

  const search =
    typeof query.search === "string" && query.search.trim().length > 0
      ? query.search.trim()
      : undefined;

  return { completed, search };
};
