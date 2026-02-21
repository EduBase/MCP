<img src="https://static.edubase.net/media/brand/title/color.png" alt="EduBase logo" height="150" />

# EduBase MCP server

[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/EduBase/MCP/main.svg)](https://results.pre-commit.ci/latest/github/EduBase/MCP/main)
[![smithery badge](https://smithery.ai/badge/@EduBase/MCP)](https://smithery.ai/server/@EduBase/MCP)

This repository contains the **implementation of the Model Context Protocol** (MCP) server **for the EduBase platform**. It allows MCP clients (for example Claude Desktop) and LLMs to interact with your EduBase account and perform tasks on your behalf. It supports stdio, SSE and streamable HTTP transport protocols.

![EduBase MCP demo GIF: Claude uploads math questions](https://shared.edubase.net/mcp/EduBaseMCPdemomath.gif)

<a href="https://glama.ai/mcp/servers/@EduBase/MCP">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@EduBase/MCP/badge" alt="EduBase Server MCP server" />
</a>

## What is EduBase?

EduBase is an innovative, modular, online educational platform that makes learning more enjoyable, simpler and interactive, suitable for educational institutions or enterprises.

### Why choose EduBase?

EduBase revolutionizes digital learning with its unique combination of features:

* **Advanced Quiz System** with parametrization allowing infinite variations of the same question, real-time cheating detection, beautiful LaTeX typesetting, advanced STEM-support and automatic grading
* **Unified Learning Environment** that centralizes all your educational content — videos, exams, documents, and SCORM modules — in one intuitive system
* **Enterprise-Grade Security** with features like SSO integration, fine-grained access controls, comprehensive auditing, and GDPR compliance
* **Integration** with your existing systems through LTI, comprehensive API, and custom integration options
* **AI-Assisted Tools**, such as EduBase Assistant, that can instantly transform your existing content into interactive quizzes and assessments, or translate your materials from one language to another

From higher education institutions to corporate training departments, EduBase scales to meet your specific needs while maintaining an intuitive user experience across all devices.

### Demo video

Collaboratively creating and uploading questions, scheduling exams and analyzing user results with Claude:

<a href="https://www.youtube.com/watch?v=jvGP-5NzRPs">
  <img src="https://img.youtube.com/vi/jvGP-5NzRPs/maxresdefault.jpg" alt="Demonstrating EduBase's MCP server to collaboratively create and upload questions, schedule exams and analyze results." width="600"/>
</a>

### Obtaining your API credentials

Once logged in, on your Dashboard, search for the Integrations menu, click "add integration" and choose the type "EduBase API".

**If you don't see this option**, enter the `MCPGITHUB` activation code or feel free to contact us to request access at [info@edubase.net](mailto:info@edubase.net).

<img src="https://shared.edubase.net/mcp/EduBase_Integration_page_with_API_credentials.png" alt="EduBase API credentials page" width="500" />

## Tools

Each documented API endpoint is available as a separate tool, named `edubase_<method>_<endpoint>`. For example, the tool for the `GET /user:me` endpoint is named `edubase_get_user_me`. See our [developer documentation](https://developer.edubase.net) for more information.

## Configuration

The MCP server can be configured using environment variables. The following variables are available:

| Variable | Description | Required | Default value |
|---|---|---|---|
| `EDUBASE_API_URL` | The base URL of the EduBase API, most probably `https://subdomain.edubase.net/api`. | **Yes** | `https://www.edubase.net/api` |
| `EDUBASE_API_APP` | The App ID of your integration app on EduBase, the `app` on the EduBase API. Find this in the integration details window on EduBase. | Not if HTTP transport is used with authentication, otherwise **Yes** | - |
| `EDUBASE_API_KEY` | The Secret key of your integration app on EduBase, the `secret` on the EduBase API. Find this along the App ID in the integration details window on EduBase. | Not if HTTP transport is used with authentication, otherwise **Yes** | - |
| `EDUBASE_SSE_MODE` | Start MCP server in HTTP mode with SSE transport. Value must be `true`. | No | `false` |
| `EDUBASE_STREAMABLE_HTTP_MODE` | Start MCP server in HTTP mode with streamable HTTP transport. Value must be `true`. | No | `false` |
| `EDUBASE_HTTP_PORT` | HTTP server will listen on this port if SSE or streamable HTTP transport mode is used. | No | 3000 |

## Use as a remote MCP server

You can use the **EduBase MCP server as a remote MCP server** for your MCP client. To do this, you need to host the MCP server where clients can access it, and then configure the client to connect to the server. Either start it with SSE or streamable HTTP transport mode and always use HTTPS when accessing the server remotely over the internet!

### Authentication with remote servers

You can use server in two modes:

* **Without client authentication**: In this mode, the server will not require any authentication from the client. This is useful for testing or development purposes, or in a closed network but it is not recommended for production use. For this, you have to configure the server with the `EDUBASE_API_APP` and `EDUBASE_API_KEY` as well!
* **With Bearer token authentication**: In this mode, the server will require a Bearer token to be sent with each request. This is the recommended way to use the server in production. You can obtain the Bearer token from your EduBase account by creating an integration app and providing the App ID and Secret key in the `{app}:{secret}` format, base64 encoded as a token. The server will then use this token to authenticate the client and authorize access to the API endpoints.

## Usage with Claude Desktop

For a step-by-step walkthrough, see our blog post on how to [connect EduBase with Claude: The Complete MCP Integration Guide](https://edubase.blog/claude-mcp-integration-guide/).

### Installing manually

Add the following to your `claude_desktop_config.json`:

#### Using Node.js

Before running the MCP server, make sure you have **Node.js installed**. You can download it from [nodejs.org](https://nodejs.org/) or use a package manager like `brew`. Download EduBase MCP server release or clone the repository and run `npm run build` to build the server. Do not forget to adjust `/path/to/dist` to the actual directory and **configure the environmental variables**!

```json
{
  "mcpServers": {
    "edubase": {
      "command": "node",
      "args": [
        "/path/to/dist/index.js"
      ],
      "env": {
        "EDUBASE_API_URL": "https://domain.edubase.net/api",
        "EDUBASE_API_APP": "your_integration_app_id",
        "EDUBASE_API_KEY": "your_integration_secret_key"
      }
    }
  }
}
```

#### Using Docker

Before running the MCP server, make sure you have **Docker installed and is running**. You can download it from [docker.com](https://www.docker.com/) or use a package manager. Do not forget to **configure the environmental variables**!

```json
{
  "mcpServers": {
    "edubase": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "EDUBASE_API_URL",
        "-e",
        "EDUBASE_API_APP",
        "-e",
        "EDUBASE_API_KEY",
        "edubase/mcp"
      ],
      "env": {
        "EDUBASE_API_URL": "https://domain.edubase.net/api",
        "EDUBASE_API_APP": "your_integration_app_id",
        "EDUBASE_API_KEY": "your_integration_secret_key"
      }
    }
  }
}
```

### Installing via remote MCP server

You can use the provided EduBase MCP server (if available) as a remote server. We recommend Base64 encoding your `EDUBASE_API_APP` and `EDUBASE_API_KEY` and using it in as a Bearer token in the `Authorization` header (`Authorization: Bearer ${BASE64_ENCODED_TOKEN}`).

```json
{
  "mcpServers": {
    "edubase": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://domain.edubase.net/mcp",
        "--header",
        "Authorization: Bearer ${EDUBASE_API_APP}:${EDUBASE_API_KEY}"
      ]
    }
  }
}
```

### Installing via Smithery

To install EduBase MCP server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@EduBase/MCP):

```bash
npx -y @smithery/cli install @EduBase/MCP --client claude
```

## Contact

Website: [www.edubase.net](www.edubase.net)  
Developer Documentation: [developer.edubase.net](developer.edubase.net)  
Email: [info@edubase.net](mailto:info@edubase.net)
