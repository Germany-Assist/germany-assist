import React, { useState, useEffect } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import PasswordInput from "./PasswordInput";
import TermsCheckbox from "./TermsCheckbox";
import SectionHeader from "./SectionHeader";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  nationality: "",
  countryOfResidence: "",
  companyName: "",
  profileImage: null,
  bio: "",
  idDocument: null,
  proofOfResidence: null,
  businessRegistration: null,
  termsAccepted: false,
};

const initialErrors = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  nationality: "",
  countryOfResidence: "",
  companyName: "",
  bio: "",
  terms: "",
  general: "",
};

const validateName = (name) => {
  const regex = /^[a-zA-Z\s'-]+$/;
  return regex.test(name);
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePhone = (phone) => {
  const regex = /^[0-9+()\-\s]*$/;
  return regex.test(phone);
};

const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });
  return formData;
};

const BasicInfoForm = ({
  role,
  subRole,
  onBack,
  onContinue,
  error,
  setError,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [countries, setCountries] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const inputBaseStyle =
    "w-full py-2.5 px-3 border-2 border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none transition-colors duration-300 focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]";

  const validateField = (field, value, currentFormData = formData) => {
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
        if (!value.trim()) error = "Phone number is required";
        else if (value.replace(/\s/g, "").length < 7 || value.replace(/\s/g, "").length > 20)
          error = "Phone number must be between 7 and 20 characters";
        else if (!validatePhone(value)) error = "Phone number contains invalid characters";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8)
          error = "Password must be at least 8 characters long";
        else if (!/[A-Z]/.test(value))
          error = "Password must contain at least one uppercase letter";
        else if (!/[a-z]/.test(value))
          error = "Password must contain at least one lowercase letter";
        else if (!/[0-9]/.test(value))
          error = "Password must contain at least one number";
        else if (!/[^a-zA-Z0-9]/.test(value))
          error = "Password must contain at least one special character";
        break;
      case "confirmPassword":
        if (!value) error = "Please confirm your password";
        else if (currentFormData.password !== value)
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

  const updateField = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    const fieldError = validateField(field, value, newFormData);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
    if (field === "email" && fieldError === "") {
      setError(null);
    }
  };

  const handleGoogleResponse = (response) => {
    setError(null);
    if (!response.success) {
      setError(response.message);
      return;
    }
    if (response.firstName) updateField("firstName", response.firstName);
    if (response.lastName) updateField("lastName", response.lastName);
    if (response.email) {
      updateField("email", response.email);
      setError(null);
    }
    if (response.phone) updateField("phone", response.phone);
    setErrors((prev) => ({ ...prev, general: "" }));
  };

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common),
        );
        setCountries(sorted);
        setIsLoadingCountries(false);
      })
      .catch(() => setIsLoadingCountries(false));
  }, []);

  const validateForm = () => {
    const newErrors = { ...initialErrors };
    let isValid = true;
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else if (formData.firstName.trim().length < 2 || formData.firstName.trim().length > 50) {
      newErrors.firstName = "First name must be between 2 and 50 characters";
      isValid = false;
    } else if (!validateName(formData.firstName)) {
      newErrors.firstName = "First name can only contain letters, spaces, hyphens, and apostrophes";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else if (formData.lastName.trim().length < 2 || formData.lastName.trim().length > 50) {
      newErrors.lastName = "Last name must be between 2 and 50 characters";
      isValid = false;
    } else if (!validateName(formData.lastName)) {
      newErrors.lastName = "Last name can only contain letters, spaces, hyphens, and apostrophes";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (formData.phone.replace(/\s/g, "").length < 7 || formData.phone.replace(/\s/g, "").length > 20) {
      newErrors.phone = "Phone number must be between 7 and 20 characters";
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone number contains invalid characters";
      isValid = false;
    }

    if (!formData.nationality) {
      newErrors.nationality = "Please select your nationality";
      isValid = false;
    }

    if (!formData.countryOfResidence) {
      newErrors.countryOfResidence = "Please select your country of residence";
      isValid = false;
    }

    if (
      role === "provider" &&
      subRole === "company" &&
      !formData.companyName.trim()
    ) {
      newErrors.companyName = "Company name is required";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
      isValid = false;
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
      isValid = false;
    } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the Terms and Privacy Policy";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    setError("");
    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      nationality: formData.nationality,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      countryOfResidence: formData.countryOfResidence,
      companyName: formData.companyName,
      profileImage: formData.profileImage,
      bio: formData.bio,
      idDocument: formData.idDocument,
      proofOfResidence: formData.proofOfResidence,
      businessRegistration: formData.businessRegistration,
    };
    const formDataPayload = createFormData(data);

    onContinue(formDataPayload);
  };
  return (
    <div className="w-full max-w-[560px] text-left px-4 sm:px-0">
      <button
        onClick={onBack}
        className="flex items-center justify-center gap-1.5 border border-[#E5E7EB] rounded-lg py-1.5 px-2.75 text-sm text-[#6B7280] cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-5 pl-2.5 pr-2.5"
      >
        <span className="flex items-center">←</span> Back
      </button>

      <div className="text-xl font-bold text-[#111827] mb-1">
        {role === "provider"
          ? subRole === "company"
            ? "Company / Organization Account"
            : "Freelancer Account"
          : role === "relocate"
            ? "Individual Account"
            : "Individual Account"}
      </div>

      <div className="text-sm text-[#6B7280] mb-5.5">
        {role === "provider"
          ? subRole === "company"
            ? "Company or organization."
            : "Independent professional."
          : role === "relocate"
            ? "Free access · No transaction fees · Full platform access"
            : "Free access · No transaction fees · Full platform access"}
      </div>

      {(error || errors.general) && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm mb-4">
          <span>⚠</span>
          <span>{error || errors.general}</span>
        </div>
      )}

      <div className="flex w-full justify-left pt-3 pb-3">
        <GoogleLoginButton
          authStyle={"flex items-center justify-left"}
          handleGoogleResponse={handleGoogleResponse}
        />
      </div>

      <div className="mb-5">
        <SectionHeader title="Basic Information" required />

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-2.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <FormInput
              label="First Name"
              value={formData.firstName}
              onChange={(value) => updateField("firstName", value)}
              placeholder="Ahmed"
              required
              error={errors.firstName}
              inputBaseStyle={inputBaseStyle}
            />
            <FormInput
              label="Last Name"
              value={formData.lastName}
              onChange={(value) => updateField("lastName", value)}
              placeholder="Mohamed"
              required
              error={errors.lastName}
              inputBaseStyle={inputBaseStyle}
            />
          </div>
          <span className="text-xs text-[#6B7280]  mt-[-0.7rem]">
            Enter your name exactly as it appears on your passport or official
            ID.
          </span>
          <FormInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => updateField("email", value)}
            placeholder="your@email.com"
            required
            error={errors.email}
            inputBaseStyle={inputBaseStyle}
          />
          <FormInput
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(value) => updateField("phone", value)}
            placeholder="+20 100 000 0000"
            required
            error={errors.phone}
            inputBaseStyle={inputBaseStyle}
          />
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Nationality"
              value={formData.nationality}
              onChange={(value) => updateField("nationality", value)}
              options={countries}
              placeholder="Select your nationality"
              required
              error={errors.nationality}
              inputBaseStyle={inputBaseStyle}
              isLoading={isLoadingCountries}
            />

            <FormSelect
              label="Country of Residence"
              value={formData.countryOfResidence}
              onChange={(value) => updateField("countryOfResidence", value)}
              options={countries}
              placeholder="Select country"
              required
              error={errors.countryOfResidence}
              inputBaseStyle={inputBaseStyle}
              isLoading={isLoadingCountries}
            />
          </div>
        </div>

        {role === "provider" && subRole === "company" && (
          <>
            <div className="mb-2.5">
              <FormInput
                label="Company Name"
                value={formData.companyName}
                onChange={(value) => updateField("companyName", value)}
                placeholder="Official registered company name"
                required
                error={errors.companyName}
                inputBaseStyle={inputBaseStyle}
              />
            </div>
          </>
        )}

        <div className="mb-2.5">
          <PasswordInput
            label="Password"
            value={formData.password}
            onChange={(value) => updateField("password", value)}
            placeholder="Create a password"
            required
            error={errors.password}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            showStrength
            inputBaseStyle={inputBaseStyle}
          />

          <div className="mb-2.5 mt-4">
            <PasswordInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(value) => updateField("confirmPassword", value)}
              placeholder="Repeat password"
              required
              error={errors.confirmPassword}
              showPassword={showConfirmPassword}
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              inputBaseStyle={inputBaseStyle}
            />
          </div>
        </div>

        <TermsCheckbox
          checked={agreedToTerms}
          onChange={(value) => {
            setAgreedToTerms(value);
            if (value) setErrors((prev) => ({ ...prev, terms: "" }));
            else
              setErrors((prev) => ({
                ...prev,
                terms: "You must agree to the Terms and Privacy Policy",
              }));
          }}
          error={errors.terms}
        />
      </div>

      {(error || errors.general) && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm mb-4">
          <span>⚠</span>
          <span>{error || errors.general}</span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl bg-[#024CEE] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[#0341cc] hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] btn-ripple"
      >
        Continue →
      </button>
    </div>
  );
};

export default BasicInfoForm;
