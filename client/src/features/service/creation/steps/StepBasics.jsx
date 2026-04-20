import React from "react";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import DropdownMenu from "../DropdownMenu";

const StepBasics = ({
  data,
  onUpdate,
  onNext,
  categories,
  updateCategory,
  subcategories,
}) => {
  // Validation: Requirements must have at least one non-empty entry
  const hasRequirements = data.requirements?.some((r) => r.trim().length > 0);

  const isInvalid =
    data.title.length < 5 ||
    (data.description?.length || 0) < 100 ||
    !data.category ||
    !data.subcategory ||
    !hasRequirements ||
    data.limitToPause < 0;

  const handleRequirementChange = (index, value) => {
    const newReqs = [...(data.requirements || [""])];
    newReqs[index] = value;
    onUpdate({ requirements: newReqs });
  };

  const addRequirement = () => {
    onUpdate({ requirements: [...(data.requirements || []), ""] });
  };

  const removeRequirement = (index) => {
    const newReqs = data.requirements.filter((_, i) => i !== index);
    onUpdate({ requirements: newReqs.length ? newReqs : [""] });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">
          Basic Information
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg">
          Define the core identity and requirements of your service.
        </p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Service Title
          </label>
          <input
            type="text"
            className="w-full p-4 border border-light-700 dark:border-white/10 rounded-2xl outline-none focus:border-accent transition-all text-lg bg-transparent text-slate-900 dark:text-white"
            placeholder="e.g. Professional Visa Consulting"
            value={data.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
        </div>

        {/* Category & Subcategory */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Category
          </label>
          <div className="flex gap-4">
            <DropdownMenu
              placeholder="Category"
              categories={categories}
              selectedValue={data.category}
              onSelect={(cat) => updateCategory({ category: cat.id })}
            />
            <DropdownMenu
              placeholder="Subcategory"
              disabled={!data.category}
              categories={subcategories}
              selectedValue={data.subcategory}
              onSelect={(sub) => onUpdate({ subcategory: sub.id })}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Service Description
          </label>
          <textarea
            className="w-full h-32 p-4 border border-light-700 dark:border-white/10 rounded-2xl outline-none focus:border-accent transition-all text-lg resize-none bg-transparent text-slate-900 dark:text-white"
            placeholder="Describe what you offer in detail..."
            value={data.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
          />
        </div>

        {/* Requirements Section */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
            Client Requirements
          </label>
          <p className="text-xs text-slate-500 mb-2">
            What does the user need to provide to receive your service?
          </p>
          {(data.requirements || [""]).map((req, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-3 border border-light-700 dark:border-white/10 rounded-xl bg-transparent text-slate-900 dark:text-white focus:border-accent outline-none"
                placeholder="e.g. Scanned Passport Copy"
                value={req}
                onChange={(e) => handleRequirementChange(idx, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeRequirement(idx)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRequirement}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity mt-2"
          >
            <Plus size={14} /> Add Requirement
          </button>
        </div>

        {/* Limit to Pause */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Global Pause Limit
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Service will auto-pause after this many active orders (set to zero
            to disable).
          </p>
          <input
            type="number"
            className="w-full p-4 border border-light-700 dark:border-white/10 rounded-2xl outline-none focus:border-accent transition-all bg-transparent text-slate-900 dark:text-white"
            value={data.limitToPause}
            min="0"
            onChange={(e) =>
              onUpdate({ limitToPause: parseInt(e.target.value) || 0 })
            }
          />
        </div>
      </div>

      <button
        disabled={isInvalid}
        onClick={onNext}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 dark:bg-white disabled:opacity-30 text-white dark:text-black font-bold py-4 px-10 rounded-2xl transition-all shadow-xl hover:bg-accent hover:text-white"
      >
        Next: Pricing <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default StepBasics;
