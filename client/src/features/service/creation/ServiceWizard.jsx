import React, { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import WizardProgress from "./WizardProgress";
import StepBasics from "./steps/StepBasics";
import LivePreview from "./steps/LivePreview";
import StepMedia from "./steps/StepMedia";
import StepTypeAndPricing from "./steps/StepTypeAndPricing";
import StepReviewChoice from "./steps/StepReviewChoice"; // Import the new step
import {
  createNewService,
  updateService,
} from "../../../api/serviceProviderApis";
import CreationSuccess from "./CreationSuccess";
import { useMeta } from "../../../contexts/MetadataContext";
import StatusModal from "../../../components/ui/StatusModal";
import { getErrorMessage } from "../../../api/errorMessages";

const ServiceWizard = ({ initialData = null, isEditMode = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successServiceId, setSuccessServiceId] = useState(null);
  const [statusModalCon, setStatusModalCon] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [deletedAssets, setDeletedAssets] = useState([]);
  const { categories } = useMeta();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    description: "",
    requirements: [""],
    limitToPause: 0,
    requestedStatus: "draft",
    assets: [],
    variants: [],
    timelines: [],
    type: "oneTime",
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      let requirementsArray = [""];
      try {
        if (typeof initialData.requirements === "string") {
          const parsed = JSON.parse(initialData.requirements);
          requirementsArray = Array.isArray(parsed)
            ? parsed
            : [initialData.requirements];
        } else if (Array.isArray(initialData.requirements)) {
          requirementsArray = initialData.requirements;
        }
      } catch (e) {
        requirementsArray = initialData.requirements
          ? [initialData.requirements]
          : [""];
      }

      const categoryId = initialData.category?.id || "";
      const subcategoryId = initialData.subCategory?.id || "";

      if (categories && categoryId) {
        const mainCat = categories.find((i) => i.id === categoryId);
        setSubcategories(mainCat?.subcategories || []);
      }

      setFormData({
        id: initialData.id,
        title: initialData.title || "",
        description: initialData.description || "",
        type: initialData.type || "oneTime",
        category: categoryId,
        subcategory: subcategoryId,
        requirements: requirementsArray.length > 0 ? requirementsArray : [""],
        limitToPause: initialData.limitToPause || 0,
        requestedStatus: initialData.status || "draft",
        variants: (initialData.variants || []).map((v) => ({
          label: v.label || "",
          price: v.price || 0,
          deliveryTime: v.deliveryTime || "",
        })),
        timelines: (initialData.timelines || []).map((t) => ({
          label: t.label || "",
          price: t.price || 0,
          maxParticipants: t.maxParticipants || t.limit || 1,
          startDate: t.startDate || "",
          endDate: t.endDate || "",
          deadlineDate: t.deadlineDate || "",
        })),
        assets: (initialData.assets || [])
          .filter((asset) => !asset.thumb)
          .map((asset) => ({
            ...asset,
            isExisting: true,
            name: asset.name,
          })),
      });
    }
  }, [isEditMode, initialData, categories]);

  const updateCategory = (categoryData) => {
    const mainCat = categories.find((i) => i.id === categoryData.category);
    setSubcategories(mainCat?.subcategories || []);
    setFormData((prev) => ({
      ...prev,
      category: categoryData.category,
      subcategory: "",
    }));
  };

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const trackDeletedAsset = (name) => {
    if (name) setDeletedAssets((prev) => [...prev, name]);
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // Updated handleSubmit to accept the final status (draft/review)
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const sendData = new FormData();

    sendData.append("title", formData.title);
    sendData.append("subcategoryId", formData.subcategory);
    sendData.append("description", formData.description);
    sendData.append("type", formData.type);
    sendData.append("limitToPause", formData.limitToPause);
    // Append the status chosen in StepReviewChoice
    sendData.append("status", formData.requestedStatus);

    sendData.append(
      "requirements",
      JSON.stringify(formData.requirements.filter((r) => r.trim() !== "")),
    );
    sendData.append("variants", JSON.stringify(formData.variants));
    sendData.append("timelines", JSON.stringify(formData.timelines));

    if (isEditMode && deletedAssets.length > 0) {
      sendData.append("deletedAssets", JSON.stringify(deletedAssets));
    }

    let uploadIndex = 0;
    formData.assets.forEach((asset) => {
      if (asset.file) {
        sendData.append("images", asset.file);
        sendData.append(`imageKeys[${uploadIndex}]`, asset.key);
        uploadIndex++;
      }
    });
    try {
      const response = isEditMode
        ? await updateService(initialData.id, sendData)
        : await createNewService(sendData);
      if (response.status === 201 || response.status === 200) {
        setIsSubmitting(false);
        setSuccessServiceId(initialData?.id || response.data.data.id);
        nextStep();
      }
    } catch (error) {
      const message = getErrorMessage(error);
      setStatusModalCon({
        isOpen: true,
        type: "error",
        onClose: () => setStatusModalCon(null),
        message: message,
        buttonText: "Retry",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full px-4 md:px-0 max-w-7xl mx-auto">
      <StatusModal {...statusModalCon} />

      {isEditMode && initialData?.rejectionReason && currentStep < 5 && (
        <div className="mb-6 md:mb-10 bg-red-50 dark:bg-red-500/5 border-2 border-red-500/30 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 shadow-xl shadow-red-500/10 animate-in slide-in-from-top-10 duration-700">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-red-500 rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-white animate-pulse shrink-0">
            <ShieldAlert size={28} />
          </div>
          <div className="text-center md:text-left flex-1">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 dark:text-red-400">
              Update Required
            </span>
            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1">
              Rejection Reason: {initialData.rejectionReason}
            </h3>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 px-2 gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isEditMode ? "bg-orange-500 text-white" : "bg-zinc-900 dark:bg-white text-white dark:text-black"}`}
          >
            {isEditMode ? "Modifying Existing Service" : "Creating New Service"}
          </div>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Progress: Step {currentStep} / 4
        </div>
      </div>

      <div className="mb-8 md:mb-12">
        <WizardProgress currentStep={currentStep} />
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start">
        <div className="lg:col-span-7 bg-white/60 dark:bg-white/5 border border-white/20 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-sm">
          {currentStep === 1 && (
            <StepBasics
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              categories={categories}
              updateCategory={updateCategory}
              subcategories={subcategories}
              isEditMode={isEditMode}
            />
          )}
          {currentStep === 2 && (
            <StepTypeAndPricing
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
              isEditMode={isEditMode}
            />
          )}
          {currentStep === 3 && (
            <StepMedia
              data={formData}
              onUpdate={updateFormData}
              onAssetDeleted={trackDeletedAsset}
              onBack={prevStep}
              onNext={nextStep}
              isEditMode={isEditMode}
            />
          )}
          {currentStep === 4 && (
            <StepReviewChoice
              data={formData}
              onBack={prevStep}
              onUpdate={updateFormData}
              onComplete={handleSubmit}
              isEditMode={isEditMode}
            />
          )}
          {currentStep === 5 && (
            <CreationSuccess
              serviceId={successServiceId}
              isEditMode={isEditMode}
              status={formData.requestedStatus}
            />
          )}
        </div>

        <div className="hidden lg:block lg:col-span-5 sticky top-4">
          <div className="bg-zinc-900/5 dark:bg-white/5 border border-zinc-200 rounded-[1.5rem] p-2 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Live Preview
              </span>
            </div>
            <LivePreview data={formData} categories={categories} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceWizard;
