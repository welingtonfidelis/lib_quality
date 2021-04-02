import {
  NextFunction, Request, Response, Router,
} from 'express';

import {
  inputValidateRepositoryIssues,
  inputValidateRepositoryIssuesStats,
} from '../middlewares';
import { RepositoryController } from '../controllers';
import { repositoryIssuesInterface } from '../interfaces';

const router = Router();
const repositoryController = new RepositoryController();

router.get(
  '/repository/:owner/:project_name/issues',
  inputValidateRepositoryIssues,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { owner, project_name: projectName } = req.params;
      const repository: repositoryIssuesInterface = {
        owner,
        projectName,
      };

      const data = await repositoryController.searchIssues(repository);

      res.json({
        status_code: 200,
        message: 'success',
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/repository/issues/stats',
  inputValidateRepositoryIssuesStats,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await repositoryController.issuesStats();

      res.json({
        status_code: 200,
        message: 'success',
        data,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
