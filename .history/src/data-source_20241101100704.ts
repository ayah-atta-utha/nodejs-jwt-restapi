 
import { DataSource } from "typeorm";
import { News } from "./entities/News";
import config from "./config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config,
  port: 5432,
  username: "news_user",
  password: "news123",
  database: "news_api",
  synchronize: true,
  logging: false,
  entities: [News],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
