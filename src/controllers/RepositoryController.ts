import { repositoryIssuesInterface } from '../interfaces';
import { RepositoryService } from '../services';

const repositoryService = new RepositoryService();

class RepositoryController {
  searchIssues(repository: repositoryIssuesInterface) {
    return repositoryService.searchIssues(repository);
  }

  issuesStats() {
    return repositoryService.issuesStats();
  }
}

export {
  RepositoryController,
};
