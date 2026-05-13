import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div
            style={{
                height: "70px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 30px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                position: "sticky",
                top: 0,
                zIndex: 100
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>📋</span>
                <h2 style={{
                    margin: 0,
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "bold",
                    cursor: "pointer"
                }}
                    onClick={() => navigate("/dashboard")}
                >
                    Task Manager
                </h2>
            </div>

            <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
                <nav style={{ display: "flex", gap: "30px", alignItems: "center" }}>
                    <a
                        onClick={() => navigate("/dashboard")}
                        style={{
                            color: isActive("/dashboard") ? "#fbbf24" : "white",
                            textDecoration: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: isActive("/dashboard") ? "600" : "500",
                            transition: "all 0.3s ease",
                            paddingBottom: "5px",
                            borderBottom: isActive("/dashboard") ? "2px solid #fbbf24" : "2px solid transparent"
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive("/dashboard")) {
                                e.target.style.color = "#fbbf24";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive("/dashboard")) {
                                e.target.style.color = "white";
                            }
                        }}
                    >
                        📊 Dashboard
                    </a>
                    <a
                        onClick={() => navigate("/projects")}
                        style={{
                            color: isActive("/projects") ? "#fbbf24" : "white",
                            textDecoration: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: isActive("/projects") ? "600" : "500",
                            transition: "all 0.3s ease",
                            paddingBottom: "5px",
                            borderBottom: isActive("/projects") ? "2px solid #fbbf24" : "2px solid transparent"
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive("/projects")) {
                                e.target.style.color = "#fbbf24";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive("/projects")) {
                                e.target.style.color = "white";
                            }
                        }}
                    >
                        🎯 Projects
                    </a>
                </nav>

                <div style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative" }}>
                    <div
                        style={{
                            position: "relative",
                            cursor: "pointer"
                        }}
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                transition: "all 0.3s ease",
                                color: "white"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                                if (!dropdownOpen) {
                                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                                }
                            }}
                        >
                            <span>👤</span>
                            <span style={{ fontSize: "14px", fontWeight: "500" }}>
                                {user?.name}
                            </span>
                            <span>▼</span>
                        </div>

                        {dropdownOpen && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "100%",
                                    right: 0,
                                    marginTop: 0,
                                    backgroundColor: "white",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                    minWidth: "200px",
                                    zIndex: 1000,
                                    border: "1px solid #e5e7eb"
                                }}
                                onMouseEnter={() => setDropdownOpen(true)}
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
                                    <p style={{ margin: "0", color: "#666", fontSize: "12px" }}>Logged in as</p>
                                    <p style={{ margin: "4px 0 0 0", color: "#333", fontSize: "14px", fontWeight: "600" }}>
                                        {user?.email}
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        backgroundColor: "transparent",
                                        color: "#dc2626",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        textAlign: "left",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = "#fee2e2";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = "transparent";
                                    }}
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Navbar;