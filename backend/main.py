from services.github_service import GitHubService
from services.repository_reader import RepositoryReader
from services.chunker import DocumentChunker
from services.embedding_service import EmbeddingService
from services.vector_db import VectorDatabase
from services.retriever_service import Retriever

def main():

    github = GitHubService()

    reader = RepositoryReader()

    chunker = DocumentChunker()

    embedding_service = EmbeddingService()

    vector_db = VectorDatabase()

    repo_url = input("Enter GitHub Repository URL: ")

    print("\nCloning Repository...")

    repository_path = github.clone_repository(repo_url)

    print("Repository cloned successfully!\n")

    print("Reading repository files...")

    documents = reader.read_repository(repository_path)

    print(f"Files Found : {len(documents)}\n")

    print("Chunking documents...")

    chunks = chunker.chunk_documents(documents)

    print(f"Chunks Created : {len(chunks)}\n")

    print("Generating embeddings...")

    embeddings = embedding_service.generate_embeddings(chunks)

    print("Embeddings Generated!\n")

    print("Saving into ChromaDB...")

    vector_db.add_chunks(chunks, embeddings)

    print("Repository Indexed Successfully!")

    retriever = Retriever()

    print("\n==============================")

    while True:

        question = input("\nAsk Question (type exit to quit): ")

        if question.lower() == "exit":
            break

        results = retriever.retrieve(question)

        print("\nTop Retrieved Chunks\n")

        for i, document in enumerate(results["documents"][0], 1):
            metadata = results["metadatas"][0][i - 1]

            print("=" * 60)

            print(f"Rank : {i}")

            print(f"File : {metadata['file_name']}")

            print()

            print(document[:700])

            print()


if __name__ == "__main__":
    main()