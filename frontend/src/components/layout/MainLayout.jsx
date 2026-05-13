import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {

    return (

        <div
            style={{
                display: "flex",
                backgroundColor: "#f8f9fa",
                minHeight: "100vh"
            }}
        >

            <Sidebar />
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column"
                }}
            >

                <Navbar />

                <div
                    style={{
                        flex: 1,
                        padding: "24px",
                        overflowY: "auto"
                    }}
                >
                    {children}
                </div>
            </div>

        </div>
    );
};

export default MainLayout;