import express from "express";
import ProjectController from "../controller/project.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import isProjectAdmin from "../middleware/projectAdmin.middleware.js";

const router = express.Router();

router.post(
    "/:projectId/members",
    verifyJWT,
    isProjectAdmin,
    ProjectController.addMember
);

router.delete(
    "/:projectId/members/:memberId",
    verifyJWT,
    isProjectAdmin,
    ProjectController.removeMember
);

router.get(
    "/:projectId/members",
    verifyJWT,
    ProjectController.getMembers
);

router.post(
    "/",
    verifyJWT,
    ProjectController.createProject
);


router.get(
    "/",
    verifyJWT,
    ProjectController.getProjects
);


router.get(
    "/:projectId",
    verifyJWT,
    ProjectController.getSingleProject
);


router.put(
    "/:projectId",
    verifyJWT,
    isProjectAdmin,
    ProjectController.updateProject
);


router.delete(
    "/:projectId",
    verifyJWT,
    isProjectAdmin,
    ProjectController.deleteProject
);

export default router;