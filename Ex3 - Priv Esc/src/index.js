#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Current logged-in user session
const CURRENT_USER = "alice@example.com";

// Fake todo data for users
const TODO_DATA = {
  "alice@example.com": [
    { id: 1, title: "Complete project proposal", status: "pending", priority: "high" },
    { id: 2, title: "Review team feedback", status: "in_progress", priority: "medium" },
    { id: 3, title: "Schedule team meeting", status: "completed", priority: "low" },
    { id: 4, title: "Update documentation", status: "pending", priority: "medium" },
  ],
  "bob@example.com": [
    { id: 1, title: "Fix bug in authentication", status: "in_progress", priority: "high" },
    { id: 2, title: "Write unit tests", status: "pending", priority: "high" },
    { id: 3, title: "Code review for PR #42", status: "pending", priority: "medium" },
    { id: 4, title: "Deploy to staging", status: "completed", priority: "high" },
    { id: 5, title: "Update dependencies", status: "pending", priority: "low" },
  ],
};

// Helper function to get the next available todo ID for a user
function getNextTodoId(email) {
  if (!TODO_DATA[email] || TODO_DATA[email].length === 0) {
    return 1;
  }
  return Math.max(...TODO_DATA[email].map((todo) => todo.id)) + 1;
}

// Create the server
const server = new Server(
  {
    name: "todo-list-server",
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
        name: "get_todos",
        description: "Get all todos for a user by their email address. You are currently logged in as Alice. Requires the user's email address as input.",
        inputSchema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "The email address of the user whose todos you want to retrieve. You are currently logged in as alice@example.com, but you can specify any user's email (e.g., alice@example.com or bob@example.com)",
            },
          },
          required: ["email"],
        },
      },
      {
        name: "create_todo",
        description: "Create a new todo for a user. You are currently logged in as Alice. Requires the user's email address and todo title.",
        inputSchema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "The email address of the user who will own this todo. You are currently logged in as alice@example.com, but you can specify any user's email (e.g., alice@example.com or bob@example.com)",
            },
            title: {
              type: "string",
              description: "The title/description of the todo item",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "The priority level of the todo (default: medium)",
            },
            status: {
              type: "string",
              enum: ["pending", "in_progress", "completed"],
              description: "The status of the todo (default: pending)",
            },
          },
          required: ["email", "title"],
        },
      },
      {
        name: "mark_todo_complete",
        description: "Mark a todo item as completed. You are currently logged in as Alice. Requires the user's email address and the todo ID.",
        inputSchema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "The email address of the user who owns the todo. You are currently logged in as alice@example.com, but you can specify any user's email (e.g., alice@example.com or bob@example.com)",
            },
            todo_id: {
              type: "integer",
              description: "The ID of the todo item to mark as complete",
            },
          },
          required: ["email", "todo_id"],
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
      case "get_todos": {
        const email = (args.email || "").toLowerCase().trim();

        if (!email) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Email address is required. Please provide the user's email address.",
              },
            ],
            isError: true,
          };
        }

        if (!TODO_DATA[email]) {
          return {
            content: [
              {
                type: "text",
                text: `Error: No todos found for email '${email}'. Available users: alice@example.com, bob@example.com`,
              },
            ],
            isError: true,
          };
        }

        const todos = TODO_DATA[email];
        if (todos.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No todos found for ${email}.`,
              },
            ],
          };
        }

        // Format the todos nicely
        let todoList = `Todos for ${email}`;
        if (email === CURRENT_USER) {
          todoList += ` (your account)`;
        } else {
          todoList += ` (requested by ${CURRENT_USER})`;
        }
        todoList += `:\n\n`;
        for (const todo of todos) {
          todoList += `ID: ${todo.id}\n`;
          todoList += `Title: ${todo.title}\n`;
          todoList += `Status: ${todo.status}\n`;
          todoList += `Priority: ${todo.priority}\n`;
          todoList += "-".repeat(40) + "\n";
        }

        return {
          content: [
            {
              type: "text",
              text: todoList,
            },
          ],
        };
      }

      case "create_todo": {
        const email = (args.email || "").toLowerCase().trim();
        const title = (args.title || "").trim();
        const priority = (args.priority || "medium").toLowerCase();
        const status = (args.status || "pending").toLowerCase();

        if (!email) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Email address is required. Please provide the user's email address.",
              },
            ],
            isError: true,
          };
        }

        if (!title) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Todo title is required. Please provide a title for the todo.",
              },
            ],
            isError: true,
          };
        }

        // Validate email exists in system
        if (!TODO_DATA[email]) {
          return {
            content: [
              {
                type: "text",
                text: `Error: User '${email}' not found. Available users: alice@example.com, bob@example.com`,
              },
            ],
            isError: true,
          };
        }

        // Validate priority
        if (!["low", "medium", "high"].includes(priority)) {
          return {
            content: [
              {
                type: "text",
                text: `Error: Invalid priority '${priority}'. Must be one of: low, medium, high`,
              },
            ],
            isError: true,
          };
        }

        // Validate status
        if (!["pending", "in_progress", "completed"].includes(status)) {
          return {
            content: [
              {
                type: "text",
                text: `Error: Invalid status '${status}'. Must be one of: pending, in_progress, completed`,
              },
            ],
            isError: true,
          };
        }

        // Create the new todo
        const newId = getNextTodoId(email);
        const newTodo = {
          id: newId,
          title: title,
          status: status,
          priority: priority,
        };

        TODO_DATA[email].push(newTodo);

        let successMessage = `Successfully created todo for ${email}`;
        if (email === CURRENT_USER) {
          successMessage += ` (your account)`;
        } else {
          successMessage += ` (created by ${CURRENT_USER})`;
        }
        successMessage += `:\n\n` +
                    `ID: ${newTodo.id}\n` +
                    `Title: ${newTodo.title}\n` +
                    `Status: ${newTodo.status}\n` +
                    `Priority: ${newTodo.priority}`;

        return {
          content: [
            {
              type: "text",
              text: successMessage,
            },
          ],
        };
      }

      case "mark_todo_complete": {
        const email = (args.email || "").toLowerCase().trim();
        const todoId = args.todo_id;

        if (!email) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Email address is required. Please provide the user's email address.",
              },
            ],
            isError: true,
          };
        }

        if (todoId === undefined || todoId === null) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Todo ID is required. Please provide the ID of the todo to mark as complete.",
              },
            ],
            isError: true,
          };
        }

        // Validate email exists in system
        if (!TODO_DATA[email]) {
          return {
            content: [
              {
                type: "text",
                text: `Error: User '${email}' not found. Available users: alice@example.com, bob@example.com`,
              },
            ],
            isError: true,
          };
        }

        // Find the todo by ID
        const todo = TODO_DATA[email].find((t) => t.id === todoId);

        if (!todo) {
          return {
            content: [
              {
                type: "text",
                text: `Error: Todo with ID ${todoId} not found for user ${email}.`,
              },
            ],
            isError: true,
          };
        }

        // Check if already completed
        if (todo.status === "completed") {
          return {
            content: [
              {
                type: "text",
                text: `Todo ID ${todoId} is already marked as completed.\n\n` +
                      `Title: ${todo.title}\n` +
                      `Status: ${todo.status}\n` +
                      `Priority: ${todo.priority}`,
              },
            ],
          };
        }

        // Mark as completed
        todo.status = "completed";

        let successMessage = `Successfully marked todo as completed for ${email}`;
        if (email === CURRENT_USER) {
          successMessage += ` (your account)`;
        } else {
          successMessage += ` (marked by ${CURRENT_USER})`;
        }
        successMessage += `:\n\n` +
                    `ID: ${todo.id}\n` +
                    `Title: ${todo.title}\n` +
                    `Status: ${todo.status}\n` +
                    `Priority: ${todo.priority}`;

        return {
          content: [
            {
              type: "text",
              text: successMessage,
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
  console.error(`Todo List MCP server running on stdio`);
  console.error(`Current user session: ${CURRENT_USER}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

