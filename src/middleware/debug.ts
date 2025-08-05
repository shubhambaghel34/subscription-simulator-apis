import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const debugMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.LOG_LEVEL === 'debug') {
    logger.debug('Request Details', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }
  next();
};

export const responseDebugMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  res.send = function(data) {
    if (process.env.LOG_LEVEL === 'debug') {
      logger.debug('Response Details', {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseData: data
      });
    }
    return originalSend.call(this, data);
  };
  next();
};

export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.debug('Request Performance', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  next();
}; 