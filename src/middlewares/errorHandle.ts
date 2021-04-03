import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors';

const errorHandleMidleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('ERROR ===> \n\n', error, '\n\n <===');

  if (error instanceof AppError) {
    const code = (error.code && error.code >= 100 && error.code <= 511) ? error.code : 500;
    const message = error.message || 'Internal server error.';

    return res.status(code).json({
      status_code: code,
      message,
      data: {},
    });
  }

  return res.status(500).json({
    status_code: 500,
    message: 'Internal server error',
    data: {},
  });
};

export {
  errorHandleMidleware,
};
