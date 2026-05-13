import express from "express";
import AuthController from "../controller/auth.controller.js";

const router = express.Router();


router.post(
    "/signup",
    AuthController.signup
);

router.post(
    "/login",
    AuthController.login
);


export default router;