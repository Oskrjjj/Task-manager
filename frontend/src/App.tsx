import { FormEvent, useEffect, useMemo, useState } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "pending"
  >("all");
  const [searchFilter, setSearchFilter] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (statusFilter === "completed") {
        params.set("completed", "true");
      }
      if (statusFilter === "pending") {
        params.set("completed", "false");
      }
      if (searchFilter.trim()) {
        params.set("search", searchFilter.trim());
      }

      const queryString = params.toString();
      const response = await fetch(
        `${API_URL}/tasks${queryString ? `?${queryString}` : ""}`
      );

      if (!response.ok) {
        throw new Error("No se pudieron cargar las tareas");
      }

      const data = (await response.json()) as Task[];
      setTasks(data);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Error inesperado";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTasks();
  }, [statusFilter, searchFilter]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setError(null);

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear la tarea");
      }

      setTitle("");
      await fetchTasks();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Error inesperado";
      setError(message);
    }
  };

  const completeTask = async (id: number) => {
    setError(null);

    try {
      const response = await fetch(`${API_URL}/tasks/${id}/complete`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("No se pudo completar la tarea");
      }

      await fetchTasks();
    } catch (completeError) {
      const message =
        completeError instanceof Error
          ? completeError.message
          : "Error inesperado";
      setError(message);
    }
  };

  const deleteTask = async (id: number) => {
    setError(null);

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar la tarea");
      }

      await fetchTasks();
    } catch (deleteError) {
      const message =
        deleteError instanceof Error ? deleteError.message : "Error inesperado";
      setError(message);
    }
  };

  const summary = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Desafio Tecnico</p>
        <h1>Administrador de Tareas</h1>
        <p>Gestion de tareas</p>
      </section>

      <section className="glass card">
        <form onSubmit={onSubmit} className="task-form">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Escribe una nueva tarea..."
            aria-label="Nueva tarea"
          />
          <button type="submit">Crear</button>
        </form>

        <div className="filters">
          <div className="chip-group" role="group" aria-label="Estado">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={statusFilter === "all" ? "active" : ""}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={statusFilter === "pending" ? "active" : ""}
            >
              Pendientes
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("completed")}
              className={statusFilter === "completed" ? "active" : ""}
            >
              Completadas
            </button>
          </div>
          <input
            value={searchFilter}
            onChange={(event) => setSearchFilter(event.target.value)}
            placeholder="Buscar por titulo"
            aria-label="Buscar por titulo"
          />
        </div>

        <div className="stats">
          <article>
            <span>Total</span>
            <strong>{summary.total}</strong>
          </article>
          <article>
            <span>Completadas</span>
            <strong>{summary.completed}</strong>
          </article>
          <article>
            <span>Pendientes</span>
            <strong>{summary.pending}</strong>
          </article>
        </div>

        {error ? <p className="error">{error}</p> : null}

        <ul className="task-list">
          {loading ? <li className="empty">Cargando tareas...</li> : null}
          {!loading && tasks.length === 0 ? (
            <li className="empty">No hay tareas para mostrar.</li>
          ) : null}
          {!loading
            ? tasks.map((task) => (
                <li key={task.id} className={task.completed ? "done" : ""}>
                  <div>
                    <p>{task.title}</p>
                    <small>{new Date(task.createdAt).toLocaleString()}</small>
                  </div>
                  <div className="task-actions">
                    <button
                      type="button"
                      onClick={() => completeTask(task.id)}
                      disabled={task.completed}
                      aria-label={`Marcar ${task.title} como completada`}
                    >
                      {task.completed ? "Completada" : "Completar"}
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Eliminar ${task.title}`}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))
            : null}
        </ul>
      </section>
    </main>
  );
};

export default App;
