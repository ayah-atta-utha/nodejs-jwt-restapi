"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routing_controllers_1 = require("routing-controllers");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const data_source_1 = require("./data-source"); // Adjust the path as needed
const NewsController_1 = require("./controllers/NewsController"); // Adjust the path as needed
const swagger_json_1 = __importDefault(require("../swagger.json")); // Adjust the path as needed
const config_1 = __importDefault(require("./config"));
const AuthController_1 = require("./controllers/AuthController");
const app = (0, express_1.default)();
const PORT = config_1.default.PORT;
app.use(express_1.default.json());
// Set up the routing-controllers with a common route prefix
(0, routing_controllers_1.useExpressServer)(app, {
    routePrefix: '/api',
    controllers: [NewsController_1.NewsController, AuthController_1.AuthController], // Register your controller here
});
// Set up Swagger UI
app.use('/api/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// Initialize the TypeORM data source
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
    // Start the server after the database connection is established
    const server = app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/api`);
    });
    // Handle SIGINT (Ctrl + C) for graceful shutdown
    process.on('SIGINT', async () => {
        console.log('Received SIGINT. Shutting down gracefully...');
        // Close the HTTP server
        await new Promise((resolve) => {
            server.close(() => {
                console.log('HTTP server closed.');
                resolve();
            });
        });
        // Close the TypeORM connection
        await data_source_1.AppDataSource.destroy();
        console.log('Database connection closed.');
        console.log('Server has been shut down.');
        process.exit(0);
    });
})
    .catch((err) => {
    console.error("Error during Data Source initialization", err);
});
exports.default = app;
