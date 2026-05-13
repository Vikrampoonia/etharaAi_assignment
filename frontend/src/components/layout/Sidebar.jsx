import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { label: "Dashboard", path: "/dashboard", icon: "📊" },
        { label: "Projects", path: "/projects", icon: "🎯" }
    ];

    return (
        <div
            style={{
                width: "240px",
                minHeight: "100vh",
                background: "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)",
                padding: "24px 0",
                boxShadow: "2px 0 8px rgba(0, 0, 0, 0.08)",
                position: "sticky",
                top: 0,
                overflowY: "auto"
            }}
        >
            <div style={{ padding: "0 20px", marginBottom: "30px" }}>
                <h2 style={{
                    margin: 0,
                    fontSize: "20px",
                    color: "#667eea",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <span>✨</span> Task Manager
                </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "0 12px" }}>
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px 16px",
                            textDecoration: "none",
                            color: isActive(item.path) ? "#667eea" : "#666",
                            fontSize: "15px",
                            fontWeight: isActive(item.path) ? "600" : "500",
                            borderRadius: "8px",
                            transition: "all 0.3s ease",
                            backgroundColor: isActive(item.path) ? "#e0e7ff" : "transparent",
                            borderLeft: isActive(item.path) ? "4px solid #667eea" : "4px solid transparent",
                            cursor: "pointer",
                            marginLeft: isActive(item.path) ? "-4px" : "0"
                        }}
                        onMouseEnter={() => setHoveredItem(item.path)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={() => setHoveredItem(null)}
                    >
                        <span style={{ fontSize: "18px" }}>{item.icon}</span>
                        <span>{item.label}</span>
                        {hoveredItem === item.path && !isActive(item.path) && (
                            <span style={{ marginLeft: "auto", fontSize: "12px" }}>→</span>
                        )}
                    </Link>
                ))}
            </div>

            <div style={{
                margin: "30px 0 0 0",
                padding: "20px 12px 0 12px",
                borderTop: "1px solid #dee2e6"
            }}>
                <p style={{
                    fontSize: "12px",
                    color: "#999",
                    margin: "0 16px 12px 16px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                }}>
                    Quick Info
                </p>
                <div style={{
                    padding: "12px 16px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                    fontSize: "13px",
                    color: "#666",
                    lineHeight: "1.6"
                }}>
                    <p style={{ margin: "0 0 8px 0" }}>📌 <strong>Organize</strong> your tasks efficiently</p>
                    <p style={{ margin: "0" }}>🎯 <strong>Track</strong> project progress</p>
                </div>
            </div>

        </div>
    );
};

export default Sidebar;