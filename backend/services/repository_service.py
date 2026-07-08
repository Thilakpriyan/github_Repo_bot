from backend.services.repository_manager import RepositoryManager


class RepositoryService:

    def __init__(self):

        self.manager = RepositoryManager()

    def get_repositories(self):

        return self.manager.get_all_repositories()

    def delete_repository(self, repo_name):

        deleted = self.manager.remove_repository(repo_name)

        if deleted:
            return {
                "message": "Repository deleted successfully",
                "repository": repo_name
            }

        return {
            "message": "Repository not found"
        }