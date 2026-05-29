// express
import jobRoutes from "./routes/jobRoutes.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import errorMiddleware from "./middleware/errorMiddleware.js";

//routes

//middleware

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "launchpad Api is running" });
});
// routes will come here later

app.use("/api/jobs", jobRoutes);

// error handler
app.use(errorMiddleware);

//export
export default app;
