import React, { useState, useRef, useEffect } from "react";
import FileUpload from "./FileUpload";

const CATEGORIES = [
  {
    id: "german_language",
    label: "German Language",
    title: "German Language",
    icon: "🇩🇪",
    requirements: [
      {
        title: "Teaching Certificate",
        description: "Are you a Goethe/TELC/TestDaF teacher? Upload your teaching certificate to earn the 'Certified Teacher' or 'Certified Examiner' badge.",
        badge: "Certified Teacher / Certified Examiner",
      },
      {
        title: "Germanistics Degree",
        description: "Do you have a University Degree in Germanistics? Upload it to earn the 'Expert Teacher' badge.",
        badge: "Expert Teacher",
      },
      {
        title: "Native Speaker Certificate",
        description: "Are you a native German speaker? Upload your passport or ID to earn the 'Native Speaker' badge.",
        badge: "Native Speaker",
      },
    ],
  },
  {
    id: "career_coaching",
    label: "Career Coaching",
    title: "Career Coaching",
    icon: "💼",
    requirements: [
      {
        title: "Coaching Certification",
        description: "Do you have an ICF, CCA, or equivalent coaching certification? Upload it to earn the 'Certified Coach' badge.",
        badge: "Certified Coach",
      },
      {
        title: "HR Experience",
        description: "Do you have 2+ years of HR or recruitment experience? Upload your CV or employment letter.",
        badge: "Senior Career Advisor",
      },
    ],
  },
  {
    id: "translation",
    label: "Translation Services",
    title: "Translation Services",
    icon: "📝",
    requirements: [
      {
        title: "Translator License",
        description: "Are you a certified translator? Upload your license or certification.",
        badge: "Certified Translator",
      },
      {
        title: "Language Certificates",
        description: "Upload your C1/C2 proficiency certificates for relevant languages.",
        badge: "Expert Linguist",
      },
    ],
  },
  {
    id: "recruitment",
    label: "Recruitment Services",
    title: "Recruitment Services",
    icon: "🤝",
    requirements: [
      {
        title: "Agency Registration",
        description: "Is your recruitment agency officially registered? Upload your business registration.",
        badge: "Licensed Agency",
      },
      {
        title: "Client References",
        description: "Do you have active client contracts or references? Upload proof of placements.",
        badge: "Trusted Partner",
      },
    ],
  },
  {
    id: "visa",
    label: "Visa & Immigration",
    title: "Visa & Immigration",
    icon: "✈️",
    requirements: [
      {
        title: "Legal Consultant License",
        description: "Are you a licensed attorney or immigration consultant? Upload your license or bar membership.",
        badge: "Licensed Consultant",
      },
      {
        title: "Professional Insurance",
        description: "Do you have professional liability insurance? Upload your policy document.",
        badge: "Insured Professional",
      },
    ],
  },
  {
    id: "recognition",
    label: "Certificate Recognition",
    title: "Certificate Recognition",
    icon: "🏅",
    requirements: [
      {
        title: "Anerkennung Experience",
        description: "Have you successfully helped with certificate recognition (Anerkennung)? Upload case documentation.",
        badge: "Recognition Expert",
      },
      {
        title: "Educational Background",
        description: "Upload your educational certificates related to the field.",
        badge: "Qualified Specialist",
      },
    ],
  },
  {
    id: "university",
    label: "University Student Services",
    title: "University Student Services",
    icon: "🎓",
    requirements: [
      {
        title: "University Partnership",
        description: "Do you have a partnership agreement with German universities? Upload the agreement.",
        badge: "University Partner",
      },
      {
        title: "Agent Registration",
        description: "Are you a registered education agent? Upload your registration document.",
        badge: "Registered Agent",
      },
    ],
  },
  {
    id: "relocation",
    label: "Relocation Services",
    title: "Relocation Services",
    icon: "🏠",
    requirements: [
      {
        title: "Relocation Certification",
        description: "Do you have relocation specialist certification? Upload your certificate.",
        badge: "Certified Relocation Expert",
      },
      {
        title: "German Presence",
        description: "Do you have an office or partner in Germany? Upload proof of presence.",
        badge: "Local Expert",
      },
    ],
  },
];

