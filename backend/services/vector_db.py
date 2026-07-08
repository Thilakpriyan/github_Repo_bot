import chromadb


class VectorDatabase:

    def __init__(self):

        self.client = chromadb.PersistentClient(
            path="vector_store"
        )

    def get_or_create_collection(self, collection_name):

        return self.client.get_or_create_collection(
            name=collection_name
        )

    def collection_exists(self, collection_name):

        collections = self.client.list_collections()

        return any(
            collection.name == collection_name
            for collection in collections
        )

    def add_chunks(
        self,
        collection_name,
        chunks,
        embeddings
    ):

        collection = self.get_or_create_collection(
            collection_name
        )

        ids = [
            f"{chunk['file_name']}_{i}"
            for i, chunk in enumerate(chunks)
        ]

        documents = [
            chunk["text"]
            for chunk in chunks
        ]

        metadatas = [
            {
                "file_name": chunk["file_name"],
                "file_path": chunk["file_path"]
            }
            for chunk in chunks
        ]

        collection.add(
            ids=ids,
            embeddings=embeddings.tolist(),
            documents=documents,
            metadatas=metadatas
        )

    def query(
        self,
        collection_name,
        query_embedding,
        top_k=5
    ):

        collection = self.get_or_create_collection(
            collection_name
        )

        return collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=top_k
        )