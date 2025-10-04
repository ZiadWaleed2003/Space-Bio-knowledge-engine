from langchain_nvidia import ChatNVIDIA
from langchain_cerebras import ChatCerebras
from langchain_groq import ChatGroq
from langsmith import Client as LangSmithClient
from functools import lru_cache

from src.config import CONFIG


@lru_cache(maxsize=None)
def get_main_llm() -> ChatNVIDIA :
    print("--Initializing LLM Client from nvidia llama3.3")
    model = ChatNVIDIA(
        model="meta/llama-3.3-70b-instruct",
            model_provider="langchain-nvidia-ai-endpoints",
            base_url = "https://integrate.api.nvidia.com/v1",
            temperature = 0,
            nvidia_api_key = CONFIG['NVIDIA_API_KEY'],
    )

    return model

@lru_cache(maxsize=None)
def get_router_llm() -> ChatCerebras:

    model = ChatCerebras(
            model="llama-3.3-70b",
            temperature = 0,
            api_key = CONFIG['CEREBRAS_API_KEY'],
    )

    return model


@lru_cache(maxsize=None)
def get_langsmith_client() -> LangSmithClient:
    """Initializes and returns a shared LangSmith Client instance."""
    print("--- Initializing LangSmith Client (This will run only once) ---")
    return LangSmithClient()

@lru_cache(maxsize=None)
def get_query_rewriter():

    try:
        model = ChatGroq(
            model="moonshotai/kimi-k2-instruct",
            temperature = 0,
            api_key = CONFIG['GROQ_API_KEY'],
        )
        return model
    except Exception as e:
        print(f"ERROR initializing LLM: {str(e)}")
        raise
