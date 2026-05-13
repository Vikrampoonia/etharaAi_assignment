import {
    Task,
    ProjectMember,
    User
} from "../modals/index.js";

import { Op } from "sequelize";





class DashboardService {





    async getSummary(userId) {

        /*
        |--------------------------------------------------------------------------
        | GET USER PROJECTS
        |--------------------------------------------------------------------------
        */

        const memberships =
            await ProjectMember.findAll({

                where: { userId }
            });

        const projectIds =
            memberships.map(
                member => member.projectId
            );






        /*
        |--------------------------------------------------------------------------
        | TOTAL TASKS
        |--------------------------------------------------------------------------
        */

        const totalTasks =
            await Task.count({

                where: {
                    projectId: projectIds
                }
            });






        /*
        |--------------------------------------------------------------------------
        | TASK STATUS COUNTS
        |--------------------------------------------------------------------------
        */

        const todo =
            await Task.count({

                where: {
                    projectId: projectIds,
                    status: "TODO"
                }
            });





        const inProgress =
            await Task.count({

                where: {
                    projectId: projectIds,
                    status: "IN_PROGRESS"
                }
            });





        const done =
            await Task.count({

                where: {
                    projectId: projectIds,
                    status: "DONE"
                }
            });






        /*
        |--------------------------------------------------------------------------
        | OVERDUE TASKS
        |--------------------------------------------------------------------------
        */

        const overdue =
            await Task.count({

                where: {

                    projectId: projectIds,

                    dueDate: {
                        [Op.lt]: new Date()
                    },

                    status: {
                        [Op.ne]: "DONE"
                    }
                }
            });





        return {
            totalTasks,
            todo,
            inProgress,
            done,
            overdue
        };
    }






    async getTasksPerUser(userId) {

        const memberships =
            await ProjectMember.findAll({

                where: { userId }
            });

        const projectIds =
            memberships.map(
                member => member.projectId
            );






        const tasks =
            await Task.findAll({

                where: {
                    projectId: projectIds
                },

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






        /*
        |--------------------------------------------------------------------------
        | GROUP TASKS
        |--------------------------------------------------------------------------
        */

        const grouped = {};

        tasks.forEach(task => {

            const user =
                task.assignee;

            if (!user) return;

            if (!grouped[user.id]) {

                grouped[user.id] = {

                    userId: user.id,

                    name: user.name,

                    email: user.email,

                    totalTasks: 0
                };
            }

            grouped[user.id].totalTasks++;
        });





        return Object.values(grouped);
    }






    async getOverdueTasks(userId) {

        const memberships =
            await ProjectMember.findAll({

                where: { userId }
            });

        const projectIds =
            memberships.map(
                member => member.projectId
            );






        const overdueTasks =
            await Task.findAll({

                where: {

                    projectId: projectIds,

                    dueDate: {
                        [Op.lt]: new Date()
                    },

                    status: {
                        [Op.ne]: "DONE"
                    }
                },

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





        return overdueTasks;
    }
}

export default new DashboardService;