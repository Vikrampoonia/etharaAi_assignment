import request from "../utils/fetchWrapper";

export const getDashboardSummary = async () => {
    return request("/dashboard/summary");
};

export const getTasksPerUser = async () => {
    return request("/dashboard/tasks-per-user");
};

export const getOverdueTasks = async () => {
    return request("/dashboard/overdue");
};