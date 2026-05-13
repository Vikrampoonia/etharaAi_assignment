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

            const data =
                await DashboardService.getOverdueTasks(
                    req.user.id
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