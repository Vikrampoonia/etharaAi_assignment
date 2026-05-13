import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div className="project-card">
      <div className="project-card-content">
        <h3>{project.name}</h3>

        <p className="project-description">
          {project.description || "No description"}
        </p>

        <div className="project-meta">
          <span>
            Members: {project.membersCount || 0}
          </span>

          <span>
            Tasks: {project.tasksCount || 0}
          </span>
        </div>

        <p className="project-date">
          Created:
          {" "}
          {new Date(project.createdAt).toLocaleDateString()}
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