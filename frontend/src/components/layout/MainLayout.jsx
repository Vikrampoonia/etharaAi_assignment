import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {

    return (

        <div
            style={{
                display: "flex"
            }}
        >

            <Sidebar />
            <div
                style={{
                    flex: 1,
                    background: "#f9fafb",
                    minHeight: "100vh"
                }}
            >

                <Navbar />

                <div
                    style={{
                        padding: "20px"
                    }}
                >
                    {children}
                </div>
             </div>

        </div>
    );
};

export default MainLayout;