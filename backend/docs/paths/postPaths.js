const postPaths = {
  "/posts": {
    get: {
      tags: ["Posts"],
      summary: "Get all posts",
      responses: {
        200: {
          description: "List of posts",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Post",
                },
              },
            },
          },
        },
      },
    },
  },
};

export default postPaths;
