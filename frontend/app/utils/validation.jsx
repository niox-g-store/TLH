import Validator from 'validatorjs';
import DOMPurify from 'dompurify';
import { validateImage } from "image-validator";
import en from 'validatorjs/src/lang/en';

Validator.setMessages('en', en);

Validator.register(
  'username_format',
  function(value) {
    return /^[a-zA-Z0-9_-]+$/.test(value); // allows only letters, numbers, underscores, dashes
  },
  'Username may only contain letters, numbers, underscores, and dashes.'
);

Validator.register(
  'confirmed',
  function(value, requirement, attribute) {
    const allFields = this.validator?.input || {};
    return value === allFields[requirement];
  },
  'The :attribute confirmation does not match.'
);

export const allFieldsValidation = (data, rules, options) => {
  const validation = new Validator(data, rules, options);
  const validationResponse = { isValid: validation.passes() };
  if (!validationResponse.isValid) {
    validationResponse.errors = validation.errors.all();
  }
  return validationResponse;
};

export const fileValidation = async (file) => {
  try {
    const isValidImage = await validateImage(file);
    if (isValidImage) {
      return true;
    }
  } catch (error) {
    return false
  }
};

export const santizeFields = data => {
  const fields = { ...data };

  for (const field in fields) {
    if (typeof fields[field] === 'string') {
      fields[field] = DOMPurify.sanitize(fields[field], {
        USE_PROFILES: { html: false }
      });
    }
  }
  return fields;
};
