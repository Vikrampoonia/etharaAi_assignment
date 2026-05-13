import User from "./user.model.js";
import Project from "./project.model.js";
import Task from "./task.model.js";
import ProjectMember from "./projectMember.model.js";

/*
|--------------------------------------------------------------------------
| USER <-> PROJECT
|--------------------------------------------------------------------------
*/

User.belongsToMany(Project, {
  through: ProjectMember,
  foreignKey: "userId"
});

Project.belongsToMany(User, {
  through: ProjectMember,
  foreignKey: "projectId"
});

ProjectMember.belongsTo(User, {
    foreignKey: "userId"
});

User.hasMany(ProjectMember, {
    foreignKey: "userId"
});

ProjectMember.belongsTo(Project, {
    foreignKey: "projectId"
});

Project.hasMany(ProjectMember, {
    foreignKey: "projectId"
});

/*
|--------------------------------------------------------------------------
| PROJECT -> TASK
|--------------------------------------------------------------------------
*/

Project.hasMany(Task, {
  foreignKey: "projectId",
  onDelete: "CASCADE"
});

Task.belongsTo(Project, {
  foreignKey: "projectId"
});



/*
|--------------------------------------------------------------------------
| USER -> TASK
|--------------------------------------------------------------------------
*/

User.hasMany(Task, {
  foreignKey: "assignedTo"
});

Task.belongsTo(User, {
  foreignKey: "assignedTo",
  as: "assignee"
});


export {
  User,
  Project,
  Task,
  ProjectMember
};