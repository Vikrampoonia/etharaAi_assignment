import request from "../utils/fetchWrapper";





export const signupUser = async (
    payload
) => {

    return request(
        "/auth/signup",
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
        "/auth/login",
        {
            method: "POST",

            body: JSON.stringify(payload)
        }
    );
};