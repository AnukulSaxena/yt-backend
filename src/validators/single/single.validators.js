import { body, param, query } from "express-validator";

const singleParamValidator = (item) => {
  return [
    param(item)
      .trim()
      .notEmpty()
      .withMessage(item + " is Required"),
  ];
};

const singleQueryValidator = (item) => {
  return [
    query(item)
      .trim()
      .notEmpty()
      .withMessage(item + " is Required"),
  ];
};

const singleBodyValidator = (item) => {
  return [
    body(item)
      .trim()
      .notEmpty()
      .withMessage(item + " is Required"),
  ];
};

export { singleParamValidator, singleBodyValidator, singleQueryValidator };
