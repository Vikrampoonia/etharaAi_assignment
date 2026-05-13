import jwt from "jsonwebtoken";

import { User } from "../modals/index.js";


const verifyJWT = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader ||
            !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

export default verifyJWT;