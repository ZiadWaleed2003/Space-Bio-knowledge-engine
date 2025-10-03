from langchain_nvidia import ChatNVIDIA
from langchain_cerebras import ChatCerebras
from langchain_google_genai import ChatGoogleGenerativeAI
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
            model="qwen/qwen-3-32b",
            model_provider="langchain-nvidia-ai-endpoints",
            temperature = 0,
            nvidia_api_key = CONFIG['CEREBRAS_API_KEY'],
    )

    return model


@lru_cache(maxsize=None)
def get_langsmith_client() -> LangSmithClient:
    """Initializes and returns a shared LangSmith Client instance."""
    print("--- Initializing LangSmith Client (This will run only once) ---")
    return LangSmithClient()

@lru_cache(maxsize=None)
def get_query_parser():

    try:
        model = ChatGoogleGenerativeAI(
            model="gemini/gemini-2.0-flash",
            api_key=CONFIG['GEMINI_API_KEY'],
            temperature=0
        )
        return model
    except Exception as e:
        print(f"ERROR initializing LLM: {str(e)}")
        raise
