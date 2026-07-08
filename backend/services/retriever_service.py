from sentence_transformers import SentenceTransformer
from services.vector_db import VectorDatabase


class Retriever:

    def __init__(self):

        self.embedding_model = SentenceTransformer(
            "BAAI/bge-small-en-v1.5"
        )

        self.vector_db = VectorDatabase()

    def retrieve(
        self,
        query,
        top_k=5
    ):

        query_embedding = self.embedding_model.encode(
            query
        )

        results = self.vector_db.collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=top_k
        )

        return results