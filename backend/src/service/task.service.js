import {
    Task,
    User,
    ProjectMember
} from "../models/index.js";





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






    async getTasks(projectId) {

        const tasks = await Task.findAll({

            where: { projectId },

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

        return tasks;
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

        await task.update(updateData);

        return task;
    }






    async deleteTask(taskId) {

        const task =
            await Task.findByPk(taskId);

        if (!task) {
            throw new Error("Task not found");
        }

        await task.destroy();

        return true;
    }
}

export default TaskService;