import fs from "fs";
import yaml from "js-yaml";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import modelsSchemas from "./components.js";

const filterInternalSchemas = (schemas) => {
  const filteredSchemas = {};
  for (const [key, value] of Object.entries(schemas)) {
    if (!value["x-internal"]) {
      filteredSchemas[key] = value;
    }
  }
  return filteredSchemas;
};

const authPaths = yaml.load(
  fs.readFileSync("docs/paths/authPaths.yaml", "utf8")
);
const userPaths = yaml.load(
  fs.readFileSync("docs/paths/userPaths.yaml", "utf8")
);
const postPaths = yaml.load(
  fs.readFileSync("docs/paths/postPaths.yaml", "utf8")
);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ExTask API",
      version: "1.0.0-oas3",
      description: "ExTask API",
    },
    servers: [
      {
        url: "{baseUrl}:5000/api",
        description: "Development server",
        variables: {
          baseUrl: {
            default: "http://localhost",
            description: "Local server",
          },
        },
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
      schemas: filterInternalSchemas(modelsSchemas),
    },
    tags: [
      { name: "Authentication", description: "Authentication endpoints" },
      { name: "Users", description: "Users related endpoints" },
      { name: "Posts", description: "Posts related endpoints" },
    ],
    paths: {
      ...authPaths,
      ...userPaths,
      ...postPaths,
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default function swaggerDocs(app, port) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
}
