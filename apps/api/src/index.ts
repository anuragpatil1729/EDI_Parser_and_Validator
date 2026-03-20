import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./middleware/logger";
import { requireAuth } from "./middleware/auth";
import chatRoutes from "./routes/chat";
import dashboardRoutes from "./routes/dashboard";
import parseRoutes from "./routes/parse";
import providerRoutes from "./routes/provider";
import uploadRoutes from "./routes/upload";
import translateRoutes from "./routes/translate";
import validateRoutes from "./routes/validate";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(logger);

app.get("/health", (_req, res) => res.json({ status: "ok", service: "api-gateway" }));
app.use("/upload", requireAuth, uploadRoutes);
app.use("/parse", requireAuth, parseRoutes);
app.use("/validate", requireAuth, validateRoutes);
app.use("/chat", requireAuth, chatRoutes);
app.use("/translate", requireAuth, translateRoutes);
app.use("/dashboard", requireAuth, dashboardRoutes);
app.use("/ai-provider", requireAuth, providerRoutes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API gateway listening on ${env.port}`);
});
