# MCP Course Code

This repository contains multiple MCP (Model Context Protocol) server examples and a client testing tool. Each project demonstrates different aspects of building and working with MCP servers.

## Projects Overview

1. **Ex1 - MCP**: Math MCP Server - Provides basic mathematical operations and math jokes
2. **Ex3 - Priv Esc**: Todo List MCP Server - Manages todo lists for users (Alice and Bob)
3. **Ex4 - Select server**: Weather MCP Server - Returns weather-related jokes
4. **mcp-lite**: MCP Client Tester - A tool for testing and interacting with MCP servers

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

To check your versions:
```bash
node --version
npm --version
```

## Installation

Each project has its own dependencies. Navigate to each project directory and install dependencies:

### Ex1 - MCP (Math Server)

```bash
cd "Ex1 - MCP"
npm install
```

### Ex3 - Priv Esc (Todo List Server)

```bash
cd "Ex3 - Priv Esc"
npm install
```

### Ex4 - Select server (Weather Server)

```bash
cd "Ex4 - Select server"
npm install
```

### mcp-lite (MCP Client Tester)

```bash
cd mcp-lite
npm install
```

**Optional - Install globally:**
```bash
cd mcp-lite
npm install -g
```

This makes the `mcp-client` command available globally.

## Usage

### Ex1 - MCP: Math Server

A server that provides mathematical operations and math jokes.

#### Running the Server

```bash
cd "Ex1 - MCP"
npm start
```

Or directly:
```bash
node src/index.js
```

#### Available Tools

- **add**: Add two numbers (`{ "a": 5, "b": 3 }`)
- **subtract**: Subtract two numbers (`{ "a": 10, "b": 4 }`)
- **multiply**: Multiply two numbers (`{ "a": 7, "b": 6 }`)
- **divide**: Divide two numbers (`{ "a": 20, "b": 4 }`)
- **power**: Raise a number to a power (`{ "base": 2, "exponent": 8 }`)
- **get_math_joke**: Get a random math joke (`{}`)

#### Claude Desktop Configuration

