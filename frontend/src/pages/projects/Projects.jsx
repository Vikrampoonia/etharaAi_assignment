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

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);

      const data = await projectService.getProjects();

      setProjects(data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
    <div className="projects-page">
      <div className="projects-header">
        <h2>Projects</h2>

        <button
            className="create-btn"
            onClick={() => setShowModal(true)}
            >
            + Create Project
        </button>
      </div>

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
            />
          ))}
        </div>
      )}

      {showModal && (
        <CreateProjectModal
            onClose={() => setShowModal(false)}
            onProjectCreated={fetchProjects}
        />
        )}
    </div>
    </MainLayout>
  );
};

export default Projects;