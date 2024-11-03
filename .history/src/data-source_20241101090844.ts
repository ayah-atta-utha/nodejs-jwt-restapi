 
import { DataSource } from "typeorm";
import { News } from "./entities/News";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "yourusername",
  password: "yourpassword",
  database: "yourdatabase",
  synchronize: true,
  logging: false,
  entities: [News],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
