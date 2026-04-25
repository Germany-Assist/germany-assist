import React, { useState, useEffect } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import PasswordInput from "./PasswordInput";
import FileUpload from "./FileUpload";
import ProfileImageUpload from "./ProfileImageUpload";
import TermsCheckbox from "./TermsCheckbox";
import SectionHeader from "./SectionHeader";

const initialFormData = {
  firstName: "",
  lastName: "",
  displayName: "",
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
};

const initialErrors = {
  firstName: "",
  lastName: "",
  displayName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  nationality: "",
  countryOfResidence: "",
  companyName: "",
  bio: "",
  general: "",
};

const validateName = (name) => {
  const regex = /^[a-zA-Z\s'-]*$/;
  return regex.test(name);
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePhone = (phone) => {
  const regex = /^\+?[\d\s-]{10,}$/;
  return regex.test(phone.replace(/\s/g, ""));
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
  console.log(formData.values());
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

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }
  };

  const handleGoogleResponse = (response) => {
    if (response.firstName) updateField("firstName", response.firstName);
    if (response.lastName) updateField("lastName", response.lastName);
    if (response.email) updateField("email", response.email);
    if (response.phone) updateField("phone", response.phone);
    if (response.nationality) updateField("nationality", response.nationality);
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
    } else if (!validateName(formData.firstName)) {
      newErrors.firstName =
        "Only letters, spaces, hyphens, and apostrophes allowed";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else if (!validateName(formData.lastName)) {
      newErrors.lastName =
        "Only letters, spaces, hyphens, and apostrophes allowed";
      isValid = false;
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
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
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number";
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
      newErrors.password = "Password must be at least 8 characters";
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
      newErrors.general = "You must agree to the Terms of Service";
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
      displayName: formData.displayName,
      nationality: formData.country,
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
            ? "Office Account"
            : "Freelancer Account"
          : "Individual Account"}
      </div>

      <div className="text-sm text-[#6B7280] mb-5.5">
        Fill in your details to get started.
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
        <SectionHeader icon="👤" title="Basic Information" required />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2.5">
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
          <SectionHeader icon="🌍" title="Location" />

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
        {role === "provider" ? (
          <SectionHeader icon="🏢" title="Company Name" />
        ) : (
          <SectionHeader icon="🏢" title="Display Name" />
        )}
        <div className="mb-2.5">
          <FormInput
            label={role === "provider" ? `Company Name` : `Display Name`}
            value={formData.displayName}
            onChange={(value) => updateField("displayName", value)}
            placeholder="How you'll appear"
            required
            error={errors.displayName}
            inputBaseStyle={inputBaseStyle}
          />
          <p className="text-[11px] text-[#6B7280] mt-1 ml-1">
            This name will be shown publicly on your profile.
          </p>
        </div>

        {role === "provider" && (
          <div className="mb-2.5">
            <SectionHeader icon="📝" title="About You" />
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">
                Bio{" "}
                <span className="text-[#6B7280] font-normal text-xs">
                  — Optional
                </span>
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                placeholder="Tell clients about yourself, your expertise, and what services you offer..."
                rows={4}
                className={`${inputBaseStyle} resize-none ${
                  errors.bio
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#E5E7EB] focus:border-[#024CEE]"
                }`}
              />
              <p className="text-[11px] text-[#6B7280] mt-1 ml-1">
                {formData.bio.length}/500 characters
              </p>
            </div>
          </div>
        )}

        <div className="mb-2.5">
          <SectionHeader icon="🔒" title="Security" />

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
            {formData.confirmPassword && (
              <div
                className={`text-xs mt-1.5 ml-1 ${
                  formData.password === formData.confirmPassword
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formData.password === formData.confirmPassword
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <SectionHeader
            icon="🏅"
            title="Credential Uploads"
            subtitle="earn verified badges · PDF, JPG, PNG · max 5MB"
          />
          <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
            Upload your credentials to earn badges that appear on your public
            profile. The more you verify, the higher you rank in search results.
          </p>

          <FileUpload
            icon="🪪"
            title="Passport or National ID "
            subtitle="Required for all members to fully use the platform."
            badge
            badgeText="Optional"
            file={formData.idDocument}
            fieldName="idDocumentument"
            onUpload={(file) => updateField("idDocument", file)}
            onRemove={() => updateField("idDocument", null)}
            accept=".pdf,.jpg,.jpeg,.png"
          />

          {role === "provider" && subRole === "company" && (
            <>
              <FileUpload
                icon="🏠"
                title="Proof of Residence"
                subtitle="Document proving your business address."
                badge
                badgeText="Optional"
                file={formData.proofOfResidence}
                fieldName="proofOfResidence"
                onUpload={(file) => updateField("proofOfResidence", file)}
                onRemove={() => updateField("proofOfResidence", null)}
                accept=".pdf,.jpg,.jpeg,.png"
              />

              <FileUpload
                icon="📋"
                title="Business Registration"
                subtitle="Upload your official company registration document (PDF)."
                badge
                badgeText="Optional"
                file={formData.businessRegistration}
                fieldName="businessRegistration"
                onUpload={(file) => updateField("businessRegistration", file)}
                onRemove={() => updateField("businessRegistration", null)}
                accept=".pdf"
              />
            </>
          )}
        </div>

        <ProfileImageUpload
          file={formData.profileImage}
          onUpload={(file) => updateField("profileImage", file)}
        />

        <TermsCheckbox checked={agreedToTerms} onChange={setAgreedToTerms} />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl bg-[#024CEE] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[#0341cc] shadow-md active:scale-[0.98]"
      >
        Continue →
      </button>
    </div>
  );
};

export default BasicInfoForm;
