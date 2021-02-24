import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach(error => {
    let { path } = error;

    if (error.params.label !== '_scope_') {
      [path] = error.path.split('.');
    }

    validationErrors[path] = error.message;
  });

  return validationErrors;
}
