import { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { projectService, searchMembers } from "../../services/project.service";
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
  const [taskPage, setTaskPage] = useState(1);
  const TASK_PAGE_SIZE = 5;
  const [taskPagination, setTaskPagination] = useState({
    page: 1,
    limit: TASK_PAGE_SIZE,
    total: 0,
    totalPages: 1
  });
  const [reassignSelection, setReassignSelection] = useState({});
  const [reassignSuggestions, setReassignSuggestions] = useState({});
  const reassignTimersRef = useRef({});
  const [reassignQueries, setReassignQueries] = useState({});
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
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

      const [projectResponse, taskResponse] = await Promise.all([
        projectService.getProjectById(id),
        taskService.getTasks(id, {
          page: taskPage,
          limit: TASK_PAGE_SIZE,
          status: filterStatus || undefined,
          priority: filterPriority || undefined,
          assignedTo: filterAssignee || undefined,
          title: filterTitle || undefined
        })
      ]);

      const project = projectResponse?.data || projectResponse?.project || null;

      const taskData = taskResponse?.data || taskResponse || {};

      const rawTasks = taskData?.tasks || taskData?.rows || taskData || [];

      const normalizedTasks = Array.isArray(rawTasks) ? rawTasks : [];

      const pagination = taskData?.pagination || { page: taskPage, limit: TASK_PAGE_SIZE, total: normalizedTasks.length, totalPages: 1 };

      setProject(project);
      setTasks(normalizedTasks);
      setTaskPagination({
        page: pagination.page || taskPage,
        limit: pagination.limit || TASK_PAGE_SIZE,
        total: pagination.total || 0,
        totalPages: pagination.totalPages || 1
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, taskPage, filterStatus, filterPriority, filterAssignee, filterTitle]);

  useEffect(() => {
    // refresh tasks when page changes
    fetchProjectAndTasks();
  }, [taskPage, fetchProjectAndTasks]);

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

      // if deleting last item on page, move back a page
      await fetchProjectAndTasks();
      if (tasks.length === 1 && taskPage > 1) {
        setTaskPage((p) => p - 1);
      }

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

  async function handleReassignTask(taskId, assignedTo) {
    // optimistic update: set local task assignee then call API
    const prevTasks = tasks;
    try {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, assignedTo, assignee: members.find(m => (m.user?.id || m.User?.id || m.userId || m.id) === assignedTo)?.user || members.find(m => (m.user?.id || m.User?.id || m.userId || m.id) === assignedTo)?.User || null } : t))
      );

      await taskService.updateTask(taskId, { assignedTo });
      // refresh to ensure server state
      fetchProjectAndTasks();
    } catch (error) {
      console.error(error);
      // revert
      setTasks(prevTasks);
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

              <div className="tasks-filters" style={{ margin: "12px 0", display: "flex", gap: "8px", alignItems: "center", background: "#fff", padding: "8px", borderRadius: 8, border: "1px solid #e6e6e6" }}>
                <input
                  type="text"
                  placeholder="Search task name"
                  value={filterTitle}
                  onChange={(e) => { setFilterTitle(e.target.value); setTaskPage(1); }}
                  style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", minWidth: 220 }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    list="assignees-list"
                    placeholder="Search assignee"
                    value={members.find(m => (m.user?.id || m.User?.id || m.userId || m.id) === filterAssignee)?.user?.name || members.find(m => (m.user?.id || m.User?.id || m.userId || m.id) === filterAssignee)?.User?.name || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const found = members.find(m => (m.user?.name || m.User?.name) === val || (m.user?.email || m.User?.email) === val);
                      if (found) {
                        const uid = found.user?.id || found.User?.id || found.userId || found.id;
                        setFilterAssignee(uid);
                      } else if (val === "") {
                        setFilterAssignee("");
                      } else {
                        setFilterAssignee("");
                      }
                      setTaskPage(1);
                    }}
                    style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", minWidth: 180 }}
                  />
                  <datalist id="assignees-list">
                    {members.map((m) => {
                      const uid = m.user?.id || m.User?.id || m.userId || m.id;
                      const name = m.user?.name || m.User?.name || m.user?.email || m.User?.email || uid;
                      return <option key={uid} value={name} />;
                    })}
                  </datalist>
                </div>

                <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setTaskPage(1); }} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", minWidth: 140 }}>
                  <option value="">All Statuses</option>
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>

                <select value={filterPriority} onChange={(e) => { setFilterPriority(e.target.value); setTaskPage(1); }} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", minWidth: 140 }}>
                  <option value="">All Priorities</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>

                <button onClick={() => { setFilterAssignee(""); setFilterPriority(""); setFilterStatus(""); setFilterTitle(""); setTaskPage(1); }} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", marginLeft: 6 }}>Clear</button>
              </div>

              {tasks.length > 0 ? (
                <div className="members-table-wrap">
                  <table className="members-table tasks-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Assignee</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id}>
                          <td>{task.title || "-"}</td>
                          <td className="task-desc-cell">{task.description || "-"}</td>
                          <td>
                            <span className="priority-badge">{task.priority}</span>
                          </td>
                          <td>{task.assignee?.name || task.assignee?.email || "-"}</td>
                          <td>
                            <span className="status-badge">{task.status}</span>
                          </td>
                          <td>
                            {isProjectAdmin ? (
                              <>
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                  <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteTask(task.id)}
                                  >
                                    Delete
                                  </button>

                                  <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    style={{ marginLeft: "8px" }}
                                  >
                                    <option value="TODO">TODO</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                    <option value="DONE">DONE</option>
                                  </select>

                                  <div style={{ position: 'relative' }}>
                                    <input
                                      type="text"
                                      placeholder="Type to search members"
                                      value={reassignQueries[task.id] ?? (reassignSelection[task.id] ? (members.find(m => (m.user?.id || m.User?.id || m.userId || m.id) === reassignSelection[task.id])?.user?.name || members.find(m => (m.user?.id || m.User?.id || m.userId || m.id) === reassignSelection[task.id])?.User?.name || '') : (task.assignee?.name || task.assignee?.email || ''))}
                                      onChange={(e) => {
                                        const q = e.target.value;
                                        setReassignQueries((prev) => ({ ...prev, [task.id]: q }));
                                        const timers = reassignTimersRef.current;
                                        if (timers[task.id]) clearTimeout(timers[task.id]);
                                        timers[task.id] = setTimeout(async () => {
                                          if (!q) {
                                            setReassignSuggestions((prev) => ({ ...prev, [task.id]: [] }));
                                            return;
                                          }
                                          try {
                                            const res = await searchMembers(id, q, 10);
                                            const data = res?.members || res?.data?.members || [];
                                            const filtered = data.filter(m => {
                                              const uid = m.user?.id || m.User?.id || m.userId || m.id;
                                              const current = task.assignedTo || task.assignee?.id;
                                              return uid !== current;
                                            });
                                            setReassignSuggestions((prev) => ({ ...prev, [task.id]: filtered }));
                                          } catch (err) {
                                            console.error(err);
                                          }
                                        }, 300);
                                      }}
                                      onFocus={(e) => {
                                        (async () => {
                                          try {
                                            const res = await searchMembers(id, '', 10);
                                            const data = res?.members || res?.data?.members || [];
                                            const filtered = data.filter(m => {
                                              const uid = m.user?.id || m.User?.id || m.userId || m.id;
                                              const current = task.assignedTo || task.assignee?.id;
                                              return uid !== current;
                                            });
                                            setReassignSuggestions((prev) => ({ ...prev, [task.id]: filtered }));
                                          } catch (err) {
                                            console.error(err);
                                          }
                                        })();
                                      }}
                                      style={{ marginLeft: "8px", padding: '6px 8px', minWidth: 160 }}
                                    />

                                    {reassignSuggestions[task.id] && reassignSuggestions[task.id].length > 0 && (
                                      <ul style={{ position: 'absolute', zIndex: 50, background: '#fff', border: '1px solid #ddd', marginTop: 4, listStyle: 'none', padding: 6, width: 300, maxHeight: 220, overflowY: 'auto' }}>
                                        {reassignSuggestions[task.id].slice(0, 10).map((m) => {
                                          const uid = m.user?.id || m.User?.id || m.userId || m.id;
                                          const name = m.user?.name || m.User?.name || m.user?.email || m.User?.email || uid;
                                          return (
                                            <li key={uid} style={{ padding: '6px 8px', cursor: 'pointer' }} onClick={() => { setReassignSelection((prev) => ({ ...prev, [task.id]: uid })); setReassignQueries((prev) => ({ ...prev, [task.id]: name })); setReassignSuggestions((prev) => ({ ...prev, [task.id]: [] })); handleReassignTask(task.id, uid); }}>
                                              {name}
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : (
                              // normal member: allow status change only for tasks assigned to them
                              ((task.assignedTo || task.assignee?.id) === currentUser?.id) ? (
                                <select
                                  value={task.status}
                                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                >
                                  <option value="TODO">TODO</option>
                                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                                  <option value="DONE">DONE</option>
                                </select>
                              ) : (
                                <span className="status-badge">{task.status}</span>
                              )
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No tasks found</p>
              )}

              <div className="members-pagination tasks-pagination">
                <button
                  className="delete-btn members-page-btn"
                  onClick={() => setTaskPage((prev) => Math.max(1, prev - 1))}
                  disabled={taskPagination.page <= 1}
                >
                  Previous
                </button>

                <span className="members-page-info">
                  Page {taskPagination.page} of {taskPagination.totalPages}
                </span>

                <button
                  className="delete-btn members-page-btn"
                  onClick={() => setTaskPage((prev) => Math.min(taskPagination.totalPages, prev + 1))}
                  disabled={taskPagination.page >= taskPagination.totalPages}
                >
                  Next
                </button>
              </div>

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