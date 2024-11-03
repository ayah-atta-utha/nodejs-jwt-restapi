 
import { DataSource } from "typeorm";
import { News } from "./entities/News";
import config from "./config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.DB.HOST,
  port: config.DB.PORT,
  username: config.DB.USERNAME,
  password: config.DB.PASSWORD,
  database: config.DB.NAME,
  synchronize: true,
  logging: false,
  entities: [News],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
