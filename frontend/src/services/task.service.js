import fetchWrapper from "../utils/fetchWrapper";

const BASE_URL = "/task";

export const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

async function getTasks(projectId, options = {}) {
  const params = new URLSearchParams();
  if (options.page) params.append("page", options.page);
  if (options.limit) params.append("limit", options.limit);
  if (options.status) params.append("status", options.status);
  if (options.priority) params.append("priority", options.priority);
  if (options.assignedTo) params.append("assignedTo", options.assignedTo);
  if (options.title) params.append("title", options.title);

  const url = `${BASE_URL}/projects/${projectId}/tasks${params.toString() ? `?${params.toString()}` : ""}`;

  return fetchWrapper(url);
}

async function createTask(projectId, data) {
  return fetchWrapper(
    `${BASE_URL}/projects/${projectId}/tasks`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

async function updateTask(taskId, data) {
  return fetchWrapper(
    `${BASE_URL}/tasks/${taskId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

async function deleteTask(taskId) {
  return fetchWrapper(
    `${BASE_URL}/tasks/${taskId}`,
    {
      method: "DELETE",
    }
  );
}