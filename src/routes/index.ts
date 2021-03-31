import { Router } from 'express';

import repositoryRoute from './repositoryRoute';

const router = Router();

router.use(repositoryRoute);

export { router };
