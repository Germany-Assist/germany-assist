import React, { useState } from "react";
import ProfileImageUpload from "./ProfileImageUpload";
import FileUpload from "./FileUpload";
import SectionHeader from "./SectionHeader";
import CategorySelect from "./CategorySelect";

const AdditionalInfo = ({ role, subRole, onBack, onSkip, onComplete }) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [formData, setFormData] = useState({
    profileImage: null,
    bio: "",
    categories: [],
    categoryUploads: {},
    idDocument: null,
    proofOfResidence: null,
    businessRegistration: null,
  });

  const inputBaseStyle =
    "w-full py-2.5 px-3 border-2 border-[#E5E7EB] rounded-xl text-sm text-[#111827] bg-white outline-none transition-colors duration-300 focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]";

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoriesChange = (newCategories, uploadData = null) => {
    if (uploadData && uploadData.files) {
      setFormData((prev) => ({
        ...prev,
        categoryUploads: {
          ...prev.categoryUploads,
          [uploadData.categoryId]: uploadData.files,
        },
      }));
    } else if (newCategories) {
      if (
        JSON.stringify(newCategories) !== JSON.stringify(formData.categories)
      ) {
        const removedCategories = formData.categories.filter(
          (c) => !newCategories.includes(c),
        );
        const newCategoryUploads = { ...formData.categoryUploads };
        removedCategories.forEach((catId) => {
          delete newCategoryUploads[catId];
        });
        setFormData((prev) => ({
          ...prev,
          categories: newCategories,
          categoryUploads: newCategoryUploads,
        }));
      } else {
        setFormData((prev) => ({ ...prev, categories: newCategories }));
      }
    }
  };

  const [isCategoryValid, setIsCategoryValid] = useState(true);

  const canProceedFromCategories = () => {
    if (formData.categories.length === 0) return true;
    const hasFiles = Object.values(formData.categoryUploads).some(
      (files) => files && files.length > 0,
    );
    return hasFiles;
  };

  const handleNextSubStep = () => {
    if (currentSubStep < 3) {
      setCurrentSubStep(currentSubStep + 1);
    } else {
      onComplete(formData);
    }
  };

  return (
    <div className="w-full max-w-[560px] text-left px-4 sm:px-0">
      <div className="flex items-center gap-2 mb-6">
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
            currentSubStep == 1
              ? "bg-[#024CEE] outline outline-3 outline-[#cfe9f3] border-[#024CEE] text-white "
              : currentSubStep > 1
                ? "bg-[#eaf7fc] border-[#49b7df] text-[#49b7df]"
                : "bg-white border-[#E5E7EB] text-[#6B7280]"
          }`}
        >
          1
        </div>
        <div
          className={`flex-1 h-0.5 rounded ${currentSubStep >= 2 ? "bg-[#49B7DF]" : "bg-[#E5E7EB]"}`}
        />
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
            currentSubStep == 2
              ? "bg-[#024CEE] outline outline-3 outline-[#cfe9f3] border-[#024CEE] text-white "
              : currentSubStep > 2
                ? "bg-[#eaf7fc] border-[#49b7df] text-[#49b7df]"
                : "bg-white border-[#E5E7EB] text-[#6B7280]"
          }`}
        >
          2
        </div>
        <div
          className={`flex-1 h-0.5 rounded ${currentSubStep >= 3 ? "bg-[#49B7DF]" : "bg-[#E5E7EB]"}`}
        />
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
            currentSubStep == 3
              ? "bg-[#024CEE] outline outline-3 outline-[#cfe9f3] border-[#024CEE] text-white "
              : currentSubStep > 3
                ? "bg-[#eaf7fc] border-[#49b7df] text-[#49b7df]"
                : "bg-white border-[#E5E7EB] text-[#6B7280]"
          }`}
        >
          3
        </div>
        <span className="text-sm text-[#6B7280] ml-2">
          {currentSubStep === 1 && "Profile Setup"}
          {currentSubStep === 2 && "Category & Credentials"}
          {currentSubStep === 3 && "Identity Verification"}
        </span>
      </div>

      <button
        onClick={
          currentSubStep === 1
            ? onBack
            : () => setCurrentSubStep(currentSubStep - 1)
        }
        className="flex items-center p-3 gap-1.5 border border-[#E5E7EB] rounded-lg py-1.5 px-2.75 text-sm text-[#6B7280] cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827] mb-5"
      >
        ← Back
      </button>

      {currentSubStep === 1 && (
        <div className="fade-in">
          <div className="text-[1.375rem] font-bold text-[#111827] mb-1">
            Profile Setup
          </div>
          <div className="text-sm text-[#6B7280] mb-5">
            Add a photo and a short bio so clients know who they're working
            with.
          </div>

          <div className="mb-5">
            <ProfileImageUpload
              file={formData.profileImage}
              onUpload={(file) => updateField("profileImage", file)}
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-[#111827] mb-2">
              Bio{" "}
              <span className="text-[#6B7280] font-normal text-xs">
                — 80 to 600 characters
              </span>
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Tell clients about your experience, qualifications, and what makes you the right choice…"
              rows={4}
              className={`${inputBaseStyle} resize-none`}
              maxLength={600}
            />
            <div className="flex justify-between mt-1 ml-1">
              <span className="text-[11px] text-[#6B7280]">
                {formData.bio.length < 80
                  ? "Minimum 80 characters recommended"
                  : ""}
              </span>
              <span className="text-xs text-[#9CA3AF]">
                {formData.bio.length}/600
              </span>
            </div>
          </div>

          <button
            onClick={handleNextSubStep}
            className="w-full py-3 rounded-xl bg-[#024CEE] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[#0341cc] active:scale-[0.98]"
          >
            Next: Choose Category →
          </button>
          <button
            onClick={() => onSkip(formData)}
            className="w-full py-2.75 p-4 mt-2 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-medium text-sm cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827]"
          >
            Skip all — verify my email
          </button>
        </div>
      )}

      {currentSubStep === 2 && (
        <div className="fade-in">
          <div className="text-[1.375rem] font-bold text-[#111827] mb-1">
            Your Category
          </div>
          <div className="text-sm text-[#6B7280] mb-5">
            Select the service(s) you offer. Click on a category to see
            requirements and upload credentials.
          </div>

          <div className="mb-5">
            <CategorySelect
              selectedCategories={formData.categories}
              onChange={handleCategoriesChange}
              onValidationChange={setIsCategoryValid}
            />
          </div>

          {formData.categories.length > 0 && !canProceedFromCategories() && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">
                ⚠️ Please upload at least one credential file for each selected
                category to continue.
              </p>
            </div>
          )}

          <button
            onClick={handleNextSubStep}
            disabled={
              formData.categories.length > 0 && !canProceedFromCategories()
            }
            className={`w-full py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all active:scale-[0.98] ${
              formData.categories.length > 0 && !canProceedFromCategories()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#024CEE] text-white hover:bg-[#0341cc]"
            }`}
          >
            Next: Identity Verification →
          </button>
          <button
            onClick={() => onSkip(formData)}
            className="w-full py-2.75 p-4 mt-2 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-medium text-sm cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827]"
          >
            Skip all — verify my email
          </button>
        </div>
      )}

      {currentSubStep === 3 && (
        <div className="fade-in">
          <div className="text-[1.375rem] font-bold text-[#111827] mb-1">
            Identity Verification
          </div>
          <div className="text-sm text-[#6B7280] mb-5">
            Upload your ID to activate your provider account. Documents are
            reviewed securely by our team and never shared publicly.
          </div>

          <div className="mb-5">
            <FileUpload
              icon="🪖"
              title="Passport or National ID"
              subtitle="Required for all providers to publish services on the platform. Upload a clear photo or scan — PDF, JPG, or PNG."
              badge
              badgeText="Required"
              files={formData.idDocument ? [formData.idDocument] : []}
              onUpload={(files) => updateField("idDocument", files?.[0] || null)}
              onRemove={() => updateField("idDocument", null)}
              accept=".pdf,.jpg,.jpeg,.png"
              multiple={false}
            />

            {role === "provider" && (
              <FileUpload
                icon="🏠"
                title="Proof of Residence"
                subtitle="Document proving your current address."
                badge
                badgeText="Optional"
                files={formData.proofOfResidence ? [formData.proofOfResidence] : []}
                onUpload={(files) => updateField("proofOfResidence", files?.[0] || null)}
                onRemove={() => updateField("proofOfResidence", null)}
                accept=".pdf,.jpg,.jpeg,.png"
                multiple={false}
              />
            )}

            {role === "provider" && subRole === "company" && (
              <FileUpload
                icon="📋"
                title="Business Registration"
                subtitle="Upload your official company registration document (Gewerbeanmeldung or equivalent) as PDF."
                badge
                badgeText="Required for Company"
                files={formData.businessRegistration ? [formData.businessRegistration] : []}
                onUpload={(files) => updateField("businessRegistration", files?.[0] || null)}
                onRemove={() => updateField("businessRegistration", null)}
                accept=".pdf"
                multiple={false}
              />
            )}
          </div>

          <button
            onClick={() => onComplete(formData)}
            className="w-full py-3 rounded-xl bg-[#024CEE] text-white font-semibold text-sm cursor-pointer transition-all hover:bg-[#0341cc] active:scale-[0.98]"
          >
            Submit & Verify Email →
          </button>
          <button
            onClick={() => onSkip(formData)}
            className="w-full p-4 py-2.75 mt-2 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-medium text-sm cursor-pointer transition-all hover:border-[#93b4f7] hover:text-[#111827]"
          >
            Skip all — verify my email
          </button>
        </div>
      )}
    </div>
  );
};

export default AdditionalInfo;
