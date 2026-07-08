import json
import os


class RepositoryManager:

    def __init__(self):

        self.file_path = "data/repositories.json"

        os.makedirs("data", exist_ok=True)

        if not os.path.exists(self.file_path):

            with open(self.file_path, "w") as file:
                json.dump({}, file)

    def load(self):

        with open(self.file_path, "r") as file:
            return json.load(file)

    def save(self, data):

        with open(self.file_path, "w") as file:
            json.dump(data, file, indent=4)

    def repository_exists(self, repo_name):

        repositories = self.load()

        return repo_name in repositories

    def add_repository(self, repo_name, repo_url):

        repositories = self.load()

        repositories[repo_name] = {
            "url": repo_url
        }

        self.save(repositories)

    def list_repositories(self):

        repositories = self.load()

        return list(repositories.keys())