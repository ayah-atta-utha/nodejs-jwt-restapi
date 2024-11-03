"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
// src/data-source.ts
const typeorm_1 = require("typeorm");
const News_1 = require("./entities/News");
const config_1 = __importDefault(require("./config"));
const User_1 = require("./entities/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: config_1.default.DB.HOST,
    port: config_1.default.DB.PORT,
    username: config_1.default.DB.USER,
    password: config_1.default.DB.PASSWORD,
    database: config_1.default.DB.NAME,
    synchronize: true,
    logging: false,
    entities: [News_1.News, User_1.User],
    subscribers: [],
    migrations: [],
});
exports.default = exports.AppDataSource;
