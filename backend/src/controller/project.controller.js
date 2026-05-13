import ProjectService from "../service/project.service.js";

import ResponseHandler from "../utils/response.js";

import {
    validateProject
} from "../validation/project.validation.js";


class ProjectController {

    async createProject(req, res) {

        try {

            const { name, description } = req.body;

            const validationError =
                validateProject({ name });

            if (validationError) {

                return ResponseHandler.error(
                    res,
                    validationError,
                    400
                );
            }

            const data =
                await ProjectService.createProject({

                    name,
                    description,

                    createdBy: req.user.id
                });

            return ResponseHandler.success(
                res,
                "Project created successfully",
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


    async getProjects(req, res) {

        try {

            const data =
                await ProjectService.getProjects(
                    req.user.id
                );

            return ResponseHandler.success(
                res,
                "Projects fetched successfully",
                data
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message
            );
        }
    }


    async getSingleProject(req, res) {

        try {

            const { projectId } = req.params;

            const data =
                await ProjectService.getSingleProject(
                    projectId
                );

            return ResponseHandler.success(
                res,
                "Project fetched successfully",
                data
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message
            );
        }
    }


    async updateProject(req, res) {

        try {

            const { projectId } = req.params;

            const data =
                await ProjectService.updateProject({

                    projectId,

                    updateData: req.body
                });

            return ResponseHandler.success(
                res,
                "Project updated successfully",
                data
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message
            );
        }
    }


    async deleteProject(req, res) {

        try {

            const { projectId } = req.params;

            await ProjectService.deleteProject(
                projectId
            );

            return ResponseHandler.success(
                res,
                "Project deleted successfully"
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message
            );
        }
    }

    async addMember(req, res) {

        try {

            const { projectId } = req.params;

            const { email } = req.body;

            const data = await ProjectService.addMember({
                projectId,
                email
            });

            return ResponseHandler.success(
                res,
                "Member added successfully",
                data
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message
            );
        }
    }


    async removeMember(req, res) {

        try {

            const { projectId, memberId } = req.params;

            await ProjectService.removeMember({
                projectId,
                memberId
            });

            return ResponseHandler.success(
                res,
                "Member removed successfully"
            );

        } catch (error) {

            return ResponseHandler.error(
                res,
                error.message
            );
        }
    }


    async getMembers(req, res) {

        try {

            const { projectId } = req.params;

            const data = await ProjectService.getMembers(
                projectId
            );

            return ResponseHandler.success(
                res,
                "Members fetched successfully",
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

export default new ProjectController;

