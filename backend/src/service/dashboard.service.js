import {
    Task,
    ProjectMember,
    User
} from "../modals/index.js";

import { Op } from "sequelize";

class DashboardService {
    buildDateRange(dateValue) {
        if (!dateValue) return null;

        const start = new Date(dateValue);
        if (Number.isNaN(start.getTime())) return null;

        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        return {
            [Op.gte]: start,
            [Op.lt]: end
        };
    }

    async getSummary(userId) {
        const memberships = await ProjectMember.findAll({
            where: { userId }
        });

        const projectIds = memberships.map((member) => member.projectId);

        const totalTasks = await Task.count({
            where: {
                projectId: projectIds
            }
        });

        const todo = await Task.count({
            where: {
                projectId: projectIds,
                status: "TODO"
            }
        });

        const inProgress = await Task.count({
            where: {
                projectId: projectIds,
                status: "IN_PROGRESS"
            }
        });

        const done = await Task.count({
            where: {
                projectId: projectIds,
                status: "DONE"
            }
        });

        const overdue = await Task.count({
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
        const memberships = await ProjectMember.findAll({
            where: { userId }
        });

        const projectIds = memberships.map((member) => member.projectId);

        const tasks = await Task.findAll({
            where: {
                projectId: projectIds
            },
            include: [
                {
                    model: User,
                    as: "assignee",
                    attributes: ["id", "name", "email"]
                }
            ]
        });

        const grouped = {};

        tasks.forEach((task) => {
            const user = task.assignee;
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

    async getOverdueTasks(userId, options = {}) {
        const {
            page = 1,
            limit = 5,
            status = "",
            priority = "",
            assignee = "",
            title = "",
            endDate = ""
        } = options;

        const memberships = await ProjectMember.findAll({
            where: { userId }
        });

        const projectIds = memberships.map((member) => member.projectId);

        const whereClause = {
            projectId: projectIds,
            dueDate: {
                [Op.lt]: new Date()
            },
            status: {
                [Op.ne]: "DONE"
            }
        };

        if (status) {
            whereClause.status = status;
        }

        if (priority) {
            whereClause.priority = priority;
        }

        if (title && title.trim()) {
            whereClause.title = {
                [Op.iLike]: `%${title.trim()}%`
            };
        }

        const dueDateRange = this.buildDateRange(endDate);
        if (dueDateRange) {
            whereClause.dueDate = dueDateRange;
        }

        const assigneeInclude = {
            model: User,
            as: "assignee",
            attributes: ["id", "name", "email"]
        };

        if (assignee && assignee.trim()) {
            const assigneeTerm = assignee.trim();
            assigneeInclude.where = {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${assigneeTerm}%` } },
                    { email: { [Op.iLike]: `%${assigneeTerm}%` } }
                ]
            };
            assigneeInclude.required = true;
        }

        const offset = (page - 1) * limit;

        const { rows, count } = await Task.findAndCountAll({
            where: whereClause,
            include: [assigneeInclude],
            order: [["dueDate", "ASC"]],
            limit,
            offset,
            distinct: true
        });

        const totalPages = count === 0 ? 1 : Math.ceil(count / limit);

        return {
            tasks: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages
            }
        };
    }
}

export default new DashboardService;
