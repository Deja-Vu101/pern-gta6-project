import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const URL = process.env.URL;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "PERN GTA6 || API Documentation",
    version: "1.0.0",
    description: "Documentation for your API",
  },
  servers: [
    {
      url: URL,
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
    schemas: {
      WaitListItem: {
        type: "object",
        properties: {
          id: {
            type: "number",
            example: 1,
          },
          email: {
            type: "string",
            example: "kozachkov@example.com",
          },
          name: {
            type: "string",
            example: "Rostyslav Kozachkov",
          },
          queue: {
            type: "number",
            example: 1,
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: {
            type: "number",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          email: {
            type: "string",
            example: "user@example.com",
          },
          password: {
            type: "string",
            example: "password123",
          },
          isActivated: {
            type: "boolean",
            example: false,
          },
          activationLink: {
            type: "string",
            example: "http://example.com/activate",
          },
          roleName: {
            type: "array",
            items: {
              type: "string",
              example: "USER",
            },
          },
          role: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Roles",
            },
          },
        },
      },
      Roles: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: 1,
          },
          name: {
            type: "string",
            example: "ADMIN",
          },
        },
      },
      Token: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          userId: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          refreshToken: {
            type: "string",
            example: "some-refresh-token",
          },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ["./router/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
