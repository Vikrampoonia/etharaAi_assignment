import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

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

      <button
        className="view-btn"
        onClick={() =>
          navigate(`/projects/${project.id}`)
        }
      >
        Open Project
      </button>
    </div>
  );
};

export default ProjectCard;