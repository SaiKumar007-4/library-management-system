import express from "express";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to the Library Management System");
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);

// Error middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;