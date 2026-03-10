import { createLogger } from './logger.js';
const log = createLogger('validate');

/**
 * Validate data against a schema.
 * @param {Object} schema - field definitions { fieldName: { type, required, minLength, maxLength, min, max, pattern, enum } }
 * @param {Object} data - request body to validate
 * @returns {{ valid: boolean, errors?: string[] }}
 */
export function validate(schema, data) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object'] };
  }

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    const hasValue = value !== undefined && value !== null && value !== '';

    // Required check
    if (rules.required && !hasValue) {
      errors.push(`${field} is required`);
      continue;
    }

    // Skip further checks if value is absent and not required
    if (!hasValue) continue;

    // Type checks
    if (rules.type) {
      switch (rules.type) {
        case 'string':
          if (typeof value !== 'string') {
            errors.push(`${field} must be a string`);
            continue;
          }
          break;
        case 'number':
          if (typeof value !== 'number' || Number.isNaN(value)) {
            errors.push(`${field} must be a number`);
            continue;
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(`${field} must be a boolean`);
            continue;
          }
          break;
        case 'email':
          if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(`${field} must be a valid email address`);
            continue;
          }
          break;
        case 'url':
          if (typeof value !== 'string') {
            errors.push(`${field} must be a string`);
            continue;
          }
          try {
            new URL(value);
          } catch {
            errors.push(`${field} must be a valid URL`);
            continue;
          }
          break;
      }
    }

    // String constraints
    if (typeof value === 'string') {
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }
      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        errors.push(`${field} must be at most ${rules.maxLength} characters`);
      }
    }

    // Number constraints
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`);
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`${field} must be at most ${rules.max}`);
      }
    }

    // Pattern check
    if (rules.pattern && typeof value === 'string') {
      const regex = rules.pattern instanceof RegExp ? rules.pattern : new RegExp(rules.pattern);
      if (!regex.test(value)) {
        errors.push(`${field} does not match the required format`);
      }
    }

    // Enum check
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    log.warn('Validation failed: %s', errors.join('; '));
    return { valid: false, errors };
  }

  return { valid: true };
}

/**
 * Create a reusable validation function for a given schema.
 * @param {Object} schema
 * @returns {(body: Object) => { valid: boolean, errors?: string[] }}
 */
export function validateMiddleware(schema) {
  return (body) => validate(schema, body);
}
