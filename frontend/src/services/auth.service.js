import request from "../utils/fetchWrapper";





export const signupUser = async (
    payload
) => {

    return request(
        "/api/auth/signup",
        {
            method: "POST",

            body: JSON.stringify(payload)
        }
    );
};





export const loginUser = async (
    payload
) => {

    return request(
        "/api/auth/login",
        {
            method: "POST",

            body: JSON.stringify(payload)
        }
    );
};