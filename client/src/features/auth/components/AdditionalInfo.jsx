import React, { useState, useEffect } from "react";
import ProfileImageUpload from "./ProfileImageUpload";
import FileUpload from "./FileUpload";
import CategorySelect from "./CategorySelect";

const AdditionalInfo = ({
  role,
  subRole,
  onBack,
  onSkip,
  onComplete,
  initialProfileImage,
  isSubmitting = false,
  error = "",
}) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [formData, setFormData] = useState({
    profileImage: null,
    about: "",
    categories: [],
    categoryUploads: {},
    idDocument: null,
    proofOfResidence: null,
    businessRegistration: null,
  });

  useEffect(() => {
    if (initialProfileImage && !formData.profileImage) {
      setFormData((prev) => ({ ...prev, profileImage: initialProfileImage }));
    }
  }, [initialProfileImage]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoriesChange = (newCategories, uploadData = null) => {
    if (uploadData?.files) {
      setFormData((prev) => ({
        ...prev,
        categoryUploads: {
          ...prev.categoryUploads,
          [uploadData.categoryId]: uploadData.files,
        },
      }));
    } else if (newCategories) {
      const removedCategories = formData.categories.filter(
        (c) => !newCategories.includes(c),
      );
      const newCategoryUploads = { ...formData.categoryUploads };
      removedCategories.forEach((catId) => delete newCategoryUploads[catId]);

      setFormData((prev) => ({
        ...prev,
        categories: newCategories,
        categoryUploads: newCategoryUploads,
      }));
    }
  };

  const canProceedFromCategories = () => {
    if (formData.categories.length === 0) return true;
    return Object.values(formData.categoryUploads).some(
      (files) => files?.length > 0,
    );
  };

  const handleNext = () => {
    const maxSteps = role === "provider" ? 3 : 1;
    if (currentSubStep < maxSteps) {
      setCurrentSubStep(currentSubStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentSubStep === 1) onBack();
    else setCurrentSubStep(currentSubStep - 1);
  };

  const inputBaseStyle =
    "w-full py-2.5 px-3 border-2 border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none transition-colors duration-300 focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]";

  return (
    <div className="w-full max-w-[560px] text-left px-4 sm:px-0 animate-fade-up">
      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm mb-4 animate-shake">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {role === "provider" && (
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                  currentSubStep === step
                    ? "bg-[#024CEE] border-[#024CEE] text-white ring-4 ring-blue-50"
                    : currentSubStep > step
                      ? "bg-blue-50 border-blue-400 text-blue-400"
                      : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-0.5 rounded ${currentSubStep > step ? "bg-blue-400" : "bg-gray-200"}`}
                />
              )}
            </React.Fragment>
          ))}
          <span className="text-sm text-gray-500 ml-2">
            {currentSubStep === 1 && "Profile"}
            {currentSubStep === 2 && "Categories"}
            {currentSubStep === 3 && "Verification"}
          </span>
        </div>
      )}

      <button
        onClick={handleBack}
        disabled={isSubmitting}
        className="flex items-center gap-1.5 border border-gray-200 rounded-lg py-1.5 px-3 text-sm text-gray-500 hover:border-blue-300 hover:text-gray-900 mb-6 disabled:opacity-50"
      >
        ← Back
      </button>

      {isSubmitting && (
        <div className="flex flex-col items-center justify-center gap-2 p-4 mb-6 bg-blue-50 rounded-xl border border-blue-200">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-blue-600">
            Processing...
          </span>
        </div>
      )}

      <div className="fade-in">
        {currentSubStep === 1 && (
          <>
            <h2 className="text-xl font-bold mb-1">Profile Setup</h2>
            <p className="text-sm text-gray-500 mb-6">
              {role === "provider"
                ? "Add a photo and description so clients can learn more about you."
                : "Upload your profile photo and ID to activate your account."}
            </p>

            <div className="mb-6">
              <ProfileImageUpload
                file={formData.profileImage}
                onUpload={(file) => updateField("profileImage", file)}
                onRemove={() => updateField("profileImage", null)}
              />
            </div>

            {role === "provider" && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  About{" "}
                  <span className="text-gray-400 font-normal">
                    (80-600 chars)
                  </span>
                </label>
                <textarea
                  value={formData.about}
                  onChange={(e) => updateField("about", e.target.value)}
                  placeholder="Share your experience and qualifications..."
                  rows={4}
                  className={`${inputBaseStyle} resize-none`}
                  maxLength={600}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[11px] text-gray-400">
                    {formData.about.length < 80
                      ? "Min 80 characters recommended"
                      : ""}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formData.about.length}/600
                  </span>
                </div>
              </div>
            )}

            {role === "individual" && (
              <div className="mb-6">
                <FileUpload
                  icon="🪖"
                  title="Passport or National ID "
                  subtitle="Upload a clear scan or photo — PDF, JPG, or PNG. Reviewed securely and never shared publicly."
                  badge
                  badgeText="Required"
                  files={formData.idDocument ? [formData.idDocument] : []}
                  onUpload={(files) =>
                    updateField(
                      "idDocument",
                      Array.isArray(files) ? files[0] : files,
                    )
                  }
                  onRemove={() => updateField("idDocument", null)}
                />
              </div>
            )}
          </>
        )}

        {currentSubStep === 2 && (
          <>
            <h2 className="text-xl font-bold mb-1">Your Category</h2>
            <p className="text-sm text-gray-500 mb-6">
              Select the service(s) you offer. We'll show you which credentials
              to upload to earn verified badges.
            </p>
            <div className="mb-6">
              <CategorySelect
                selectedCategories={formData.categories}
                onChange={handleCategoriesChange}
              />
            </div>
          </>
        )}

        {currentSubStep === 3 && (
          <>
            <h2 className="text-xl font-bold mb-1">Identity Verification</h2>
            <p className="text-sm text-gray-500 mb-6">
              Upload your ID to activate your provider account. Documents are
              reviewed securely by our team and never shared publicly.
            </p>
            <div className="flex flex-col gap-4 mb-6">
              <FileUpload
                icon="🪖"
                title="Passport or National ID"
                subtitle="Required for all providers to publish services on the platform. Upload a clear photo or scan — PDF, JPG, or PNG."
                badge
                badgeText="Required"
                files={formData.idDocument ? [formData.idDocument] : []}
                onUpload={(files) =>
                  updateField(
                    "idDocument",
                    Array.isArray(files) ? files[0] : files,
                  )
                }
                onRemove={() => updateField("idDocument", null)}
              />
              <FileUpload
                icon="🏠"
                title="Proof of Residence"
                subtitle="Utility bill or official document (last 3 months) — PDF, JPG, or PNG."
                badge
                badgeText="Optional"
                files={
                  formData.proofOfResidence ? [formData.proofOfResidence] : []
                }
                onUpload={(files) =>
                  updateField(
                    "proofOfResidence",
                    Array.isArray(files) ? files[0] : files,
                  )
                }
                onRemove={() => updateField("proofOfResidence", null)}
              />
              <FileUpload
                icon="📋"
                title="Business Registration"
                subtitle="Upload your official company registration document (Gewerbeanmeldung or equivalent) ."
                badge
                badgeText="Required for Company"
                files={
                  formData.businessRegistration
                    ? [formData.businessRegistration]
                    : []
                }
                onUpload={(files) =>
                  updateField(
                    "businessRegistration",
                    Array.isArray(files) ? files[0] : files,
                  )
                }
                onRemove={() => updateField("businessRegistration", null)}
              />
            </div>
          </>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={handleNext}
            disabled={
              isSubmitting ||
              (currentSubStep === 2 &&
                formData.categories.length > 0 &&
                !canProceedFromCategories())
            }
            className="w-full py-3 bg-[#024CEE] text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {isSubmitting
              ? "Processing..."
              : currentSubStep === (role === "provider" ? 3 : 1)
                ? "Submit & Continue →"
                : "Next Step →"}
          </button>
          <button
            onClick={() => onSkip(formData)}
            disabled={isSubmitting}
            className="w-full py-3 border border-gray-200 text-gray-500 rounded-xl font-medium hover:border-blue-300 hover:text-gray-900 transition-all disabled:opacity-50"
          >
            Skip for now &mdash; verify my email
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
