export const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTasks = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const addTask = async (task: {
  name: string;
  completed: boolean;
  description?: string;
  dueDate?: string;
}) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return response.json();
};

export const updateTask = async (
  id: string,
  updates: Partial<{
    name: string;
    completed: boolean;
    description?: string;
    dueDate?: string;
  }>
) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return response.json();
};

export const deleteTask = async (id: string) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
