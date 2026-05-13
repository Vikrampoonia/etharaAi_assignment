import DashboardService from "../service/dashboard.service.js";

import ResponseHandler from "../utils/response.js";





class DashboardController {





    async getSummary(req, res) {

        try {

            const data =
                await DashboardService.getSummary(
                    req.user.id
                );

            return ResponseHandler.success(
                res,
                "Dashboard summary fetched",
                data
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message
            );
        }
    }






    async getTasksPerUser(req, res) {

        try {

            const data =
                await DashboardService.getTasksPerUser(
                    req.user.id
                );

            return ResponseHandler.success(
                res,
                "Tasks per user fetched",
                data
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message
            );
        }
    }






    async getOverdueTasks(req, res) {

        try {

            const page = Number.parseInt(req.query.page, 10) || 1;
            const limit = Number.parseInt(req.query.limit, 10) || 5;

            const data =
                await DashboardService.getOverdueTasks(
                    req.user.id,
                    {
                        page: Math.max(1, page),
                        limit: Math.max(1, limit),
                        status: req.query.status || "",
                        priority: req.query.priority || "",
                        assignee: req.query.assignee || "",
                        title: req.query.title || "",
                        endDate: req.query.endDate || ""
                    }
                );

            return ResponseHandler.success(
                res,
                "Overdue tasks fetched",
                data
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message
            );
        }
    }
}

export default new DashboardController;