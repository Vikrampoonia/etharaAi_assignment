import { ProjectMember } from "../models/index.js";





const isProjectAdmin = async (req, res, next) => {

    try {

        const projectId = req.params.projectId;

        const membership = await ProjectMember.findOne({
            where: {
                projectId,
                userId: req.user.id
            }
        });

        if (!membership) {

            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        if (membership.role !== "ADMIN") {

            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default isProjectAdmin;