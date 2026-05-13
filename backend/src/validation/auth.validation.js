export const validateSignup = ({ name, email, password }) => {

    if (!name || !email || !password) {
        return "All fields are required";
    }

    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }

    //email regex

    return null;
};

export const validateLogin = ({ email, password }) => {

    if (!email || !password) {
        return "Email and password are required";
    }

    //email regex

    return null;
};