const CategorySelect = ({ selectedCategories, onChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((c) => c !== categoryId)
      : [...selectedCategories, categoryId];
    onChange(newCategories);
  };

  const getCategoryById = (id) => CATEGORIES.find((c) => c.id === id);

  const getSelectedCategoryData = () => 
    selectedCategories.map((id) => getCategoryById(id)).filter(Boolean);

  const handleUpload = (categoryId, requirementTitle, file) => {
    onChange(selectedCategories, { categoryId, requirementTitle, file });
  };

  return (
    <div>
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Main Category <span className="text-[#6B7280] font-normal text-xs">(choose one or more)</span>
        </label>
        
        <div
          className="flex items-center justify-between px-3 py-2.5 border-2 border-[#E5E7EB] rounded-xl bg-white cursor-pointer transition-colors hover:border-[#024CEE] focus:border-[#024CEE] focus:shadow-[0_0_0_3px_rgba(2,76,238,0.07)]"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex-1 flex flex-wrap gap-1.5">
            {selectedCategories.length === 0 ? (
              <span className="text-[#C4C9D4] text-sm">Select categories…</span>
            ) : (
              selectedCategories.map((id) => {
                const cat = getCategoryById(id);
                return (
                  <span
                    key={id}
                    className="text-xs px-2 py-0.5 rounded-full bg-[#EBF1FD] border border-blue-200 text-[#024CEE] font-medium"
                  >
                    {cat?.label || id}
                  </span>
                );
              })
            )}
          </div>
          <span className={`text-[#6B7280] text-xs transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}>
            ▼
          </span>
        </div>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#024CEE] rounded-xl z-50 max-h-[220px] overflow-y-auto shadow-lg">
            {CATEGORIES.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#EBF1FD] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="w-4 h-4 accent-[#024CEE] cursor-pointer"
                />
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm text-[#111827]">{category.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {selectedCategories.length > 0 && (
        <div className="mt-5">
          <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3 pb-2 border-b border-[#E5E7EB]">
            🏅 Credentials to Upload — earn verified badges · PDF, JPG, PNG · max 5MB
          </div>
          
          <div className="bg-[#EBF1FD] border border-blue-100 rounded-lg p-3 mb-4">
            <p className="text-sm text-[#6B7280] leading-relaxed">
              🏅 Upload your credentials to earn badges on your public profile. The more you verify, the higher you rank in search results.
            </p>
          </div>

          <div className="space-y-4">
            {getSelectedCategoryData().map((category) => (
              <div
                key={category.id}
                className="border-2 border-[#E5E7EB] rounded-xl overflow-hidden"
              >
                <div className="bg-[#F9FAFB] px-4 py-3 border-b border-[#E5E7EB] flex items-center gap-3">
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-sm font-bold text-[#111827]">{category.title}</span>
                </div>
                
                <div className="p-4">
                  <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                    Accepted credentials & files
                  </div>
                  
                  <ul className="space-y-3 mb-4">
                    {category.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-[#111827]">
                            {req.icon} {req.title}
                            <span className="text-xs font-semibold ml-2 px-1.5 py-0.5 rounded-full bg-[#EBF1FD] text-[#024CEE] border border-blue-200">
                              🏅 {req.badge}
                            </span>
                          </div>
                          <div className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                            {req.description}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div
                    className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-4 text-center cursor-pointer hover:border-[#024CEE] hover:bg-[#EBF1FD] transition-all"
                    onClick={() => document.getElementById(`upload_${category.id}`)?.click()}
                  >
                    <input
                      type="file"
                      id={`upload_${category.id}`}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                          handleUpload(category.id, "multiple", files[0]);
                        }
                      }}
                    />
                    <div className="text-xl mb-1">📎</div>
                    <div className="text-sm font-medium text-[#024CEE]">Click to upload files</div>
                    <div className="text-xs text-[#9CA3AF] mt-1">PDF, JPG, PNG · multiple files allowed · max 5MB each</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCategories.length === 0 && (
        <div className="text-center py-8 text-[#6B7280] text-sm">
          Select a category above to see which credentials you can upload.
        </div>
      )}
    </div>
  );
};

export default CategorySelect;