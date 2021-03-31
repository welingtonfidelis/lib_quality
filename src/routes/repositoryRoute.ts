import {
  NextFunction, Request, Response, Router,
} from 'express';

import { inputValidateRepositoryIssues } from '../middlewares';
import { RepositoryController } from '../controllers';
import { repositoryIssuesInterface } from '../interfaces';

const router = Router();
const repositoryController = new RepositoryController();

router.get(
  '/repository/:project_name/issues',
  inputValidateRepositoryIssues,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { project_name: projectName } = req.params;
      const repository: repositoryIssuesInterface = {
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

export default router;
