from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import uvicorn

from src.graph.main_graph import MainGraph


app = FastAPI(
    title="NASA Space Biology Knowledge Engine",
    description="API for querying NASA space biology research using AI agents",
    version="1.0.0"
)


class QueryRequest(BaseModel):
    user_prompt: str


class QueryResponse(BaseModel):
    status: str
    final_state:str
    
@app.get(
        "/"
)
async def main():
    return {"message": "Yeah it's working broski"}

@app.get("/healthy")
async def check_health():
    return {
        "status": "healthy",
        "message": "NASA API is running",
    }


@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    
    try:
        print(f"received query request: {request.user_prompt}")
        
        graph_instance = MainGraph()
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