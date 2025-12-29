# Article Automation Server

This is a dedicated Node.js server that handles article automation requests from the frontend.

## Why a separate server?

The Laravel PHP backend cannot reliably execute long-running Node.js processes. This lightweight Express server solves that problem by:
- Running as a dedicated automation service
- Streaming real-time logs to the frontend
- Handling the Node.js automation script natively

## Setup

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm run server
   ```
   
   The server will start on `http://localhost:3001`

3. **Keep it running**: Leave this terminal open while using the frontend automation feature.

## Usage

Once the server is running, you can:
- Click "Run Automation" in the frontend (http://localhost:3000/automation)
- The frontend will connect to this server
- Watch real-time logs as articles are processed
- Get automatic redirect to articles page when complete

## API Endpoints

### `POST /run-automation`
Triggers the article automation script and streams output in real-time using Server-Sent Events (SSE).

**Response format** (SSE stream):
```json
data: {"type": "log", "message": "Processing article..."}
data: {"type": "error", "message": "Error message"}
data: {"type": "complete", "success": true, "message": "Automation completed!"}
```

### `GET /health`
Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "message": "Automation server is running"
}
```

## Troubleshooting

**Frontend shows "Failed to connect to automation server":**
- Make sure this server is running (`npm run server`)
- Check that port 3001 is not being used by another process
- Verify the server output shows "Ready to handle automation requests"

**Automation fails during execution:**
- Check the terminal where the server is running for detailed error logs
- Ensure the `.env` file has a valid `GEMINI_API_KEY`
- Verify database connection in Laravel backend

## Architecture

```
Frontend (React)
    ↓ HTTP POST
Automation Server (Express on :3001)
    ↓ spawn child process
automation.js (Node.js script)
    ↓ writes to
Database (via Laravel API)
```
