import { body, param, query } from "express-validator";

/**
 *
 * @param {string} idName
 * @description A common validator responsible to validate mongodb ids passed in the url's path variable
 */
export const mongoIdPathVariableValidator = (idName) => {
  return [
    param(idName).notEmpty().isMongoId().withMessage(`Invalid ${idName}`),
  ];
};

/**
 *
 * @param {string} idName
 * @description A common validator responsible to validate mongodb ids passed in the request body
 */
export const mongoIdRequestBodyValidator = (idName) => {
  return [body(idName).notEmpty().isMongoId().withMessage(`Invalid ${idName}`)];
};

export const mongoIdOptionalQueryValidator = (idName) => {
  return [
    query(idName).optional().isMongoId().withMessage(`Invalid ${idName}`),
  ];
};
