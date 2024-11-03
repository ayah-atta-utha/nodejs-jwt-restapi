import express from 'express';
import { useExpressServer } from 'routing-controllers';
import swaggerUi from 'swagger-ui-express';
import { AppDataSource } from './data-source'; // Adjust the path as needed
import { NewsController } from './controllers/NewsController'; // Adjust the path as needed
import swaggerDocument from '../swagger.json'; // Adjust the path as needed

const app = express();
const PORT = 3000;

app.use(express.json());

// Set up the routing-controllers with a common route prefix
useExpressServer(app, {
  routePrefix: '/api',
  controllers: [NewsController], // Register your controller here
});

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Initialize the TypeORM data source
AppDataSource.initialize()
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
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log('HTTP server closed.');
          resolve();
        });
      });

      // Close the TypeORM connection
      await AppDataSource.destroy();
      console.log('Database connection closed.');

      console.log('Server has been shut down.');
      process.exit(0);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
  export default app;
