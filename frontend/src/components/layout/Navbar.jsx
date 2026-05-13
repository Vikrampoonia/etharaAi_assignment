import { useAuth } from "../../context/AuthContext";

const Navbar = () => {

    const { user, logout } = useAuth();

    return (
        <div
            style={{
                height: "70px",
                background: "#ffffff",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 20px"
            }}
        >

         <h3>Team Task Management</h3>

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    alignItems: "center"
                }}
            >

                <span>
                    {user?.name}
                </span>

                <button onClick={logout}>
                    Logout
                </button>
             </div>

        </div>
    );
};

export default Navbar;