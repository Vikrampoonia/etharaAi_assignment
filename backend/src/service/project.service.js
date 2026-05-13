import {
    Project,
    ProjectMember,
    Task,
    User
} from "../modals/index.js";
import { Op } from "sequelize";


class ProjectService {

    async addMember({
        projectId,
        email
    }) {

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            throw new Error("User not found");
        }

        const existingMember =
            await ProjectMember.findOne({
                where: {
                    projectId,
                    userId: user.id
                }
            });

        if (existingMember) {
            throw new Error("User already member");
        }

        const member = await ProjectMember.create({
            projectId,
            userId: user.id,
            role: "MEMBER"
        });
        return member;
    }

    async removeMember({
        projectId,
        memberId
    }) {
        const member = await ProjectMember.findOne({
            where: {
                projectId,
                userId: memberId
            }
        });

        if (!member) {
            throw new Error("Member not found");
        }

        await member.destroy();
        return true;
    }

    async getMembers({
        projectId,
        page = 1,
        limit = 10,
        userId,
        search = "",
        role = ""
    }) {
        const offset = (page - 1) * limit;

        const memberWhere = { projectId };
        if (role) {
            memberWhere.role = role;
        }

        const includeUser = {
            model: User,
            attributes: [
                "id",
                "name",
                "email"
            ]
        };

        if (search && search.trim()) {
            const term = search.trim();
            includeUser.where = {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${term}%` } },
                    { email: { [Op.iLike]: `%${term}%` } }
                ]
            };
            includeUser.required = true;
        }

        const {
            rows,
            count
        } = await ProjectMember.findAndCountAll({
            where: memberWhere,
            include: [
                includeUser
            ],
            order: [["createdAt", "DESC"]],
            limit,
            offset
        });

        const currentUserMembership =
            userId
                ? await ProjectMember.findOne({
                    where: {
                        projectId,
                        userId
                    },
                    attributes: ["role"]
                })
                : null;

        const totalPages =
            count === 0
                ? 1
                : Math.ceil(count / limit);

        return {
            members: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages
            },
            isCurrentUserAdmin:
                currentUserMembership?.role === "ADMIN"
        };
    }

    async searchMembers({ projectId, q = "", limit = 10 }) {
        const whereClause = { projectId };

        const members = await ProjectMember.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"]
                }
            ],
            limit,
            order: [["createdAt", "DESC"]]
        });

        if (q && q.trim()) {
            const ql = q.toLowerCase();
            return members.filter((m) => {
                const name = (m.User?.name || "").toLowerCase();
                const email = (m.User?.email || "").toLowerCase();
                return name.includes(ql) || email.includes(ql);
            }).slice(0, limit);
        }

        return members;
    }


    async createProject({
        name,
        description,
        createdBy
    }) {

        const project = await Project.create({
            name,
            description,
            createdBy
        });

        await ProjectMember.create({

            projectId: project.id,

            userId: createdBy,

            role: "ADMIN"
        });

        return project;
    }


    async getProjects(userId) {
        const memberships = await ProjectMember.findAll({
            where: {
                userId
            },
            include: [
                {
                    model: Project
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        const projects = await Promise.all(
            memberships.map(async (membership) => {
                const project = membership.Project;

                if (!project) return null;

                const [membersCount, tasksCount] = await Promise.all([
                    ProjectMember.count({
                        where: {
                            projectId: project.id
                        }
                    }),
                    Task.count({
                        where: {
                            projectId: project.id
                        }
                    })
                ]);

                return {
                    ...project.toJSON(),
                    membersCount,
                    tasksCount,
                    role: membership.role,
                    isCurrentUserAdmin: membership.role === "ADMIN"
                };
            })
        );

        return projects.filter(Boolean);
    }

    async getSingleProject(projectId) {
        const project =
            await Project.findByPk(projectId);

        if (!project) {
            throw new Error("Project not found");
        }

        return project;
    }

    async updateProject({
        projectId,
        updateData
    }) {

        const project =
            await Project.findByPk(projectId);

        if (!project) {
            throw new Error("Project not found");
        }

        await project.update(updateData);

        return project;
    }


    async deleteProject(projectId, userId) {
        const project = await Project.findByPk(projectId);

        if (!project) {
            throw new Error("Project not found");
        }

        const membership = await ProjectMember.findOne({
            where: {
                projectId,
                userId
            }
        });

        if (!membership || membership.role !== "ADMIN") {
            throw new Error("Only project admin can delete this project");
        }

        await project.destroy();

        return true;
    }

}

export default new ProjectService;
