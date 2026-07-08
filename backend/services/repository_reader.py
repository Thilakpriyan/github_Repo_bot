from pathlib import Path


class RepositoryReader:
    """
    Reads all supported source files from a repository.
    """

    SUPPORTED_EXTENSIONS = {
        ".py",
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".java",
        ".cpp",
        ".c",
        ".cs",
        ".go",
        ".rs",
        ".php",
        ".html",
        ".css",
        ".md",
        ".json",
        ".yaml",
        ".yml",
        ".txt"
    }

    IGNORED_DIRECTORIES = {
        ".git",
        "node_modules",
        "__pycache__",
        ".venv",
        "venv",
        "build",
        "dist",
        ".idea",
        ".vscode"
    }

    def read_repository(self, repository_path: str):
        """
        Read all supported files from a repository.
        """

        repository_path = Path(repository_path)

        documents = []

        for file_path in repository_path.rglob("*"):

            if not file_path.is_file():
                continue

            if any(folder in file_path.parts for folder in self.IGNORED_DIRECTORIES):
                continue

            if file_path.suffix.lower() not in self.SUPPORTED_EXTENSIONS:
                continue

            try:
                content = file_path.read_text(
                    encoding="utf-8",
                    errors="ignore"
                )

                documents.append(
                    {
                        "file_name": file_path.name,
                        "file_path": str(file_path),
                        "content": content
                    }
                )

            except Exception as e:
                print(f"Error reading {file_path}: {e}")

        return documents