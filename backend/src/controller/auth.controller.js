import AuthService from "../service/auth.service.js";

import ResponseHandler from "../utils/response.js";

import {
    validateSignup,
    validateLogin
} from "../validation/auth.validation.js";



class AuthController {

    async signup(req, res) {

        try {

            const { name, email, password } = req.body;

            const validationError = validateSignup({
                name,
                email,
                password
            });

            if (validationError) {
                return ResponseHandler.error(
                    res,
                    validationError,
                    400
                );
            }

            const data = await AuthService.signup({
                name,
                email,
                password
            });

            return ResponseHandler.success(
                res,
                "Signup successful",
                data,
                201
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message,
                500
            );
        }
    }


    async login(req, res) {

        try {

            const { email, password } = req.body;

            const validationError = validateLogin({
                email,
                password
            });

            if (validationError) {
                return ResponseHandler.error(
                    res,
                    validationError,
                    400
                );
            }

            const data = await AuthService.login({
                email,
                password
            });

            return ResponseHandler.success(
                res,
                "Login successful",
                data
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message,
                500
            );
        }
    }
}

export default new AuthController;