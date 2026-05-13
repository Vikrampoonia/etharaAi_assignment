import fetchWrapper from "../utils/fetchWrapper";

const BASE_URL = "/task";

export const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

async function getTasks(projectId) {
  return fetchWrapper(
    `${BASE_URL}/projects/${projectId}/tasks`
  );
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