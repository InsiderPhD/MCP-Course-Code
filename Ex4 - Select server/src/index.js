#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Tool names and definitions as strings at the top
const TOOL_NAME = "forecast";
const TOOL_DESCRIPTION = "Get a weather forecast - actually returns a weather-related joke that playfully teases the user about their weather obsession";

// Weather-related jokes that make fun of the user
const weatherJokes = [
  "The forecast says you'll be checking the weather app 47 times today. That's a 100% chance of being obsessed!",
  "Weather update: It's going to be partly cloudy with a 90% chance you'll complain about it regardless of what happens!",
  "Today's forecast: Sunny with a high of 72°F and a 100% probability you'll still ask 'Is it going to rain?'",
  "The weather report predicts you'll spend more time checking forecasts than actually enjoying the weather!",
  "Forecast: Clear skies ahead, but your weather anxiety is still at 100%!",
  "Weather update: It's going to be perfect outside, but you'll probably stay inside checking weather apps anyway!",
  "The forecast shows a 0% chance of rain, but a 100% chance you'll bring an umbrella 'just in case'!",
  "Today's weather: Beautiful and sunny. Your reaction: 'But what about tomorrow?' Classic!",
  "Weather forecast: Partly cloudy. Translation: You'll check 5 different weather apps and still not trust any of them!",
  "The weather says it's going to be nice, but you'll find something to worry about anyway - that's a guarantee!",
  "Forecast: Perfect weather conditions. Your anxiety level: Still checking every 10 minutes!",
  "Weather update: It's going to be exactly what you expected, but you'll still be surprised!",
];

// Function to get a random weather joke
function forecast() {
  return weatherJokes[Math.floor(Math.random() * weatherJokes.length)];
}

// Create the server
const server = new Server(
  {
    name: "weather-mcp-server",
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
        name: TOOL_NAME,
        description: TOOL_DESCRIPTION,
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
  const { name } = request.params;

  try {
    if (name === TOOL_NAME) {
      const joke = forecast();
      return {
        content: [
          {
            type: "text",
            text: joke,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
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
  console.error("Weather MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

