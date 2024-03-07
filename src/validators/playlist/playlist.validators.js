import { body, param } from "express-validator";

const playlistBodyValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
  ];
};

const playlistPathVariableValidator = () => {
  return [
    param("playlistId")
      .trim()
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid playlistId"),

    param("videoId")
      .trim()
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid videoId"),
  ];
};

export { playlistBodyValidator, playlistPathVariableValidator };
