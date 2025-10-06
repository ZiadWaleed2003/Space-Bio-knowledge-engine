from typing import Any, Dict, List
from sentence_transformers.cross_encoder import CrossEncoder
from functools import lru_cache


@lru_cache(maxsize=None)
def load_reranker_model(model_name="cross-encoder/ms-marco-MiniLM-L-6-v2"):
    try:
        reranker_model = CrossEncoder(model_name)
        print("✅ Cross-encoder model loaded successfully.")
        return reranker_model
    except Exception as e:
        print(f"❌ Error loading cross-encoder model: {e}")
        return None


def rerank_documents(query: str, retrieved_docs:List[Dict[str, Any]], top_k: int = 5) -> list[dict]:
    """
    Re-ranks a list of retrieved documents based on a query using a cross-encoder model.

    Args:
        query (str): The original user query.
        retrieved_docs (list[dict]): A list of dictionaries, where each dict represents
                                     a retrieved document (e.g., from Weaviate).
                                     It must contain a 'content' key.
        top_k (int): The number of top documents to return.

    Returns:
        list[dict]: A new list of documents, sorted by relevance score,
                    with the score added to each dictionary.
    """
    reranker_model = load_reranker_model()
    if not reranker_model:
        print("Reranker model is not available. Returning original documents.")
        return retrieved_docs[:top_k]
        
    # just putting the query and the docs together
    doc_contents = [doc['content'] for doc in retrieved_docs]
    query_doc_pairs = [[query, content] for content in doc_contents]

    # finally prediction
    print(f"\n🚀 Reranking {len(retrieved_docs)} documents...")
    scores = reranker_model.predict(query_doc_pairs, show_progress_bar=True)

    
    for doc, score in zip(retrieved_docs, scores):
        doc['rerank_score'] = score

    # sorting by top k
    sorted_docs = sorted(retrieved_docs, key=lambda x: x['rerank_score'], reverse=True)

    # Return the top K most relevant documents
    return sorted_docs[:top_k]