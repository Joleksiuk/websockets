import express, { Application } from "express";
import path from "path";

export function setupFrontend(app: Application): void {
  const frontendPath = path.join(__dirname, "../../frontend/build");
  const indexPath = path.join(frontendPath, "index.html");

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(indexPath);
  });
}

// export function setupFrontend(app: Application): void {
//   const frontendPath = path.join(__dirname, "../../../frontend/build");

//   app.use(express.static(frontendPath));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(frontendPath, "index.html"));
//   });
// }
