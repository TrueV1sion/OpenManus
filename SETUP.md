# OpenManus Web Application - Setup Guide

## What Was Built

I've transformed OpenManus into a beautiful web application with:

- **Modern React Frontend** - Clean, responsive UI with Tailwind CSS
- **FastAPI Backend** - REST API to interact with the OpenManus AI agent
- **Supabase Database** - Conversation and message persistence with real-time updates
- **Professional Design** - Blue color scheme, smooth animations, intuitive UX

## Prerequisites

Before running the application, you need:

1. **Python 3.12+** with dependencies installed
2. **Node.js** (already available)
3. **LLM API Key** (Anthropic Claude, OpenAI, or Ollama)

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure LLM API

Edit `config/config.toml` and add your API credentials:

```toml
[llm]
model = "claude-3-7-sonnet-20250219"
base_url = "https://api.anthropic.com/v1/"
api_key = "YOUR_API_KEY_HERE"
max_tokens = 8192
temperature = 0.0
```

For other providers (OpenAI, Ollama, Azure), see `config/config.example.toml` for examples.

### 3. Start the Backend Server

```bash
npm run backend
```

This starts the FastAPI server on http://localhost:8000

### 4. Start the Frontend (in a new terminal)

The frontend dev server starts automatically, or you can run:

```bash
npm run dev
```

This starts the Vite dev server on http://localhost:3000

## Features

- **Create Conversations** - Start new chat sessions with the AI agent
- **Message History** - All conversations saved to Supabase
- **Real-time Updates** - Live message streaming
- **Execution Steps** - View detailed agent execution steps
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Themes** - Professional color schemes

## Project Structure

```
├── src/
│   ├── components/        # React components
│   │   ├── ChatInterface.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── MessageItem.jsx
│   ├── hooks/             # React hooks
│   │   ├── useConversations.js
│   │   └── useMessages.js
│   └── lib/
│       └── supabase.js    # Supabase client
├── app/
│   ├── web_api.py         # FastAPI backend
│   ├── agent/             # AI agent code
│   └── ...
└── supabase/
    └── migrations/        # Database schema
```

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /api/agent/run` - Run agent with a message

## Database Schema

The Supabase database includes:

- `conversations` table - Chat sessions
- `messages` table - Individual messages
- Real-time subscriptions enabled
- Row Level Security configured

## Troubleshooting

### Backend won't start
- Ensure Python dependencies are installed: `pip install -r requirements.txt`
- Check that config/config.toml exists with valid API credentials
- Verify port 8000 is not in use

### Frontend shows "Failed to get response"
- Make sure the backend is running on port 8000
- Check browser console for CORS errors
- Verify Supabase environment variables in .env

### Agent errors
- Confirm your LLM API key is valid
- Check you have sufficient API credits
- Review backend logs for detailed error messages

## Next Steps

1. Add user authentication (Supabase Auth)
2. Implement conversation sharing
3. Add file upload capabilities
4. Create conversation export feature
5. Add agent configuration UI

## Support

For issues with:
- OpenManus agent: See original README.md
- Web interface: Check browser console and backend logs
- Database: Verify Supabase connection in .env
