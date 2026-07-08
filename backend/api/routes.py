from fastapi import APIRouter
from backend.api.schemas import ChatRequest
from backend.services.chat_service import ChatService
from backend.api.schemas import RepositoryRequest

from backend.services.index_service import IndexService

router = APIRouter()


@router.post("/index")
def index_repository(request: RepositoryRequest):

    service = IndexService()

    result = service.index_repository(
        request.repo_url
    )
    return result

@router.post("/chat")
def chat(request: ChatRequest):
    service = ChatService()

    return service.chat(
            request.repository,
            request.question
        )
