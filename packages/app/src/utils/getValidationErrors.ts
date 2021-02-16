import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach(error => {
    const path = error.path.split('.')[0];

    validationErrors[path] = error.message;
  });

  return validationErrors;
}
