import { body } from "express-validator";

export const createFreelancerValidator = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("First name must be between 1 and 100 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Last name must be between 1 and 100 characters"),

  body("displayName")
    .trim()
    .notEmpty()
    .withMessage("Display name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Display name must be between 3 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+?[\d\s-]{10,}$/)
    .withMessage("Invalid phone number"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("nationality")
    .trim()
    .notEmpty()
    .withMessage("Nationality is required"),

  body("countryOfResidence")
    .trim()
    .notEmpty()
    .withMessage("Country of residence is required"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must not exceed 500 characters"),
];

export const createCompanyValidator = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("First name must be between 1 and 100 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Last name must be between 1 and 100 characters"),

  body("displayName")
    .trim()
    .notEmpty()
    .withMessage("Display name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Display name must be between 3 and 100 characters"),

  body("companyName")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Company name must be between 2 and 200 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+?[\d\s-]{10,}$/)
    .withMessage("Invalid phone number"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("nationality")
    .trim()
    .notEmpty()
    .withMessage("Nationality is required"),

  body("countryOfResidence")
    .trim()
    .notEmpty()
    .withMessage("Country of residence is required"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must not exceed 500 characters"),
];

export const createServiceProviderValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Name must be between 3 and 200 characters"),

  body("about")
    .trim()
    .notEmpty()
    .withMessage("About is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("About must be between 10 and 5000 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Description must be between 10 and 5000 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("phoneNumber")
    .optional()
    .isLength({ min: 7, max: 20 })
    .withMessage("Phone number must be between 7 and 20 characters")
    .matches(/^[0-9+()\-\s]*$/)
    .withMessage("Phone number contains invalid characters"),

  body("image")
    .optional()
    .isURL()
    .withMessage("Image must be a valid URL")
    .matches(/\.(jpg|jpeg|png|gif)$/i)
    .withMessage("Image must end with .jpg, .jpeg, .png, or .gif"),
];

export const updateServiceProviderValidator = [
  body("name")
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage("Name must be between 3 and 200 characters"),

  body("about")
    .optional()
    .isLength({ min: 10, max: 5000 })
    .withMessage("About must be between 10 and 5000 characters"),

  body("description")
    .optional()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Description must be between 10 and 5000 characters"),

  body("phoneNumber")
    .optional()
    .isLength({ min: 7, max: 20 })
    .withMessage("Phone number must be between 7 and 20 characters")
    .matches(/^[0-9+()\-\s]*$/)
    .withMessage("Phone number contains invalid characters"),

  body("image")
    .optional()
    .isURL()
    .withMessage("Image must be a valid URL")
    .matches(/\.(jpg|jpeg|png|gif)$/i)
    .withMessage("Image must end with .jpg, .jpeg, .png, or .gif"),
];
