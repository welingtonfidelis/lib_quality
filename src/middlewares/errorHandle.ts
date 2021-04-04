import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors';

const { NODE_ENV } = process.env;

const errorHandleMidleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (NODE_ENV !== 'test') console.log('ERROR ===> \n\n', error, '\n\n <===');

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
    message: `Internal server error: ${error.message}`,
    data: {},
  });
};

export {
  errorHandleMidleware,
};
