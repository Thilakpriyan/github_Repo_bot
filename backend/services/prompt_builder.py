class PromptBuilder:

    def build_prompt(self, question, chunks):

        context = "\n\n".join(chunks)

        prompt = f"""
You are an expert software engineer.

Answer the user's question ONLY using the repository context below.

If the answer is not present in the context, say:

"I couldn't find enough information in this repository."

Repository Context:
-------------------
{context}

-------------------

Question:
{question}

Answer:
"""

        return prompt