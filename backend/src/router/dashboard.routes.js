import express from "express";

import DashboardController
from "../controller/dashboard.controller.js";

import verifyJWT
from "../middleware/auth.middleware.js";

const router = express.Router();





router.get(
    "/summary",
    verifyJWT,
    DashboardController.getSummary
);





router.get(
    "/tasks-per-user",
    verifyJWT,
    DashboardController.getTasksPerUser
);





router.get(
    "/overdue",
    verifyJWT,
    DashboardController.getOverdueTasks
);





export default router;