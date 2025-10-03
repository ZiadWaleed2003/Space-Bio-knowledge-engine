import weaviate
from weaviate.classes.config import Configure

# Assume 'client' is your connected Weaviate client

# This is the collection for your research paper chunks

def db_config():
    client = weaviate.connect_to_local()
    
    client.collections.create(
        name="ResearchPaperChunk", # Use a descriptive name
        vector_config=[
            Configure.Vectors.text2vec_nvidia(
                name="content_vector", # A name for this specific vector configuration
                source_properties=["content"], # Tell Weaviate to vectorize the 'content' property
                model="nvidia/nv-embed-v1", # The specific NVIDIA model to use
                base_url="https://integrate.api.nvidia.com/v1" # The NIM API endpoint
            )
        ],
        properties=[
            Configure.Property(name="content", data_type=Configure.DataType.TEXT),
            Configure.Property(name="source_file", data_type=Configure.DataType.TEXT)
            # ... add any other properties you need
        ]
    )