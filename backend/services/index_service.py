from backend.services.github_service import GitHubService
from backend.services.repository_reader import RepositoryReader
from backend.services.chunker import DocumentChunker
from backend.services.embedding_service import EmbeddingService
from backend.services.vector_db import VectorDatabase
from backend.services.repository_manager import RepositoryManager


class IndexService:

    def __init__(self):

        self.github = GitHubService()

        self.reader = RepositoryReader()

        self.chunker = DocumentChunker()

        self.embedding_service = EmbeddingService()

        self.vector_db = VectorDatabase()

        self.repository_manager = RepositoryManager()

    def index_repository(self, repo_url):

        repo_name = repo_url.rstrip("/").split("/")[-1]

        # Already Indexed
        if self.repository_manager.repository_exists(repo_name):

            return {
                "message": "Repository already indexed",
                "repository": repo_name
            }

        # Clone Repository
        repository_path = self.github.clone_repository(repo_url)

        # Read Files
        documents = self.reader.read_repository(repository_path)

        # Chunk Documents
        chunks = self.chunker.chunk_documents(documents)

        # Generate Embeddings
        embeddings = self.embedding_service.generate_embeddings(chunks)

        # Save to ChromaDB
        self.vector_db.add_chunks(
            repo_name,
            chunks,
            embeddings
        )

        # Save Repository Metadata
        self.repository_manager.add_repository(
            repo_name,
            repo_url
        )

        return {
            "message": "Repository indexed successfully",
            "repository": repo_name,
            "files": len(documents),
            "chunks": len(chunks)
        }