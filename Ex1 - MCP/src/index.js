#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Math jokes database
const mathJokes = [
  "Why was the equal sign so humble? Because it knew it wasn't less than or greater than anyone else!",
  "Why do mathematicians like parks? Because of all the natural logs!",
  "Why did the mathematician break up with the polynomial? They had too many variables!",
  "What do you call a number that can't keep still? A roamin' numeral!",
  "Why did the student get upset when his teacher called him average? It was a mean thing to say!",
  "Why don't mathematicians need to sunbathe? They can just use tan!",
  "What's a math teacher's favorite place in NYC? Times Square!",
  "Why was the math book sad? It had too many problems!",
  "What do you call a snake that's 3.14 meters long? A π-thon!",
  "Why did the obtuse angle go to the beach? Because it was over 90 degrees!",
];

// Helper function to get a random joke
function getRandomJoke() {
  return mathJokes[Math.floor(Math.random() * mathJokes.length)];
}

// Create the server
const server = new Server(
  {
    name: "math-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add",
        description: "Add two numbers together",
        inputSchema: {
          type: "object",
          properties: {
            a: {
              type: "number",
              description: "First number",
            },
            b: {
              type: "number",
              description: "Second number",
            },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "subtract",
        description: "Subtract the second number from the first number",
        inputSchema: {
          type: "object",
          properties: {
            a: {
              type: "number",
              description: "First number (minuend)",
            },
            b: {
              type: "number",
              description: "Second number (subtrahend)",
            },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "multiply",
        description: "Multiply two numbers together",
        inputSchema: {
          type: "object",
          properties: {
            a: {
              type: "number",
              description: "First number",
            },
            b: {
              type: "number",
              description: "Second number",
            },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "divide",
        description: "Divide the first number by the second number",
        inputSchema: {
          type: "object",
          properties: {
            a: {
              type: "number",
              description: "First number (dividend)",
            },
            b: {
              type: "number",
              description: "Second number (divisor)",
            },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "power",
        description: "Raise the first number to the power of the second number",
        inputSchema: {
          type: "object",
          properties: {
            base: {
              type: "number",
              description: "Base number",
            },
            exponent: {
              type: "number",
              description: "Exponent",
            },
          },
          required: ["base", "exponent"],
        },
      },
      {
        name: "get_math_joke",
        description: "Get a random math-related joke",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "add": {
        const result = args.a + args.b;
        return {
          content: [
            {
              type: "text",
              text: `${args.a} + ${args.b} = ${result}`,
            },
          ],
        };
      }

      case "subtract": {
        const result = args.a - args.b;
        return {
          content: [
            {
              type: "text",
              text: `${args.a} - ${args.b} = ${result}`,
            },
          ],
        };
      }

      case "multiply": {
        const result = args.a * args.b;
        return {
          content: [
            {
              type: "text",
              text: `${args.a} × ${args.b} = ${result}`,
            },
          ],
        };
      }

      case "divide": {
        if (args.b === 0) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Division by zero is not allowed!",
              },
            ],
            isError: true,
          };
        }
        const result = args.a / args.b;
        return {
          content: [
            {
              type: "text",
              text: `${args.a} ÷ ${args.b} = ${result}`,
            },
          ],
        };
      }

      case "power": {
        const result = Math.pow(args.base, args.exponent);
        return {
          content: [
            {
              type: "text",
              text: `${args.base}^${args.exponent} = ${result}`,
            },
          ],
        };
      }

      case "get_math_joke": {
        const joke = getRandomJoke();
        return {
          content: [
            {
              type: "text",
              text: joke,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Math MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

