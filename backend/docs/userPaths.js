const userPaths = {
  "/users": {
    get: {
      tags: ["Users"],
      summary: "Get all users",
      responses: {
        200: {
          description: "List of users",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
        },
      },
    },
  },
};

export default userPaths;
