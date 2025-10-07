import weaviate
from weaviate.classes.config import Configure, Property, DataType
from dotenv import load_dotenv
import os

load_dotenv()


def connect_to_local_vec_store():
    try:
        # Use environment variable for Weaviate host, default to localhost for local dev
        weaviate_host = os.getenv("WEAVIATE_HOST", "localhost")
        weaviate_port = os.getenv("WEAVIATE_PORT", "8080")
        
        client = weaviate.connect_to_local(
            host=weaviate_host,
            port=int(weaviate_port)
        )
        print(f"✅ Successfully connected to Weaviate at {weaviate_host}:{weaviate_port}.")
        return client
    except Exception as e:
        print(f"❌ Failed to connect to Weaviate: {e}")


def create_collections():
    
    try :

        client = connect_to_local_vec_store()
        if client:

            # --- Define and Create the Collection ---
            collection_name = "ResearchPaperChunks"

            # To ensure a clean start, delete the collection if it already exists
            if client.collections.exists(collection_name):
                client.collections.delete(collection_name)
                print(f"🧹 Deleted existing collection: '{collection_name}'")
            
            client.collections.create(
            name=collection_name,
            vectorizer_config=[
                Configure.NamedVectors.text2vec_nvidia(
                    name="content_vector",
                    source_properties=["content"],
                    model="nvidia/llama-3.2-nemoretriever-300m-embed-v2"
                )
            ],
            properties=[
                # --- This property will be vectorized ---
                Property(name="content", data_type=DataType.TEXT),

                # --- These properties are for filtering ONLY ---
                Property(name="paper_title", data_type=DataType.TEXT),
                Property(name="main_topic", data_type=DataType.TEXT),
                Property(name="sub_topic", data_type=DataType.TEXT),
                Property(name="section_title", data_type=DataType.TEXT),
            ]
        )
        print(f"✅ Successfully created collection: '{collection_name}'")

        return client

            
    except Exception as e:
        print(f"Couldn't connect to the vec db {e}")
        return False