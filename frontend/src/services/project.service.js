import fetchWrapper from "../utils/fetchWrapper";

const BASE_URL = "/projects";

export const projectService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getMembers,
  addMember,
  removeMember,
  addMembers,
  removeMembers
};

async function getProjects() {
  return fetchWrapper(BASE_URL);
}

async function getProjectById(projectId) {
  return fetchWrapper(`${BASE_URL}/${projectId}`);
}

async function createProject(data) {
  return fetchWrapper(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function updateProject(projectId, data) {
  return fetchWrapper(`${BASE_URL}/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

async function deleteProject(projectId) {
  return fetchWrapper(`${BASE_URL}/${projectId}`, {
    method: "DELETE",
  });
}

async function getMembers(
  projectId,
  { page = 1, limit = 10 } = {}
) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  }).toString();

  return fetchWrapper(
    `${BASE_URL}/${projectId}/members?${query}`
  );
}

async function addMember(projectId, data) {
  return fetchWrapper(`${BASE_URL}/${projectId}/members`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function removeMember(projectId, memberId) {
  return fetchWrapper(
    `${BASE_URL}/${projectId}/members/${memberId}`,
    {
      method: "DELETE",
    }
  );
}

async function addMembers(projectId, data) {
  return fetchWrapper(
    `${BASE_URL}/${projectId}/members`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

async function removeMembers(
  projectId,
  memberId
) {
  return fetchWrapper(
    `${BASE_URL}/${projectId}/members/${memberId}`,
    {
      method: "DELETE",
    }
  );
}