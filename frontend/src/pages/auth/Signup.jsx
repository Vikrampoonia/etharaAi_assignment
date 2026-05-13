import {
    useState
} from "react";

import {
    signupUser
} from "../../services/auth.service";

import {
    useNavigate
} from "react-router-dom";







const SignUp = () => {

    const navigate = useNavigate();

    const [formData, setFormData] =
        useState({

            email: "",
            password: ""
        });





    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value
        });
    };





    const handleSubmit =
        async (e) => {

        e.preventDefault();

        try {

            const response =
                await signupUser(
                    formData
                );

          

            navigate("/login");

        } catch (error) {

            alert(error.message);
        }
    };





    return (

        <div>

            <h1>Login</h1>

            <form
                onSubmit={handleSubmit}
            >

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button type="submit">
                    signUp
                </button>

            </form>

        </div>
    );
};

export default SignUp;