import request from "../utils/fetchWrapper";

export const getDashboardSummary = async () => {
    return request("/api/dashboard/summary");
};

export const getTasksPerUser = async () => {
    return request("/api/dashboard/tasks-per-user");
};

export const getOverdueTasks = async () => {
    return request("/api/dashboard/overdue");
};