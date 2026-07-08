from langchain_text_splitters import RecursiveCharacterTextSplitter


class DocumentChunker:

    def __init__(
        self,
        chunk_size=800,
        chunk_overlap=150
    ):

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                " ",
                ""
            ]
        )

    def chunk_documents(self, documents):

        chunks = []

        for document in documents:

            split_chunks = self.text_splitter.split_text(
                document["content"]
            )

            for index, chunk in enumerate(split_chunks):

                chunks.append(
                    {
                        "chunk_id": index,
                        "text": chunk,
                        "file_name": document["file_name"],
                        "file_path": document["file_path"]
                    }
                )

        return chunks