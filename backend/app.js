import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import taskRoutes from "./routes/tasks.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Task Manager API is running",
    version: "1.0.0",
  });
});

export default app;
