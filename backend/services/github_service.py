from pathlib import Path
from git import Repo


class GitHubService:

    def __init__(self):
        self.repo_base_path = Path("repositories")
        self.repo_base_path.mkdir(exist_ok=True)

    def clone_repository(self, repo_url: str) -> Path:

        repo_name = repo_url.rstrip("/").split("/")[-1]

        local_path = self.repo_base_path / repo_name

        if local_path.exists():
            print(f"Repository already exists: {local_path}")
            return local_path

        print(f"Cloning {repo_url}...")

        Repo.clone_from(repo_url, local_path)

        print("Clone completed.")

        return local_path