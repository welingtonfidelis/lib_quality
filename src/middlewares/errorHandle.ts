import { NextFunction, Request, Response } from 'express';

const errorHandleMidleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.log('ERROR ===> \n\n', error, '\n\n <===');

  const code = (error.code && error.code >= 100 && error.code <= 511) ? error.code : 500;
  const message = error.message || 'Internal server error.';

  return res.status(code).json({
    status_code: code,
    message,
    data: {},
  });
};

export {
  errorHandleMidleware,
};
