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
  },
  apis: [
    "C:/Users/Osama.shoora/Documents/Tasks/React/login-signup/backend/routes/**/*.js",
  ],
};

export default swaggerOptions;
