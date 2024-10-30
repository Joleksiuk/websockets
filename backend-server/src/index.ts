import { AppDataSource } from "./data-source";
import app from "./app";
import { port } from "./config";

AppDataSource.initialize()
  .then(async () => {
    app.listen(port, () => {
      console.log(
        `Express server has started. Open http://localhost:${port}/users to see results`
      );
    });
  })
  .catch((error) => console.log(error));
