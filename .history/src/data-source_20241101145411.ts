 
import { DataSource } from "typeorm";
import { News } from "./entities/News";
import config from "./config";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.DB.HOST,
  port: config.DB.PORT,
  username: config.DB.USER,
  password: config.DB.PASSWORD,
  database: config.DB.NAME,
  synchronize: true,
  logging: false,
  entities: [News,User],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;