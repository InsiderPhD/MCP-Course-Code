# Math MCP Server

An MCP (Model Context Protocol) server that provides basic mathematical operations and math-related jokes.

## Features

### Mathematical Operations
- **Add**: Add two numbers together
- **Subtract**: Subtract the second number from the first
- **Multiply**: Multiply two numbers together
- **Divide**: Divide the first number by the second (with division by zero protection)
- **Power**: Raise a number to a power

### Math Jokes
- **get_math_joke**: Returns a random math-related joke from a collection of 10 jokes

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

The server runs on stdio and can be used with any MCP-compatible client.

### Running the Server

```bash
npm start
```

### Example Tool Calls

The server provides the following tools:

1. **add** - `{ "a": 5, "b": 3 }` → Returns `5 + 3 = 8`
2. **subtract** - `{ "a": 10, "b": 4 }` → Returns `10 - 4 = 6`
3. **multiply** - `{ "a": 7, "b": 6 }` → Returns `7 × 6 = 42`
4. **divide** - `{ "a": 20, "b": 4 }` → Returns `20 ÷ 4 = 5`
5. **power** - `{ "base": 2, "exponent": 8 }` → Returns `2^8 = 256`
6. **get_math_joke** - `{}` → Returns a random math joke

## Configuration

### For Claude Desktop

To use this server with Claude Desktop, you need to add it to your Claude Desktop configuration file.

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

1. Create or edit the configuration file at the path above
2. Add the math server configuration (or merge with existing `mcpServers`)

**Recommended approach** (using wrapper script):
```json
{
  "mcpServers": {
    "math-server": {
      "command": "/Users/katiepaxtonfear/Documents/MCP Course Code/Ex1 - MCP/run-server.sh"
    }
  }
}
```

**Alternative approach** (direct node command):
```json
{
  "mcpServers": {
    "math-server": {
      "command": "/opt/homebrew/bin/node",
      "args": [
        "/Users/katiepaxtonfear/Documents/MCP Course Code/Ex1 - MCP/src/index.js"
      ]
    }
  }
}
```

**Note**: 
- Make sure to update the paths to match your actual project location
- If `node` is installed in a different location, find it with `which node` and update the path
- The wrapper script approach (`run-server.sh`) is recommended as it ensures the correct working directory

An example configuration file (`claude_desktop_config.json`) is included in this project for reference. You can copy its contents to your Claude Desktop config file.

### Troubleshooting

If the server fails to start:

1. **Check Node.js installation**: Run `which node` to find your Node.js path and update the configuration accordingly
2. **Verify dependencies**: Make sure `npm install` has been run and `node_modules` exists
3. **Test the server manually**: Run `npm start` or `node src/index.js` to verify it works
4. **Check file permissions**: Ensure `run-server.sh` is executable (`chmod +x run-server.sh`)
5. **Check Claude Desktop logs**: Look for error messages in Claude Desktop's console/logs

### For Other MCP Clients

The server communicates via stdio, so any MCP-compatible client can use it. Refer to your client's documentation for how to configure MCP servers.

## Error Handling

- Division by zero is handled gracefully with an error message
- Invalid tool names return appropriate error messages
- All errors are returned in the MCP error format

