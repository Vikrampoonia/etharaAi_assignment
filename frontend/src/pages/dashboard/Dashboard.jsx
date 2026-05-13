import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";

import {
    getDashboardSummary,
    getOverdueTasks
} from "../../services/dashboard.service";

const OVERDUE_PAGE_SIZE = 5;

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [overduePagination, setOverduePagination] = useState({
        page: 1,
        limit: OVERDUE_PAGE_SIZE,
        total: 0,
        totalPages: 1
    });
    const [loading, setLoading] = useState(true);
    const [overdueLoading, setOverdueLoading] = useState(false);
    const [ready, setReady] = useState(false);
    const [overduePage, setOverduePage] = useState(1);
    const [taskNameInput, setTaskNameInput] = useState("");
    const [taskNameFilter, setTaskNameFilter] = useState("");
    const [assigneeInput, setAssigneeInput] = useState("");
    const [assigneeFilter, setAssigneeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [endDateFilter, setEndDateFilter] = useState("");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setTaskNameFilter(taskNameInput.trim());
            setOverduePage(1);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [taskNameInput]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setAssigneeFilter(assigneeInput.trim());
            setOverduePage(1);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [assigneeInput]);

    useEffect(() => {
        let active = true;

        const fetchInitialData = async () => {
            try {
                setLoading(true);

                const [summaryResponse, overdueResponse] = await Promise.all([
                    getDashboardSummary(),
                    getOverdueTasks({
                        page: overduePage,
                        limit: OVERDUE_PAGE_SIZE,
                        status: statusFilter || undefined,
                        priority: priorityFilter || undefined,
                        assignee: assigneeFilter || undefined,
                        title: taskNameFilter || undefined,
                        endDate: endDateFilter || undefined
                    })
                ]);

                if (!active) return;

                setSummary(summaryResponse?.data || null);

                const overdueData = overdueResponse?.data || {};
                const overdueRows = overdueData?.tasks || overdueData?.rows || overdueData || [];
                const normalizedTasks = Array.isArray(overdueRows) ? overdueRows : [];
                const pagination = overdueData?.pagination || {
                    page: overduePage,
                    limit: OVERDUE_PAGE_SIZE,
                    total: normalizedTasks.length,
                    totalPages: 1
                };

                setOverdueTasks(normalizedTasks);
                setOverduePagination({
                    page: pagination.page || overduePage,
                    limit: pagination.limit || OVERDUE_PAGE_SIZE,
                    total: pagination.total || 0,
                    totalPages: pagination.totalPages || 1
                });
            } catch (error) {
                console.log(error.message);
            } finally {
                if (active) {
                    setLoading(false);
                    setReady(true);
                }
            }
        };

        fetchInitialData();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!ready) return;

        let active = true;

        const fetchOverdueTasksData = async () => {
            try {
                setOverdueLoading(true);

                const overdueResponse = await getOverdueTasks({
                    page: overduePage,
                    limit: OVERDUE_PAGE_SIZE,
                    status: statusFilter || undefined,
                    priority: priorityFilter || undefined,
                    assignee: assigneeFilter || undefined,
                    title: taskNameFilter || undefined,
                    endDate: endDateFilter || undefined
                });

                if (!active) return;

                const overdueData = overdueResponse?.data || {};
                const overdueRows = overdueData?.tasks || overdueData?.rows || overdueData || [];
                const normalizedTasks = Array.isArray(overdueRows) ? overdueRows : [];
                const pagination = overdueData?.pagination || {
                    page: overduePage,
                    limit: OVERDUE_PAGE_SIZE,
                    total: normalizedTasks.length,
                    totalPages: 1
                };

                setOverdueTasks(normalizedTasks);
                setOverduePagination({
                    page: pagination.page || overduePage,
                    limit: pagination.limit || OVERDUE_PAGE_SIZE,
                    total: pagination.total || 0,
                    totalPages: pagination.totalPages || 1
                });
            } catch (error) {
                console.log(error.message);
            } finally {
                if (active) {
                    setOverdueLoading(false);
                }
            }
        };

        fetchOverdueTasksData();

        return () => {
            active = false;
        };
    }, [ready, overduePage, statusFilter, priorityFilter, assigneeFilter, taskNameFilter, endDateFilter]);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <MainLayout>
            <h1>Dashboard</h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >
                <div style={cardStyle}>
                    <h3>Total Tasks</h3>
                    <p>{summary?.totalTasks}</p>
                </div>

                <div style={cardStyle}>
                    <h3>Todo</h3>
                    <p>{summary?.todo}</p>
                </div>

                <div style={cardStyle}>
                    <h3>In Progress</h3>
                    <p>{summary?.inProgress}</p>
                </div>

                <div style={cardStyle}>
                    <h3>Done</h3>
                    <p>{summary?.done}</p>
                </div>

                <div style={cardStyle}>
                    <h3>Overdue</h3>
                    <p>{summary?.overdue}</p>
                </div>
            </div>

            <div style={{ marginTop: "40px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0 }}>Overdue Tasks</h2>
                </div>

                <div
                    style={{
                        margin: "16px 0 18px",
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        flexWrap: "wrap",
                        background: "#fff",
                        padding: "12px",
                        borderRadius: 8,
                        border: "1px solid #e6e6e6"
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search task name"
                        value={taskNameInput}
                        onChange={(e) => setTaskNameInput(e.target.value)}
                        style={filterInputStyle}
                    />

                    <input
                        type="text"
                        placeholder="Search assignee name or email"
                        value={assigneeInput}
                        onChange={(e) => setAssigneeInput(e.target.value)}
                        style={filterInputStyle}
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setOverduePage(1);
                        }}
                        style={filterSelectStyle}
                    >
                        <option value="">All Statuses</option>
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="DONE">DONE</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => {
                            setPriorityFilter(e.target.value);
                            setOverduePage(1);
                        }}
                        style={filterSelectStyle}
                    >
                        <option value="">All Priorities</option>
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                    </select>

                    <input
                        type="date"
                        value={endDateFilter}
                        onChange={(e) => {
                            setEndDateFilter(e.target.value);
                            setOverduePage(1);
                        }}
                        style={filterInputStyle}
                    />

                    <button
                        onClick={() => {
                            setTaskNameInput("");
                            setTaskNameFilter("");
                            setAssigneeInput("");
                            setAssigneeFilter("");
                            setStatusFilter("");
                            setPriorityFilter("");
                            setEndDateFilter("");
                            setOverduePage(1);
                        }}
                        style={clearButtonStyle}
                    >
                        Clear
                    </button>
                </div>

                {overdueLoading ? (
                    <p>Loading overdue tasks...</p>
                ) : overdueTasks.length === 0 ? (
                    <p>No overdue tasks</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Task Name</th>
                                    <th style={thStyle}>Assignee</th>
                                    <th style={thStyle}>End Date</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                {overdueTasks.map((task) => (
                                    <tr key={task.id}>
                                        <td style={tdStyle}>{task.title || "-"}</td>
                                        <td style={tdStyle}>{task.assignee?.name || task.assignee?.email || "-"}</td>
                                        <td style={tdStyle}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
                                        <td style={tdStyle}>
                                            <span style={statusBadgeStyle}>{task.status}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={priorityBadgeStyle}>{task.priority}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="members-pagination" style={{ marginTop: 16 }}>
                    <button
                        className="delete-btn members-page-btn"
                        onClick={() => setOverduePage((prev) => Math.max(1, prev - 1))}
                        disabled={overduePagination.page <= 1 || overdueLoading}
                    >
                        Previous
                    </button>

                    <span className="members-page-info">
                        Page {overduePagination.page} of {overduePagination.totalPages}
                    </span>

                    <button
                        className="delete-btn members-page-btn"
                        onClick={() => setOverduePage((prev) => Math.min(overduePagination.totalPages, prev + 1))}
                        disabled={overduePagination.page >= overduePagination.totalPages || overdueLoading}
                    >
                        Next
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

const cardStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
};

const filterInputStyle = {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    minWidth: 220
};

const filterSelectStyle = {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    minWidth: 150
};

const clearButtonStyle = {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #e5e7eb",
    background: "#fff"
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
};

const thStyle = {
    textAlign: "left",
    padding: "12px 14px",
    background: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: 700
};

const tdStyle = {
    padding: "12px 14px",
    borderBottom: "1px solid #eef2f7"
};

const statusBadgeStyle = {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: 999,
    background: "#e0f2fe",
    color: "#075985",
    fontSize: 12,
    fontWeight: 700
};

const priorityBadgeStyle = {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: 999,
    background: "#fef3c7",
    color: "#92400e",
    fontSize: 12,
    fontWeight: 700
};

export default Dashboard;
