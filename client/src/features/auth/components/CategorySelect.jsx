import React, { useState, useRef, useEffect, use } from "react";
import { fetchCategoriesForRegister } from "../../../api/meta.api";

const MAX_FILES_PER_CATEGORY = 3;

const CategorySelect = ({
  selectedCategories,
  onChange,
  onValidationChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categoryFiles, setCategoryFiles] = useState({});
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);
  useEffect(() => {
    //call the categories
    const fetchCategories = async () => {
      try {
        const response = await fetchCategoriesForRegister();
        setCategories(response.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (onValidationChange) {
      const hasFiles = Object.values(categoryFiles).some(
        (files) => files && files.length > 0,
      );
      onValidationChange(hasFiles || selectedCategories.length === 0);
    }
  }, [categoryFiles, selectedCategories, onValidationChange]);

  const toggleCategory = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((c) => c !== categoryId)
      : [...selectedCategories, categoryId];
    onChange(newCategories);

    if (!selectedCategories.includes(categoryId)) {
      setCategoryFiles((prev) => ({ ...prev, [categoryId]: [] }));
    } else {
      setCategoryFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[categoryId];
        return newFiles;
      });
    }
  };

  const getCategoryById = (id) => categories.find((c) => c.id === id);

  const getSelectedCategoryData = () =>
    selectedCategories.map((id) => getCategoryById(id)).filter(Boolean);

  const handleFileUpload = (categoryId, event) => {
    const files = Array.from(event.target.files);
    const currentFiles = categoryFiles[categoryId] || [];

    if (currentFiles.length + files.length > MAX_FILES_PER_CATEGORY) {
      alert(`Maximum ${MAX_FILES_PER_CATEGORY} files allowed per category`);
      return;
    }

    const newFiles = [...currentFiles, ...files].slice(
      0,
      MAX_FILES_PER_CATEGORY,
    );
    setCategoryFiles((prev) => ({ ...prev, [categoryId]: newFiles }));

    onChange(selectedCategories, { categoryId, files: newFiles });
  };

  const removeFile = (categoryId, fileIndex) => {
    const currentFiles = categoryFiles[categoryId] || [];
    const newFiles = currentFiles.filter((_, index) => index !== fileIndex);
    setCategoryFiles((prev) => ({ ...prev, [categoryId]: newFiles }));
    onChange(selectedCategories, { categoryId, files: newFiles });
  };

  const formatFileSize = (bytes) => {
    const kb = Math.round(bytes / 1024);
    return `${kb} KB`;
  };

  const getFileExtension = (filename) => {
    return filename.split(".").pop().toUpperCase();
  };

  return (
    <div>
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-[#111827] mb-2">
          Main Category{" "}
          <span className="text-[#6B7280] font-normal text-xs">
            (choose one or more)
          </span>
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
          <span
            className={`text-[#6B7280] text-xs transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </div>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#024CEE] rounded-xl z-50 max-h-[220px] overflow-y-auto shadow-lg">
            {categories.map((category) => (
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
            🏅 Credentials to Upload{" "}
            <span className="font-normal text-[#9CA3AF] text-[10px]">
              — earn verified badges · PDF, JPG, PNG · max 5MB
            </span>
          </div>

          <div className="bg-[#EBF1FD] border border-blue-100 rounded-lg p-3 mb-4">
            <p className="text-sm text-[#6B7280] leading-relaxed">
              🏅 Upload your credentials to earn badges on your public profile.
              The more you verify, the higher you rank in search results.
            </p>
          </div>

          <div className="space-y-4">
            {getSelectedCategoryData().map((category) => {
              const files = categoryFiles[category.id] || [];
              const hasFiles = files.length > 0;

              return (
                <div
                  key={category.id}
                  className={`border-2 rounded-xl overflow-hidden ${hasFiles ? "border-green-500 bg-green-50" : "border-[#E5E7EB]"}`}
                >
                  <div className="bg-[#F9FAFB] px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-sm font-bold text-[#111827]">
                        {category.title}
                      </span>
                    </div>
                    {hasFiles && (
                      <span className="text-xs text-green-600 font-medium">
                        ✓ {files.length} file(s) uploaded
                      </span>
                    )}
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

                    <div>
                      <input
                        type="file"
                        id={`upload_${category.id}`}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        onChange={(e) => handleFileUpload(category.id, e)}
                        disabled={files.length >= MAX_FILES_PER_CATEGORY}
                      />

                      {files.length === 0 ? (
                        <label
                          htmlFor={`upload_${category.id}`}
                          className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-4 text-center cursor-pointer hover:border-[#024CEE] hover:bg-[#EBF1FD] transition-all block"
                        >
                          <div className="text-xl mb-1">📎</div>
                          <div className="text-sm font-medium text-[#024CEE]">
                            Click to upload files
                          </div>
                          <div className="text-xs text-[#9CA3AF] mt-1">
                            PDF, JPG, PNG · max 5MB each
                          </div>
                        </label>
                      ) : (
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 border border-[#E5E7EB] rounded-lg bg-white"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#EBF1FD] border border-blue-200 flex items-center justify-center text-xs font-bold text-[#024CEE]">
                                {getFileExtension(file.name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-[#111827] truncate">
                                  {file.name}
                                </div>
                                <div className="text-xs text-[#9CA3AF]">
                                  {formatFileSize(file.size)}
                                </div>
                              </div>
                              <div className="text-green-500 text-sm">✓</div>
                              <button
                                type="button"
                                onClick={() => removeFile(category.id, index)}
                                className="text-[#9CA3AF] hover:text-red-500 text-sm px-1"
                              >
                                ✕
                              </button>
                            </div>
                          ))}

                          {files.length < MAX_FILES_PER_CATEGORY && (
                            <label
                              htmlFor={`upload_${category.id}`}
                              className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-3 text-center cursor-pointer hover:border-[#024CEE] hover:bg-[#EBF1FD] transition-all block"
                            >
                              <div className="text-sm font-medium text-[#024CEE]">
                                + Add more files
                              </div>
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
