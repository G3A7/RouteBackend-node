import { ApiError } from "../utils/apiError.js";
import { FAIL } from "../utils/constant.js";

export const validation = (schema) => {
  return (req, res, next) => {
    let validationErrors = [];
    for (const key of Object.keys(schema)) {
      const date = schema[key].validate(req[key], { abortEarly: false });
      if (date?.error) {
        validationErrors.push(date?.error?.details);
      }
    }
    if (validationErrors.length > 0) {
      throw new ApiError(validationErrors, 400, FAIL);
    }
    next();
  };
};
