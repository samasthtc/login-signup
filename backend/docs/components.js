const modelsSchemas = {
  Post: {
    type: "object",
    required: ["user", "username", "body"],
    properties: {
      id: {
        type: "string",
        description: "Auto-generated ID of the post",
      },
      user: {
        type: "string",
        description: "ID of the user who created the post",
      },
      username: {
        type: "string",
        description: "Username of the post creator",
      },
      body: {
        type: "string",
        description: "Content of the post (max 500 characters)",
      },
      images: {
        type: "array",
        items: {
          type: "string",
        },
        description: "List of image URLs associated with the post",
      },
      likes: {
        type: "array",
        items: {
          type: "string",
        },
        description: "List of user IDs who liked the post",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the post was created",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the post was last updated",
      },
    },
    example: {
      id: "60d0fe4f5311236168a109ca",
      user: "60d0fe4f5311236168a109cb",
      username: "john_doe",
      body: "This is a sample post content.",
      images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
      likes: ["60d0fe4f5311236168a109cc", "60d0fe4f5311236168a109cd"],
      createdAt: "2023-12-22T10:15:30.000Z",
      updatedAt: "2023-12-22T12:30:45.000Z",
    },
  },
  User: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      id: { type: "string", description: "Auto-generated ID" },
      name: { type: "string", description: "User's name" },
      email: { type: "string", description: "User's email address" },
      password: { type: "string", description: "User's password" },
      role: { type: "string", description: "User's role (user or admin). Default is user" },
    },
    example: {
      id: "60d0fe4f5311236168a109ca",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "hashedsecurepassword",
      role: "user",
    },
  },
}

export default modelsSchemas