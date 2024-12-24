import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import modelsSchemas from "./components.js";
import authPaths from "./paths/authPaths.js";
import postPaths from "./paths/postPaths.js";
import userPaths from "./paths/userPaths.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ExTask API",
      version: "1.0.0",
      description: "ExTask API",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: modelsSchemas,
    },
    paths: {
      ...userPaths,
      ...postPaths,
      ...authPaths,
    },
  },
  security: [{ bearerAuth: [] }],
  apis: [
    "C:/Users/Osama.shoora/Documents/Tasks/React/login-signup/backend/routes/**/*.js",
    "D:/coding/Training/Login-Signup-React/login-signup/backend/routes/**/*.js",
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default function swaggerDocs(app, port) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
}
