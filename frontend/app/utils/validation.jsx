import Validator from 'validatorjs';
import DOMPurify from 'dompurify';
import { validateImage } from "image-validator";
import en from 'validatorjs/src/lang/en';

Validator.setMessages('en', en);

Validator.register(
  'confirmed',
  function(value, requirement, attribute) {
    return value === this.inputs[requirement];
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
