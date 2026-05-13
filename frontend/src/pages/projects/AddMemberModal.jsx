import { useState } from "react";

import { projectService }
from "../../services/project.service";

const AddMemberModal = ({
  projectId,
  onClose,
  onMemberAdded,
}) => {

  const [email, setEmail] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      return setError("Email is required");
    }

    try {
      setLoading(true);
      setError("");

      await projectService.addMember(
        projectId,
        { email }
      );

      onMemberAdded();
      onClose();

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
        "Failed to add member"
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h2>Add Member</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            X
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter member email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
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
              ? "Adding..."
              : "Add Member"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default AddMemberModal;