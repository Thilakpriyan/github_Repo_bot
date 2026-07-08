from backend.services.rag_service import RAGService


class ChatService:

    def __init__(self):

        self.rag = RAGService()

    def chat(
        self,
        repository,
        question
    ):

        answer = self.rag.ask(
            repository,
            question
        )

        return {
            "repository": repository,
            "question": question,
            "answer": answer
        }