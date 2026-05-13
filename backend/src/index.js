import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import authRoutes from "./router/auth.routes.js";
import projectRoutes from "./router/project.routes.js";
import taskRoutes from "./router/task.routes.js";
import dashboardRoutes from "./router/dashboard.routes.js";
import { connectDB, sequelize } from './config/db.js';
import Result from './constant/result.js';
import './modals/index.js';

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
const server = http.createServer(app);

app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.originalUrl}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
    res.status(200).send({
        status: 200,
        message: "Server is running",
    });
});

app.get('/check-tables', async (req, res) => {

    const result = new Result();

    try {

        const [tables] = await sequelize.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public';
        `);

        result.status = 200;
        result.message = "Tables fetched successfully";
        result.data = tables;

        return res.status(result.status).send(result);

    } catch (error) {

        result.status = 500;
        result.message = error.message;
        result.data = [];

        return res.status(result.status).send(result);
    }
});

app.get("/drop-tables", async (req,res) => {
    try {
    await sequelize.sync({ force: true });

    res.json({
      success: true,
      message: "All tables deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
})

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connected");

    await sequelize.sync();

    console.log("Tables synced");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

