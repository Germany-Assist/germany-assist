import React, { useState } from "react";
import { Link } from "react-router-dom";

const CandidateOnboarding = ({ onComplete, isStandalone = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Professional Info
    profession: "",
    degree: "",
    yearsOfExperience: "",
    currentSalary: "",

    // Step 2: German & Location
    germanLevel: "",
    currentLocation: "",
    preferredGermanLocation: "",
    arrivalTimeframe: "",

    // Step 3: Support Areas
    supportAreas: [],
    priorityArea: "",

    // Step 4: Additional Info
    hasJobOffer: "",
    companySize: "",
    workType: "",
    familyStatus: "",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  // German proficiency levels
  const germanLevels = [
    { value: "none", label: "No German (A0)" },
    { value: "a1", label: "Basic (A1)" },
    { value: "a2", label: "Elementary (A2)" },
    { value: "b1", label: "Intermediate (B1)" },
    { value: "b2", label: "Upper Intermediate (B2)" },
    { value: "c1", label: "Advanced (C1)" },
    { value: "c2", label: "Proficient (C2)" },
    { value: "native", label: "Native Speaker" },
  ];

  // Support areas based on existing services
  const supportAreas = [
    { value: "visa-paperwork", label: "Visa & Work Permits", icon: "📋" },
    { value: "translation", label: "Document Translation", icon: "📝" },
    {
      value: "language-learning",
      label: "German Language Learning",
      icon: "🗣️",
    },
    { value: "career-coaching", label: "Career Coaching", icon: "💼" },
    { value: "housing", label: "Housing & Accommodation", icon: "🏠" },
    {
      value: "banking-finance",
      label: "Banking & Financial Setup",
      icon: "💰",
    },
    { value: "legal-advice", label: "Legal Consultation", icon: "⚖️" },
    { value: "tax-setup", label: "Tax Registration", icon: "📊" },
    { value: "networking", label: "Professional Networking", icon: "🤝" },
    {
      value: "cultural-integration",
      label: "Cultural Integration",
      icon: "🌍",
    },
  ];

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSupportAreaToggle = (area) => {
    const updatedAreas = formData.supportAreas.includes(area)
      ? formData.supportAreas.filter((a) => a !== area)
      : [...formData.supportAreas, area];
    updateFormData("supportAreas", updatedAreas);
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.profession)
          newErrors.profession = "Profession is required";
        if (!formData.degree) newErrors.degree = "Education level is required";
        if (!formData.yearsOfExperience)
          newErrors.yearsOfExperience = "Experience is required";
        break;
      case 2:
        if (!formData.germanLevel)
          newErrors.germanLevel = "German level is required";
        if (!formData.currentLocation)
          newErrors.currentLocation = "Current location is required";
        if (!formData.arrivalTimeframe)
          newErrors.arrivalTimeframe = "Arrival timeframe is required";
        break;
      case 3:
        if (formData.supportAreas.length === 0)
          newErrors.supportAreas = "Select at least one support area";
        if (!formData.priorityArea)
          newErrors.priorityArea = "Priority area is required";
        break;
      case 4:
        if (!formData.hasJobOffer)
          newErrors.hasJobOffer = "Job offer status is required";
        if (!formData.workType)
          newErrors.workType = "Work type preference is required";
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/candidates/onboarding', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (onComplete) {
        onComplete(formData);
      }
    } catch (error) {
      console.error("Onboarding submission error:", error);
      setErrors({
        submit: "Failed to save your information. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Professional Background
        </h2>
        <p className="text-gray-600">
          Tell us about your professional experience
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What is your profession?
        </label>
        <input
          type="text"
          value={formData.profession}
          onChange={(e) => updateFormData("profession", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Software Engineer, Marketing Manager, Data Scientist"
        />
        {errors.profession && (
          <p className="text-red-500 text-sm mt-1">{errors.profession}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Highest Education Level
        </label>
        <select
          value={formData.degree}
          onChange={(e) => updateFormData("degree", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select your education level</option>
          <option value="high-school">High School</option>
          <option value="associate">Associate Degree</option>
          <option value="bachelor">Bachelor's Degree</option>
          <option value="master">Master's Degree</option>
          <option value="phd">PhD/Doctorate</option>
          <option value="other">Other/Professional Certification</option>
        </select>
        {errors.degree && (
          <p className="text-red-500 text-sm mt-1">{errors.degree}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Years of Professional Experience
        </label>
        <select
          value={formData.yearsOfExperience}
          onChange={(e) => updateFormData("yearsOfExperience", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select experience level</option>
          <option value="0-1">0-1 years (Entry level)</option>
          <option value="2-3">2-3 years</option>
          <option value="4-5">4-5 years</option>
          <option value="6-10">6-10 years</option>
          <option value="11-15">11-15 years</option>
          <option value="15+">15+ years (Senior)</option>
        </select>
        {errors.yearsOfExperience && (
          <p className="text-red-500 text-sm mt-1">
            {errors.yearsOfExperience}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Salary Range (Optional)
        </label>
        <select
          value={formData.currentSalary}
          onChange={(e) => updateFormData("currentSalary", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Prefer not to say</option>
          <option value="under-30k">Under €30,000</option>
          <option value="30k-40k">€30,000 - €40,000</option>
          <option value="40k-50k">€40,000 - €50,000</option>
          <option value="50k-60k">€50,000 - €60,000</option>
          <option value="60k-80k">€60,000 - €80,000</option>
          <option value="80k-100k">€80,000 - €100,000</option>
          <option value="100k+">€100,000+</option>
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Location & Language
        </h2>
        <p className="text-gray-600">
          Help us understand your location preferences and German skills
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          German Language Level
        </label>
        <select
          value={formData.germanLevel}
          onChange={(e) => updateFormData("germanLevel", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select your German level</option>
          {germanLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
        {errors.germanLevel && (
          <p className="text-red-500 text-sm mt-1">{errors.germanLevel}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Location
        </label>
        <input
          type="text"
          value={formData.currentLocation}
          onChange={(e) => updateFormData("currentLocation", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., London, UK or São Paulo, Brazil"
        />
        {errors.currentLocation && (
          <p className="text-red-500 text-sm mt-1">{errors.currentLocation}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred German Location (Optional)
        </label>
        <select
          value={formData.preferredGermanLocation}
          onChange={(e) =>
            updateFormData("preferredGermanLocation", e.target.value)
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No preference</option>
          <option value="berlin">Berlin</option>
          <option value="munich">Munich</option>
          <option value="hamburg">Hamburg</option>
          <option value="frankfurt">Frankfurt</option>
          <option value="cologne">Cologne</option>
          <option value="dusseldorf">Düsseldorf</option>
          <option value="stuttgart">Stuttgart</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          When could you arrive in Germany if you get a job opportunity?
        </label>
        <select
          value={formData.arrivalTimeframe}
          onChange={(e) => updateFormData("arrivalTimeframe", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select timeframe</option>
          <option value="immediately">Immediately (within 2 weeks)</option>
          <option value="1-month">Within 1 month</option>
          <option value="2-3-months">2-3 months</option>
          <option value="3-6-months">3-6 months</option>
          <option value="6-12-months">6-12 months</option>
          <option value="flexible">Flexible / depends on visa process</option>
        </select>
        {errors.arrivalTimeframe && (
          <p className="text-red-500 text-sm mt-1">{errors.arrivalTimeframe}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Support Areas</h2>
        <p className="text-gray-600">
          What areas do you need the most help with?
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Select all areas where you need support:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {supportAreas.map((area) => (
            <button
              key={area.value}
              type="button"
              onClick={() => handleSupportAreaToggle(area.value)}
              className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                formData.supportAreas.includes(area.value)
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{area.icon}</span>
                <span className="font-medium">{area.label}</span>
              </div>
            </button>
          ))}
        </div>
        {errors.supportAreas && (
          <p className="text-red-500 text-sm mt-1">{errors.supportAreas}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What is your top priority?
        </label>
        <select
          value={formData.priorityArea}
          onChange={(e) => updateFormData("priorityArea", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select your top priority</option>
          {supportAreas.map((area) => (
            <option key={area.value} value={area.value}>
              {area.label}
            </option>
          ))}
        </select>
        {errors.priorityArea && (
          <p className="text-red-500 text-sm mt-1">{errors.priorityArea}</p>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Additional Information
        </h2>
        <p className="text-gray-600">
          A few more details to help us serve you better
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you currently have a job offer from a German company?
        </label>
        <div className="space-y-2">
          {[
            { value: "yes", label: "Yes, I have a confirmed offer" },
            { value: "pending", label: "I have offers under consideration" },
            { value: "applying", label: "I am actively applying" },
            { value: "no", label: "No, I am just exploring" },
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="hasJobOffer"
                value={option.value}
                checked={formData.hasJobOffer === option.value}
                onChange={(e) => updateFormData("hasJobOffer", e.target.value)}
                className="mr-3"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {errors.hasJobOffer && (
          <p className="text-red-500 text-sm mt-1">{errors.hasJobOffer}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Company Size
        </label>
        <select
          value={formData.companySize}
          onChange={(e) => updateFormData("companySize", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No preference</option>
          <option value="startup">Startup (1-50 employees)</option>
          <option value="small">Small (51-200 employees)</option>
          <option value="medium">Medium (201-1000 employees)</option>
          <option value="large">Large (1000+ employees)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Work Type Preference
        </label>
        <select
          value={formData.workType}
          onChange={(e) => updateFormData("workType", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select work type</option>
          <option value="onsite">On-site</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="flexible">Flexible</option>
        </select>
        {errors.workType && (
          <p className="text-red-500 text-sm mt-1">{errors.workType}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Family Status
        </label>
        <select
          value={formData.familyStatus}
          onChange={(e) => updateFormData("familyStatus", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Prefer not to say</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="family">Family with children</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          value={formData.additionalNotes}
          onChange={(e) => updateFormData("additionalNotes", e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any additional information you'd like to share..."
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {isStandalone && (
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-3">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Germany-Assist
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Candidate Profile Setup
            </h1>
            <p className="text-gray-600">
              Help us understand your background and goals
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {errors.submit && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving Profile...
                  </div>
                ) : (
                  "Complete Profile"
                )}
              </button>
            )}
          </div>
        </div>

        {/* Skip Option for Testing */}
        {isStandalone && (
          <div className="text-center mt-6">
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
              Skip for now and explore the platform
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateOnboarding;
