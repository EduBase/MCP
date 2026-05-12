# EduBase MCP — Submission Manifest

This document is intended for **app store reviewers** at OpenAI (ChatGPT Apps) and Anthropic (Claude Connectors). It mirrors the machine-readable manifest at `/.well-known/mcp-app.json` in plain prose.

## Identity

| Field | Value |
|---|---|
| Name | EduBase |
| Vendor | EduBase Kft. |
| Vendor address | 1046 Budapest, Pálya utca 24. 4/20., Hungary |
| Vendor VAT ID | HU25598386 |
| Contact email | info@edubase.net |
| Website | https://www.edubase.net |
| Documentation | https://developer.edubase.net |
| Source repository | https://github.com/EduBase/MCP |

## What it does

EduBase is an **assessment and e-learning** platform used by 210+ organizations across corporate training, regulated industries, and higher education since 2016 (hundreds of thousands of documented successful exam completions). This MCP server exposes the EduBase REST API as MCP tools so that AI assistants can, on the user's behalf:

- **author** questions across 20+ types, with **parametric** values so every test-taker can receive a unique variant at the same difficulty;
- assemble quiz sets and **schedule** exams with flexible access (link, QR code, PIN) and modes from homework and survey through formal exam;
- **assess** attempts automatically with partial credit, penalties, and configurable tolerance — or apply manual overrides, re-evaluate completed tests, and adjust scores;
- issue tamper-proof, digitally signed certificates with serial numbers, configurable validity (for example 1 day to 5 years), QR/barcode verification, expiration tracking, renewal workflows;
- **track** results live and **audit** complete second-by-second activity logs (including Quiz Flow-style timelines), anti-cheating signals (tab focus, clipboard, response-speed anomalies, parallel logins), and richer behavioral analytics (navigation patterns, time per question, hardware issues) beyond raw scores;
- run **conversational assessments** where participants can chat with a question during an attempt while instructors retain the interaction trail for review;
- **notify** external systems via webhooks on exam and quiz completion, and notify users via email (push/SMS where enabled on the account tier);
- manage users, classes, courses, organizations, departments, tags, fine-grained permissions, and SCORM learning materials;
- run AI-assisted result analysis;
- upload files via the EduBase filebin and read/write every other resource the user could access through the EduBase UI or REST API.

Each call runs against the **consenting user's own EduBase account** with that user's exact permissions. There are no service-account credentials; the MCP server cannot access data the user couldn't already access through the normal EduBase user interface or the EduBase API.

### Scope transparency (reviewers)

The OAuth scope `mcp` is a **single broad scope** aligned with the user's normal API integration permissions. Practically, that means the connector can perform **any action the authenticated user could perform in EduBase**, including destructive or high-impact changes where their role allows it: for example editing or deleting exams and content, changing grades or applying overrides, managing users and permissions, revoking or reissuing certificates, and other write operations exposed by the API. The worst-case blast radius is therefore **the same as giving a human user with that account's roles full UI plus API access** — not a read-only subset.

## Endpoints

The MCP server is deployed at the URL the user pastes into their AI assistant.

| Path | Purpose |
|---|---|
| `POST /mcp` | MCP using Streamable HTTP MCP transport |
| `GET /.well-known/mcp-app.json` | Composite app manifest (this document, machine-readable) |
| `GET /.well-known/openai-app.json` | Same content, OpenAI-friendly path alias |
| `GET /.well-known/ai-plugin.json` | Legacy OpenAI plugin manifest (kept for compatibility with older review pipelines) |
| `GET /.well-known/oauth-protected-resource` | RFC 9728 protected-resource metadata (points at the OAuth IdP) |
| `GET /manifest.json` | Alias for `mcp-app.json` |

## Authentication — OAuth 2.1, EduBase as IdP

The MCP server is a Resource Server. The Authorization Server is EduBase itself.

| Property | Value |
|---|---|
| Grant types | `authorization_code`, `refresh_token` |
| PKCE | required, `S256` only |
| Dynamic client registration | enabled (RFC 7591) at `/oauth/register` |
| Authorization endpoint | `/oauth/authorize` |
| Token endpoint | `/oauth/token` |
| Revocation endpoint | `/oauth/revoke` (RFC 7009) |
| Introspection endpoint | `/oauth/introspect` (RFC 7662) |
| AS metadata | `/.well-known/oauth-authorization-server` (RFC 8414) |
| Access tokens | opaque, 1h TTL, stored DB-side |
| Refresh tokens | rotated on every use, 30d TTL |
| Token format | opaque random strings (no JWT, no JWKS) |
| Scopes | `mcp` (single broad scope mirroring the user's manual API integration permissions; see **Scope transparency** under *What it does*) |

**End-to-end flow**:
1. The MCP client (Claude Desktop, Claude.ai connector, ChatGPT App, …) POSTs `/mcp` with no auth. The MCP server replies `401` with `WWW-Authenticate: Bearer realm="edubase-mcp", resource_metadata="…/.well-known/oauth-protected-resource"`.
2. The client fetches the resource metadata document, learns the EduBase Authorization Server, then fetches `/.well-known/oauth-authorization-server` from EduBase.
3. The client either dynamically registers itself (RFC 7591) or uses pre-registered credentials.
4. The client redirects the user to `/oauth/authorize` with PKCE; the user logs into their EduBase account if needed and approves access on a consent screen that shows the requesting app's name.
5. On approval, EduBase auto-provisions a per-(user, client) MCP API integration if one doesn't exist yet, records the consent, issues an authorization code, and redirects back.
6. The client exchanges code+verifier for an access + refresh token.
7. The client retries `/mcp` with `Authorization: Bearer <token>`. The MCP server forwards the token verbatim to the EduBase API, which resolves it to the auto-provisioned integration and applies that integration's API policy / rate limits / permissions.

The user can revoke access at any time from `/content/integrations` on EduBase, which marks the consent revoked and bulk-revokes all access + refresh tokens immediately.

## Data the MCP server itself stores

None about the user. All persistence (tokens, consents, audit) lives in the EduBase database under the user's account, governed by the existing EduBase privacy policy.

The MCP server process holds in memory: per-session MCP transport state (session id ↔ transport instance), short-lived rate-limit counters, no persistent storage of its own.

## Privacy & legal

- Privacy Policy: https://www.edubase.net/page/privacy-policy
- Terms of Use: https://www.edubase.net/page/terms-of-use
- Legal information: https://www.edubase.net/page/legal
- Status page: https://status.edubase.net

## Hosting & deployment

Self-hostable Node.js process — also distributed on npm as [`@edubase/mcp`](https://www.npmjs.com/package/@edubase/mcp). Runs as `stdio`, `SSE`, or `Streamable HTTP` transport. For OpenAI Apps and Claude Connectors submissions the Streamable HTTP transport with OAuth is required.

Configuration is via environment variables documented in [README.md](./README.md).

## Versioning

This connector follows semver. Breaking changes to existing MCP tools always bump the major version; new tools and additive metadata bump the minor.

The `version` field served in `serverInfo` and the `/.well-known/*` manifests is the npm package version.
