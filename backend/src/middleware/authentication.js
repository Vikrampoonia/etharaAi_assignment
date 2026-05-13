import messages from "../constant/message.js";
import tokenUtils from "../utils/tokenUtils.js";
// import redis from "../config/redis.js";


const authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = tokenUtils.extractBearerToken(authorizationHeader);

    // const isBlacklisted = await redis.get(`blacklist:${token}`);
    // if (isBlacklisted) {
    //     return res.status(401).json({
    //         message: messages.sessionEnded
    //     });
    // }

    const decoded = tokenUtils.verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    const status = error?.message === messages.jwtSecretNotConfigured ? 500 : 401;

    return res.status(status).send({
      status,
      message: error?.message || messages.invalidOrExpiredToken
    });
  }
};

export default authMiddleware;