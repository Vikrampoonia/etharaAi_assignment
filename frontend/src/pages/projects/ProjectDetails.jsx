import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { projectService } from "../../services/project.service";
import { taskService } from "../../services/task.service";
import AddMemberModal from "./AddMemberModal";
import MainLayout
  from "../../components/layout/MainLayout";

import CreateTaskModal
  from "./CreateTaskModal";

const MEMBER_PAGE_SIZE = 5;

const ProjectDetails = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [showTaskModal, setShowTaskModal] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] =
    useState(false);
  const [showMemberModal, setShowMemberModal] =
    useState(false);
  const [memberActionMessage, setMemberActionMessage] =
    useState("");
  const [activeSection, setActiveSection] =
    useState("members");
  const [memberPage, setMemberPage] =
    useState(1);
  const [memberPagination, setMemberPagination] =
    useState({
      page: 1,
      limit: MEMBER_PAGE_SIZE,
      total: 0,
      totalPages: 1
    });
  const [isMemberAdmin, setIsMemberAdmin] =
    useState(false);

  const fetchProjectAndTasks = useCallback(async () => {
    try {
      setLoading(true);

      const [
        projectResponse,
        taskResponse
      ] = await Promise.all([
        projectService.getProjectById(id),
        taskService.getTasks(id)
      ]);

      const project =
        projectResponse?.data ||
        projectResponse?.project ||
        null;

      const tasks =
        taskResponse?.data ||
        taskResponse?.tasks ||
        [];

      setProject(project);
      setTasks(Array.isArray(tasks) ? tasks : []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchMembers = useCallback(
    async (targetPage = memberPage) => {
      try {
        setMembersLoading(true);

        const membersResponse =
          await projectService.getMembers(
            id,
            {
              page: targetPage,
              limit: MEMBER_PAGE_SIZE
            }
          );

        const memberData = membersResponse?.data || {};

        const rawMembers =
          memberData?.members ||
          membersResponse?.members ||
          [];

        const normalizedMembers = Array.isArray(rawMembers)
          ? rawMembers.map((member) => ({
            ...member,
            user: member.user || member.User || null
          }))
          : [];

        const pagination =
          memberData?.pagination || {
            page: targetPage,
            limit: MEMBER_PAGE_SIZE,
            total: normalizedMembers.length,
            totalPages: 1
          };

        setMembers(normalizedMembers);
        setMemberPagination({
          page: pagination.page || targetPage,
          limit: pagination.limit || MEMBER_PAGE_SIZE,
          total: pagination.total || 0,
          totalPages: pagination.totalPages || 1
        });

        setIsMemberAdmin(
          !!memberData?.isCurrentUserAdmin
        );

        return {
          totalPages: pagination.totalPages || 1,
          page: pagination.page || targetPage,
          count: normalizedMembers.length
        };
      } catch (error) {
        console.error(error);
        return {
          totalPages: 1,
          page: targetPage,
          count: 0
        };
      } finally {
        setMembersLoading(false);
      }
    },
    [id, memberPage]
  );

  useEffect(() => {
    setMemberPage(1);
    fetchProjectAndTasks();
  }, [id, fetchProjectAndTasks]);

  useEffect(() => {
    fetchMembers(memberPage);
  }, [memberPage, fetchMembers]);

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

      const result = await fetchMembers(memberPage);

      if (
        result.count === 0 &&
        memberPage > 1
      ) {
        setMemberPage((prev) => prev - 1);
      }

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
    setMemberPage(1);
    await fetchMembers(1);
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

      fetchProjectAndTasks();

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

      fetchProjectAndTasks();

    } catch (error) {
      console.error(error);
    }
  }

  const isProjectAdmin =
    isMemberAdmin ||
    project?.createdBy === currentUser?.id;

  return (
    <MainLayout>
      <div className="project-details-page">

        {/* Project Header */}

        <div className="project-header">

          <div>
            <div className="project-top-nav">
              <button
                className={`project-top-nav-btn ${activeSection === "members"
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  setActiveSection("members")
                }
              >
                Members
              </button>

              <button
                className={`project-top-nav-btn ${activeSection === "tasks"
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  setActiveSection("tasks")
                }
              >
                Tasks
              </button>
            </div>

            <h1>{project.name}</h1>

            <p>
              {project.description ||
                "No description"}
            </p>
          </div>

        </div>

        {/* Members Section */}

        {activeSection === "members" && (
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

            <div className="members-table-wrap">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    {isProjectAdmin && (
                      <th>Actions</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {membersLoading ? (
                    <tr>
                      <td
                        className="members-empty"
                        colSpan={
                          isProjectAdmin
                            ? 4
                            : 3
                        }
                      >
                        Loading members...
                      </td>
                    </tr>
                  ) : members.length > 0 ? (
                    members.map((member) => (
                      <tr key={member.id}>
                        <td>{member.user?.name || member.User?.name || "-"}</td>
                        <td>{member.user?.email || member.User?.email || "-"}</td>
                        <td>
                          <span className="role-badge member-role-badge">
                            {member.role}
                          </span>
                        </td>
                        {isProjectAdmin && (
                          <td>
                            <button
                              className="delete-btn member-remove-btn"
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
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="members-empty"
                        colSpan={
                          isProjectAdmin
                            ? 4
                            : 3
                        }
                      >
                        No members found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="members-pagination">
                <button
                  className="delete-btn members-page-btn"
                  onClick={() =>
                    setMemberPage((prev) =>
                      Math.max(1, prev - 1)
                    )
                  }
                  disabled={memberPagination.page <= 1 || membersLoading}
                >
                  Previous
                </button>

                <span className="members-page-info">
                  Page {memberPagination.page} of {memberPagination.totalPages}
                </span>

                <button
                  className="delete-btn members-page-btn"
                  onClick={() =>
                    setMemberPage((prev) =>
                      Math.min(
                        memberPagination.totalPages,
                        prev + 1
                      )
                    )
                  }
                  disabled={
                    memberPagination.page >= memberPagination.totalPages ||
                    membersLoading
                  }
                >
                  Next
                </button>
              </div>
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
        )}

        {/* Tasks Section */}

        {activeSection === "tasks" && (
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
                  members={members || []}
                  onClose={() =>
                    setShowTaskModal(false)
                  }
                  onTaskCreated={
                    fetchProjectAndTasks
                  }
                />
              )}

            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default ProjectDetails;