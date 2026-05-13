import { DataTypes } from "sequelize";
import {sequelize} from "../config/db.js";

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT
    },

    dueDate: {
      type: DataTypes.DATE
    },

    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
      defaultValue: "MEDIUM"
    },

    status: {
      type: DataTypes.ENUM(
        "TODO",
        "IN_PROGRESS",
        "DONE"
      ),
      defaultValue: "TODO"
    },
    createdBy: {
    type: DataTypes.UUID,
    allowNull: false
}
  },
  {
    timestamps: true
  }
);

export default Task;