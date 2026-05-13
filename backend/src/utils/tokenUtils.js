import jwt from 'jsonwebtoken';
import messages from '../constant/message.js';

class TokenUtils {
    getJwtSecret() {
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error(messages.jwtSecretNotConfigured);
        }

        return jwtSecret;
    }

    createAccessToken(payload, options = { expiresIn: '24h' }) {
        return jwt.sign(payload, this.getJwtSecret(), options);
    }

    verifyAccessToken(token) {
        return jwt.verify(token, this.getJwtSecret());
    }

    decodeToken(token) {
        return jwt.decode(token);
    }

    extractBearerToken(authorizationHeader) {
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new Error(messages.authorizationTokenRequired);
        }

        return authorizationHeader.slice(7).trim();
    }
}

export default new TokenUtils();
