export const validateName = (name) => {
  const regex = /^[a-zA-Z\s'-]+$/;
  return regex.test(name);
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  return /^\+?[0-9()\-\s]{7,20}$/.test(phone.trim());
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  if (!/[^a-zA-Z0-9]/.test(password)) return "Password must contain at least one special character";
  return "";
};

export const validateField = (field, value, role, subRole, formData) => {
  let error = "";
  switch (field) {
    case "firstName":
      if (!value.trim()) error = "First name is required";
      else if (value.trim().length < 2 || value.trim().length > 50)
        error = "First name must be between 2 and 50 characters";
      else if (!validateName(value))
        error = "First name can only contain letters, spaces, hyphens, and apostrophes";
      break;
    case "lastName":
      if (!value.trim()) error = "Last name is required";
      else if (value.trim().length < 2 || value.trim().length > 50)
        error = "Last name must be between 2 and 50 characters";
      else if (!validateName(value))
        error = "Last name can only contain letters, spaces, hyphens, and apostrophes";
      break;
    case "email":
      if (!value.trim()) error = "Email is required";
      else if (!validateEmail(value)) error = "Invalid email format";
      break;
    case "phone":
      if (!value || !value.trim()) error = "Phone number is required";
      else if (
        value.replace(/\s/g, "").length < 7 ||
        value.replace(/\s/g, "").length > 20
      )
        error = "Phone number must be between 7 and 20 characters";
      else if (!validatePhone(value))
        error = "Phone number contains invalid characters";
      break;
    case "password":
      error = validatePassword(value);
      break;
    case "confirmPassword":
      if (!value) error = "Please confirm your password";
      else if (formData.password !== value)
        error = "Passwords do not match";
      break;
    case "nationality":
      if (!value) error = "Please select your nationality";
      break;
    case "countryOfResidence":
      if (!value) error = "Please select your country of residence";
      break;
    case "companyName":
      if (role === "provider" && subRole === "company" && !value.trim()) {
        error = "Company name is required";
      }
      break;
    default:
      break;
  }
  return error;
};
