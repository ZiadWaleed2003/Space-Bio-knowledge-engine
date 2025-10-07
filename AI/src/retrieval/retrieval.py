import logging
from src.db.db_client import connect_to_local_vec_store


class Retrieval:
    def __init__(self):
        self.weaviate_client = connect_to_local_vec_store()
        self.collection_name = "ResearchPaperChunks"

    def retrieve_docs(self , query , top_k = 20):
        try:
                # Get the collection
                collection = self.weaviate_client.collections.get(self.collection_name)
                
                # Perform semantic search using the named vector
                response = collection.query.near_text(
                    query=query,
                    limit=top_k,  # Top 20 documents
                    return_metadata=['distance', 'certainty'],
                    target_vector="content_vector" 
                )
                
                # Extract the results
                retrieved_docs = []
                for idx, obj in enumerate(response.objects):
                    doc = {
                        'rank': idx + 1,
                        'content': obj.properties.get('content', ''),
                        'paper_title': obj.properties.get('paper_title', ''),
                        'main_topic': obj.properties.get('main_topic', ''),
                        'sub_topic': obj.properties.get('sub_topic', ''),
                        'section_title': obj.properties.get('section_title', ''),
                        'distance': obj.metadata.distance if obj.metadata else None,
                        'certainty': obj.metadata.certainty if obj.metadata else None
                    }
                    retrieved_docs.append(doc)
                    logging.info(f"[RETRIEVER NODE] Doc {idx + 1}: {doc['paper_title'][:50]}... (certainty: {doc['certainty']})")
                
                logging.info(f"[RETRIEVER NODE] Successfully retrieved {len(retrieved_docs)} documents")
                return retrieved_docs
                    
        except Exception as e:
            logging.error(f"[RETRIEVER NODE] Error during retrieval: {str(e)}")
            return None