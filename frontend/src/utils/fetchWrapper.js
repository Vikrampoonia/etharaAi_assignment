const BASE_URL = process.env.REACT_APP_BASE_URL;





const request = async (
    endpoint,
    options = {}
) => {

    const token =
        localStorage.getItem("token");





    const response = await fetch(

        `${BASE_URL}${endpoint}`,

        {
            headers: {
                "Content-Type":
                    "application/json",

                Authorization:
                    token
                        ? `Bearer ${token}`
                        : ""
            },

            ...options
        }
    );





    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export default request;