from fastapi import APIRouter
from backend.api.schemas import ChatRequest
from backend.services.chat_service import ChatService
from backend.api.schemas import RepositoryRequest
from backend.services.repository_service import RepositoryService
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
@router.get("/health")
def health():

    return {
        "status": "healthy"
    }
@router.get("/repositories")
def repositories():

    service = RepositoryService()

    return service.get_repositories()
@router.delete("/repository/{repo_name}")
def delete_repository(repo_name: str):

    service = RepositoryService()

    return service.delete_repository(repo_name)