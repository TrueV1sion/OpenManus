from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.agent.manus import Manus
from app.logger import logger


class Message(BaseModel):
    role: str
    content: str
    timestamp: Optional[str] = None


class AgentRequest(BaseModel):
    conversation_id: str
    message: str
    history: List[Message] = []


class AgentResponse(BaseModel):
    response: str
    steps: List[str] = []


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting OpenManus Web API")
    yield
    logger.info("Shutting down OpenManus Web API")


app = FastAPI(
    title="OpenManus API",
    description="AI Agent API for OpenManus",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "OpenManus API",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/api/agent/run", response_model=AgentResponse)
async def run_agent(request: AgentRequest):
    try:
        logger.info(f"Received request for conversation {request.conversation_id}")

        try:
            agent = Manus()
        except FileNotFoundError as config_error:
            logger.error("Configuration file not found")
            raise HTTPException(
                status_code=503,
                detail="LLM configuration not set up. Please create config/config.toml with your API credentials. See config/config.example.toml for reference."
            )

        result = await agent.run(request.message)

        steps = []
        for i in range(agent.current_step):
            steps.append(f"Step {i + 1} completed")

        final_response = ""
        if agent.memory.messages:
            last_message = agent.memory.messages[-1]
            if last_message.role == "assistant":
                final_response = last_message.content

        if not final_response:
            final_response = result

        return AgentResponse(
            response=final_response,
            steps=steps,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
