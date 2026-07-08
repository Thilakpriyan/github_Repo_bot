import chromadb


class VectorDatabase:

    def __init__(self):

        self.client = chromadb.PersistentClient(
            path="vector_store"
        )

        self.collection = self.client.get_or_create_collection(
            name="github_repository"
        )

    def add_chunks(
        self,
        chunks,
        embeddings
    ):
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

        self.collection.add(
            ids=ids,
            embeddings=embeddings.tolist(),
            documents=documents,
            metadatas=metadatas
        )