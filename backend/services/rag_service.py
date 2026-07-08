from services.retriever_service import Retriever
from services.prompt_builder import PromptBuilder
from services.llm_service import LLMService


class RAGService:

    def __init__(self):

        self.retriever = Retriever()

        self.prompt_builder = PromptBuilder()

        self.llm = LLMService()

    def ask(
            self,
            collection_name,
            question
    ):
        retrieved = self.retriever.retrieve(
            collection_name,
            question
        )

        chunks = retrieved["documents"][0]

        prompt = self.prompt_builder.build_prompt(
            question,
            chunks
        )

        answer = self.llm.generate_answer(
            prompt
        )

        return answer