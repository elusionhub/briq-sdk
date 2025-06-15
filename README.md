# Briq SMS SDK

A modern TypeScript SDK for the Briq SMS API. Send messages, manage campaigns, and organize workspaces with full type safety.

## Installation

```bash
npm install @elusion-sdk/briq
# or
bun add @elusion-sdk/briq
```

## Quick Start

```typescript
import { Briq } from "@elusion-sdk/briq";

const briq = new Briq({
  apiKey: "your-api-key", // or set BRIQ_API_KEY env var
});

// Send an instant message
const response = await briq.messages.sendInstant({
  recipients: ["255700000000"],
  content: "Hello from Briq!",
  sender_id: "BRIQ",
});

console.log("Message sent:", response.data);
```

## Features

- **Modern TypeScript** - Full type safety and IntelliSense
- **Instant Messages** - Send SMS to single or multiple recipients
- **Campaign Management** - Create and manage SMS campaigns
- **Workspace Organization** - Organize projects and teams
- **Message Tracking** - Get delivery status and logs
- **Built for Speed** - Optimized for Node.js and modern runtimes

## Core Services

### Messages

```typescript
// Send instant message
await briq.messages.sendInstant({
  recipients: ["255700000000", "255700000000"],
  content: "Your message here",
  sender_id: "your-sender-id",
});

// Get message logs
const logs = await briq.messages.getLogs();
```

### Campaigns

```typescript
// Create campaign
const campaign = await briq.campaigns.create({
  name: "Summer Sale",
  description: "Promotional campaign",
  workspace_id: "workspace-id",
  launch_date: "2025-07-01T10:00:00Z",
});

// Send campaign message
await briq.messages.sendCampaign({
  campaign_id: campaign.data.id,
  group_id: "group-id",
  content: "Special offer inside!",
  sender_id: "your-sender-id",
});
```

### Workspaces

```typescript
// Create workspace
const workspace = await briq.workspaces.create({
  name: "My Project",
  description: "SMS campaigns for my project",
});

// List all workspaces
const workspaces = await briq.workspaces.list();
```

## Configuration

```typescript
const briq = new Briq({
  apiKey: "your-api-key",
  baseURL: "https://karibu.briq.tz", // optional
  timeout: 30000, // optional, default 30s
  headers: {
    // optional custom headers
    "X-Custom-Header": "value",
  },
});
```

## Error Handling

```typescript
try {
  await briq.messages.sendInstant({
    recipients: ["invalid-number"],
    content: "Test message",
    sender_id: "BRIQ",
  });
} catch (error) {
  if (error.status === 400) {
    console.log("Invalid request:", error.message);
  } else if (error.status === 429) {
    console.log("Rate limited, try again later");
  } else {
    console.log("Unexpected error:", error);
  }
}
```

## Environment Variables

```bash
# Set your API key
export BRIQ_API_KEY=your-api-key-here

# Optional: Custom API base URL
export BRIQ_BASE_URL=https://karibu.briq.tz
```

## TypeScript Support

This SDK is built with TypeScript and provides full type definitions. No need to install additional `@types` packages.

## Development

```bash
# Clone and install
git clone https://github.com/elusionhub/briq-sdk.git
cd briq-sdk
bun install

# Build
bun run build
```

## License

MIT © [Elution Hub](https://github.com/elusionhub)

## Support

- Email: elusion.lab@gmail.com
- Issues: [GitHub Issues](https://github.com/elusionhub/briq-sdk/issues)
- Docs: [API Documentation](https://github.com/elusionhub/briq-sdk#readme)
