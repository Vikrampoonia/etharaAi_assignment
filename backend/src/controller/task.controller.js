import TaskService from "../service/task.service.js";
import ResponseHandler from "../utils/response.js";
import {
    validateTask
} from "../validation/task.validation.js";



class TaskController {


    async createTask(req, res) {

        try {

            const { projectId } = req.params;

            const validationError =
                validateTask(req.body);

            if (validationError) {

                return ResponseHandler.error(
                    res,
                    validationError,
                    400
                );
            }

            const data =
                await TaskService.createTask({

                    projectId,

                    taskData: req.body,

                    createdBy: req.user.id
                });

            return ResponseHandler.success(
                res,
                "Task created successfully",
                data,
                201
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message
            );
        }
    }






    async getTasks(req, res) {

        try {

            const { projectId } = req.params;

            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;

            const filters = {
                status: req.query.status,
                priority: req.query.priority,
                assignedTo: req.query.assignedTo,
                title: req.query.title
            };

            const data = await TaskService.getTasks(projectId, {
                page,
                limit,
                ...filters
            });

            return ResponseHandler.success(
                res,
                "Tasks fetched successfully",
                data
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message
            );
        }
    }






    async getSingleTask(req, res) {

        try {

            const { taskId } = req.params;

            const data =
                await TaskService.getSingleTask(
                    taskId
                );

            return ResponseHandler.success(
                res,
                "Task fetched successfully",
                data
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message
            );
        }
    }






    async updateTask(req, res) {

        try {

            const { taskId } = req.params;

            const data =
                await TaskService.updateTask({

                    taskId,

                    user: req.user,

                    updateData: req.body
                });

            return ResponseHandler.success(
                res,
                "Task updated successfully",
                data
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message
            );
        }
    }






    async deleteTask(req, res) {

        try {

            const { taskId } = req.params;

            await TaskService.deleteTask(taskId, req.user);

            return ResponseHandler.success(
                res,
                "Task deleted successfully"
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message
            );
        }
    }
}

export default new TaskController;