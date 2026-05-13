import {
    Task,
    User,
    ProjectMember,
    Project
} from "../modals/index.js";
import { Op } from "sequelize";





class TaskService {





    async createTask({
        projectId,
        taskData,
        createdBy
    }) {

        const {
            title,
            description,
            dueDate,
            priority,
            assignedTo
        } = taskData;





        const task = await Task.create({

            title,

            description,

            dueDate,

            priority,

            assignedTo,

            createdBy,

            projectId
        });





        return task;
    }






    async getTasks(projectId, options = {}) {

        const page = parseInt(options.page, 10) || 1;
        const limit = parseInt(options.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const where = { projectId };

        if (options.status) {
            where.status = options.status;
        }

        if (options.priority) {
            where.priority = options.priority;
        }

        if (options.assignedTo) {
            where.assignedTo = options.assignedTo;
        }

        if (options.title) {
            where.title = { [Op.iLike]: `%${options.title}%` };
        }

        const result = await Task.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: "assignee",
                    attributes: ["id", "name", "email"]
                }
            ],
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        });

        const tasks = result.rows;
        const total = result.count || 0;
        const totalPages = Math.max(1, Math.ceil(total / limit));

        return {
            tasks,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }






    async getSingleTask(taskId) {

        const task = await Task.findByPk(taskId, {

            include: [
                {
                    model: User,
                    as: "assignee",
                    attributes: [
                        "id",
                        "name",
                        "email"
                    ]
                }
            ]
        });

        if (!task) {
            throw new Error("Task not found");
        }

        return task;
    }






    async updateTask({
        taskId,
        user,
        updateData
    }) {

        const task =
            await Task.findByPk(taskId);

        if (!task) {
            throw new Error("Task not found");
        }






        const membership =
            await ProjectMember.findOne({

                where: {
                    projectId: task.projectId,
                    userId: user.id
                }
            });

        if (!membership) {
            throw new Error("Access denied");
        }






        /*
        |--------------------------------------------------------------------------
        | MEMBER ACCESS
        |--------------------------------------------------------------------------
        */

        if (membership.role === "MEMBER") {

            if (task.assignedTo !== user.id) {
                throw new Error(
                    "You can update only your tasks"
                );
            }

            /*
            |--------------------------------------------------------------------------
            | MEMBERS CAN ONLY UPDATE STATUS
            |--------------------------------------------------------------------------
            */

            task.status = updateData.status;

            await task.save();

            return task;
        }






        /*
        |--------------------------------------------------------------------------
        | ADMIN ACCESS
        |--------------------------------------------------------------------------
        */

        // If reassignment is requested, ensure the new assignee is a member of the project
        if (updateData.hasOwnProperty("assignedTo")) {
            const newAssigneeId = updateData.assignedTo;

            if (!newAssigneeId) {
                throw new Error("Assigned user is required");
            }

            const assigneeMembership = await ProjectMember.findOne({
                where: {
                    projectId: task.projectId,
                    userId: newAssigneeId
                }
            });

            if (!assigneeMembership) {
                throw new Error("Assignee must be a member of the project");
            }
        }

        await task.update(updateData);

        return task;
    }






    async deleteTask(taskId, user) {

        const task = await Task.findByPk(taskId);

        if (!task) {
            throw new Error("Task not found");
        }

        const project = await Project.findByPk(task.projectId);

        const membership = await ProjectMember.findOne({
            where: {
                projectId: task.projectId,
                userId: user.id
            }
        });

        const isProjectCreator = project && project.createdBy === user.id;

        if (!(membership && membership.role === "ADMIN") && !isProjectCreator) {
            throw new Error("Access denied");
        }

        await task.destroy();

        return true;
    }
}

export default new TaskService;