import * as https from "https";
import fs from "fs";
import path from "path";

export function loadSSLCertificates(): https.ServerOptions {
  try {
    const certPath = path.resolve(__dirname, "../files/localhost.pem");
    const keyPath = path.resolve(__dirname, "../files/localhost-key.pem");

    const cert = fs.readFileSync(certPath);
    const key = fs.readFileSync(keyPath);

    return { cert, key };
  } catch (error) {
    console.error("Error loading SSL certificates:", error);
    process.exit(1); // Exit the process if certificates cannot be loaded
  }
}
