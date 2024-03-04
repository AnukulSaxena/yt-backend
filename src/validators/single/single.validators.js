import { param, query } from "express-validator";

const singleParamValidator = (item) => {
  return [
    param(item)
      .trim()
      .notEmpty()
      .withMessage(item + " is Required"),
  ];
};

const singleOptionalQueryValidator = (item) => {};

export { singleParamValidator };
