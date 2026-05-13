import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import { generateToken } from "../utils/jwt.js";

class AuthService {

    async signup({ name, email, password }) {

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = generateToken({
            id: user.id,
            email: user.email
        });

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    }

    async login({ email, password }) {

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = generateToken({
            id: user.id,
            email: user.email
        });

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    }
}

export default AuthService;