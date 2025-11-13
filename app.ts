// src/app.ts

import type { NextFunction, Request, Response } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// Security middleware
import helmet from "helmet";
import winston from "winston";
import rateLimit from "express-rate-limit";

const logger = winston.createLogger();
const app = express();

// Security headers
app.use(helmet());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static assets
app.use(express.static("public"));
// API Routes

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// 404
// Routes
app.get("/", (req, res) => {
  res.send("Secure Express Server");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
