import bcrypt from 'bcryptjs';

class PasswordUtils {
    async hashPassword(password, saltRounds = 10) {
        return bcrypt.hash(password, saltRounds);
    }

    async comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

export default new PasswordUtils();
