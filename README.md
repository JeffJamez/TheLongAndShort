# TheLongAndShort - Modern File Upload Server

<div align="center">
  A production-ready ShareX-compatible file upload and sharing server
</div>

## Overview

TheLongAndShort (as in "shortening" of "long" Urls 😉) is a modern, feature-rich file upload server that provides a complete solution for file sharing, URL shortening, and media management. Built with Node.js and TypeScript, it offers excellent performance and extensibility.

## Features

- **Quick Setup**: Get started with Docker in minutes
- **Universal Upload**: Support for any file type
- **Organization**: Folders and tags for file management
- **URL Shortening**: Create short, memorable links
- **Rich Embeds**: Automatic media previews for images, videos, audio
- **Webhook Integration**: Discord and HTTP webhooks for notifications
- **Authentication**: OAuth2, 2FA, and Passkey support
- **Security**: Password protection for uploads
- **Media Processing**: Image compression and video thumbnails
- **API**: Full REST API for integrations
- **PWA**: Progressive Web App support
- **Partial Uploads**: Resumeable chunked uploads
- **User Management**: Invites and upload quotas
- **Custom Themes**: Branded user interface

## Tech Stack

- **Runtime**: Node.js (LTS 20.x, 22.x)
- **Language**: TypeScript
- **Framework**: Custom (Fastify-based)
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Local filesystem or S3-compatible
- **Authentication**: OAuth2, 2FA, Passkeys

## Quick Start with Docker

```yaml
services:
  postgresql:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: TheLongAndShort
      POSTGRES_PASSWORD: ${POSTGRESQL_PASSWORD:?Required}
      POSTGRES_DB: TheLongAndShort
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD', 'pg_isready', '-U', 'TheLongAndShort']
      interval: 10s
      timeout: 5s
      retries: 5

  TheLongAndShort:
    image: ghcr.io/diced/zipline
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgres://TheLongAndShort:${POSTGRESQL_PASSWORD}@postgresql:5432/TheLongAndShort
    depends_on:
      postgresql:
        condition: service_healthy
    volumes:
      - './uploads:/TheLongAndShort/uploads'
      - './public:/TheLongAndShort/public'
      - './themes:/TheLongAndShort/themes'

volumes:
  pgdata:
```

### Generate Secrets

```bash
echo "POSTGRESQL_PASSWORD=$(openssl rand -base64 42 | tr -dc A-Za-z0-9 | cut -c -32 | tr -d '\n')" > .env
echo "CORE_SECRET=$(openssl rand -base64 42 | tr -dc A-Za-z0-9 | cut -c -32 | tr -d '\n')" >> .env
```

### Start Server

```bash
docker compose up -d
```

Access the application at http://localhost:3000

## Configuration Options

### Storage Backend

**Local Filesystem** (default):

```bash
DATASOURCE_TYPE=local
DATASOURCE_LOCAL_DIRECTORY=/path/to/files
```

**S3-Compatible**:

```bash
DATASOURCE_TYPE=s3
DATASOURCE_S3_ACCESS_KEY_ID=your-key
DATASOURCE_S3_SECRET_ACCESS_KEY=your-secret
DATASOURCE_S3_BUCKET=your-bucket
DATASOURCE_S3_REGION=us-west-2
```

### Server Settings

```bash
CORE_PORT=3000
CORE_HOSTNAME=0.0.0.0
```

## Development Setup

### Prerequisites

- Node.js LTS (20.x or 22.x)
- pnpm 10.x
- PostgreSQL server

### Installation

```bash
pnpm install
```

### Environment Configuration

Create a `.env` file:

```bash
DEBUG=TheLongAndShort

# Required
CORE_SECRET="32-character-secret-key"

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/TheLongAndShort?schema=public"

# Storage
DATASOURCE_TYPE=local
DATASOURCE_LOCAL_DIRECTORY="./uploads"
```

### Start Development Server

```bash
pnpm dev
```

### Build for Production

```bash
pnpm build
pnpm start
```

## Database Management

TheLongAndShort uses Prisma ORM for database operations.

### Create Migration

```bash
pnpm db:migrate
```

### Prototype Changes

```bash
pnpm db:prototype
```

## API Integration

### Upload File

```bash
curl -X POST https://your-server.com/api/upload \
  -F "file=@/path/to/file.jpg"
```

### Get File Info

```bash
curl https://your-server.com/api/files/:id
```

### Shorten URL

```bash
curl -X POST https://your-server.com/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## Security Features

- **Encryption**: Sensitive data encrypted at rest
- **Rate Limiting**: Prevent abuse
- **File Scanning**: Malware detection (optional)
- **Access Control**: User roles and permissions
- **Audit Logging**: Track all actions

## Architecture Highlights

### Database Schema

Prisma provides type-safe database access with migrations.

### Storage Abstraction

Support for multiple storage backends without code changes:

- Local filesystem
- Amazon S3
- MinIO
- DigitalOcean Spaces
- Backblaze B2

### Webhook System

Flexible webhook system for integrations:

```javascript
// Discord webhook example
{
  "content": "New file uploaded!",
  "embeds": [{
    "title": "file.jpg",
    "fields": [
      { "name": "Size", "value": "1.2 MB" },
      { "name": "Type", "value": "image/jpeg" }
    ]
  }]
}
```

## Documentation

Full documentation available in the project docs.

## License

MIT License - see [LICENSE](LICENSE) for details.
