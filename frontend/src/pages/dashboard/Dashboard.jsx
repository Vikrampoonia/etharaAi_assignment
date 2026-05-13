import { useEffect, useState } from "react";

import MainLayout
from "../../components/layout/MainLayout";

import {
    getDashboardSummary,
    getOverdueTasks
} from "../../services/dashboard.service";

const Dashboard = () => {

    const [summary, setSummary] = useState(null);

    const [overdueTasks, setOverdueTasks] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchDashboard();

    }, []);

    const fetchDashboard = async () => {try {

            const summaryResponse =
                await getDashboardSummary();

            const overdueResponse =
                await getOverdueTasks();

            setSummary(summaryResponse.data);

            setOverdueTasks(overdueResponse.data);

        } catch (error) {

            console.log(error.message);

        } finally {

            setLoading(false);
        }
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }
    return (

        <MainLayout>

            <h1>Dashboard</h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(5, 1fr)",
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

            <div
                style={{
                    marginTop: "40px"
                }}
            >

                <h2>Overdue Tasks</h2>

                {
                    overdueTasks.length === 0
                    ? (
                        <p>No overdue tasks</p>
                    )
                    : (
                        overdueTasks.map(task => (

                            <div
                                key={task.id}
                                style={taskCardStyle}
                            >                                <h4>{task.title}</h4>

                                <p>
                                    Status: {task.status}
                                </p>

                                <p>
                                    Priority: {task.priority}
                                </p>

                            </div>
                        ))
                    )
                }

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

const taskCardStyle = {
    background: "white",
    padding: "15px",
    marginTop: "15px",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
};

export default Dashboard;