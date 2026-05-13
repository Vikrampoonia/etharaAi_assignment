import messages from "../constant/message.js";

const authorizationMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).send({
                status: 401,
                message: messages.unauthorized,
            });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).send({
                status: 403,
                message: messages.forbidden,
            });
        }

        next();
    };
};

export default authorizationMiddleware;
