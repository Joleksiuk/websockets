import express, { Application } from "express";
import path from "path";

export function setupFrontend(app: Application): void {
  const frontendPath = path.join(__dirname, "../../../frontend/build");

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}
