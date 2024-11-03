 
import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "yourusername",
  password: "yourpassword",
  database: "yourdatabase",
  synchronize: true,
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
