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
  fs.readFileSync("docs/endpoints/authPaths.yaml", "utf8")
);
const userPaths = yaml.load(
  fs.readFileSync("docs/endpoints/userPaths.yaml", "utf8")
);
const postPaths = yaml.load(
  fs.readFileSync("docs/endpoints/postPaths.yaml", "utf8")
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
        url: "http://localhost:5000/api",
        description: "Development server",
      },
      {
        url: "{baseUrl}:{basePort}/api",
        description: "Customizable Development server",
        variables: {
          baseUrl: {
            default: "http://localhost",
            description: "Local server",
          },
          basePort: {
            default: "5000",
            description: "Default port",
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
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    default: false,
                  },
                  message: {
                    type: "string",
                    default: "Unauthorized: Invalid or missing Bearer token",
                  },
                },
              },
            },
          },
        },
      },
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
  app.use("/docs/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/docs/json", (req, res) => res.json(swaggerSpec));
  console.log(`Swagger Docs available at http://localhost:${port}/docs/api-docs`);
}
