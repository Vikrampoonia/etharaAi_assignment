import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { projectService } from "../../services/project.service";
import { taskService } from "../../services/task.service";
import AddMemberModal from "./AddMemberModal";
import CreateTaskModal
from "./CreateTaskModal";

const ProjectDetails = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] =
  useState(false);

  const [loading, setLoading] = useState(true);
  const [showMemberModal, setShowMemberModal] =
  useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  async function fetchProjectDetails() {
    try {
      setLoading(true);

      const projectData =
        await projectService.getProjectById(id);

      const taskData =
        await taskService.getTasks(id);

      setProject(projectData.project);
      setTasks(taskData.tasks || []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page-loader">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="empty-state">
        Project not found
      </div>
    );
  }
  async function handleRemoveMember(
  memberId
) {
  try {

    await projectService.removeMember(
      id,
      memberId
    );

    fetchProjectDetails();

  } catch (error) {
    console.error(error);
  }
}

async function handleDeleteTask(
  taskId
) {
  try {

    await taskService.deleteTask(
      taskId
    );

    fetchProjectDetails();

  } catch (error) {
    console.error(error);
  }
}

async function handleStatusChange(
  taskId,
  status
) {
  try {

    await taskService.updateTask(
      taskId,
      { status }
    );

    fetchProjectDetails();

  } catch (error) {
    console.error(error);
  }
}

  return (
    <div className="project-details-page">

      {/* Project Header */}

      <div className="project-header">

        <div>
          <h1>{project.name}</h1>

          <p>
            {project.description ||
              "No description"}
          </p>
        </div>

      </div>

      {/* Members Section */}

      <div className="project-section">

        <div className="section-header">
          <h2>Members</h2>

          <button
  className="create-btn"
  onClick={() =>
    setShowMemberModal(true)
  }
>
  + Add Member
</button>
        </div>

        <div className="members-list">

          {project.members?.length > 0 ? (
            project.members.map((member) => (
              <div
                key={member.id}
                className="member-card"
              >
                <div>
                  <h4>{member.user?.name}</h4>

                  <p>{member.user?.email}</p>
                </div>

                <span className="role-badge">
                  {member.role}
                </span>
                <button
  className="delete-btn"
  onClick={() =>
    handleRemoveMember(member.id)
  }
>
  Remove
</button>
              </div>
            ))
          ) : (
            <p>No members found</p>
          )}

        </div>

        {showMemberModal && (
  <AddMemberModal
    projectId={id}
    onClose={() =>
      setShowMemberModal(false)
    }
    onMemberAdded={
      fetchProjectDetails
    }
  />
)}
      </div>

      {/* Tasks Section */}

      <div className="project-section">

        <div className="section-header">
          <h2>Tasks</h2>

          <button
            className="create-btn"
            onClick={() =>
                setShowTaskModal(true)
            }
            >
            + Create Task
        </button>
        </div>

        <div className="tasks-list">

          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="task-card"
              >
                <div>
                  <h3>{task.title}</h3>

                  <p>
                    {task.description ||
                      "No description"}
                  </p>
                </div>

                <div className="task-meta">

                  <span className="priority-badge">
                    {task.priority}
                  </span>

                  <span className="status-badge">
                    {task.status}
                  </span>
                        <button
                        className="delete-btn"
                        onClick={() =>
                            handleDeleteTask(task.id)
                        }
                        >
                        Delete
                        </button>
                        <select
  value={task.status}
  onChange={(e) =>
    handleStatusChange(
      task.id,
      e.target.value
    )
  }
>

  <option value="TODO">
    TODO
  </option>

  <option value="IN_PROGRESS">
    IN_PROGRESS
  </option>

  <option value="DONE">
    DONE
  </option>

</select>
                </div>
              </div>
            ))
          ) : (
            <p>No tasks found</p>
          )}

          {showTaskModal && (
  <CreateTaskModal
    projectId={id}
    members={project.members || []}
    onClose={() =>
      setShowTaskModal(false)
    }
    onTaskCreated={
      fetchProjectDetails
    }
  />
)}

        </div>
      </div>

    </div>
  );
};

export default ProjectDetails;