import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
});

export const taskService = {
  getAll: (completed) => {
    const params = completed !== undefined ? { completed } : {};
    return api.get("/tasks", { params }).then((res) => res.data);
  },
  create: (title) => api.post("/tasks", { title }).then((res) => res.data),
  update: (id, updates) =>
    api.patch(`/tasks/${id}`, updates).then((res) => res.data),
  delete: (id) => api.delete(`/tasks/${id}`).then((res) => res.data),
};

export default api;
