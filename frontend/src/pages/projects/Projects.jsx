import MainLayout
  from "../../components/layout/MainLayout";

import { useEffect, useState } from "react";
import { projectService } from "../../services/project.service";
import ProjectCard from "./ProjectCard";
import CreateProjectModal from "./CreateProjectModal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);

      const response = await projectService.getProjects();
      const apiData = response?.data || response?.projects || [];

      setProjects(Array.isArray(apiData) ? apiData : []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleProjectCreated(message) {
    await fetchProjects();
    setShowModal(false);
    setSuccessMessage(message || "Project created successfully");

    setTimeout(() => {
      setSuccessMessage("");
    }, 2500);
  }

  return (
    <MainLayout>
      <div className="projects-page">
        <div className="projects-header">
          <div className="projects-title-wrap">
            <p className="projects-kicker">Workspace</p>
            <h2>Projects</h2>
            <p className="projects-subtitle">
              Plan, organize and track deliverables with your team.
            </p>
          </div>

          <button
            className="create-btn"
            onClick={() => setShowModal(true)}
          >
            + Create Project
          </button>
        </div>

        {successMessage && (
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
            {successMessage}
          </div>
        )}

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <p>No projects found</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                canDelete={project.isCurrentUserAdmin}
                onDeleted={fetchProjects}
              />
            ))}
          </div>
        )}

        {showModal && (
          <CreateProjectModal
            onClose={() => setShowModal(false)}
            onProjectCreated={handleProjectCreated}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Projects;