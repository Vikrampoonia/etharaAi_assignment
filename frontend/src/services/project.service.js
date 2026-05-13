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

// search members by query (name or email) with limit
export async function searchMembers(projectId, q = "", limit = 10) {
  const params = new URLSearchParams({
    q: String(q || ""),
    limit: String(limit)
  }).toString();

  return fetchWrapper(`${BASE_URL}/${projectId}/members/search?${params}`);
}

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
  { page = 1, limit = 10, search = "", role = "" } = {}
) {
  const queryObj = {
    page: String(page),
    limit: String(limit),
  };

  if (search) {
    queryObj.search = String(search);
  }

  if (role) {
    queryObj.role = String(role);
  }

  const query = new URLSearchParams(queryObj).toString();

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