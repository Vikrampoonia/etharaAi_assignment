import { DataTypes } from "sequelize";
import {sequelize} from "../config/db.js";

const ProjectMember = sequelize.define(
  "ProjectMember",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    role: {
      type: DataTypes.ENUM("ADMIN", "MEMBER"),
      defaultValue: "MEMBER"
    }
  },
  {
    timestamps: true
  }
);

export default ProjectMember;