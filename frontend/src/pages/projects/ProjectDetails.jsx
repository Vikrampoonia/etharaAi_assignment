import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { projectService } from "../../services/project.service";
import { taskService } from "../../services/task.service";
import AddMemberModal from "./AddMemberModal";
import MainLayout
from "../../components/layout/MainLayout";

import CreateTaskModal
  from "./CreateTaskModal";

const ProjectDetails = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [showMemberModal, setShowMemberModal] =
    useState(false);
  const [memberActionMessage, setMemberActionMessage] =
    useState("");

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  async function fetchProjectDetails() {
    try {
      setLoading(true);

      const [
        projectResponse,
        taskResponse,
        membersResponse
      ] = await Promise.all([
        projectService.getProjectById(id),
        taskService.getTasks(id),
        projectService.getMembers(id)
      ]);

      const project =
        projectResponse?.data ||
        projectResponse?.project ||
        null;

      const tasks =
        taskResponse?.data ||
        taskResponse?.tasks ||
        [];

      const members =
        membersResponse?.data ||
        membersResponse?.members ||
        [];

      const normalizedMembers = Array.isArray(members)
        ? members.map((member) => ({
          ...member,
          user: member.user || member.User || null
        }))
        : [];

      setProject(
        project
          ? {
            ...project,
            members: normalizedMembers
          }
          : null
      );
      setTasks(Array.isArray(tasks) ? tasks : []);

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

      const response = await projectService.removeMember(
        id,
        memberId
      );

      await fetchProjectDetails();

      setMemberActionMessage(
        response?.message || "Member removed successfully"
      );

      setTimeout(() => {
        setMemberActionMessage("");
      }, 2500);

    } catch (error) {
      console.error(error);
    }
  }

  async function handleMemberAdded(message) {
    await fetchProjectDetails();
    setShowMemberModal(false);
    setMemberActionMessage(
      message || "Member added successfully"
    );

    setTimeout(() => {
      setMemberActionMessage("");
    }, 2500);
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

  const isProjectAdmin =
    !!project?.members?.find(
      (member) =>
        (member.userId || member.user?.id || member.User?.id) ===
        currentUser?.id &&
        member.role === "ADMIN"
    );

  return (
     <MainLayout>
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

          {isProjectAdmin && (
            <button
              className="create-btn"
              onClick={() =>
                setShowMemberModal(true)
              }
            >
              + Add Member
            </button>
          )}
        </div>

        {memberActionMessage && (
          <div
            style={{
              marginBottom: "14px",
              background: "#ecfdf3",
              color: "#166534",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              padding: "10px 12px",
              fontWeight: 600
            }}
          >
            {memberActionMessage}
          </div>
        )}

        <div className="members-list">

          {project.members?.length > 0 ? (
            project.members.map((member) => (
              <div
                key={member.id}
                className="member-card"
              >
                <div>
                  <h4>{member.user?.name || member.User?.name}</h4>

                  <p>{member.user?.email || member.User?.email}</p>
                </div>

                <span className="role-badge">
                  {member.role}
                </span>
                {isProjectAdmin && (
                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleRemoveMember(
                        member.userId ||
                        member.user?.id ||
                        member.User?.id ||
                        member.id
                      )
                    }
                  >
                    Remove
                  </button>
                )}
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
            onMemberAdded={handleMemberAdded}
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
    </MainLayout>
  );
};

export default ProjectDetails;