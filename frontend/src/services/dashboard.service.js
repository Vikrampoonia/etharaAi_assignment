import request from "../utils/fetchWrapper";

export const getDashboardSummary = async () => {
    return request("/dashboard/summary");
};

export const getTasksPerUser = async () => {
    return request("/dashboard/tasks-per-user");
};

export const getOverdueTasks = async (params = {}) => {
    const query = new URLSearchParams();

    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.status) query.set("status", params.status);
    if (params.priority) query.set("priority", params.priority);
    if (params.assignee) query.set("assignee", params.assignee);
    if (params.title) query.set("title", params.title);
    if (params.endDate) query.set("endDate", params.endDate);

    const suffix = query.toString() ? `?${query.toString()}` : "";
    return request(`/dashboard/overdue${suffix}`);
};