import { Link } from "react-router-dom";

const Sidebar = () => {

    return (

        <div
            style={{
                width: "220px",
                minHeight: "100vh",
                background: "#f3f4f6",
                padding: "20px"
            }}
        >

            <h2>Task Manager</h2>
<div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    marginTop: "30px"
                }}
            >

                <Link to="/dashboard">
                    Dashboard
                </Link>

                <Link to="/projects">
                    Projects
                </Link>
            </div>

        </div>
    );
};

export default Sidebar;