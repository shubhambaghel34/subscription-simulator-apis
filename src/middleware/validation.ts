import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { Currency, SubscriptionInterval } from '../types/enums';

export const validateCreateSubscription = [
  body('donorId')
    .isString()
    .notEmpty()
    .withMessage('donorId is required and must be a string'),
  
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('amount must be a positive number'),
  
  body('currency')
    .isIn(Object.values(Currency))
    .withMessage('currency must be one of: USD, EUR, GBP, CAD, AUD'),
  
  body('interval')
    .isIn(Object.values(SubscriptionInterval))
    .withMessage('interval must be one of: daily, weekly, monthly, yearly'),
  
  body('campaignDescription')
    .isString()
    .notEmpty()
    .withMessage('campaignDescription is required and must be a string'),
];

export const validateId = [
  param('id')
    .isString()
    .notEmpty()
    .withMessage('id parameter is required'),
];

export const validateDonorId = [
  param('donorId')
    .isString()
    .notEmpty()
    .withMessage('donorId parameter is required'),
];

export const validateSubscriptionId = [
  param('subscriptionId')
    .isString()
    .notEmpty()
    .withMessage('subscriptionId parameter is required'),
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }
  next();
}; 