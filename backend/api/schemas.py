from pydantic import BaseModel


class RepositoryRequest(BaseModel):
    repo_url: str


class ChatRequest(BaseModel):
    repository: str
    question: str