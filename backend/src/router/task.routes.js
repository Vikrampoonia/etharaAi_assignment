import express from "express";

import TaskController
from "../controllers/task.controller.js";

import verifyJWT
from "../middleware/auth.middleware.js";

import isProjectAdmin
from "../middleware/projectAdmin.middleware.js";

const router = express.Router();





router.post(
    "/projects/:projectId/tasks",
    verifyJWT,
    isProjectAdmin,
    TaskController.createTask
);





router.get(
    "/projects/:projectId/tasks",
    verifyJWT,
    TaskController.getTasks
);





router.get(
    "/tasks/:taskId",
    verifyJWT,
    TaskController.getSingleTask
);





router.put(
    "/tasks/:taskId",
    verifyJWT,
    TaskController.updateTask
);





router.delete(
    "/tasks/:taskId",
    verifyJWT,
    TaskController.deleteTask
);





export default router;