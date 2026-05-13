import { useState } from "react";

import { taskService }
from "../../services/task.service";

const CreateTaskModal = ({
  projectId,
  members,
  onClose,
  onTaskCreated,
}) => {

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      priority: "MEDIUM",
      assignedTo: "",
      dueDate: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title.trim()) {
      return setError(
        "Title is required"
      );
    }

    try {

      setLoading(true);
      setError("");

      await taskService.createTask(
        projectId,
        formData
      );

      onTaskCreated();
      onClose();

    } catch (error) {

      console.error(error);

      setError(
        error.message ||
        "Failed to create task"
      );

    } finally {
      setLoading(false);
    }
  }

  

  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h2>Create Task</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            X
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />



          </div>

          <div className="form-group">

            <label>Description</label>

            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>Priority</label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="LOW">
                LOW
              </option>

              <option value="MEDIUM">
                MEDIUM
              </option>

              <option value="HIGH">
                HIGH
              </option>

            </select>

          </div>

          <div className="form-group">

            <label>Assign To</label>

            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
            >

              <option value="">
                Select Member
              </option>

              {members.map((member) => (
                <option
                  key={member.user.id}
                  value={member.user.id}
                >
                  {member.user.name}
                </option>
              ))}

            </select>

          </div>

          <div className="form-group">

            <label>Due Date</label>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
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
              : "Create Task"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default CreateTaskModal;