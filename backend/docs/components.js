const modelsSchemas = {
  Post: {
    type: "object",
    example: {
      _id: "60d0fe4f5311236168a109ca",
      userId: "60d0fe4f5311236168a109cb",
      username: "John Doe",
      body: "This is a sample post content.",
      images: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
      ],
      likes: ["60d0fe4f5311236168a109cc", "60d0fe4f5311236168a109cd"],
      createdAt: "2023-12-22T10:15:30.000Z",
      updatedAt: "2023-12-22T12:30:45.000Z",
    },
    required: ["user", "username", "body"],
    properties: {
      _id: {
        type: "string",
        description: "Auto-generated ID of the post",
      },
      userId: {
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
        description: "List of image URLs associated with the post",
        items: {
          type: "string",
        },
      },
      likes: {
        type: "array",
        description: "List of user IDs who liked the post",
        items: {
          type: "string",
        },
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
  },
  User: {
    type: "object",
    example: {
      _id: "60d0fe4f5311236168a109ca",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "hashedsecurepassword",
      role: "user",
      createdAt: "2024-12-24T08:55:02.790Z",
      updatedAt: "2024-12-24T08:55:02.790Z",
    },
    required: ["name", "email", "password"],
    properties: {
      _id: {
        type: "string",
        description: "Auto-generated ID",
      },
      name: {
        type: "string",
        description: "User's name",
      },
      email: {
        type: "string",
        description: "User's email address",
      },
      password: {
        type: "string",
        description: "User's password",
      },
      role: {
        enum: ["user", "admin"],
        default: "user",
        description: "User's role (user or admin). Default is user",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the user was created",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the user was last updated",
      },
    },
  },
  UserNoPassword: {
    type: "object",
    example: {
      _id: "60d0fe4f5311236168a1ca",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "user",
      createdAt: "2024-12-24T08:55:02.790Z",
      updatedAt: "2024-12-24T08:55:02.790Z",
    },
    required: ["name", "email"],
    properties: {
      _id: {
        type: "string",
        description: "Auto-generated ID",
      },
      name: {
        type: "string",
        description: "User's name",
      },
      email: {
        type: "string",
        description: "User's email address",
      },
      role: {
        enum: ["user", "admin"],
        default: "user",
        description: "User's role (user or admin). Default is user",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the user was created",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the user was last updated",
      },
    },
  },
};

export default modelsSchemas;
