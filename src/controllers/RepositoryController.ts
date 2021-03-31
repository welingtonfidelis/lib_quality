import { repositoryIssuesInterface } from '../interfaces';
import { RepositoryService } from '../services';

const repositoryService = new RepositoryService();

class RepositoryController {
  searchIssues(repository: repositoryIssuesInterface) {
    return repositoryService.searchIssues(repository);
  }
}

export {
  RepositoryController,
};
