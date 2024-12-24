const authPaths = {
  "/login": {
    get: {
      tags: ["Authentication"],
      summary: "Login",
      responses: {
        200: {
          description: "Logged in user",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/UserNoPassword",
                },
              },
            },
          },
        },
      },
    },
  },
};

export default authPaths;
