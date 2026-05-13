import { useNavigate } from "react-router-dom";
import { projectService } from "../../services/project.service";

const ProjectCard = ({ project, canDelete = false, onDeleted }) => {
  const navigate = useNavigate();

  async function handleDeleteProject(event) {
    event.stopPropagation();

    const confirmed = window.confirm(
      `Delete project \"${project.name}\"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await projectService.deleteProject(project.id);

      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert(error.message || "Failed to delete project");
    }
  }

  return (
    <div className="project-card">
      <div className="project-card-accent" />

      <div className="project-card-content">
        <div className="project-card-head">
          <h3>{project.name}</h3>
          <span className="project-status-chip">Active</span>
        </div>

        <p className="project-description">
          {project.description || "No description"}
        </p>

        <div className="project-meta">
          <span className="meta-pill members-pill">
            👥 Members: {project.membersCount || 0}
          </span>

          <span className="meta-pill tasks-pill">
            ✅ Tasks: {project.tasksCount || 0}
          </span>
        </div>

        <p className="project-date">
          Created {new Date(project.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div style={actionRowStyle}>
        {canDelete && (
          <button
            className="view-btn"
            style={deleteButtonStyle}
            onClick={handleDeleteProject}
          >
            Delete Project
          </button>
        )}

        <button
          className="view-btn"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          Open Project
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;

const actionRowStyle = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  justifyContent: "flex-end",
  alignItems: "center"
};

const deleteButtonStyle = {
  background: "linear-gradient(135deg, #ef4444, #dc2626)",
  border: "1px solid #b91c1c",
  color: "#fff"
};