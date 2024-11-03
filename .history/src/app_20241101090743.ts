 
import "reflect-metadata";
import express from "express";
import { useExpressServer } from "routing-controllers";
import { NewsController } from "./controllers/NewsController";
import AppDataSource from "./data-source";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

const app = express();
app.use(express.json());

useExpressServer(app, {
  controllers: [NewsController], // Register the controller
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

export default app;
