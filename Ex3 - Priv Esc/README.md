# MCP Todo List Server

An MCP (Model Context Protocol) server that provides access to a fake todo list for two users: Alice and Bob.

## Features

- Fake todo data for `alice@example.com` and `bob@example.com`
- Get todos by specifying the user's email address
- Create new todos for users
- Mark todos as completed
- Each todo includes: ID, title, status, and priority

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the server:
```bash
npm start
```

Or directly:
```bash
node src/index.js
```

## Claude Desktop Configuration

To use this server with Claude Desktop, add the configuration from `claude_desktop_config.json` to your Claude Desktop MCP settings file.

**Location of Claude Desktop config file:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

You can either:
1. Copy the contents of `claude_desktop_config.json` into your existing Claude Desktop config file (merge with existing `mcpServers` if any)
2. Or merge this server configuration into your existing config manually

**Note**: Make sure to update the path in the config file if you move the server script to a different location.

## Usage

The server provides three tools:

### 1. `get_todos`
Get all todos for a user by their email address.

**Required parameters:**
- `email` - The user's email address (e.g., `alice@example.com` or `bob@example.com`)

**Example:**
```json
{
  "email": "alice@example.com"
}
```

### 2. `create_todo`
Create a new todo for a user.

**Required parameters:**
- `email` - The user's email address
- `title` - The title/description of the todo

**Optional parameters:**
- `priority` - Priority level: `low`, `medium`, or `high` (default: `medium`)
- `status` - Status: `pending`, `in_progress`, or `completed` (default: `pending`)

**Example:**
```json
{
  "email": "bob@example.com",
  "title": "Review pull request #123",
  "priority": "high",
  "status": "pending"
}
```

### 3. `mark_todo_complete`
Mark a todo item as completed.

**Required parameters:**
- `email` - The user's email address
- `todo_id` - The ID of the todo item to mark as complete

**Example:**
```json
{
  "email": "alice@example.com",
  "todo_id": 1
}
```

