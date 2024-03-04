import { param } from "express-validator";

const singleParamValidator = (item) => {
  return [
    param(item)
      .trim()
      .notEmpty()
      .withMessage(item + " is Required"),
  ];
};

export { singleParamValidator };
