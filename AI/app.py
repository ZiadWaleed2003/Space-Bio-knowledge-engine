from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import logging
import uvicorn
from pyngrok import ngrok

from src.graph.main_graph import MainGraph


app = FastAPI(
    title="NASA Space Biology Knowledge Engine",
    description="API for querying NASA space biology research using AI agents",
    version="1.0.0"
)

graph_instance = None

@app.on_event("startup")
async def startup_event():
    global graph_instance
    try:
        graph_instance = MainGraph()
        
        # Start ngrok tunnel
        port = 8000
        public_url = ngrok.connect(port)
        print("\n" + "="*60)
        print(f"🚀 NASA Space Biology Knowledge Engine API is running!")
        print(f"📡 Public URL: {public_url}")
        print(f"🔗 Share this URL with your friend: {public_url}")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"Failed to initialize MainGraph: {str(e)}")
        raise


class QueryRequest(BaseModel):
    user_prompt: str


class QueryResponse(BaseModel):
    status: str
    final_state: Dict[str, Any]


@app.get("/checkhealth")
async def check_health():
    return {
        "status": "healthy",
        "message": "NASA API is running",
        "graph_initialized": graph_instance is not None
    }


@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    if graph_instance is None:
        raise HTTPException(
            status_code=503,
            detail="Graph not initialized. Service unavailable."
        )
    
    try:
        print(f"received query request: {request.user_prompt}")
        
        final_state = graph_instance.run_graph(request.user_prompt)
                
        return QueryResponse(
            status="success",
            final_state=final_state
        )
        
    except Exception as e:
        print(f"Error processing query: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
