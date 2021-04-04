import { Request, Response, NextFunction } from 'express';

import { AppError } from '../../errors';
import schema from './schema/repository/issues';

const inputValidateRepositoryIssues = (req: Request, res: Response, next: NextFunction) => {
  const input = { ...req.body, ...req.params, ...req.query };
  const options = {
    abortEarly: false,
  };

  const { error } = schema.validate(input, options);

  if (error) {
    throw new AppError(error.message, 400);
  }

  next();
};

export {
  inputValidateRepositoryIssues,
};
