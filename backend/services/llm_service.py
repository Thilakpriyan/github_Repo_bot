import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()


class LLMService:

    def __init__(self):

        self.client = Groq(
            api_key=os.getenv("GROQ_API_KEY")
        )

        self.model = "llama-3.3-70b-versatile"

    def generate_answer(self, prompt):

        response = self.client.chat.completions.create(

            model=self.model,

            messages=[
                {
                    "role": "system",
                    "content": "You are a senior software engineer."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.2

        )

        return response.choices[0].message.content