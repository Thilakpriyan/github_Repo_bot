from sentence_transformers import SentenceTransformer
from backend.services.vector_db import VectorDatabase


class Retriever:

    def __init__(self):

        self.embedding_model = SentenceTransformer(
            "BAAI/bge-small-en-v1.5"
        )

        self.vector_db = VectorDatabase()

    def retrieve(
        self,
        collection_name,
        query,
        top_k=5
    ):

        query_embedding = self.embedding_model.encode(
            query
        )

        return self.vector_db.query(
            collection_name,
            query_embedding,
            top_k
        )