Add to your Claude Desktop config file (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "math-server": {
      "command": "/Users/katiepaxtonfear/Documents/MCP Course Code/Ex1 - MCP/run-server.sh"
    }
  }
}
```

**Note**: Update the path to match your actual project location. Make sure `run-server.sh` is executable:
```bash
chmod +x "Ex1 - MCP/run-server.sh"
```

### Ex3 - Priv Esc: Todo List Server

A server that manages todo lists for users (Alice and Bob).

#### Running the Server

```bash
cd "Ex3 - Priv Esc"
npm start
```

Or directly:
```bash
node src/index.js
```

#### Available Tools

- **get_todos**: Get all todos for a user
  ```json
  { "email": "alice@example.com" }
  ```

- **create_todo**: Create a new todo for a user
  ```json
  {
    "email": "bob@example.com",
    "title": "Review pull request #123",
    "priority": "high",
    "status": "pending"
  }
  ```

- **mark_todo_complete**: Mark a todo as completed
  ```json
  {
    "email": "alice@example.com",
    "todo_id": 1
  }
  ```

#### Claude Desktop Configuration

Add to your Claude Desktop config file:

```json
{
  "mcpServers": {
    "todo-list-server": {
      "command": "node",
      "args": [
        "/Users/katiepaxtonfear/Documents/MCP Course Code/Ex3 - Priv Esc/src/index.js"
      ]
    }
  }
}
```

**Note**: Update the path to match your actual project location.

### Ex4 - Select server: Weather Server

A server that returns weather-related jokes (with a humorous twist).

#### Running the Server

```bash
cd "Ex4 - Select server"
npm start
```

Or directly:
```bash
node src/index.js
```

#### Available Tools

- **forecast**: Get a weather forecast (actually returns a weather-related joke)
  ```json
  {}
  ```

#### Claude Desktop Configuration

Add to your Claude Desktop config file:

```json
{
  "mcpServers": {
    "weather-server": {
      "command": "node",
      "args": [
        "/Users/katiepaxtonfear/Documents/MCP Course Code/Ex4 - Select server/src/index.js"
      ]
    }
  }
}
```

**Note**: Update the path to match your actual project location.

### mcp-lite: MCP Client Tester

A command-line tool for testing and interacting with MCP servers. Useful for security testing, tool enumeration, and server configuration analysis.

#### Configuration

Create an `MCPserver.json` file in the `mcp-lite` directory (or specify a custom path with `--config`):

```json
{
  "mcpServers": {
    "math-server": {
      "command": "node",
      "args": [
        "/Users/katiepaxtonfear/Documents/MCP Course Code/Ex1 - MCP/src/index.js"
      ]
    },
    "todo-server": {
      "command": "node",
      "args": [
        "/Users/katiepaxtonfear/Documents/MCP Course Code/Ex3 - Priv Esc/src/index.js"
      ]
    },
    "weather-server": {
      "command": "node",
      "args": [
        "/Users/katiepaxtonfear/Documents/MCP Course Code/Ex4 - Select server/src/index.js"
      ]
    }
  }
}
```

**Note**: Update all paths to match your actual project locations.

#### Common Commands

**List all tools from all servers:**
```bash
cd mcp-lite
npm start -- list
# or if installed globally:
mcp-client list
```

**List tools from a specific server:**
```bash
npm start -- list --server math-server
# or
mcp-client list --server math-server
```

**List all configured servers:**
```bash
npm start -- servers
# or
mcp-client servers
```

**Get server information:**
```bash
npm start -- info math-server
# or
mcp-client info math-server
```

**Generate a tool call template:**
```bash
npm start -- generate math-server add
# or
mcp-client generate math-server add
```

**Call a tool:**
```bash
npm start -- call math-server add --args '{"a":5,"b":3}'
# or
mcp-client call math-server add --args '{"a":5,"b":3}'
```

**Call a tool with arguments from a file:**
```bash
npm start -- call math-server add --args-file ./args.json
# or
mcp-client call math-server add --args-file ./args.json
```

**JSON output (for automation):**
```bash
npm start -- list --json
# or
mcp-client list --json
```

**Custom configuration file:**
```bash
npm start -- list --config /path/to/config.json
# or
mcp-client list --config /path/to/config.json
```

For more detailed usage information, see the [mcp-lite README](mcp-lite/README.md).

## Claude Desktop Configuration

To use multiple servers with Claude Desktop, merge all server configurations into a single `mcpServers` object:

**macOS location**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows location**: `%APPDATA%\Claude\claude_desktop_config.json`

**Example combined configuration:**
```json
{
  "mcpServers": {
    "math-server": {
      "command": "/Users/katiepaxtonfear/Documents/MCP Course Code/Ex1 - MCP/run-server.sh"
    },
    "todo-list-server": {
      "command": "node",
      "args": [
        "/Users/katiepaxtonfear/Documents/MCP Course Code/Ex3 - Priv Esc/src/index.js"
      ]
    },
    "weather-server": {
      "command": "node",
      "args": [
        "/Users/katiepaxtonfear/Documents/MCP Course Code/Ex4 - Select server/src/index.js"
      ]
    }
  }
}
```

**Important Notes:**
- Update all paths to match your actual project locations
- Find your Node.js path with `which node` (macOS/Linux) or `where node` (Windows)
- Make sure `run-server.sh` is executable: `chmod +x "Ex1 - MCP/run-server.sh"`
- After updating the config, restart Claude Desktop

## Troubleshooting

### Server Won't Start

1. **Check Node.js installation:**
   ```bash
   which node  # macOS/Linux
   where node  # Windows
   ```

2. **Verify dependencies are installed:**
   ```bash
   cd <project-directory>
   npm install
   ```

3. **Test the server manually:**
   ```bash
   cd <project-directory>
   npm start
   ```

4. **Check file permissions** (for shell scripts):
   ```bash
   chmod +x "Ex1 - MCP/run-server.sh"
   ```

### Claude Desktop Issues

1. **Check Claude Desktop logs** for error messages
2. **Verify paths** in the configuration file are correct and absolute
3. **Restart Claude Desktop** after making configuration changes
4. **Test servers manually** first to ensure they work independently

### mcp-lite Connection Issues

1. **Verify server configuration** in `MCPserver.json`
2. **Check that server commands are available** in your PATH
3. **Ensure required environment variables** are set (if any)
4. **Test servers individually** using `npm start` in each project directory

## Project Structure

```
MCP Course Code/
├── Ex1 - MCP/              # Math MCP Server
│   ├── src/
│   │   └── index.js
│   ├── package.json
│   ├── run-server.sh
│   └── claude_desktop_config.json
├── Ex3 - Priv Esc/         # Todo List MCP Server
│   ├── src/
│   │   └── index.js
│   ├── package.json
│   └── claude_desktop_config.json
├── Ex4 - Select server/    # Weather MCP Server
│   ├── src/
│   │   └── index.js
│   ├── package.json
│   └── claude_desktop_config.json
└── mcp-lite/              # MCP Client Tester
    ├── src/
    │   ├── cli.js
    │   ├── mcp-client.js
    │   └── oauth-provider.js
    ├── package.json
    └── MCPserver.json.example
```

## Additional Resources

- Each project has its own detailed README with specific usage instructions
- See individual project READMEs for more examples and detailed documentation
- [MCP Documentation](https://modelcontextprotocol.io/)

## License

All projects in this repository are licensed under MIT.

