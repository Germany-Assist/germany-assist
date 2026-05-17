import React, { useState, useEffect } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import FormInput from "./FormInput";
import PasswordInput from "./PasswordInput";
import TermsCheckbox from "./TermsCheckbox";
import SectionHeader from "./SectionHeader";
import CountrySelect from "./CountrySelect";
import { checkEmailExists } from "../../../api/authService";
import { validateField, validateEmail } from "../utils/validation";

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
  about: "",
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
  about: "",
  terms: "",
  general: "",
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
  initialValues,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Sync with initialValues when provided (e.g., when going back)
  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleEmailCheck = async (email) => {
    if (!email || !validateEmail(email)) return;
    setCheckingEmail(true);
    try {
      const { exists } = await checkEmailExists(email);
      if (exists) {
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email:
            prev.email === "This email is already registered" ? "" : prev.email,
        }));
      }
    } catch (err) {
      console.error("Failed to check email:", err);
    } finally {
      setCheckingEmail(false);
    }
  };

  const inputBaseStyle =
    "w-full py-2.5 px-3 border-2 border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none transition-colors duration-300 focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]";

  const isFormReady = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "nationality",
      "countryOfResidence",
      "password",
      "confirmPassword",
    ];

    if (role === "provider" && subRole === "company") {
      requiredFields.push("companyName");
    }

    const hasAllFields = requiredFields.every(
      (field) => !!formData[field]?.toString().trim(),
    );
    const hasNoErrors = Object.values(errors).every((err) => !err);

    return hasAllFields && hasNoErrors && agreedToTerms && !checkingEmail;
  };

  const updateField = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    const fieldError = validateField(field, value, role, subRole, newFormData);
    setErrors((prev) => {
      const newErrors = { ...prev, [field]: fieldError };
      if (
        field !== "email" &&
        prev.email === "This email is already registered"
      ) {
        newErrors.email = prev.email;
      }
      return newErrors;
    });

    if (field === "email" && fieldError === "") {
      setError(null);
    }
  };

  const handleGoogleResponse = async (response) => {
    setError(null);
    if (!response.success) {
      setError(response.message);
      return;
    }

    const newFormData = {
      ...formData,
      firstName: response.firstName || formData.firstName,
      lastName: response.lastName || formData.lastName,
      email: response.email || formData.email,
      phone: response.phone || formData.phone,
      profileImage: response.profilePicture?.url || formData.profileImage,
    };

    setFormData(newFormData);

    const fieldsToValidate = ["firstName", "lastName", "email", "phone"];
    const newErrors = { ...errors };
    fieldsToValidate.forEach((field) => {
      if (response[field]) {
        newErrors[field] = validateField(
          field,
          response[field],
          role,
          subRole,
          newFormData,
        );
      }
    });
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = { ...initialErrors };
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const error = validateField(
        field,
        formData[field],
        role,
        subRole,
        formData,
      );
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the Terms and Privacy Policy";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const email = formData.email.trim();
    setCheckingEmail(true);
    try {
      const { exists } = await checkEmailExists(email);
      if (exists) {
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered",
        }));
        return;
      }
    } catch (err) {
      console.error("Failed to check email:", err);
    } finally {
      setCheckingEmail(false);
    }

    onContinue(createFormData(formData));
  };

  return (
    <div className="w-full max-w-[560px] text-left px-4 sm:px-0 animate-fade-up">
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
          : "Individual Account"}
      </div>

      <div className="text-sm text-[#6B7280] mb-5.5">
        Free access · No transaction fees · Full platform access
      </div>

      {(error || errors.general) && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm mb-4">
          <span>⚠</span>
          <span>{error || errors.general}</span>
        </div>
      )}

      <div className="flex w-full justify-left pt-3 pb-3">
        <GoogleLoginButton
          authStyle="flex items-center justify-left w-full border rounded-lg py-2"
          handleGoogleResponse={handleGoogleResponse}
        />
      </div>

      <div className="relative flex items-center mb-6">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-4 flex-shrink text-gray-500 text-sm">
          or create account with email
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <div className="mb-5">
        <SectionHeader title="Basic Information" required />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <CountrySelect
            label="Nationality"
            value={formData.nationality}
            onChange={(value) => updateField("nationality", value)}
            placeholder="Select your nationality"
            required
            error={errors.nationality}
            inputBaseStyle={inputBaseStyle}
          />
          <CountrySelect
            label="Country of Residence"
            value={formData.countryOfResidence}
            onChange={(value) => updateField("countryOfResidence", value)}
            placeholder="Select country"
            required
            error={errors.countryOfResidence}
            inputBaseStyle={inputBaseStyle}
          />
        </div>

        <p className="text-xs text-[#6B7280] mt-[-1rem] mb-4">
          Enter your name exactly as it appears on your passport or official ID.
        </p>

        <div className="flex flex-col gap-4 mb-6">
          <FormInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => updateField("email", value)}
            onBlur={() => handleEmailCheck(formData.email)}
            placeholder="your@email.com"
            required
            error={errors.email}
            inputBaseStyle={inputBaseStyle}
            autoComplete="email"
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

        {role === "provider" && subRole === "company" && (
          <div className="mb-6">
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
        )}

        <div className="flex flex-col gap-4 mb-6">
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

        <TermsCheckbox
          checked={agreedToTerms}
          onChange={(value) => {
            setAgreedToTerms(value);
            setErrors((prev) => ({
              ...prev,
              terms: value
                ? ""
                : "You must agree to the Terms and Privacy Policy",
            }));
          }}
          error={errors.terms}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormReady()}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all btn-ripple ${
          isFormReady()
            ? "bg-[#024CEE] text-white cursor-pointer hover:bg-[#0341cc] hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
            : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
        }`}
      >
        {checkingEmail ? "Checking email..." : "Continue →"}
      </button>
    </div>
  );
};

export default BasicInfoForm;
