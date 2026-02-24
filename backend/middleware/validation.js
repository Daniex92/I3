import { body, validationResult } from 'express-validator';

export const validateEmail = body('email')
  .isEmail()
  .withMessage('Email inválido')
  .normalizeEmail();

export const validatePhone = body('phone')
  .matches(/^[\d\s\-\+\(\)]{7,20}$/)
  .withMessage('Teléfono inválido');

export const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('La contraseña debe tener al menos 6 caracteres');

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
