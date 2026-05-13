import { useState } from "react";
import { projectService } from "../../services/project.service";

const CreateProjectModal = ({
  onClose,
  onProjectCreated,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name.trim()) {
      return setError("Project name is required");
    }

    try {
      setLoading(true);
      setError("");

      await projectService.createProject(formData);

      onProjectCreated();
      onClose();

    } catch (error) {
      console.error(error);
      setError(
        error.message || "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>Create Project</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Project Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows="4"
            />
          </div>

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Project"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;