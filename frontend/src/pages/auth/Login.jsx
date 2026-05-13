import {
    useState
} from "react";

import {
    loginUser
} from "../../services/auth.service";

import {
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../../context/AuthContext";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => {
    if (!email) {
        return "Email is required";
    }
    if (!EMAIL_REGEX.test(email)) {
        return "Please enter a valid email address";
    }
    return "";
};

const validatePassword = (password) => {
    if (!password) {
        return "Password is required";
    }
    if (password.length < 6) {
        return "Password must be at least 6 characters long";
    }
    return "";
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "20px"
    },
    card: {
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        width: "100%",
        maxWidth: "400px"
    },
    title: {
        marginTop: 0,
        marginBottom: "10px",
        color: "#333",
        fontSize: "28px",
        fontWeight: "bold",
        textAlign: "center"
    },
    subtitle: {
        marginTop: 0,
        marginBottom: "30px",
        color: "#666",
        fontSize: "14px",
        textAlign: "center"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },
    label: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#333"
    },
    input: {
        padding: "12px 15px",
        fontSize: "14px",
        border: "2px solid #e0e0e0",
        borderRadius: "6px",
        transition: "all 0.3s ease",
        outline: "none",
        boxSizing: "border-box",
        width: "100%"
    },
    button: {
        padding: "12px 20px",
        fontSize: "16px",
        fontWeight: "bold",
        color: "white",
        backgroundColor: "#667eea",
        border: "none",
        borderRadius: "6px",
        marginTop: "10px",
        transition: "background-color 0.3s ease",
        cursor: "pointer"
    },
    error: {
        backgroundColor: "#fee",
        color: "#c33",
        padding: "12px 15px",
        borderRadius: "6px",
        marginBottom: "20px",
        fontSize: "14px",
        border: "1px solid #fcc"
    },
    signup: {
        marginTop: "20px",
        textAlign: "center",
        color: "#666",
        fontSize: "14px"
    },
    signupLink: {
        color: "#667eea",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "color 0.3s ease"
    }
};


const Login = () => {

    const navigate =
        useNavigate();

    const { login } =
        useAuth();

    const [formData, setFormData] =
        useState({
            email: "",
            password: ""
        });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setError("");

        // Real-time validation
        let newErrors = { ...validationErrors };
        if (name === "email") {
            const emailError = validateEmail(value);
            if (emailError) {
                newErrors.email = emailError;
            } else {
                delete newErrors.email;
            }
        } else if (name === "password") {
            const passwordError = validatePassword(value);
            if (passwordError) {
                newErrors.password = passwordError;
            } else {
                delete newErrors.password;
            }
        }
        setValidationErrors(newErrors);
    };

    const handleSubmit =
        async (e) => {
            e.preventDefault();

            // Validate form
            const emailError = validateEmail(formData.email);
            const passwordError = validatePassword(formData.password);

            const errors = {};
            if (emailError) errors.email = emailError;
            if (passwordError) errors.password = passwordError;

            setValidationErrors(errors);

            if (Object.keys(errors).length > 0) {
                return;
            }

            setLoading(true);
            setError("");

            try {
                const response =
                    await loginUser(
                        formData
                    );

                login(response.data);
                navigate("/dashboard");

            } catch (error) {
                setError(error.message || "Login failed. Please try again.");
            } finally {
                setLoading(false);
            }
        };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Welcome Back</h1>
                <p style={styles.subtitle}>Login to your account</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                                ...styles.input,
                                borderColor: validationErrors.email ? "#fcc" : "#e0e0e0"
                            }}
                        />
                        {validationErrors.email && (
                            <span style={{ color: "#c33", fontSize: "12px" }}>
                                {validationErrors.email}
                            </span>
                        )}
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{
                                ...styles.input,
                                borderColor: validationErrors.password ? "#fcc" : "#e0e0e0"
                            }}
                        />
                        {validationErrors.password && (
                            <span style={{ color: "#c33", fontSize: "12px" }}>
                                {validationErrors.password}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p style={styles.signup}>
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        style={styles.signupLink}
                    >
                        Sign up here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;