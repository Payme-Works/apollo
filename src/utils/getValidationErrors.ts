import { ValidationError } from 'yup';

interface ValidationErrors {
  [key: string]: string;
}

export function getValidationErrors(err: ValidationError): ValidationErrors {
  const validationErrors: ValidationErrors = {};

  err.inner.forEach(error => {
    let { path } = error;

    if (error.params.label !== '_scope_') {
      [path] = error.path.split('.');
    }

    validationErrors[path] = error.message;
  });

  return validationErrors;
}
