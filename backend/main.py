# from services.rag_service import RAGService
# from services.github_service import GitHubService
# from services.repository_reader import RepositoryReader
# from services.chunker import DocumentChunker
# from services.embedding_service import EmbeddingService
# from services.vector_db import VectorDatabase
# from services.retriever_service import Retriever
# from services.repository_manager import RepositoryManager
# def main():
#
#     github = GitHubService()
#
#     reader = RepositoryReader()
#
#     chunker = DocumentChunker()
#
#     embedding_service = EmbeddingService()
#
#     vector_db = VectorDatabase()
#
#
#     repo_url = input("Enter GitHub Repository URL: ")
#
#     print("\nCloning Repository...")
#
#     repository_path = github.clone_repository(repo_url)
#     repo_name = repo_url.rstrip("/").split("/")[-1]
#
#
#     repository_manager = RepositoryManager()
#
#     print("Repository cloned successfully!\n")
#
#     print("Reading repository files...")
#
#     documents = reader.read_repository(repository_path)
#
#     print(f"Files Found : {len(documents)}\n")
#
#     print("Chunking documents...")
#
#     chunks = chunker.chunk_documents(documents)
#
#     print(f"Chunks Created : {len(chunks)}\n")
#
#     print("Generating embeddings...")
#
#     embeddings = embedding_service.generate_embeddings(chunks)
#
#     print("Embeddings Generated!\n")
#
#     print("Saving into ChromaDB...")
#
#     if repository_manager.repository_exists(repo_name):
#
#         print(f"\n✅ '{repo_name}' is already indexed.")
#
#     else:
#
#         print("\nRepository not indexed.")
#         print("Indexing repository...")
#
#         repository_path = github.clone_repository(repo_url)
#
#         documents = reader.read_repository(repository_path)
#
#         chunks = chunker.chunk_documents(documents)
#
#         embeddings = embedding_service.generate_embeddings(chunks)
#
#         vector_db.add_chunks(
#             repo_name,
#             chunks,
#             embeddings
#         )
#
#         repository_manager.add_repository(
#             repo_name,
#             repo_url
#         )
#
#     print("Repository Indexed Successfully!")
#     collections = vector_db.client.list_collections()
#     print("\nCollections:")
#     for collection in collections:
#         print(collection.name)
#
#     rag = RAGService()
#
#     print("\n======================================")
#     print("GitHub Repository Chatbot")
#     print("======================================")
#
#     while True:
#
#         question = input("\nAsk Question (type exit to quit): ")
#
#         if question.lower() == "exit":
#             break
#
#         answer = rag.ask(
#             repo_name,
#             question
#         )
#
#
#
#
#
#
#         print("\n")
#         print("=" * 70)
#         print("AI Answer")
#         print("=" * 70)
#         print(answer)
#
# if __name__ == "__main__":
#     main()

from fastapi import FastAPI

from backend.api.routes import router

app = FastAPI(
    title="GitHub Repository Chatbot",
    version="1.0.0"
)

app.include_router(router)